import { FirebaseApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { CurrentTicket } from "~/routes/sessions.$id";

export default function CurrentTicketTpm({
  id,
  currentTicket,
  firebase,
}: {
  id: string;
  currentTicket: CurrentTicket | null;
  firebase: FirebaseApp;
}) {
  if (!currentTicket) {
    return (
      <div className="text-2xl mb-4 flex flex-col">
        <p>Enter the ticket we will be sizing:</p>
        <input
          type="text"
          className="border border-gray-300 rounded px-2 py-1 text-center my-5"
        />
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer my-5"
          onClick={() => {
            const db = getDatabase(firebase); // Get a reference to the database service
            const newUserRef = ref(db, `sessions/${id}/currentTicket`);
            set(newUserRef, {
              id: "WEB-1245",
              votes: [],
            }).then(() => {
              console.log("Ticket set");
            });
          }}
        >
          Start!
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl mb-4">
        Current Ticket: <strong>{currentTicket.id}</strong>
      </h2>
      <div>
        <div className="flex space-x-2">Current Votes</div>
        {currentTicket.votes.map((vote) => (
          <p>
            {vote.name}: {vote.vote}
          </p>
        ))}
      </div>
    </div>
  );
}
