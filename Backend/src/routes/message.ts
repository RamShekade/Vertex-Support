import  Express  from "express";
import { chatRequest, chatResponse } from "../../../models/api/createChat";
import { processMessage } from "../services/processMessage";
import { AppError } from "../../../models/Errors";

const router = Express.Router();

router.post("/message", async (req, res) => {
    const request = req.body as chatRequest;

    try {
        const result: chatResponse = await processMessage(request);
        return res.json(result);
    } catch (error) {
    const appError = error as AppError;

    return res.status(500).json({
        code: appError.code,
        message: appError.message
    });
    }
}); 

export default router;