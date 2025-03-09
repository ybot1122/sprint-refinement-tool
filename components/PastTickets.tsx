import { FirebaseApp } from "firebase/app";
import React from "react";
import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { getDatabase, onValue, ref } from "firebase/database";
import { CurrentVotes, User } from "~/routes/sessions.$id";

<div className="grid grid-cols-3 gap-4">Past tickets</div>;
interface PastTicketsProps {
  firebase: FirebaseApp;
  id: string;
  dev: User[];
  qa: User[];
}

export type PastTicket = {
  uuid: string;
  id: string;
  votes: CurrentVotes;
};

const PastTickets: React.FC<PastTicketsProps> = ({ firebase, id, dev, qa }) => {
  const [pastTickets, setPastTickets] = useState<PastTicket[]>([]);

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
  );
};

export default PastTickets;
