import { useParams } from "@remix-run/react";

export default function SessionPage() {
  const { id } = useParams();
  return <h1>Product ID: {id}</h1>;
}
