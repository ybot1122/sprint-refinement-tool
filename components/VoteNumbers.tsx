import React, { useState } from "react";

const VoteNumbers: React.FC<{
  setSelectedVote: (num: number | null) => void;
  allowZero?: boolean;
}> = ({ setSelectedVote, allowZero = false }) => {
  const [selectedVote, setSelectedVoteState] = useState<number | null>(null);

  const handleVoteClick = (num: number | null) => {
    setSelectedVote(num);
    setSelectedVoteState(num);
  };

  const nums = [1, 2, 3, 5, 8, 13, 21];
  if (allowZero) {
    nums.unshift(0);
  }

  return (
    <div className="flex space-x-2 flex-wrap">
      {nums.map((num) => (
        <button
          key={num}
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer my-2 ${
            selectedVote === num ? "bg-blue-700" : ""
          }`}
          onClick={() => handleVoteClick(num)}
        >
          {num}
        </button>
      ))}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer my-2"
        onClick={() => handleVoteClick(null)}
      >
        Clear
      </button>
    </div>
  );
};

export default VoteNumbers;
