import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getFriendRequests = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const requests = await ctx.db
      .query("friendRequests")
      .withIndex("by_to_user", q => 
        q.eq("toUserId", userId).eq("status", "pending")
      )
      .collect();

    // Get sender profiles
    const requestsWithProfiles = await Promise.all(
      requests.map(async (request) => {
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_user", q => q.eq("userId", request.fromUserId))
          .first();
        return {
          ...request,
          sender: profile,
        };
      })
    );

    return requestsWithProfiles;
  },
});

export const getFriends = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const sentRequests = await ctx.db
      .query("friendRequests")
      .withIndex("by_from_user", q => 
        q.eq("fromUserId", userId).eq("status", "accepted")
      )
      .collect();

    const receivedRequests = await ctx.db
      .query("friendRequests")
      .withIndex("by_to_user", q => 
        q.eq("toUserId", userId).eq("status", "accepted")
      )
      .collect();

    // Get all friend profiles
    const friendsWithProfiles = await Promise.all(
      [...sentRequests, ...receivedRequests].map(async (friendship) => {
        const friendId = friendship.fromUserId === userId 
          ? friendship.toUserId 
          : friendship.fromUserId;
        
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_user", q => q.eq("userId", friendId))
          .first();
        
        return {
          ...friendship,
          friend: profile,
        };
      })
    );

    return friendsWithProfiles;
  },
});

// Previous functions remain the same
export const sendFriendRequest = mutation({
  args: { toUserId: v.id("users") },
  handler: async (ctx, args) => {
    const fromUserId = await getAuthUserId(ctx);
    if (!fromUserId) throw new Error("Not authenticated");
    if (fromUserId === args.toUserId) throw new Error("Cannot friend yourself");

    const existing = await ctx.db
      .query("friendRequests")
      .withIndex("by_users", q => 
        q.eq("fromUserId", fromUserId).eq("toUserId", args.toUserId)
      )
      .first();
    if (existing) throw new Error("Friend request already exists");

    return await ctx.db.insert("friendRequests", {
      fromUserId,
      toUserId: args.toUserId,
      status: "pending",
    });
  },
});

export const respondToFriendRequest = mutation({
  args: {
    requestId: v.id("friendRequests"),
    accept: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Request not found");
    if (request.toUserId !== userId) throw new Error("Not authorized");
    if (request.status !== "pending") throw new Error("Request already handled");

    await ctx.db.patch(args.requestId, {
      status: args.accept ? "accepted" : "rejected",
    });
  },
});
