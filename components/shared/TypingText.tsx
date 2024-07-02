"use client"

import useTypingAnimation from "../hooks/useTypingAnimation";

const TypingText = ({ text, speed } : {text: string, speed: number}) => {
  const displayedText = useTypingAnimation(text, speed);

  return (
    <h1 className="text-lg lg:text-2xl xl:text-3xl font-bold">
        {displayedText}
    </h1>
  )
};

export default TypingText;
