import { AlertCircle, CheckSquare } from "lucide-react";

type Props = {
  show: boolean;
  message: string;
  type: "success" | "error";
};

export default function Toast({ show, message, type }: Props) {
  if (!show) return null;
  return (
    <div
      className={`flex items-center gap-2 fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white ${
        type === "success" ? "bg-black" : "bg-red-500"
      }`}
    >
      {type === "success" ? (
        <CheckSquare className="w-4 h-4" />
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}
      {message}
    </div>
  );
}
