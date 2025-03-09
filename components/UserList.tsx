import { FirebaseApp } from "firebase/app";
import { getDatabase, push, ref } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { User } from "~/routes/sessions.$id";

interface UserListProps {
  users: User[];
  currentVotes: { [key: string]: number } | null;
  firebase: FirebaseApp;
  me: string;
  id: string;
}

const UserList: React.FC<UserListProps> = ({
  users,
  currentVotes,
  firebase,
  me,
  id,
}) => {
  const sendEmoji = (emoji: string, to: string) => {
    const database = getDatabase(firebase);
    const emojiRef = ref(database, `sessions/${id}/emoji`);
    push(emojiRef, { emoji, to, from: me });
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {users.map((user) => (
        <div
          key={user.name}
          className={`border-2 border-gray-300 rounded px-2 py-1 w-3/4 ${
            user.hasVoted ? "bg-green-100" : ""
          }`}
        >
          <p className="text-xl my-2">{user.name}</p>
          <p className="text-2xl font-bold mb-2">
            {currentVotes ? currentVotes[user.name] || "" : ""}
          </p>
          <div className="flex space-x-2 mt-4">
            {["👍", "❤️", "😂", "🎉", "😢", "😡"].map((emoji) => (
              <button
                key={emoji}
                className="text-sm cursor-pointer hover:bg-gray-200 rounded"
                onClick={() => sendEmoji(emoji, user.name)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
