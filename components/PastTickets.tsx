import { FirebaseApp } from "firebase/app";
import React from "react";

<div className="grid grid-cols-3 gap-4">Past tickets</div>;
interface PastTicketsProps {
  firebase: FirebaseApp;
  id: string;
}

const PastTickets: React.FC<PastTicketsProps> = ({ firebase, id }) => {
  return <div className="grid grid-cols-3 gap-4">Past tickets</div>;
};

export default PastTickets;
