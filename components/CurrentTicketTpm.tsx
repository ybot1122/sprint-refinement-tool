import { FirebaseApp } from "firebase/app";
import { get, getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { CurrentVotes, User } from "~/routes/sessions.$id";

export default function CurrentTicketTpm({
  id,
  currentTicket,
  firebase,
}: {
  id: string;
  currentTicket: string | null;
  firebase: FirebaseApp;
}) {
  const [votesRevealed, setVotesRevealed] = useState(false);

  useEffect(() => {
    setVotesRevealed(false);
  }, [currentTicket]);

  if (!currentTicket) {
    return (
      <div className="text-2xl mb-4 flex flex-col">
        <p>Enter the ticket we will be sizing:</p>
        <input
          type="text"
          className="border border-gray-300 rounded px-2 py-1 text-center my-5"
          id="ticket-input"
          autoComplete="off"
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

        <button
          type="button"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer my-5"
          onClick={() => {
            const db = getDatabase(firebase); // Get a reference to the database service
            const sessionRef = ref(db, `sessions/${id}/end`);
            set(sessionRef, Date.now()).then(() => {
              console.log("Session ended");
            });
          }}
        >
          End Session
        </button>
      </div>
    );
  }

  return (
    <div className="w-full text-center">
      <h2 className="text-2xl mb-4">
        Current Ticket: <strong>{currentTicket}</strong>
      </h2>
      <div>
        {!votesRevealed && (
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer my-5"
            onClick={() => {
              const db = getDatabase(firebase); // Get a reference to the database service
              const currentVotesRef = ref(db, `sessions/${id}/currentVotes`);
              get(currentVotesRef).then((snapshot) => {
                if (snapshot.exists()) {
                  const revealedRef = ref(db, `sessions/${id}/revealedVotes`);
                  const currentVotes = snapshot.val();
                  set(revealedRef, currentVotes);
                  setVotesRevealed(true);
                } else {
                  alert("No one has voted yet!");
                }
              });
            }}
          >
            Reveal Votes
          </button>
        )}
        {votesRevealed && (
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

              // reset revealed votes
              const revealedRef = ref(db, `sessions/${id}/revealedVotes`);

              // move ticket to past tickets
              get(revealedRef).then((snapshot) => {
                if (snapshot.exists()) {
                  const revealedVotes = snapshot.val();
                  const pastTicketsRef = ref(db, `sessions/${id}/pastTickets`);
                  push(pastTicketsRef, {
                    id: currentTicket,
                    votes: revealedVotes,
                  });
                  set(revealedRef, revealedVotes);
                } else {
                  console.log("No data available");
                }

                set(revealedRef, null);
                console.log("Revealed votes reset");
              });

              // reset vote status for dev
              const devsRef = ref(db, `sessions/${id}/dev`);
              get(devsRef)
                .then((snapshot) => {
                  if (snapshot.exists()) {
                    const devs = snapshot.val();
                    Object.keys(devs).forEach((i) => {
                      devs[i].hasVoted = false;
                    });
                    set(devsRef, devs);
                  } else {
                    console.log("No data available");
                  }
                })
                .catch((error) => {
                  console.error(error);
                });

              // reset vote status for qa
              const qaRef = ref(db, `sessions/${id}/qa`);
              get(qaRef)
                .then((snapshot) => {
                  if (snapshot.exists()) {
                    const devs = snapshot.val();
                    Object.keys(devs).forEach((i) => {
                      devs[i].hasVoted = false;
                    });
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
            Finish Ticket
          </button>
        )}
      </div>
    </div>
  );
}
