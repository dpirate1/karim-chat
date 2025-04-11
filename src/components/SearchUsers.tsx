import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "../hooks/use-toast";
import { Id } from "../../convex/_generated/dataModel";

export function SearchUsers() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const searchResults = useQuery(api.users.searchUsers, { searchTerm });
  const sendFriendRequest = useMutation(api.friends.sendFriendRequest);

  async function handleSendRequest(userId: Id<"users">) {
    try {
      await sendFriendRequest({ toUserId: userId });
      toast({
        title: "Friend request sent!",
        description: "They'll be notified of your request.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send friend request",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
      </div>

      <div className="space-y-4">
        {searchResults?.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
          >
            <div>
              <h3 className="font-semibold">{user.displayName}</h3>
              <p className="text-gray-600">@{user.username}</p>
            </div>
            <button
              onClick={() => handleSendRequest(user.userId)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Friend
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
