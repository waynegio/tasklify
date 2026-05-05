type Props = {
  show: boolean;
  message: string;
  type: "success" | "error";
};

export default function Toast({ show, message, type }: Props) {
  if (!show) return null;
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
}
