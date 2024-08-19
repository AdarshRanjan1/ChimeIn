import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: [],
  }],
}, {timestaps: true});

const Converstaion = mongoose.model("Converstaion", conversationSchema);

export default Converstaion;