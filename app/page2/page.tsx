"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [arr, setArr] = useState<string[]>([]);
  const [text, setText] = useState<string>("");

  const addTask = () => {
    if (text.trim() == "") {
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
            className="border"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") addTask();
            }}
          />
          <button className="bg-green-200" onClick={() => addTask()}>
            Add
          </button>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          {arr.map((task, index) => (
            <div
              key={index}
              className="flex justify-between cursor-pointer border rounded-md"
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
