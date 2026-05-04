export type Priority = "normal" | "urgent" | "later";

export interface Todo {
  id: string;
  task: string;
  status: boolean;
  priority: Priority;
}
