
import express, { Request, Response } from "express";
import messageRouter from "./routes/message";
import conversationRouter from "./routes/conversation";
import "dotenv/config";
const cors = require("cors");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("ok");
});

app.use("/api", messageRouter);
app.use("/api", conversationRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});