import React, { useState } from "react";

const VoteNumbers: React.FC<{
  setSelectedVote: (num: number | null) => void;
}> = ({ setSelectedVote }) => {
  const [selectedVote, setSelectedVoteState] = useState<number | null>(null);

  const handleVoteClick = (num: number | null) => {
    setSelectedVote(num);
    setSelectedVoteState(num);
  };

  return (
    <div className="flex space-x-2">
      {[1, 2, 3, 5, 8, 13, 21].map((num) => (
        <button
          key={num}
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer ${
            selectedVote === num ? "bg-blue-700" : ""
          }`}
          onClick={() => handleVoteClick(num)}
        >
          {num}
        </button>
      ))}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        onClick={() => handleVoteClick(null)}
      >
        Clear
      </button>
    </div>
  );
};

export default VoteNumbers;
