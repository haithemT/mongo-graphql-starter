import { not } from "graphql-shield";
import * as rules from "../rules";

export const ItemQueryPermissions = {
  item: not(rules.isAuthenticated),
  items: not(rules.isAuthenticated)
};

export const ItemMutationPermissions = {
  createItem: rules.isAuthenticated,
  updateItem: rules.isAuthenticated,
  deleteItem: rules.isAuthenticated
};
