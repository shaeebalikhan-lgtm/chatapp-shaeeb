import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";


import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
});


export const getUsersForSidebar = async (req,res)=>{

   try{
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
    return res.status(200).json(filteredUsers);
   }
   catch(error){
    console.error("Error in getUsersForSidebar:",error.message);
    return res.status(500).json({error:"Internal Server Error"});
   }

};


export const getMessages = async (req,res)=>{
    try{
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const message = await Message.find({
            $or:[
                {senderId:myId , receiverId:userToChatId},
                {senderId:userToChatId , receiverId:myId}
            ]
        })

        return res.status(200).json(message)
    }
    catch(error){
    console.error("Error in getMessages:",error.message);
    return res.status(500).json({error:"Internal Server Error"});
   }

};

// export const sendMessages = async(req,res)=>{
//     try{
//         const {text,image} = req.body;
//         const{id:receiverId} = req.params;
//         const senderId = req.user._id;

//         let imageUrl;

//         if(image){
//             const uploadResponse = await cloudinary.uploader.upload(image);
           
//             imageUrl = uploadResponse.secure_url;
//         }

//         const newMessage = await Message.create({
//             senderId,
//             receiverId,
//             text,
//             image:imageUrl
//         });

//         // TODO: IMPLEMENT SOCKET IO TO SEND MESSAGE TO RECEIVER FOR REALTIME CHAT

//         return res.status(200).json(newMessage);
//     }
//     catch(error){
//         console.error("Error in sendMessages:",error.message);
//        return res.status(500).json({error:"Internal Server Error"});
//     }
// };

export const sendMessages = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = null;

    if (req.file) {
      const uploadResponse =
        await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
        );

      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
    });

    // TODO: Socket.io realtime message

    return res.status(200).json(newMessage);
  } catch (error) {
    console.error(
      "Error in sendMessages:",
      error.message
    );

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};