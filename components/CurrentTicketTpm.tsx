import { FirebaseApp } from "firebase/app";
import { get, getDatabase, ref, set } from "firebase/database";
import { CurrentVotes, User } from "~/routes/sessions.$id";

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

            set(ticketRef, ticketNumber).then(() => {
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
          onClick={() => {
            const db = getDatabase(firebase); // Get a reference to the database service
            const ticketRef = ref(db, `sessions/${id}/currentTicket`);
            set(ticketRef, null).then(() => {
              console.log("Ticket set");
            });
            const votesRef = ref(db, `sessions/${id}/currentVotes`);
            set(votesRef, []);
            console.log("Votes reset");
            const devsRef = ref(db, `sessions/${id}/dev`);
            get(devsRef)
              .then((snapshot) => {
                if (snapshot.exists()) {
                  const devs = snapshot.val();
                  // Do something with the devs data if needed
                  devs.map((d: User) => (d.hasVoted = false));
                  set(devsRef, devs);
                } else {
                  console.log("No data available");
                }
              })
              .catch((error) => {
                console.error(error);
              });

            const qaRef = ref(db, `sessions/${id}/qa`);
            get(qaRef)
              .then((snapshot) => {
                if (snapshot.exists()) {
                  const devs = snapshot.val();
                  // Do something with the devs data if needed
                  devs.map((d: User) => (d.hasVoted = false));
                  set(qaRef, devs);
                } else {
                  console.log("No data available");
                }
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        >
          Finish Voting
        </button>
      </div>
    </div>
  );
}
