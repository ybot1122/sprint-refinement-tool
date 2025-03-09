import { User } from "~/routes/sessions.$id";

export default function ShowVotesNonTpm({
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
        <div className="flex flex-col items-center space-y-2">
          {dev.map((user) => (
            <div
              key={user.name}
              className={`border-2 ${
                user.hasVoted ? "border-green-500" : "border-gray-300"
              } rounded px-2 py-1 w-3/4`}
            >
              <p className="text-xl my-2">{user.name}</p>
              <p className="text-2xl font-bold">
                {currentVotes ? currentVotes[user.name] || "" : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/2 text-center">
        <h3 className="text-xl my-2">QA Votes</h3>
        <div className="flex flex-col items-center space-y-2">
          {qa.map((user) => (
            <p
              key={user.name}
              className={`border-2 ${
                user.hasVoted ? "border-green-500" : "border-gray-300"
              } rounded px-2 py-1 w-3/4`}
            >
              <p className="text-xl my-2">{user.name}</p>
              <p className="text-2xl font-bold">
                {currentVotes ? currentVotes[user.name] || "" : ""}
              </p>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
