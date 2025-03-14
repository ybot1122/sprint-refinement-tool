import { FirebaseApp } from "firebase/app";
import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { getDatabase, onValue, ref } from "firebase/database";
import { CurrentVotes, User } from "~/routes/sessions.$id";

interface PastTicketsProps {
  firebase: FirebaseApp;
  id: string;
}

export type PastTicket = {
  uuid: string;
  id: string;
  votes: CurrentVotes;
  finalVote: number;
  finalQaVote: number;
  duration: number;
};

const PastTickets: React.FC<PastTicketsProps> = ({ firebase, id }) => {
  const [pastTickets, setPastTickets] = useState<PastTicket[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const db = getDatabase(firebase); // Get a reference to the database service
    const pastTicketsRef = ref(db, `sessions/${id}/pastTickets`);

    onValue(pastTicketsRef, (snapshot) => {
      if (snapshot.exists()) {
        const items: PastTicket[] = [];
        snapshot.forEach((childSnapshot) => {
          items.push({ uuid: childSnapshot.key, ...childSnapshot.val() });
        });

        setPastTickets(items);
      }
    });
  }, [firebase, id]);

  return (
    <div>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-4 p-2 bg-blue-500 text-white rounded cursor-pointer"
      >
        {isVisible ? "Hide" : "Show"} Pointed Tickets ({pastTickets.length})
      </button>
      {isVisible && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {pastTickets
            .slice()
            .reverse()
            .map((ticket: PastTicket) => (
              <div key={ticket.uuid} className="border p-4 rounded shadow">
                <h2 className="text-lg font-bold">
                  {ticket.id.toLocaleUpperCase()}
                </h2>
                <p>
                  Dev: {ticket.finalVote}, QA: {ticket.finalQaVote}
                </p>
                <p>
                  Time spent: {Math.floor(ticket.duration / 60000)}m
                  {((ticket.duration % 60000) / 1000)
                    .toFixed(0)
                    .padStart(2, "0")}
                  s
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default PastTickets;
