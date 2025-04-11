import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const sendMessage = mutation({
  args: {
    toUserId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const fromUserId = await getAuthUserId(ctx);
    if (!fromUserId) throw new Error("Not authenticated");

    return await ctx.db.insert("messages", {
      fromUserId,
      toUserId: args.toUserId,
      content: args.content,
    });
  },
});

export const getMessages = query({
  args: {
    otherUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const sentMessages = await ctx.db
      .query("messages")
      .withIndex("by_users", q => 
        q.eq("fromUserId", userId).eq("toUserId", args.otherUserId)
      )
      .collect();

    const receivedMessages = await ctx.db
      .query("messages")
      .withIndex("by_users", q => 
        q.eq("fromUserId", args.otherUserId).eq("toUserId", userId)
      )
      .collect();

    return [...sentMessages, ...receivedMessages].sort(
      (a, b) => a._creationTime - b._creationTime
    );
  },
});
