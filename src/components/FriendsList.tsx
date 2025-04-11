import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "../hooks/use-toast";
import { Id } from "../../convex/_generated/dataModel";

export function FriendsList() {
  const { toast } = useToast();
  const friendRequests = useQuery(api.friends.getFriendRequests);
  const friends = useQuery(api.friends.getFriends);
  const respondToRequest = useMutation(api.friends.respondToFriendRequest);

  async function handleResponse(requestId: Id<"friendRequests">, accept: boolean) {
    try {
      await respondToRequest({ requestId, accept });
      toast({
        title: accept ? "Friend request accepted!" : "Friend request declined",
        description: accept ? "You are now friends!" : "The request has been declined.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to respond to request",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Pending Friend Requests */}
      {friendRequests && friendRequests.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Friend Requests</h2>
          <div className="space-y-4">
            {friendRequests.map((request) => (
              <div
                key={request._id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
              >
                <div>
                  <p className="font-semibold">{request.sender?.displayName}</p>
                  <p className="text-gray-600">@{request.sender?.username}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleResponse(request._id, true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleResponse(request._id, false)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Friends</h2>
        <div className="space-y-4">
          {friends?.map((friendship) => (
            <div
              key={friendship._id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
            >
              <div>
                <p className="font-semibold">{friendship.friend?.displayName}</p>
                <p className="text-gray-600">@{friendship.friend?.username}</p>
              </div>
            </div>
          ))}
          {(!friends || friends.length === 0) && (
            <p className="text-gray-600">No friends yet. Try searching for users to add!</p>
          )}
        </div>
      </div>
    </div>
  );
}
