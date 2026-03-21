import { supabase } from '../../supabase.js';

export const registerData = async (req, res) => {
    try {
        // Insert the JSON payload from the frontend directly into Supabase
        const { error } = await supabase.from('registrations').insert([req.body]);
        
        if (error) {
            console.error("Supabase insert error:", error.message);
            return res.status(400).json({ error: error.message });
        }
        
        res.status(200).json({ message: "Registration successful!" });
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
