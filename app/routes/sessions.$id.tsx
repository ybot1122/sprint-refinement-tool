import { useParams } from "@remix-run/react";
import Loader from "components/Loader";
import WelcomeToSession from "components/WelcomeToSession";
import initFirebase from "constants/init_firebase";
import { FirebaseApp } from "firebase/app";
import { get, getDatabase, onValue, ref } from "firebase/database";
import { useCallback, useEffect, useRef, useState } from "react";

export type Role = "dev" | "qa" | "tpm";

export default function SessionPage() {
  const { id } = useParams();
  const [tpm, setTpm] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [devs, setDevs] = useState<string[]>([]);
  const [qas, setQas] = useState<string[]>([]);

  const firebase = useRef<FirebaseApp>();

  useEffect(() => {
    const check = async () => {
      try {
        const snapshot = await get(sessionRef);
        if (!snapshot.exists()) {
          alert("Session not found");
          window.location.href = "/";
        } else {
          console.log(snapshot.val());
          setTpm(snapshot.val().admin);
        }
      } catch (error) {
        alert("Error reading data");
      }
    };

    const { app } = initFirebase(); // Initialize Firebase
    firebase.current = app;
    const database = getDatabase(app); // Get a reference to the database service
    const sessionRef = ref(database, `sessions/${id}`);

    check();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-green-300 p-5 min-h-screen">
      {!tpm && <Loader />}
      {!role && tpm && <WelcomeToSession tpm={tpm} online={devs.concat(qas)} />}
    </div>
  );
}
