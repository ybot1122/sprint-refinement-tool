import React, { useEffect, useRef, useState } from "react";
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
  const [isVisible, setIsVisible] = useState(false);
  const recentlyReadId = useRef<string>();
  const [unreadCount, setUnreadCount] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const database = getDatabase(firebase);
    const emojiRef = ref(database, `sessions/${id}/emoji`);

    onValue(emojiRef, (snapshot) => {
      if (snapshot.exists()) {
        const items: Message[] = [];
        snapshot.forEach((childSnapshot) => {
          items.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });

        let count = 0;
        let startCounting = false;

        if (!recentlyReadId.current) {
          recentlyReadId.current = items[items.length - 1].id;
        }

        for (let i = 0; i < items.length; i++) {
          if (items[i].id === recentlyReadId.current) {
            startCounting = true;
          }

          if (startCounting) {
            count++;
          }
        }

        const firstTenItems = items.slice(-10);

        setM(firstTenItems as Message[]);
        setUnreadCount(count);
      }
    });
  }, [firebase, id]);

  useEffect(() => {
    if (isVisible && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [m, isVisible]);

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
    if (!isVisible) {
      setUnreadCount(0);
    } else {
      recentlyReadId.current = m.length > 0 ? m[m.length - 1].id : undefined;
    }
  };

  return (
    <div className="fixed bottom-0 right-0 m-4">
      <button
        onClick={handleToggleVisibility}
        className="mb-2 p-2 bg-blue-500 text-white rounded"
      >
        {isVisible ? "Hide" : `Show Chat (${unreadCount} unread)`}
      </button>
      {isVisible && (
        <div
          ref={chatContainerRef}
          className="flex flex-col bg-white border rounded shadow-lg p-4 max-h-64 overflow-y-auto"
        >
          {m.map((message) => (
            <div key={message.id} className="mb-2 p-2 border rounded shadow">
              <div className="font-bold">
                {message.from} to {message.to}
              </div>
              <div>{message.emoji}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactLog;
