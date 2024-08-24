import Conversation from "../models/conversation.model.js"; 
import Message from "../models/message.model.js";
import { getReceiverSocketId,io } from "../socket/socket.js";

export const sendMessage = async (req,res) => {
  try {
    const { message } = req.body;
    const { id:receiverId } = req.params;
    const senderId = req.user._id;

    let converstaion = await Conversation.findOne({
      participants: { $all : [senderId, receiverId] },
    })

    if(!converstaion){
      converstaion = await Conversation.create({
        participants: [senderId, receiverId],
      })
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if(newMessage){
      converstaion.messages.push(newMessage._id);
    }

    
    // await converstaion.save();
    // await newMessage.save();

    //to make it optimize
    await Promise.all([converstaion.save(), newMessage.save()]);
    // this makes both the processes run parallel

    // SOCKET IO Functionality 
    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);

  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({error: "Internal Server Error"});
  }
};

export const getMessages = async (req,res) => {
  try {
    const { id:userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: {$all: [senderId, userToChatId]},
    }).populate("messages"); // this populates the message field with actual messages(built in for mongoose)

    if(!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({error: "Internal Server Error"});
  }
};