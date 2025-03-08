import { useState } from "react";

export default function CurrentTicketOther({
  ticketNum,
}: {
  ticketNum: string | null;
}) {
  const [selectedVote, setSelectedVote] = useState<number | null>(null);

  if (!ticketNum) {
    return <div>Waiting for next ticket...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl mb-4">
        Current Ticket: <strong>{ticketNum}</strong>
      </h2>
      <div>
        <h3 className="text-xl font-semibold mt-5 mb-2">Pick your vote</h3>
        <div className="flex space-x-2">
          {[1, 2, 3, 5, 8, 13, 21].map((num) => (
            <button
              key={num}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer ${
                selectedVote === num ? "bg-blue-700" : ""
              }`}
              onClick={() => setSelectedVote(num)}
            >
              {num}
            </button>
          ))}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
            onClick={() => setSelectedVote(null)}
          >
            Clear
          </button>
        </div>
        {selectedVote !== null && (
          <p className="mt-4">You have selected: {selectedVote}</p>
        )}
      </div>
    </div>
  );
}
