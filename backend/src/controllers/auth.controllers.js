import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/util.js";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {

    const { email, fullName, password } = req.body;

    try {
        if (!email || !fullName || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be atleast 6 character long"
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            email,
            fullName,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "User Registered sucessfully",
            user: { id: newUser._id, email }
        });


    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }

}


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: " Invalid username and password"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid username and password"
            })
        }


        const token = generateToken(user._id, res)

        console.log(token)

        return res.status(201).json({
            success: true,
            message: "Login successfull",
            data: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                profilePic: user.profilePic
            },
            token
        });

    }
    catch (error) {
        console.log("Error login controller:", error.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }

}
export const logout = async (req, res) => {
    try {
        // Match the options used when res.cookie() was created
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.log("Error logout controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
        });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body
        const userId = req.user._id

        if (!profilePic) {
            return res.status(200).json({
                message: "Profile picture is required"
            });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateUser = await User.findByIdAndUpdate(
            userId,
            {
                profilePic: uploadResponse.secure_url
            },
            { new: true }
        )

        return res.status(200).json(updateUser)


    }
    catch (error) {
        console.log("Error in updateProfile controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
        });
    }
}


export const checkAuth = async (req,res)=>{
    try{
        return res.status(200).json(req.user)
    }
    catch (error) {
        console.log("Error in updateProfile controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
        });
    }
}