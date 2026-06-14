import  Express  from "express";
import { chatRequest } from "../../../models/api/createChat";
import { processMessage } from "../services/processMessage";
import { AIMessage } from "../../../models/message";
import { getConversationMessages } from "../services/conversationData";

const router = Express.Router();

router.post("/message", async (req, res) => {
    const request = req.body as chatRequest;
    if (!request.message) {
        return res.status(400).json({ error: "Message is required" });
    }
    
    try {
        const result = await processMessage(request);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ error: "Failed to process message" });
    }

}); 

export default router;