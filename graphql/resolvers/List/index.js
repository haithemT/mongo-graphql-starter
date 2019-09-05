import User from "../../../server/models/User";
import List from "../../../server/models/List";
import Item from "../../../server/models/Item";

import { transformList } from "../merge";

export default {
  Query: {
    list: async (parent, { _id }, context, info) => {
      return await List.findOne({ _id }).exec();
    },
    lists: async (parent, args, context, info) => {
      const res = await List.find({})
        .populate()
        .exec();

      return res.map(u => ({
        _id: u._id.toString(),
        title: u.title,
        published: u.published,
        author: u.author,
        items: u.items,
        date: u.date
      }));
    }
  },
  Mutation: {
    createList: async (parent, { list }, context, info) => {
      const newList = await new List({
        title: list.title,
        published: list.published,
        author: list.author,
        date: list.date
      });
      let createdList;
      try {
        // const result = await newList.save();
        const result = await new Promise((resolve, reject) => {
          newList.save((err, res) => {
            err ? reject(err) : resolve(res);
          });
        });
        createdList = transformList(result);
        const creator = await User.findById(list.author);

        if (!creator) {
          throw new Error("User not found.");
        }
        creator.lists.push(newList);
        await creator.save();
        return createdList;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    updateList: async (parent, { _id, list }, context, info) => {
      return new Promise((resolve, reject) => {
        List.findByIdAndUpdate(_id, { $set: { ...list } }, { new: true }).exec(
          (err, res) => {
            err ? reject(err) : resolve(res);
          }
        );
      });
    },
    deleteList: async (parent, { _id }, context, info) => {
      try {
        // searching for creator of the list and deleting it from the list
        const list = await List.findById(_id);
        const creator = await User.findById(list.author);
        if (!creator) {
          throw new Error("user not found.");
        }
        const index = creator.lists.indexOf(_id);
        if (index > -1) {
          creator.lists.splice(index, 1);
        }
        await creator.save();
        return new Promise((resolve, reject) => {
          List.findByIdAndDelete(_id).exec((err, res) => {
            err ? reject(err) : resolve(res);
          });
        });
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  },
  Subscription: {
    list: {
      subscribe: (parent, args, { pubsub }) => {
        //return pubsub.asyncIterator(channel)
      }
    }
  },
  List: {
    author: async ({ author }, args, context, info) => {
      return await User.findById(author);
    },
    items: async ({ author }, args, context, info) => {
      return await Item.find({ author });
    }
  }
};
