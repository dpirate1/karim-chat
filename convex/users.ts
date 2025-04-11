import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("profiles")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();
  },
});

export const createProfile = mutation({
  args: {
    username: v.string(),
    displayName: v.string(),
    profilePicture: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if username is taken
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_username", q => q.eq("username", args.username))
      .first();
    if (existing) throw new Error("Username already taken");

    return await ctx.db.insert("profiles", {
      userId,
      ...args,
    });
  },
});

export const getProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_user", q => q.eq("userId", args.userId))
      .first();
  },
});

export const searchUsers = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profiles = await ctx.db
      .query("profiles")
      .withSearchIndex("search", q => q.search("username", args.searchTerm))
      .take(10);

    return profiles.filter(profile => profile.userId !== userId);
  },
});
