import User from "../../../server/models/User";
import List from "../../../server/models/List";
import Item from "../../../server/models/Item";

export default {
  Query: {
    user: async (parent, { _id }, context, info) => {
      return await User.findOne({ _id }).exec();
    },
    users: async (parent, args, context, info) => {
      console.log(context);
      const users = await User.find({})
        .populate()
        .exec();

      return users.map(u => ({
        _id: u._id.toString(),
        username: u.username,
        firstname: u.firstname,
        lastname: u.lastname,
        email: u.email,
        age: u.age,
        lists: u.lists,
        items: u.items
      }));
    }
  },
  Mutation: {
    signup: async (parent, args, ctx) => {
      const user = await new User(args);
      const token = User.generateJWT();
      return {
        user,
        token
      };
    },
    login: async (parent, args, context, info) => {
      const user = await User.findOne({ email }).exec();
      if (!user) {
        throw new Error("No such user found");
      }
      const valid = User.validatePassword(args.password);
      if (!valid) {
        throw new Error("Invalid password");
      }

      const token = User.generateJWT();

      return {
        token,
        user
      };
    },
    createUser: async (parent, { user }, ctx) => {
      const newUser = await new User({
        username: user.username,
        email: user.email,
        password: user.password
      });
      return new Promise((resolve, reject) => {
        newUser.save((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    updateUser: async (parent, { _id, user }, context, info) => {
      return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(_id, { $set: { ...user } }, { new: true }).exec(
          (err, res) => {
            err ? reject(err) : resolve(res);
          }
        );
      });
    },
    deleteUser: async (parent, { _id }, context, info) => {
      return new Promise((resolve, reject) => {
        User.findByIdAndDelete(_id).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    }
  },
  User: {
    lists: async ({ _id }, args, context, info) => {
      return await List.find({ author: _id });
    },
    items: async ({ _id }, args, context, info) => {
      return await Item.find({ author: _id });
    }
  }
};
