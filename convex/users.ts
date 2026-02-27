import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateNewUser = mutation({
  args: {
    name: v.string(),
    imageUrl: v.string(),
    email: v.string()
  },
  handler: async (ctx, args) => {
    // If user already exists, return the user
    const user = await ctx.db.query("UserTable").filter(q=>q.eq(q.field("email"), args.email)).collect();
    if(user?.length == 0) {
      const data={
        name: args.name,
        imageUrl: args.imageUrl,
        email: args.email
      }
      const result = await ctx.db.insert("UserTable", {
       ...data
      });
      console.log(result);
      return {
        ...data,
        result
       // _id: result._id
      }
    }
    return user[0];
  }
})