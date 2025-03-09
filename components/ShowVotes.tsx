import { User } from "~/routes/sessions.$id";
import UserList from "./UserList";

export default function ShowVotes({
  dev,
  qa,
  currentVotes,
}: {
  dev: User[];
  qa: User[];
  currentVotes: Record<string, number> | null;
}) {
  return (
    <div className="flex w-full justify-around mt-20">
      <div className="w-1/2 text-center">
        <h3 className="text-xl my-2">DEV Votes</h3>
        <UserList users={dev} currentVotes={currentVotes} />
      </div>
      <div className="w-1/2 text-center">
        <h3 className="text-xl my-2">QA Votes</h3>
        <UserList users={qa} currentVotes={currentVotes} />
      </div>
    </div>
  );
}
