import { FirebaseApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { CurrentVotes } from "~/routes/sessions.$id";

export default function CurrentTicketTpm({
  id,
  currentTicket,
  currentVotes,
  firebase,
}: {
  id: string;
  currentTicket: string | null;
  currentVotes: CurrentVotes;
  firebase: FirebaseApp;
}) {
  if (!currentTicket) {
    return (
      <div className="text-2xl mb-4 flex flex-col">
        <p>Enter the ticket we will be sizing:</p>
        <input
          type="text"
          className="border border-gray-300 rounded px-2 py-1 text-center my-5"
          id="ticket-input"
          placeholder="Example: WEB-1234"
        />
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer my-5"
          onClick={() => {
            const db = getDatabase(firebase); // Get a reference to the database service
            const ticketRef = ref(db, `sessions/${id}/currentTicket`);
            const ticketNumber = (
              document.getElementById("ticket-input") as HTMLInputElement
            )?.value;

            if (!ticketNumber) {
              alert("Please enter a ticket number");
              return;
            }

            set(ticketRef, {
              id: ticketNumber,
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
        Current Ticket: <strong>{currentTicket}</strong>
      </h2>
      <div>
        <div className="flex space-x-2">Current Votes</div>
        {currentVotes.map((vote) => (
          <p>
            {vote.name}: {vote.vote}
          </p>
        ))}
      </div>
      <div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer my-5"
        >
          Finish Voting
        </button>
      </div>
    </div>
  );
}
