import  Express  from "express";
import { chatRequest } from "../models/api/create-chat";

const router = Express.Router();

router.post("/message", (req, res) => {
    const request = req.body as chatRequest;
    if (!request.message) {
        return res.status(400).json({ error: "Message is required" });
    }
    
    res.json({ message: "Message received" });
});