"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [arr, setArr] = useState<string[]>([]);
  const [text, setText] = useState<string>("");

  const addTask = () => {
    if (text.trim() == "") {
      setText("");
      return;
    } else if (text.length > 25) {
      setText("");
      return;
    }
    setArr((prev) => [...prev, text]);
    setText("");
  };

  const removeTask = (index: number) => {
    setArr((prev) => prev.filter((_, i) => i != index));
  };

  useEffect(() => {
    const saved = localStorage.getItem("List");
    if (saved) {
      setArr(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("List", JSON.stringify(arr));
  }, [arr]);

  return (
    <div className="flex flex-col items-center h-screen">
      <main className="mt-8">
        <div className="flex gap-4">
          <input
            type="text"
            className="w-80 border p-2 rounded-2xl border-gray-400 focus:border-gray-500 focus:shadow-md focus:border-4 focus:outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") addTask();
            }}
          />
          <button
            className="w-15 bg-black rounded-2xl aspect-square text-3xl text-white"
            onClick={() => addTask()}
          >
            +
          </button>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          {arr.map((task, index) => (
            <div
              key={index}
              className="flex cursor-pointer border-2 border-gray-300 rounded-2xl p-4"
              onClick={() => removeTask(index)}
            >
              <p>{task}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
