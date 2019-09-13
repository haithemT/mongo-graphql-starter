import { not } from "graphql-shield";
import * as rules from "../rules";

export const UserQueryPermissions = {
  user: rules.isAuthenticated,
  users: rules.isAuthenticated
};

export const UserMutationPermissions = {
  signup: not(rules.isAuthenticated),
  login: not(rules.isAuthenticated),
  createUser: rules.isAdmin,
  updateUser: rules.isAdmin,
  deleteUser: rules.isAdmin
};
