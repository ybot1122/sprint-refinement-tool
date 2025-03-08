import { FirebaseApp } from "firebase/app";
import { get, getDatabase, onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { CurrentVotes, User } from "~/routes/sessions.$id";

export default function CurrentTicketTpm({
  id,
  currentTicket,
  firebase,
  qa,
  dev,
}: {
  id: string;
  currentTicket: string | null;
  firebase: FirebaseApp;
  qa: User[];
  dev: User[];
}) {
  const [currentVotes, setCurrentVotes] = useState<CurrentVotes>({});

  useEffect(() => {
    const db = getDatabase(firebase); // Get a reference to the database service
    const currentVotesRef = ref(db, `sessions/${id}/currentVotes`);

    onValue(currentVotesRef, (snapshot) => {
      if (snapshot.exists()) {
        setCurrentVotes(snapshot.val());
      } else {
        setCurrentVotes({});
      }
    });
  }, []);

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
    <div className="w-full text-center">
      <h2 className="text-2xl mb-4">
        Current Ticket: <strong>{currentTicket}</strong>
      </h2>
      <div className="flex w-full justify-around mt-4">
        <div className="w-1/2 text-center">
          <h3 className="text-xl mb-2">DEV Votes</h3>
          <div className="flex flex-col items-center space-y-2">
            {dev.map((user) => (
              <p
                key={user.name}
                className="border border-gray-300 rounded px-2 py-1 w-3/4"
              >
                {user.name}: {currentVotes[user.name] || "No vote"}
              </p>
            ))}
          </div>
        </div>
        <div className="w-1/2 text-center">
          <h3 className="text-xl mb-2">QA Votes</h3>
          <div className="flex flex-col items-center space-y-2">
            {qa.map((user) => (
              <p
                key={user.name}
                className="border border-gray-300 rounded px-2 py-1 w-3/4"
              >
                {user.name}: {currentVotes[user.name] || "No vote"}
              </p>
            ))}
          </div>
        </div>
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
                  console.log(devs);
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
          Finish Voting
        </button>
      </div>
    </div>
  );
}
