import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
    const { email, password, fullName } = req.body;

    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "Please provide all fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists, Please use a different email" });
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

        const newUser = await User.create({ email, fullName, password, profilePic: randomAvatar, });

        // TODO: CREATE THE USER IN STREAM AS WELL
        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "", // TODO: ADD DEFAULT IMAGE
            });
            console.log(`Stream user create for ${newUser.fullName}`)

        } catch (error) {
            console.log("error creating stream user", error)
        }


        const token = jwt.sign({ userid: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent xxs 
            sameSites: "strict",
            secure: process.env.NODE_ENV === "production",
        });
        res.status(201).json({ success: true, user: newUser });
    }
    catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invaled email and passwod" });
        const isPasswordValid = await user.matchPassword(password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invaled email and passwod" });


        const token = jwt.sign({ userid: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent xxs 
            sameSites: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({ sucess: true, user });


    } catch (error) {
        console.log("error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }


}


export function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "Logout successful" });
}


export async function onboard(req, res) {
    try {
        const userId = req.user._id;

        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;
        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean),
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,

        }, { new: true })

        if (!updatedUser) return res.status(400).json({ message: "User not found" });


        try {
            await upsertStreamUser ({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
            })  
            console.log(`Stream User  updated after onboarding for ${updatedUser.fullName}`);
        } catch (streamError) {
            console.log("Error updating Stream User during onboarding", streamError.message);
        }


        

        res.status(200).json({ success: true, user: updatedUser });

    } catch (error) {
        console.error("Onboarding error", error);
        res.status(500).json({ message: "Internal server error" });

    }
}

