"use client";

import { useEffect, useRef, useState } from "react";
import { CheckSquare, Plus } from "lucide-react";
import { Todo } from "./types/todo";
import TodoItem from "./components/TodoItem";
import Toast from "./components/Toast";

export default function Page() {
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
      trigger("Text is too long!", "error");
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
    trigger("Task added successfully!", "success");
    setPrio("normal");
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
    <div className="flex flex-col items-center h-screen overflow-hidden bg-zinc-50">
      <header className="px-4 w-158 flex justify-between items-center mb-2 mt-6">
        <div className="flex items-center gap-2">
          <div className="p-[4px] bg-black rounded-lg">
            <CheckSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111111]">
            TaskFlow
          </h1>
        </div>
      </header>
      <main className="px-4 flex flex-col w-158">
        <div className="bg-white p-4 shadow-md rounded-xl flex flex-col">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="What needs to be done?"
              className="flex-1 px-4 shadow-sm border rounded-lg border-gray-400 focus:border-gray-500 focus:border-3 focus:shadow-sm focus:outline-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              ref={inputRef}
              onKeyDown={(e) => {
                if (e.key == "Enter") addTask();
              }}
            />
            <button
              className="w-12 h-12 bg-black rounded-lg text-3xl text-white flex items-center justify-center cursor-pointer hover:bg-black/80"
              onClick={() => addTask()}
            >
              <Plus size={30} />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority:
            </span>
            <button
              className={`w-18 text-center text-sm px-3 py-1 rounded-full ml-2 font-semibold transition ${
                prio === "urgent"
                  ? "bg-red-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              onClick={() => setPrio("urgent")}
            >
              Urgent
            </button>
            <button
              className={`w-18 text-center text-sm px-3 py-1 rounded-full font-semibold transition ${
                prio === "normal"
                  ? "bg-gray-800 text-white shadow-lg"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              onClick={() => setPrio("normal")}
            >
              Normal
            </button>
            <button
              className={`w-18 text-center text-sm px-3 py-1 rounded-full font-semibold transition ${
                prio === "later"
                  ? "bg-yellow-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              onClick={() => setPrio("later")}
            >
              Later
            </button>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <span className="flex items-center justify-center text-gray-500 text-sm">
            {arr.filter((item) => !item.status).length} Remaining
          </span>
          <div className="ml-4 h-[2px] flex-1 bg-gray-200"></div>
        </div>
        <div className="flex flex-col gap-2 mt-4 overflow-y-auto mb-32 h-80">
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
          className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4 transition-opacity duration-200"
          onClick={() => setModal(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-lg shadow-lg border border-[#e5e5e5] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[#e5e5e5] flex justify-between items-center">
              <h3 className="font-semibold text-[#111111]">Edit Task</h3>
            </div>

            <div className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-600">
                  Task Name
                </label>
                <input
                  className="bg-white border border-[#e5e5e5] rounded-md px-4 py-2.5 text-[#111111] focus:outline-none focus:border-gray-400 transition-colors"
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                  }}
                  ref={editRef}
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-[#e5e5e5] flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                onClick={() => setModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#111111] hover:bg-gray-800 text-white rounded-md text-sm font-medium transition-colors"
                onClick={saveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
