import React from "react";

interface User {
  name: string;
}

interface UserListProps {
  users: User[];
  currentVotes: { [key: string]: number } | null;
}

const UserList: React.FC<UserListProps> = ({ users, currentVotes }) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      {users.map((user) => (
        <div
          key={user.name}
          className="border-2 border-gray-300 rounded px-2 py-1 w-3/4"
        >
          <p className="text-xl my-2">{user.name}</p>
          <p className="text-2xl font-bold">
            {currentVotes ? currentVotes[user.name] || "" : ""}
          </p>
        </div>
      ))}
    </div>
  );
};

export default UserList;
