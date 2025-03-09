import { useParams, useSearchParams } from "@remix-run/react";
import CurrentTicketOther from "components/CurrentTicketOther";
import CurrentTicketTpm from "components/CurrentTicketTpm";
import Loader from "components/Loader";
import PastTickets from "components/PastTickets";
import ShowVotes from "components/ShowVotes";
import WelcomeToSession from "components/WelcomeToSession";
import initFirebase from "constants/init_firebase";
import { FirebaseApp } from "firebase/app";
import { get, getDatabase, onValue, push, ref } from "firebase/database";
import { useCallback, useEffect, useRef, useState } from "react";

export type Role = "dev" | "qa" | "tpm";
export type CurrentVotes = Record<string, number>;
export type User = { name: string; hasVoted: boolean };

export default function SessionPage() {
  const [searchParams] = useSearchParams();
  const { id } = useParams();

  // local
  const [me, setMe] = useState(searchParams.get("tpm"));
  const [role, setRole] = useState<Role | null>(
    searchParams.get("tpm") ? "tpm" : null
  );

  // from db
  const [tpm, setTpm] = useState("");
  const [devs, setDevs] = useState<User[]>([]);
  const [qas, setQas] = useState<User[]>([]);
  const [currentTicket, setCurrentTicket] = useState<string | null>(null);
  const [currentVotes, setCurrentVotes] = useState<CurrentVotes>({});
  const [revealedVotes, setRevealedVotes] = useState<CurrentVotes | null>(null);

  const [firebase, setFirebase] = useState<FirebaseApp>();

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
          setTpm(val.admin);
          setDevs(Object.values(val?.dev || []));
          setQas(Object.values(val?.qa || []));
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
      onValue(ref(database, `sessions/${id}/dev`), (snapshot) => {
        setDevs(Object.values(snapshot.val() || {}));
      });

      onValue(ref(database, `sessions/${id}/qa`), (snapshot) => {
        setQas(Object.values(snapshot.val() || {}));
      });

      onValue(ref(database, `sessions/${id}/currentTicket`), (snapshot) => {
        const curr = snapshot.val();
        setCurrentTicket(curr || null);
      });

      onValue(ref(database, `sessions/${id}/end`), (snapshot) => {
        const curr = snapshot.val();
        if (curr) {
          window.location.href = `/sessions/recap/${id}`;
        }
      });
    });
  }, []);

  const addUser = useCallback((user: string, role: Role) => {
    const db = getDatabase(firebase); // Get a reference to the database service
    const newUserRef = ref(db, `sessions/${id}/${role}`);
    const data = {
      name: user,
      hasVoted: false,
    };
    push(newUserRef, data).then(() => {
      setMe(user);
      setRole(role);
    });
  }, []);

  useEffect(() => {
    if (firebase) {
      if (tpm && tpm === me) {
        const db = getDatabase(firebase); // Get a reference to the database service
        const currentVotesRef = ref(db, `sessions/${id}/currentVotes`);

        onValue(currentVotesRef, (snapshot) => {
          if (snapshot.exists()) {
            setCurrentVotes(snapshot.val());
          } else {
            setCurrentVotes({});
          }
        });

        // for debugging
        onValue(ref(db, `sessions/${id}`), (snapshot) => {
          const data = snapshot.val();
          if (data) {
            console.log(data);
          }
        });
      }

      if (tpm && tpm !== me) {
        const db = getDatabase(firebase); // Get a reference to the database service
        const revealedVotesRef = ref(db, `sessions/${id}/revealedVotes`);

        onValue(revealedVotesRef, (snapshot) => {
          if (snapshot.exists()) {
            setRevealedVotes(snapshot.val());
          } else {
            setRevealedVotes(null);
          }
        });
      }
    }
  }, [tpm, me, firebase]);

  if (!firebase || !id) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center justify-center bg-green-300 p-5 min-h-screen">
      {role === "tpm" && tpm && tpm !== me && (
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          Sorry, we only support 1 TPM per session. The TPM must be: {tpm}
        </div>
      )}
      {!role && tpm && (
        <WelcomeToSession
          tpm={tpm}
          online={devs.concat(qas)}
          addUser={addUser}
        />
      )}
      {role && me && (
        <div className="w-full max-w-4xl bg-white p-8 rounded shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
              Sprint Refinement - {tpm} is the TPM.
            </h1>
            <h2 className="text-xl">
              Session ID:{" "}
              <button
                className="text-blue-500 hover:text-blue-700 underline cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}${window.location.pathname}`
                  );
                  alert("Session ID copied to clipboard!");
                }}
              >
                {id}
              </button>
            </h2>
          </div>
          <div className="mb-4">
            <p>
              Welcome, {me}. You are a {role.toLocaleUpperCase()}.
            </p>
            {role === "tpm" && (
              <div className="mt-5">
                <p>Share this URL with your team:</p>
                <input
                  type="text"
                  readOnly
                  className="border p-2 rounded w-full text-center"
                  value={`${window.location.origin}${window.location.pathname}`}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center items-center my-20">
            {role === "tpm" && (
              <CurrentTicketTpm
                currentTicket={currentTicket}
                firebase={firebase}
                id={id!}
              />
            )}
            {role !== "tpm" && (
              <CurrentTicketOther
                role={role}
                me={me}
                id={id!}
                ticketNum={currentTicket}
                firebase={firebase}
                enabled={!revealedVotes}
              />
            )}
            {currentTicket ? (
              tpm && tpm === me ? (
                <ShowVotes dev={devs} qa={qas} currentVotes={currentVotes} />
              ) : (
                <ShowVotes dev={devs} qa={qas} currentVotes={revealedVotes} />
              )
            ) : null}
          </div>
          <PastTickets firebase={firebase} id={id!} />
        </div>
      )}
    </div>
  );
}
