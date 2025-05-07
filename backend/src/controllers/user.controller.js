import FriendRequest from "../models/FriendRequest.js";

import User from "../models/User.js";
export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.User

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, //exclude current user
                { $id: { $nin: currentUser.friends } }, //exclude friends
                { isOnboarded: true }, //exclude users that are not onboarded
            ]
        })
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error in getRecommendedUsers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
            .select("friends")
            .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);

    } catch (error) {
        console.error("Error in getMyFriends controller", error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const { id: recipientId } = req.params
        //prevent sending request to your self
        if (myId === recipientId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself" });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }
        // check if user is already friends
        if (recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user" });
        }

        // check if friend request already exists
        const existingUser = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ],
        });
        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already exists between you and this user" });
        }

        const FriendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        });

        res.status(201).json({ FriendRequest });

    } catch (error) {
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal server error" });

    }

}

export async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;

        const FriendRequest = await FriendRequest.findById(requestId);

        if (!FriendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }
        if (FriendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request" });
        }

        FriendRequest.status = "accepted";
        await FriendRequest.save();

        //add each user to the others friends array

        await User.findByIdAndUpdate(FriendRequest.sender, {
            $addToSet: { friends: FriendRequest.recipient },
        });

        await User.findByIdAndUpdate(FriendRequest.recipient, {
            $addToSet: { friends: FriendRequest.sender },
        });
        res.status(200).json({ message: "Friend request accepted" });

    } catch (error) {
        console.log("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal server error" });

    }

}

export async function getFriendsRequests (req, res) {
    try {
        const incomingReqs = await FriendRequest.find({ 
            recipient: req.user.id, 
            status: "pending" 
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");
        
        const acceptedReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("recipient", "fullName profilePic");
        res.status(200).json({ incomingReqs, acceptedReqs });

    } catch (error) {
        console.log("Error in getPendingFriendsRequests controller", error.message);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export async function getOutgoingFriendReqs (req, res) {
    try {
        const outgoingReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "pending", 
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json({ outgoingReqs });
    } catch (error) {
        console.log("Error in getOutgoingFriendRequests controller", error.message);
        res.status(500).json({ message: "Internal server error" });

        
    }
}