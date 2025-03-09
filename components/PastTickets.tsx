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
        <div className="grid grid-cols-3 gap-4">
          {pastTickets.map((ticket: PastTicket) => (
            <div key={ticket.uuid} className="border p-4 rounded shadow">
              <h2 className="text-lg font-bold mb-2">{ticket.id}</h2>
              <div className="mb-4">
                <ul>
                  {Object.keys(ticket.votes).map((voteKey) => (
                    <li key={voteKey}>
                      {voteKey}: {ticket.votes[voteKey]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastTickets;
