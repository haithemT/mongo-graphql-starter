import mongoose from "mongoose";
import { ObjectID } from "mongodb";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const { jwtKey } = process.env;
const { Schema } = mongoose;

ObjectID.prototype.valueOf = function() {
  return this.toString();
};

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: false,
    default: ""
  },
  lastname: {
    type: String,
    required: false,
    default: ""
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  age: {
    type: Number,
    required: false,
    default: 0
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  isAdmin: { type: Boolean, default: false },
  salt: String,
  lists: [
    {
      type: Schema.Types.ObjectId,
      ref: "List"
    }
  ],
  Items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Item"
    }
  ]
});

UserSchema.pre("save", async function(next) {
  const user = this;
  // Hash the password before saving the user model
  user.salt = crypto.randomBytes(16).toString("hex");
  user.password = await crypto
    .pbkdf2Sync(user.password, user.salt, 10000, 512, "sha512")
    .toString("hex");
  next();
});

UserSchema.methods.validatePassword = function(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10)
    },
    jwtKey
  );
};

UserSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT()
  };
};

export default mongoose.model("User", UserSchema);
