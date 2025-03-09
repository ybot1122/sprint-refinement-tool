import { useParams } from "@remix-run/react";
import initFirebase from "constants/init_firebase";
import { FirebaseApp } from "firebase/app";
import { get, getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";

type Recap = {
  totalDuration: number;
  numberOfTickets: number;
  averageDuration: number;
  qaAccuracy: Record<string, number>;
  devAccuracy: Record<string, number>;
  ticketSizes: {
    id: string;
    ticket: string;
    finalVote: number;
    finalQaVote: number;
  }[];
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
            finalQaVote: ticket.finalQaVote,
          })
        );

        const pastTickets = val?.pastTickets;

        const durations = Object.values(pastTickets || {}).map(
          (ticket: any) => ticket.duration
        );
        const averageDuration =
          durations.reduce((acc, duration) => acc + duration, 0) /
            durations.length || 0;

        const devs = Object.values(val?.dev).map((o: any) => o.name);
        const qas = Object.values(val?.qa).map((o: any) => o.name);

        const devAccuracy: Record<string, number> = {};
        const qaAccuracy: Record<string, number> = {};

        devs.map((d) => (devAccuracy[d] = 0));
        qas.map((d) => (qaAccuracy[d] = 0));

        Object.values(pastTickets || {}).map((ticket: any) => {
          Object.keys(ticket.votes).map((k) => {
            if (devs.includes(k)) {
              if (ticket.votes[k] === ticket.finalVote) {
                devAccuracy[k] += 1;
              }
            }

            if (qas.includes(k)) {
              if (ticket.votes[k] === ticket.finalQaVote) {
                qaAccuracy[k] += 1;
              }
            }
          });
        });

        setRecap({
          totalDuration: totalDuration || 0,
          numberOfTickets: numberOfTickets || 0,
          ticketSizes,
          averageDuration,
          qaAccuracy,
          devAccuracy,
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
            <p>
              {Math.floor(recap.totalDuration / 60000)}m{" "}
              {((recap.totalDuration % 60000) / 1000).toFixed(0)}s
            </p>
          </div>
          <div className="col-span-1">
            <p>Number of Tickets Pointed:</p>
          </div>
          <div className="col-span-1">
            <p>{recap.numberOfTickets}</p>
          </div>
          <div className="col-span-1">
            <p>Avg Time per Ticket:</p>
          </div>
          <div className="col-span-1">
            <p>
              {Math.floor(recap.averageDuration / 60000)}m{" "}
              {((recap.averageDuration % 60000) / 1000).toFixed(0)}s
            </p>
          </div>
          <div className="col-span-1">
            <p>Most Accurate Devs:</p>
          </div>
          <div className="col-span-1">
            <p>
              {Object.keys(recap.devAccuracy)
                .filter(
                  (key) =>
                    recap.devAccuracy[key] ===
                    Math.max(...Object.values(recap.devAccuracy))
                )
                .join(", ")}{" "}
              correctly pointed {Math.max(...Object.values(recap.devAccuracy))}{" "}
              tickets
            </p>
          </div>
          <div className="col-span-1">
            <p>Most Accurate QAs:</p>
          </div>
          <div className="col-span-1">
            <p>
              {Object.keys(recap.qaAccuracy)
                .filter(
                  (key) =>
                    recap.qaAccuracy[key] ===
                    Math.max(...Object.values(recap.qaAccuracy))
                )
                .join(", ")}{" "}
              correctly pointed {Math.max(...Object.values(recap.qaAccuracy))}{" "}
              tickets
            </p>
          </div>
        </div>
      )}
      {recap && (
        <div className="grid grid-cols-3 gap-4 bg-white p-5 rounded-lg shadow-md mt-10">
          <div className="col-span-1 font-bold">
            <p>Ticket</p>
          </div>
          <div className="col-span-1 font-bold">
            <p>Dev Size</p>
          </div>
          <div className="col-span-1 font-bold">
            <p>QA Size</p>
          </div>
          {recap.ticketSizes.map((t) => (
            <React.Fragment key={t.id}>
              <div className="col-span-1">
                <p>{t.ticket.toLocaleUpperCase()}</p>
              </div>
              <div className="col-span-1 text-center">
                <p>{t.finalVote}</p>
              </div>
              <div className="col-span-1 text-center">
                <p>{t.finalQaVote}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
