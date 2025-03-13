import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserList from "./UserList";
import { FirebaseApp } from "firebase/app";
import { User } from "~/routes/sessions.$id";

const mockFirebase: FirebaseApp = {} as FirebaseApp;

const mockUsers: User[] = [
  { name: "Alice", hasVoted: true },
  { name: "Bob", hasVoted: false },
];

const mockCurrentVotes = {
  Alice: 5,
  Bob: 0,
};

describe("UserList", () => {
  it("renders without crashing", () => {
    render(
      <UserList
        users={mockUsers}
        currentVotes={mockCurrentVotes}
        firebase={mockFirebase}
        me="testUser"
        id="testSession"
      />
    );
  });

  it("displays user names and votes correctly", () => {
    render(
      <UserList
        users={mockUsers}
        currentVotes={mockCurrentVotes}
        firebase={mockFirebase}
        me="testUser"
        id="testSession"
      />
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("null")).not.toBeInTheDocument();
  });

  it("applies correct styles based on voting status", () => {
    render(
      <UserList
        users={mockUsers}
        currentVotes={mockCurrentVotes}
        firebase={mockFirebase}
        me="testUser"
        id="testSession"
      />
    );

    const aliceElement = screen.getByText("Alice").closest("div");
    const bobElement = screen.getByText("Bob").closest("div");

    expect(aliceElement).toHaveClass("bg-green-100");
    expect(bobElement).not.toHaveClass("bg-green-100");
  });
});
