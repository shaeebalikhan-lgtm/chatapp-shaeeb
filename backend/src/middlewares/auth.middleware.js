import User from "../models/user.model.js";
import { verifyToken } from "../utils/util.js";

export const protectRoute = async(req,res ,next) =>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized access-No token provided"});
        }

        const decoded = verifyToken(token)
        console.log("decoded:",decoded);

        if(!decoded){
            return res.status(401).json({message:"Unauthorized access-Invalid token"});
        }

        const user = await User.findById(decoded.userId).select('-password') // return that user without password

        if(!user){
            return res.status(401).json({message:"Unauthorized access-user not found"});
        }

        req.user = user

        next();

    }
    catch(error){
        console.log("Error in protectroute middleware:",error.message);
        return res.status(500).json({message:"Internal server error"});
    }
    

}