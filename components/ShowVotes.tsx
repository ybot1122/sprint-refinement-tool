import { User } from "~/routes/sessions.$id";
import UserList from "./UserList";
import { FirebaseApp } from "firebase/app";

export default function ShowVotes({
  dev,
  qa,
  currentVotes,
  firebase,
  me,
  id,
}: {
  dev: User[];
  qa: User[];
  currentVotes: Record<string, number> | null;
  firebase: FirebaseApp;
  me: string;
  id: string;
}) {
  return (
    <div className="flex w-full justify-around mt-20">
      <div className="w-1/2 text-center">
        <h3 className="text-xl my-2">DEV Votes</h3>
        <UserList
          users={dev}
          currentVotes={currentVotes}
          firebase={firebase}
          me={me}
          id={id}
        />
      </div>
      <div className="w-1/2 text-center">
        <h3 className="text-xl my-2">QA Votes</h3>
        <UserList
          users={qa}
          currentVotes={currentVotes}
          firebase={firebase}
          me={me}
          id={id}
        />
      </div>
    </div>
  );
}
