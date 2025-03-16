import React, { useState } from "react";
import { Role, User } from "~/routes/sessions.$id";
import Loader from "./Loader";

interface WelcomeToSessionProps {
  tpm: string;
  online: User[];
  addUser: (user: string, role: Role) => void;
  rejoinUser: (user: string) => void;
}

const WelcomeToSession: React.FC<WelcomeToSessionProps> = ({
  tpm,
  online,
  addUser,
  rejoinUser,
}) => {
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"join" | "rejoin">("join");

  const onJoin = () => {
    setIsLoading(true);
    if (!role || !name) {
      alert("Please select a role and enter your name");
      setIsLoading(false);
      return;
    }

    if (online.some((user) => user.name === name)) {
      setIsModalOpen(true);
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

  const openModal = (name: string) => {
    setName(name);
    setIsModalOpen(true);
    setIsLoading(false);
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    rejoinUser(name);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
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
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setActiveTab("join")}
            className={`p-2 rounded-l ${
              activeTab === "join"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            } cursor-pointer`}
          >
            Join
          </button>
          <button
            onClick={() => setActiveTab("rejoin")}
            className={`p-2 rounded-r ${
              activeTab === "rejoin"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            } cursor-pointer`}
          >
            Rejoin
          </button>
        </div>
        {activeTab === "join" ? (
          <>
            <label htmlFor="role-select" className="block text-gray-700 mb-2">
              Select your role:
            </label>
            <select
              id="role-select"
              value={role || ""}
              onChange={handleRoleChange}
              className="block w-full p-2 border border-gray-300 rounded mb-4 cursor-pointer"
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
          </>
        ) : (
          <>
            <div className=" w-full max-w-md mt-4">
              {online.length === 0 ? (
                "no one else here :("
              ) : isLoading ? (
                <Loader />
              ) : (
                [...online, { name: tpm }].map((user) => (
                  <div
                    key={user.name}
                    className="flex justify-between items-center mb-2"
                  >
                    <span>{user.name}</span>
                    <button
                      onClick={() => openModal(user.name)}
                      className="bg-blue-500 text-white p-1 rounded cursor-pointer"
                    >
                      Rejoin
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Name already taken</h2>
            <p className="mb-4">Are you sure this is you?</p>
            <div className="flex justify-end">
              <button
                onClick={handleModalCancel}
                className="bg-gray-300 text-black p-2 rounded mr-2 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleModalConfirm}
                className="bg-blue-500 text-white p-2 rounded cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeToSession;
