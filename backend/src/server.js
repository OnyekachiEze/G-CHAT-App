import express from "express";
import dotenv from "dotenv";

// import "dotenv/config" 

import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import cookiesParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true  //allow frontend to send cookies
    }
));

app.use(express.json());
app.use(cookiesParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} `); 
    connectDB();
});  