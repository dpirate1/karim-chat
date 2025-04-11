import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "./components/ui/toaster";
import { Chat } from "./components/Chat";
import { FriendsList } from "./components/FriendsList";
import { SearchUsers } from "./components/SearchUsers";
import { Profile } from "./components/Profile";
import { useState } from "react";

export default function App() {
  const [selectedView, setSelectedView] = useState<"chat" | "friends" | "search" | "profile">("chat");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold accent-text">Karim Chat</h2>
        <SignOutButton />
      </header>
      
      <main className="flex-1 flex">
        <Authenticated>
          <div className="flex flex-col md:flex-row w-full">
            {/* Sidebar Navigation */}
            <nav className="bg-gray-50 p-4 md:w-64 border-b md:border-r">
              <ul className="flex md:flex-col gap-4 justify-around md:justify-start">
                <li>
                  <button
                    onClick={() => setSelectedView("chat")}
                    className={`p-2 w-full text-left rounded ${
                      selectedView === "chat" ? "bg-blue-100 text-blue-700" : ""
                    }`}
                  >
                    Chat
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedView("friends")}
                    className={`p-2 w-full text-left rounded ${
                      selectedView === "friends" ? "bg-blue-100 text-blue-700" : ""
                    }`}
                  >
                    Friends
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedView("search")}
                    className={`p-2 w-full text-left rounded ${
                      selectedView === "search" ? "bg-blue-100 text-blue-700" : ""
                    }`}
                  >
                    Search
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedView("profile")}
                    className={`p-2 w-full text-left rounded ${
                      selectedView === "profile" ? "bg-blue-100 text-blue-700" : ""
                    }`}
                  >
                    Profile
                  </button>
                </li>
              </ul>
            </nav>

            {/* Main Content */}
            <div className="flex-1 p-4">
              {selectedView === "chat" && <Chat />}
              {selectedView === "friends" && <FriendsList />}
              {selectedView === "search" && <SearchUsers />}
              {selectedView === "profile" && <Profile />}
            </div>
          </div>
        </Authenticated>
        
        <Unauthenticated>
          <div className="w-full max-w-md mx-auto p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Welcome to Social Chat</h1>
              <p className="text-gray-600">Sign in to connect with friends and start chatting!</p>
            </div>
            <SignInForm />
          </div>
        </Unauthenticated>
      </main>
      
      <Toaster />
    </div>
  );
}
