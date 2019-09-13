import { rule, and, or, not } from "graphql-shield";
import { authenticate } from "../../config/passport";

export const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    console.log(await authenticate(ctx.request, ctx.request.res));
    const user = await authenticate(ctx.request, ctx.request.res);
    return user && user.id !== null;
  }
);

export const isAdmin = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return ctx.user.role === "admin";
  }
);
