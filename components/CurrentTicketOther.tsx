import { FirebaseApp } from "firebase/app";
import { get, getDatabase, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { User } from "~/routes/sessions.$id";

export default function CurrentTicketOther({
  me,
  id,
  ticketNum,
  firebase,
}: {
  me: string;
  id: string;
  ticketNum: string | null;
  firebase: FirebaseApp;
}) {
  const [selectedVote, setSelectedVote] = useState<number | null>(null);

  if (!ticketNum) {
    return <div>Waiting for next ticket...</div>;
  }

  useEffect(() => {
    const db = getDatabase(firebase); // Get a reference to the database service
    const currentVotesRef = ref(db, `sessions/${id}/currentVotes`);

    push(currentVotesRef, { name: me, vote: selectedVote });

    const r = ref(db, `sessions/${id}/qa`);
    get(r)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          console.log(selectedVote);
          Object.keys(users).forEach((i) => {
            if (users[i].name === me) {
              users[i].hasVoted = selectedVote ? true : false;
            }
          });
          set(r, users);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedVote]);

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
