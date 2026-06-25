import Express from "express";
import { getAllConversations, getConversationMessages } from "../services/conversationData";
import { conversation } from "../models/conversation";
const conversationRouter = Express.Router();

conversationRouter.get("/conversations", async (req, res) => {
    try {
        const response: conversation[] = getAllConversations(); 
        res.json({ conversations: response });
    }   
    catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).json({ error: "Failed to fetch conversation" });
    }
});

conversationRouter.get("/conversation/:conversationId", async (req, res) => {
    const conversationId = req.params.conversationId;
    try {
        const response = getConversationMessages(conversationId);
        if (!response) {
            res.status(404).json({ error: "Conversation not found" });
            return;
        }
        res.json({ messages: response });
    } catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).json({ error: "Failed to fetch conversation" });
    }
});

export default conversationRouter;