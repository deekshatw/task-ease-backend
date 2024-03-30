import mongoose, { Document, Schema } from "mongoose";

export interface Task {
  title: string;
  description?: string;
  status: "todo" | "inProgress" | "done";
  userId: mongoose.Types.ObjectId;
}

export interface TaskModel extends Task, Document {}

const TaskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    status: {
      type: String,
      enum: ["todo", "inProgress", "done"],
      required: false,
    },
    userId: { type: mongoose.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<TaskModel>("Tasks", TaskSchema);
