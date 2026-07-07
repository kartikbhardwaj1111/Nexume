import { useEffect, useState } from 'react';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?-=[]\\;',./";

export default function DecryptedText({
  text = "",
  className = "",
  speed = 40,
  delay = 0,
  maxIterations = 5
}) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let timeoutId;
    let intervalId;

    const startDecryption = () => {
      let iteration = 0;
      const targetText = text;
      
      intervalId = setInterval(() => {
        setDisplayText(
          targetText
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iteration) {
                return targetText[index];
              }
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );

        if (iteration >= targetText.length) {
          clearInterval(intervalId);
        }

        iteration += 1 / maxIterations;
      }, speed);
    };

    timeoutId = setTimeout(startDecryption, delay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, speed, delay, maxIterations]);

  return <span className={className}>{displayText}</span>;
}
