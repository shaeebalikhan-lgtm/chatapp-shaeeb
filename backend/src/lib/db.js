import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI
//console.log(MONGO_URI)
export const connectDB = async ()=>{
  try{
    if(!MONGO_URI){
        console.log("MONGO_URI not present");
        return
    }

    if(mongoose.connection.readyState >=1){
        return
    }

    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected:${conn.connection.host}`)
  }
  catch(error){
  console.error('Mongodb connection failed',error);
  }
}