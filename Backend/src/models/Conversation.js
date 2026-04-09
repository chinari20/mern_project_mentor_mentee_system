import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    menteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: { type: String, default: "" },
    lastMessageAt: { type: Date, default: null },
  },
  { timestamps: true },
);

conversationSchema.index({ mentorId: 1, menteeId: 1 }, { unique: true });
conversationSchema.index({ members: 1 });
conversationSchema.index({ lastMessageAt: -1, updatedAt: -1 });

export default mongoose.model("Conversation", conversationSchema);
