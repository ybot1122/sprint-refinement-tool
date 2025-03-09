import { FirebaseApp } from "firebase/app";
import { get, getDatabase, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { Role, User } from "~/routes/sessions.$id";
import VoteNumbers from "./VoteNumbers";

export default function CurrentTicketOther({
  me,
  id,
  role,
  ticketNum,
  firebase,
  enabled,
}: {
  role: Role;
  me: string;
  id: string;
  ticketNum: string | null;
  firebase: FirebaseApp;
  enabled: boolean;
}) {
  const [selectedVote, setSelectedVote] = useState<number | null>(null);

  useEffect(() => {
    if (ticketNum === null) {
      setSelectedVote(null);
    }
  }, [ticketNum]);

  useEffect(() => {
    if (ticketNum === null) return;

    const db = getDatabase(firebase); // Get a reference to the database service
    const currentVotesRef = ref(db, `sessions/${id}/currentVotes/${me}`);

    // update vote value in currentVotes
    set(currentVotesRef, selectedVote);

    // update voted status (hasVoted) in either dev or qa
    const r = ref(db, `sessions/${id}/${role}`);
    get(r)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          Object.keys(users).forEach((i) => {
            if (users[i].name === me) {
              users[i].hasVoted = selectedVote !== null ? true : false;
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
  }, [selectedVote, ticketNum]);

  if (!ticketNum) {
    return <div>Waiting for next ticket...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl mb-4">
        Current Ticket: <strong>{ticketNum.toLocaleUpperCase()}</strong>
      </h2>
      <div>
        {enabled && (
          <VoteNumbers
            setSelectedVote={(num: number | null) => setSelectedVote(num)}
            allowZero
          />
        )}
        {selectedVote !== null && (
          <p className="mt-4">You have selected: {selectedVote}</p>
        )}
      </div>
    </div>
  );
}
