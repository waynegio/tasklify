import { Pencil, PencilIcon, Trash2 } from "lucide-react";
import { Todo } from "../types/todo";

interface Props {
  item: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function TodoItem({ item, onToggle, onDelete, onEdit }: Props) {
  return (
    <div
      className={`group flex items-center cursor-pointer border-2 border-gray-300 rounded-2xl p-2 sm:px-4 sm:py-5 shadow-md ${item.status ? "line-through text-gray-400" : ""}`}
      onClick={() => onToggle(item.id)}
    >
      <p className="flex-1 text-lg tracking-wider">{item.task}</p>
      <div className="flex gap-2">
        <p
          className={`flex items-center justify-center w-17 rounded-2xl ${item.priority === "later" ? "bg-yellow-400" : item.priority === "urgent" ? "bg-red-400" : "bg-green-400"}`}
        >
          {item.priority}
        </p>
        <button
          className="flex items-center justify-center group-hover:opacity-100 opacity-0 duration-300 h-full aspect-square text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
        >
          <Trash2 />
        </button>
        <button
          className="flex items-center justify-center group-hover:opacity-100 opacity-0 duration-300 h-full aspect-square text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item.id);
          }}
        >
          <PencilIcon />
        </button>
      </div>
    </div>
  );
}
