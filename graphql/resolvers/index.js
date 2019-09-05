import { mergeResolvers } from "merge-graphql-schemas";

import User from "./User/";
import List from "./List";
import Item from "./Item";

const resolvers = [User, List, Item];

export default mergeResolvers(resolvers);
