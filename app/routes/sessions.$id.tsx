import { useParams, useSearchParams } from "@remix-run/react";
import Loader from "components/Loader";
import WelcomeToSession from "components/WelcomeToSession";
import initFirebase from "constants/init_firebase";
import { FirebaseApp } from "firebase/app";
import { get, getDatabase, onValue, push, ref } from "firebase/database";
import { useCallback, useEffect, useRef, useState } from "react";

export type Role = "dev" | "qa" | "tpm";

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
    firebase.current = app;
    const database = getDatabase(app); // Get a reference to the database service
    const sessionRef = ref(database, `sessions/${id}`);

    check().then(() => {
      onValue(ref(database, `sessions/${id}/dev`), (snapshot) => {
        setDevs(Object.values(snapshot.val() || {}));
      });

      onValue(ref(database, `sessions/${id}/qa`), (snapshot) => {
        setQas(Object.values(snapshot.val() || {}));
      });

      onValue(ref(database, `sessions/${id}`), (snapshot) => {
        const data = snapshot.val();
        if (data) {
          console.log(data);
        }
      });
    });
  }, []);

  const addUser = useCallback((user: string, role: Role) => {
    const db = getDatabase(firebase.current); // Get a reference to the database service
    const newUserRef = ref(db, `sessions/${id}/${role}`);
    push(newUserRef, user).then(() => {
      setMe(user);
      setRole(role);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-green-300 p-5 min-h-screen">
      {role === "tpm" && tpm !== me && (
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          Sorry, we only support 1 TPM per session. The TPM must be: {tpm}
        </div>
      )}
      {!tpm && <Loader />}
      {!role && tpm && (
        <WelcomeToSession
          tpm={tpm}
          online={devs.concat(qas)}
          addUser={addUser}
        />
      )}
      {role && me && (
        <div className="w-full max-w-4xl bg-white p-8 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-4">Sprint Refinement</h1>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <p>
              Welcome, {me}. You are a {role.toLocaleUpperCase()}.
            </p>
            <p>Devs: {devs.join(", ")}</p>
            <p>QA: {qas.join(", ")}</p>
          </div>
          <div className="flex flex-col justify-center items-center my-5">
            <h2 className="text-2xl">
              Current Ticket: <strong>WEB-1234</strong>
            </h2>
            <div>
              <h3 className="text-xl font-semibold mt-5 mb-2">
                Submit your vote
              </h3>
              <div className="flex space-x-2">
                {[1, 2, 3, 5, 8, 13, 21].map((num) => (
                  <button
                    key={num}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                    onClick={() => console.log(`Voted: ${num}`)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">Past tickets</div>
        </div>
      )}
    </div>
  );
}
