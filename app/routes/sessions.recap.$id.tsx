import { useParams } from "@remix-run/react";
import initFirebase from "constants/init_firebase";
import { FirebaseApp } from "firebase/app";
import { get, getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";

type Recap = {
  totalDuration: number;
  numberOfTickets: number;
  ticketSizes: { id: string; ticket: string; finalVote: number }[];
};

export default function SessionRecapPage() {
  const { id } = useParams();
  const [firebase, setFirebase] = useState<FirebaseApp>();
  const [recap, setRecap] = useState<Recap | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const snapshot = await get(sessionRef);
        if (!snapshot.exists()) {
          alert("Session not found");
          window.location.href = "/";
        } else {
          console.log(snapshot.val());
          const val = snapshot.val();
        }
      } catch (error) {
        console.log(error);
        alert("Error reading data");
      }
    };

    const { app } = initFirebase(); // Initialize Firebase
    setFirebase(app);
    const database = getDatabase(app); // Get a reference to the database service
    const sessionRef = ref(database, `sessions/${id}`);

    check().then(() => {
      onValue(ref(database, `sessions/${id}`), (snapshot) => {
        const val = snapshot.val();
        const totalDuration = val?.end - val?.created_at;
        const numberOfTickets = Object.keys(val?.pastTickets || {}).length;

        const ticketSizes = Object.values(val.pastTickets || {}).map(
          (ticket: any) => ({
            id: crypto.randomUUID(),
            ticket: ticket.id,
            finalVote: ticket.finalVote,
          })
        );

        setRecap({
          totalDuration: totalDuration || 0,
          numberOfTickets: numberOfTickets || 0,
          ticketSizes,
        });
      });
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-green-300 p-5 min-h-screen">
      <h1 className="text-4xl font-bold mb-4">This Session has Ended</h1>
      <h2 className="text-2xl font-semibold mb-6">Recap</h2>
      {recap && (
        <div className="grid grid-cols-2 gap-4 bg-white p-5 rounded-lg shadow-md">
          <div className="col-span-1">
            <p>Total Duration:</p>
          </div>
          <div className="col-span-1">
            <p>{(recap.totalDuration / 60000).toFixed(2)} minutes</p>
          </div>
          <div className="col-span-1">
            <p>Number of Tickets Pointed:</p>
          </div>
          <div className="col-span-1">
            <p>{recap.numberOfTickets}</p>
          </div>
          {recap.ticketSizes.map((t) => (
            <React.Fragment key={t.id}>
              <div className="col-span-1 text-right">
                <p>{t.ticket.toLocaleUpperCase()}</p>
              </div>
              <div className="col-span-1">
                <p>{t.finalVote}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
