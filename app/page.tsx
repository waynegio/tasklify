"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { Todo } from "./types/todo";
import TodoItem from "./components/TodoItem";
import Toast from "./components/Toast";

export default function page() {
  const priorityOrder = {
    urgent: 0,
    normal: 1,
    later: 2,
  };

  const [arr, setArr] = useState<Todo[]>([]);
  const [text, setText] = useState<string>("");
  const [editText, setEditText] = useState<string>("");
  const [prio, setPrio] = useState<"normal" | "urgent" | "later">("normal");
  const [show, setShow] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMsg, setToastMsg] = useState("");
  const [modal, setModal] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const editRef = useRef<HTMLInputElement>(null);

  const trigger = (msg: string, type: "success" | "error") => {
    setToastMsg(msg);
    setToastType(type);
    setShow(true);
    setTimeout(() => setShow(false), 2000);
  };

  const addTask = () => {
    if (text.trim() === "") {
      setText("");
      trigger("Task cannot be empty!", "error");
      return;
    } else if (text.length > 25) {
      trigger("Text too long!", "error");
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
    trigger("Task is added!", "success");
    setText("");
  };

  const removeTask = (id: string) => {
    setArr((prev) => prev.filter((item) => item.id != id));
  };

  const doneTask = (id: string) => {
    setArr((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item,
      ),
    );
  };

  const saveEdit = () => {
    if (editText.length > 25) {
      trigger("Text is too long!", "error");
      return;
    } else if (editText.trim() === "") {
      trigger("Task cannot be empty!", "error");
      return;
    }
    setArr((prev) =>
      prev.map((item) =>
        item.id === editId ? { ...item, task: editText } : item,
      ),
    );
    trigger("Task is updated!", "success");
    setEditText("");
    setModal(false);
  };

  const editTask = (id: string) => {
    setModal(true);
    const target = arr.find((prev) => prev.id === id);
    setEditText(target!.task);
    setEditId(id);
  };

  const removeAll = () => {
    setArr([]);
  };

  useEffect(() => {
    inputRef.current?.focus();
    const saved = localStorage.getItem("List");
    if (saved) {
      setArr(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (modal) {
      editRef.current?.focus();
    }
  }, [modal]);

  useEffect(() => {
    localStorage.setItem("List", JSON.stringify(arr));
  }, [arr]);

  return (
    <div className="flex flex-col items-center h-[100vh] bg-zinc-50">
      <main className="pt-8 px-4 flex flex-col sm:w-180 h-full w-full">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Add a new task..."
            className="grow p-4 shadow-sm border rounded-2xl border-gray-400 focus:border-gray-500 focus:shadow-sm focus:outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key == "Enter") addTask();
            }}
          />
          <button
            className="w-15 bg-black rounded-2xl aspect-square text-3xl text-white flex items-center justify-center"
            onClick={() => addTask()}
          >
            <Plus size={30} />
          </button>
          <button
            className="w-15 bg-black rounded-2xl aspect-square text-3xl text-white flex items-center justify-center"
            onClick={() => removeAll()}
          >
            <X size={30} />
          </button>
        </div>
        <div className="mt-4 gap-4 grid grid-cols-3 w-80">
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
        <div className="flex flex-col gap-4 mt-4 overflow-y-auto mb-32">
          {[...arr]
            .sort((a, b) => {
              if (a.status !== b.status) {
                return Number(a.status) - Number(b.status);
              }
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
            .map((item) => (
              <TodoItem
                key={item.id}
                item={item}
                onToggle={doneTask}
                onDelete={removeTask}
                onEdit={editTask}
              />
            ))}
        </div>
      </main>
      <Toast show={show} message={toastMsg} type={toastType} />
      {modal && (
        <div
          className="flex fixed inset-0 bg-black/40 items-center justify-center"
          onClick={() => setModal(false)}
        >
          <div
            className="flex bg-white rounded-2xl p-4 gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              className="border rounded-2xl px-4 py-2"
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
              }}
              ref={editRef}
            />
            <button
              className="bg-black rounded-2xl text-white px-4 py-2"
              onClick={() => saveEdit()}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
