import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import MentorshipRequest from "../models/MentorshipRequest.js";

const getPairMessageFilter = (mentorId, menteeId) => ({
  $or: [
    { senderId: mentorId, receiverId: menteeId },
    { senderId: menteeId, receiverId: mentorId },
  ],
});

export const getAcceptedRequestBetweenUsers = async (firstUserId, secondUserId) =>
  MentorshipRequest.findOne({
    status: "accepted",
    $or: [
      { mentorId: firstUserId, menteeId: secondUserId },
      { mentorId: secondUserId, menteeId: firstUserId },
    ],
  });

export const hydrateConversationMetadata = async (conversation) => {
  const pairMessageFilter = getPairMessageFilter(conversation.mentorId, conversation.menteeId);

  await Message.updateMany(
    {
      $and: [
        pairMessageFilter,
        {
          $or: [{ conversationId: { $exists: false } }, { conversationId: null }],
        },
      ],
    },
    { $set: { conversationId: conversation._id } },
  );

  const latestMessage = await Message.findOne({ conversationId: conversation._id }).sort({
    createdAt: -1,
  });

  if (
    latestMessage &&
    (conversation.lastMessage !== latestMessage.text ||
      !conversation.lastMessageAt ||
      conversation.lastMessageAt.getTime() !== latestMessage.createdAt.getTime())
  ) {
    conversation.lastMessage = latestMessage.text;
    conversation.lastMessageAt = latestMessage.createdAt;
    await conversation.save();
  }

  return conversation;
};

export const ensureConversationForRequest = async (request) => {
  const conversation = await Conversation.findOneAndUpdate(
    {
      mentorId: request.mentorId,
      menteeId: request.menteeId,
    },
    {
      $setOnInsert: {
        mentorId: request.mentorId,
        menteeId: request.menteeId,
        members: [request.mentorId, request.menteeId],
      },
    },
    {
      new: true,
      upsert: true,
    },
  );

  return hydrateConversationMetadata(conversation);
};

export const ensureConversationBetweenUsers = async (firstUserId, secondUserId) => {
  const request = await getAcceptedRequestBetweenUsers(firstUserId, secondUserId);
  if (!request) return null;

  return ensureConversationForRequest(request);
};

export const syncAcceptedConversationsForUser = async (userId) => {
  const requests = await MentorshipRequest.find({
    status: "accepted",
    $or: [{ mentorId: userId }, { menteeId: userId }],
  });

  await Promise.all(requests.map((request) => ensureConversationForRequest(request)));
};
