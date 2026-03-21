import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./supabase.js";
import registerRouter from "./src/routes/registerTeam.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Attach the teams router to the /registerTeam path
app.use("/registerTeam", registerRouter);

const PORT = process.env.BACKEND_URI || 8001;

app.listen(PORT, ()=>{
    console.log(`Server is running on the port : ${PORT}`);
});