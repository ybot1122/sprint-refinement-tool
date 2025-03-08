import type { MetaFunction } from "@vercel/remix";
import React from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Sprint Refinement Tool" },
    { name: "description", content: "Welcome to Sprint Refinement" },
  ];
};

export default function Index() {
  const [showSessionInput, setShowSessionInput] = React.useState(false);
  const [sessionId, setSessionId] = React.useState("");
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-300 p-5">
      <h1 className="text-4xl mb-5">Welcome to Sprint Refinement</h1>
      <div className="flex flex-col gap-4 w-[300px]">
        <button
          className="px-5 py-2 text-lg rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          onClick={() => setShowSessionInput(!showSessionInput)}
        >
          Join Existing Session
        </button>
        {showSessionInput && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter Session ID"
              className="px-3 py-2 border rounded"
              onChange={(e) => setSessionId(e.target.value)}
            />
            <button
              className="ml-2 px-5 py-2 text-lg rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
              onClick={() => alert(`Joining session ${sessionId}`)}
            >
              Join
            </button>
          </div>
        )}
        <button
          className="px-5 py-2 text-lg rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          onClick={() => alert("Start a new session")}
        >
          Start New Session
        </button>
      </div>
    </div>
  );
}
