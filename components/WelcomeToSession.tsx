import React, { useState } from "react";
import { Role, User } from "~/routes/sessions.$id";
import Loader from "./Loader";

interface WelcomeToSessionProps {
  tpm: string;
  online: User[];
  addUser: (user: string, role: Role) => void;
}

const WelcomeToSession: React.FC<WelcomeToSessionProps> = ({
  tpm,
  online,
  addUser,
}) => {
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onJoin = () => {
    setIsLoading(true);
    if (!role || !name) {
      alert("Please select a role and enter your name");
      setIsLoading(false);
      return;
    }

    if (online.some((user) => user.name === name)) {
      alert("Name already taken");
      setIsLoading(false);
      return;
    }

    addUser(name, role);
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const val = event.target.value;

    if (val === "dev" || val === "qa" || val === "tpm") {
      setRole(val);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          Welcome to Sprint Refinement
        </h1>
        <h1 className="text-xl mb-4 text-center">Hosted By: {tpm}</h1>
        <h1 className="text-sm text-center mb-4">
          {!online.length
            ? "no one else here :("
            : online.map((o) => o.name).join(", ")}
        </h1>
        <label htmlFor="role-select" className="block text-gray-700 mb-2">
          Select your role:
        </label>
        <select
          id="role-select"
          value={role || ""}
          onChange={handleRoleChange}
          className="block w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="" disabled>
            Select your role
          </option>
          <option value="dev">Developer</option>
          <option value="qa">QA</option>
          <option value="tpm">TPM</option>
        </select>
        <div className=" w-full max-w-md mt-4">
          <label htmlFor="name-input" className="block text-gray-700 mb-2">
            Enter your name:
          </label>
          <input
            type="text"
            id="name-input"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="block w-full p-2 border border-gray-300 rounded mb-4"
          />
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <button
            onClick={onJoin}
            className="bg-blue-500 text-white p-2 rounded w-full disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
            disabled={!role || !name}
          >
            Join Session
          </button>
        )}
      </div>
    </div>
  );
};

export default WelcomeToSession;
