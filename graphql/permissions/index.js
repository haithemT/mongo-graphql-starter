import { shield } from "graphql-shield";
import { ItemMutationPermissions, ItemQueryPermissions } from "./Item";
import { UserMutationPermissions, UserQueryPermissions } from "./User";
import { ListMutationPermissions, ListQueryPermissions } from "./List";

export const permissions = shield({
  Query: {
    ...ItemQueryPermissions,
    ...UserQueryPermissions,
    ...ListQueryPermissions
  },
  Mutation: {
    ...ItemMutationPermissions,
    ...UserMutationPermissions,
    ...ListMutationPermissions
  }
});
