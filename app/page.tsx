"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem("count");
    if (saved != null) {
      setCount(Number(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("count", String(count));
  }, [count]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <p
        className={`text-5xl ${count == 0 ? "text-gray-400" : "text-green-400"}`}
      >
        {count}
      </p>
      <p>{count == 0 ? "Netral" : "Positive"}</p>
      <div className="grid grid-cols-3 gap-2 mt-4">
        <button
          className="p-2 rounded-2xl bg-green-500 flex justify-center cursor-pointer"
          onClick={() => {
            setCount((prev) => prev + 1);
          }}
        >
          Increment
        </button>
        <button
          className="p-2 rounded-2xl bg-red-500 flex justify-center cursor-pointer"
          onClick={() => setCount(count - 1)}
          disabled={count == 0}
        >
          Decrement
        </button>
        <button
          className="p-2 rounded-2xl bg-red-800 flex justify-center cursor-pointer"
          onClick={() => setCount(0)}
        >
          RESET
        </button>
      </div>
    </div>
  );
}
