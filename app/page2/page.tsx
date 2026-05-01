"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";

export default function Home() {
  type Priority = "normal" | "urgent" | "later";

  const priorityOrder = {
    urgent: 0,
    normal: 1,
    later: 2,
  };

  interface todo {
    id: string;
    task: string;
    status: boolean;
    priority: Priority;
  }

  const [arr, setArr] = useState<todo[]>([]);
  const [text, setText] = useState<string>("");
  const [prio, setPrio] = useState<"normal" | "urgent" | "later">("normal");
  const [show, setShow] = useState<boolean>(false);

  const addTask = () => {
    if (text.trim() == "") {
      setText("");
      return;
    } else if (text.length > 25) {
      setText("");
      return;
    }
    setArr((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        task: text,
        status: false,
        priority: prio,
      },
    ]);
    setText("");
    trigger();
  };

  // const removeTask = (index: number) => {
  //   setArr((prev) => prev.filter((_, i) => i != index));
  // };

  // const doneTask = (index: number) => {
  //   const copy = [...arr];
  //   copy[index].status = !copy[index].status;
  //   setArr(copy);
  // };

  const doneTask = (id: string) => {
    setArr((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item,
      ),
    );
  };

  const removeAll = () => {
    setArr([]);
  };

  const trigger = () => {
    setShow(true);
    setTimeout(() => setShow(false), 2000);
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

  useEffect(() => {
    console.log(prio);
  }, [prio]);

  return (
    <div className="flex flex-col items-center h-[100vh] bg-zinc-50">
      <main className="pt-8 px-4 flex flex-col sm:w-180 h-full">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Add a new task..."
            className="w-full p-4 shadow-sm border rounded-2xl border-gray-400 focus:border-gray-500 focus:shadow-sm focus:outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") addTask();
            }}
          />
          <button
            className="w-12 sm:w-15 bg-black rounded-2xl aspect-square text-3xl text-white flex items-center justify-center"
            onClick={() => addTask()}
          >
            <Plus size={30} />
          </button>
          <button
            className="w-12 sm:w-15 bg-black rounded-2xl aspect-square text-3xl text-white flex items-center justify-center"
            onClick={() => removeAll()}
          >
            <X size={30} />
          </button>
        </div>
        <div className="flex mt-4 gap-4 grid grid-cols-3 w-80">
          <button
            className={`tracking-wider text-lg py-1 px-4 rounded-3xl text-center duration-300 ${prio === "urgent" ? "bg-red-400" : "bg-zinc-200 hover:bg-zinc-300"}`}
            onClick={() => setPrio("urgent")}
          >
            Urgent
          </button>
          <button
            className={`tracking-wider text-lg py-1 px-4 rounded-3xl text-center duration-300 ${prio === "normal" ? "bg-green-400" : "bg-zinc-200 hover:bg-zinc-300"}`}
            onClick={() => setPrio("normal")}
          >
            Normal
          </button>
          <button
            className={`tracking-wider text-lg py-1 px-4 rounded-3xl text-center duration-300 ${prio === "later" ? "bg-yellow-400" : "bg-zinc-200 hover:bg-zinc-300"}`}
            onClick={() => setPrio("later")}
          >
            Later
          </button>
        </div>
        <p className="mt-2">
          {arr.filter((item) => !item.status).length} of {arr.length}
        </p>
        <div className="flex flex-col gap-4 mt-4 flex overflow-y-auto mb-32">
          {[...arr]
            .sort((a, b) => {
              if (a.status !== b.status) {
                return Number(a.status) - Number(b.status);
              }
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
            .map((item) => (
              <div
                key={item.id}
                className={`flex cursor-pointer border-2 border-gray-300 rounded-2xl p-2 sm:p-4 shadow-md ${item.status ? "line-through text-gray-400" : ""}`}
                onClick={() => doneTask(item.id)}
              >
                <p className="flex-1">{item.task}</p>
                <p
                  className={`w-17 text-center rounded-2xl ${item.priority === "later" ? "bg-yellow-400" : item.priority === "urgent" ? "bg-red-400" : "bg-green-400"}`}
                >
                  {item.priority}
                </p>
              </div>
            ))}
        </div>
      </main>
      {show && (
        <div className="fixed bottom-6 left-[50%] -translate-x-[50%] bg-black text-white py-3 px-6 rounded-xl shadow-lg">
          Task added successfully!
        </div>
      )}
    </div>
  );
}
