import React, { useEffect, useState } from "react";
import EmojiFloating from "./EmojiFloating";
import { getDatabase, onValue, ref } from "firebase/database";

interface ReactLogProps {
  firebase: any;
  id: string;
}

type Message = {
  id: string;
  from: string;
  to: string;
  emoji: string;
};

const ReactLog: React.FC<ReactLogProps> = ({ firebase, id }) => {
  const [m, setM] = useState<Message[]>([]);
  useEffect(() => {
    const database = getDatabase(firebase);
    const emojiRef = ref(database, `sessions/${id}/emoji`);

    onValue(emojiRef, (snapshot) => {
      if (snapshot.exists()) {
        const items: Message[] = [];
        snapshot.forEach((childSnapshot) => {
          items.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });

        const firstTenItems = items.slice(-10);
        setM(firstTenItems as Message[]);
      } else {
        console.log("No data available");
      }
    });
  }, []);

  return (
    <div className="fixed bottom-[150px] right-[150px] flex flex-col">
      {m.map((message) => (
        <EmojiFloating key={message.id} emoji={message.emoji} />
      ))}
    </div>
  );
};

export default ReactLog;
