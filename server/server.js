import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./supabase.js";
import registerRouter from "./src/routes/registerTeam.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Root route for health check
app.get("/", (req, res) => {
    res.send("Treasure Hunt Server is Running! 🚀");
});

// Attach the teams router to the /registerTeam path
app.use("/registerTeam", registerRouter);

// Use process.env.PORT (standard for Render/Heroku) or your custom URI
const PORT = process.env.PORT || process.env.BACKEND_URI || 8001;

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});