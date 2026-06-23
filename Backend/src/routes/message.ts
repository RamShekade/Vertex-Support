import  Express  from "express";
import { chatRequest, chatResponse } from "../../../models/api/createChat";
import { processMessage } from "../services/processMessage";
import { AppError } from "../../../models/Errors";

const router = Express.Router();

router.post("/message", async (req, res) => {
    console.log("Received request body:", req.body);
    const request = req.body as chatRequest;
    console.log("Parsed request:", request);
    
    try {
        const result: chatResponse = await processMessage(request);
        return res.json(result);
    } catch (error) {
        throw error as AppError;
    }

}); 

export default router;