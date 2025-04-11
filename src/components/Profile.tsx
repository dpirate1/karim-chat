import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "../hooks/use-toast";
import { useConvexAuth } from "convex/react";
import { getAuthUserId } from "@convex-dev/auth/server";

export function Profile() {
  const { toast } = useToast();
  const { isAuthenticated } = useConvexAuth();
  const currentUser = useQuery(api.users.getCurrentUser);
  const createProfile = useMutation(api.users.createProfile);
  
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    bio: "",

  });
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createProfile({
        username: formData.username,
        displayName: formData.displayName,
        bio: formData.bio,
      });
      toast({
        title: "Profile created!",
        description: "Your profile has been successfully created.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create profile",
        variant: "destructive",
      });
    }
  }

  if (!isAuthenticated || currentUser === undefined) {
    return <div>Loading...</div>;
  }

  if (currentUser) {
    return (
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Username</h3>
            <p>{currentUser.username}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Display Name</h3>
            <p>{currentUser.displayName}</p>
          </div>
          {currentUser.bio && (
            <div className="mb-4">
              <h3 className="font-semibold">Bio</h3>
              <p>{currentUser.bio}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Display Name</label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Create Profile
        </button>
      </form>
    </div>
  );
}
