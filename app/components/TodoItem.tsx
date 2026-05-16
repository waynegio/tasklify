import { EllipsisVertical, Pencil, PencilIcon, Trash2 } from "lucide-react";
import { Todo } from "../types/todo";
import { useEffect, useState } from "react";

interface Props {
  item: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function TodoItem({ item, onToggle, onDelete, onEdit }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClick = () => setOpen(false);
    if (open) {
      window.addEventListener("click", handleClick);
    }
    return () => window.removeEventListener("click", handleClick);
  }, [open]);

  return (
    <div
      className={`group flex items-center cursor-pointer border border-gray-300 rounded-xl p-4 sm:px-4 sm:py-[14px] sm:px-4 shadow-md ${item.status ? "line-through text-gray-400 bg-black/5" : ""} hover:border-gray-400 duration-300`}
      onClick={() => onToggle(item.id)}
    >
      <p className="flex-1 text-lg tracking-wider">{item.task}</p>
      <div className="flex gap-2 items-center">
        <p
          className={`flex items-center justify-center px-2 w-18 border rounded-2xl uppercase text-xs font-bold ${item.priority === "later" ? "bg-yellow-200 text-yellow-500 border-yellow-300" : item.priority === "urgent" ? "bg-red-200 text-red-600 border-red-300" : "bg-gray-200 text-gray-600 border-gray-300"}`}
        >
          {item.priority}
        </p>
        <button
          className="flex items-center justify-center h-6 w-6 p-[2px] rounded-lg group-hover:opacity-100 opacity-100 sm:opacity-0 duration-300 text-gray-500 cursor-pointer hover:text-red-500 hover:bg-red-200"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
        >
          <Trash2 />
        </button>
        {/* <button
          className="flex items-center justify-center group-hover:opacity-100 opacity-0 duration-300 h-full aspect-square text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item.id);
          }}
        >
          <PencilIcon />
        </button> */}
      </div>
    </div>
  );
}
