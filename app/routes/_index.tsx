import type { MetaFunction } from "@vercel/remix";

export const meta: MetaFunction = () => {
  return [
    { title: "Sprint Refinement Tool" },
    { name: "description", content: "Welcome to Sprint Refinement" },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-5">
      <h1 className="text-4xl mb-5">Welcome to Remix!</h1>
      <div className="flex gap-4">
        <button
          className="px-5 py-2 text-lg rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          onClick={() => alert("Join an existing session")}
        >
          Join Existing Session
        </button>
        <button
          className="px-5 py-2 text-lg rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          onClick={() => alert("Start a new session")}
        >
          Start New Session
        </button>
      </div>
    </div>
  );
}
