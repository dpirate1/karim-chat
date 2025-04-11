import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  profiles: defineTable({
    userId: v.id("users"),
    username: v.string(),
    displayName: v.string(),
    profilePicture: v.optional(v.string()),
    bio: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_username", ["username"])
    .searchIndex("search", {
      searchField: "username",
      filterFields: ["userId"],
    }),

  friendRequests: defineTable({
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
    status: v.string(), // "pending", "accepted", "rejected"
  })
    .index("by_from_user", ["fromUserId", "status"])
    .index("by_to_user", ["toUserId", "status"])
    .index("by_users", ["fromUserId", "toUserId"]),

  messages: defineTable({
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
    content: v.string(),
  })
    .index("by_users", ["fromUserId", "toUserId"])
    .index("by_to_user", ["toUserId"])
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
