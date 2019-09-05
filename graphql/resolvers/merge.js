import User from "./User";

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdLists: postMessage.bind(this, user._doc.createdLists)
    };
  } catch (error) {
    throw error;
  }
};

const transformList = event => {
  return {
    ...event._doc,
    _id: event.id,
    creator: user.bind(this, event.creator)
  };
};

exports.transformList = transformList;
