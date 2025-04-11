import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "../hooks/use-toast";
import { Id } from "../../convex/_generated/dataModel";

export function Chat() {
  const { toast } = useToast();
  const [selectedFriend, setSelectedFriend] = useState<Id<"users"> | null>(null);
  const [messageText, setMessageText] = useState("");
  
  const friends = useQuery(api.friends.getFriends);
  const messages = useQuery(api.messages.getMessages, 
    selectedFriend ? { otherUserId: selectedFriend } : "skip"
  );
  const sendMessage = useMutation(api.messages.sendMessage);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFriend || !messageText.trim()) return;

    try {
      await sendMessage({
        toUserId: selectedFriend,
        content: messageText.trim(),
      });
      setMessageText("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex">
      {/* Friends Sidebar */}
      <div className="w-64 border-r p-4">
        <h2 className="font-semibold mb-4">Conversations</h2>
        <div className="space-y-2">
          {friends?.map((friendship) => (
            <button
              key={friendship._id}
              onClick={() => setSelectedFriend(
                friendship.fromUserId === friendship.friend?.userId 
                  ? friendship.fromUserId 
                  : friendship.toUserId
              )}
              className={`w-full p-2 text-left rounded ${
                selectedFriend === friendship.friend?.userId ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
            >
              <div className="font-semibold">{friendship.friend?.displayName}</div>
              <div className="text-sm text-gray-600">@{friendship.friend?.username}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedFriend ? (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages?.map((message) => (
                  <div
                    key={message._id}
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.fromUserId === selectedFriend
                        ? "bg-gray-100 mr-auto"
                        : "bg-blue-100 ml-auto"
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
