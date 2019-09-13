import { not } from "graphql-shield";
import * as rules from "../rules";

export const ListQueryPermissions = {
  list: not(rules.isAuthenticated),
  lists: rules.isAuthenticated
};

export const ListMutationPermissions = {
  createList: rules.isAuthenticated,
  updateList: rules.isAuthenticated,
  deleteList: rules.isAuthenticated
};
