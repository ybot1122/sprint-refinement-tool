import type { MetaFunction } from "@vercel/remix";
import React, { useEffect, useRef } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import initFirebase from "constants/init_firebase";
import { FirebaseApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push, get } from "firebase/database";

export const meta: MetaFunction = () => {
  return [
    { title: "Sprint Refinement Tool" },
    { name: "description", content: "Welcome to Sprint Refinement" },
  ];
};

export default function Index() {
  const [showSessionInput, setShowSessionInput] = React.useState(false);
  const [showStart, setShowStart] = React.useState(false);
  const [sessionId, setSessionId] = React.useState("");
  const [adminName, setAdminName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const firebase = useRef<FirebaseApp>();

  useEffect(() => {
    const { app } = initFirebase(); // Initialize Firebase
    firebase.current = app;
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-green-300 p-5">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-300 p-5">
      <h1 className="text-4xl mb-5">Welcome to Sprint Refinement</h1>
      <div className="flex flex-col gap-4 w-[320px]">
        <button
          className="px-5 py-2 text-lg rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          onClick={() => setShowSessionInput(!showSessionInput)}
        >
          Join Existing Session
        </button>
        {showSessionInput && (
          <div className="my-4">
            <input
              type="text"
              placeholder="Enter Session ID"
              className="px-3 py-2 border rounded"
              onChange={(e) => setSessionId(e.target.value)}
            />
            <button
              className="ml-2 px-5 py-2 text-lg rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
              onClick={async () => {
                setIsLoading(true);
                const app = firebase.current;
                if (!app) {
                  alert("Sorry, could not connect to firebase");
                  setIsLoading(false);
                  return;
                }

                const database = getDatabase(app); // Get a reference to the database service
                const sessionRef = ref(database, `sessions/${sessionId}`);

                try {
                  const snapshot = await get(sessionRef);
                  if (snapshot.exists()) {
                  } else {
                    alert(`Session id ${sessionId} not found`);
                  }
                } catch (error) {
                  alert("Error reading data");
                  return null; // Or throw the error, depending on error handling strategy
                }

                setIsLoading(false);
              }}
            >
              Join
            </button>
          </div>
        )}
        <button
          className="px-5 py-2 text-lg rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          onClick={() => setShowStart(!showStart)}
        >
          Start New Session
        </button>
        {showStart && (
          <div className="my-4">
            <input
              type="text"
              placeholder="Enter Your Name"
              className="px-3 py-2 border rounded"
              onChange={(e) => setAdminName(e.target.value)}
            />
            <button
              className="ml-2 px-5 py-2 text-lg rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
              onClick={async () => {
                const app = firebase.current;
                if (!app) {
                  alert("Sorry, could not connect to firebase");
                  return;
                }

                const database = getDatabase(app); // Get a reference to the database service

                const new_session_id = Math.random()
                  .toString(36)
                  .substring(2, 7);

                // Set data at a specific location
                set(ref(database, `sessions/${new_session_id}`), {
                  session_id: new_session_id,
                  created_at: new Date().getMilliseconds(),
                  admin: adminName,
                });
              }}
            >
              Create
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
