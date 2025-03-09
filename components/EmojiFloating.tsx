import React, { useState, useEffect } from "react";

const EmojiFloating = ({ emoji }: { emoji: string }) => {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    // Trigger the floating effect after the component mounts
    setIsFloating(true);
  }, []);

  return (
    <div className="relative w-[25px] h-[25px]">
      <div
        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 text-6xl transition-all duration-5000 ease-out ${
          isFloating
            ? "translate-y-[-200%] opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        {emoji}
      </div>
    </div>
  );
};

export default EmojiFloating;
