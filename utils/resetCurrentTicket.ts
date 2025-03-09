import { get, getDatabase, onValue, push, ref, set } from "firebase/database";

import { FirebaseApp } from "firebase/app";

/**
 * resets the current ticket, all votes, etc
 */
export default function ({
  firebase,
  id,
  currentTicket,
  moveTicketToDone,
  finalVote,
}: {
  firebase: FirebaseApp;
  currentTicket: string;
  id: string;
  moveTicketToDone: boolean;
  finalVote: number | null;
}) {
  const db = getDatabase(firebase); // Get a reference to the database service
  const ticketRef = ref(db, `sessions/${id}/currentTicket`);
  set(ticketRef, null).then(() => {
    console.log("Ticket set");
  });
  const votesRef = ref(db, `sessions/${id}/currentVotes`);
  set(votesRef, []);
  console.log("Votes reset");

  // get revealed votes
  const revealedRef = ref(db, `sessions/${id}/revealedVotes`);

  if (moveTicketToDone) {
    // move ticket to past tickets
    get(revealedRef).then((snapshot) => {
      if (snapshot.exists()) {
        const revealedVotes = snapshot.val();
        const pastTicketsRef = ref(db, `sessions/${id}/pastTickets`);
        push(pastTicketsRef, {
          id: currentTicket,
          votes: revealedVotes,
          finalVote,
        });
        set(revealedRef, revealedVotes);
      } else {
        console.log("No data available");
      }

      set(revealedRef, null);
      console.log("Revealed votes reset");
    });
  } else {
    set(revealedRef, null);
    console.log("Revealed votes reset");
  }

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
}
