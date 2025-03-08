import { useParams } from "@remix-run/react";
import WelcomeToSession from "components/WelcomeToSession";
import { useState } from "react";

export type Role = "dev" | "qa" | "tpm";

export default function SessionPage() {
  const { id } = useParams();
  const [role, setRole] = useState<Role | null>(null);
  return (
    <div className="flex flex-col items-center justify-center bg-green-300 p-5 min-h-screen">
      <WelcomeToSession />
    </div>
  );
}
