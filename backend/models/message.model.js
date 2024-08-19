import mongoose from "mongoose";
// import User from "./user.model";

const messageSchema = new mongoose.Schema({
  senderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    requireed: true 
  },
  receiverId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    requireed: true 
  },
  message:{
    type: String,
    required:true
  }
  // createdAt, updatedAt
},{timestamps: true});

const Message = mongoose.model("Message", messageSchema);

export default Message;