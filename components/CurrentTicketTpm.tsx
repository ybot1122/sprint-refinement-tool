import { FirebaseApp } from "firebase/app";
import { get, getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import resetCurrentTicket from "utils/resetCurrentTicket";
import { CurrentVotes, User } from "~/routes/sessions.$id";
import VoteNumbers from "./VoteNumbers";

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
  const [finalVote, setFinalVote] = useState<number | null>(null);
  const [finalQaVote, setFinalQaVote] = useState<number | null>(null);
  const startTimestamp = useRef<number | null>(null);

  useEffect(() => {
    if (currentTicket) {
      startTimestamp.current = Date.now();
    } else {
      startTimestamp.current = null;
    }
  }, [currentTicket]);

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
        Current Ticket: <strong>{currentTicket.toLocaleUpperCase()}</strong>
      </h2>
      {!votesRevealed && (
        <>
          <p>Only you can see votes.</p>
          <p>Other teammates cannot see votes until you click "Reveal Votes"</p>
        </>
      )}
      {votesRevealed && (
        <div className="flex justify-center flex-col items-center mt-10">
          <h3 className="text-xl my-5">Votes Revealed. Select Dev size.</h3>
          <VoteNumbers
            setSelectedVote={(num: number | null) => setFinalVote(num)}
            allowZero
          />
        </div>
      )}
      {votesRevealed && (
        <div className="flex justify-center flex-col items-center my-10">
          <h3 className="text-xl my-5">Votes Revealed. Select QA size.</h3>
          <VoteNumbers
            setSelectedVote={(num: number | null) => setFinalQaVote(num)}
            allowZero
          />
        </div>
      )}
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
            className={`bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded cursor-pointer my-5 mx-2 ${
              finalVote === null || finalQaVote === null
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() => {
              resetCurrentTicket({
                firebase,
                id,
                currentTicket,
                moveTicketToDone: true,
                finalVote,
                finalQaVote,
                duration: Date.now() - (startTimestamp.current ?? Date.now()),
              });
              setFinalVote(null);
              setFinalQaVote(null);
            }}
            disabled={finalVote === null || finalQaVote === null}
          >
            Finish Ticket
          </button>
        )}

        <button
          type="submit"
          className="bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded cursor-pointer my-5 mx-2"
          onClick={() => {
            resetCurrentTicket({
              firebase,
              id,
              currentTicket,
              moveTicketToDone: false,
              finalVote,
              finalQaVote,
              duration: Date.now() - (startTimestamp.current ?? Date.now()),
            });
            setFinalVote(null);
            setFinalQaVote(null);
          }}
        >
          Cancel Ticket
        </button>
      </div>
    </div>
  );
}
