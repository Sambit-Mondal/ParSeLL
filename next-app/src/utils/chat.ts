import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: String, required: true },
  sender: { type: Boolean, required: true },
  room: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatSchema = new mongoose.Schema({
    buyerID: { type: String, required: true },
    sellerID: { type: String, required: true },
    messages: [MessageSchema], // Embed messages as an array
});

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);