import User from "../../../server/models/User";
import List from "../../../server/models/List";
import Item from "../../../server/models/Item";

export default {
  Query : {
    item: async(parent, {
      _id
    }, context, info) => {
      return await Item.find({_id});
    },
    items: async(parent, args, context, info) => {
      const res = await Item
        .find({})
        .populate()
        .exec();

      return res.map(u => ({
        _id: u
          ._id
          .toString(),
        text: u.text,
        author: u.author,
        list: u.list
      }));
    }
  },
  Mutation : {
    createItem: async(parent, {
      item
    }, context, info) => {
      const newItem = await new Item({text: item.text, author: item.author, list: item.list});

      return new Promise((resolve, reject) => {
        newItem.save((err, res) => {
          err
            ? reject(err)
            : resolve(res);
        });
      });
    },
    updateItem: async(parent, {
      _id,
      item
    }, context, info) => {
      return new Promise((resolve, reject) => {
        Item.findByIdAndUpdate(_id, {
          $set: {
            ...item
          }
        }, {new: true}).exec((err, res) => {
          err
            ? reject(err)
            : resolve(res);
        });
      });
    },
    deleteItem: async(parent, {
      _id
    }, context, info) => {
      return new Promise((resolve, reject) => {
        Item
          .findByIdAndDelete(_id)
          .exec((err, res) => {
            err
              ? reject(err)
              : resolve(res);
          });
      });
    }
  },
  Subscription : {
    item: {
      subscribe: (parent, args, {pubsub}) => {
        //return pubsub.asyncIterator(channel)
      }
    }
  },
  Item : {
    author: async({
      author
    }, args, context, info) => {
      return await User.findById({_id: author});
    },
    list: async({
      list
    }, args, context, info) => {
      return await List.findById({_id: list});
    }
  }
};
