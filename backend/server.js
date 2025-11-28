import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fileUpload from "express-fileupload";
import cron from "node-cron";

import chunkingRoute from "./routes/chunkingRoute.js";
import retrievalRoute from "./routes/retrievalRoute.js";
import { cleanTempDirectory } from "./middleware/cleanTempDirectory.js";

// load env vars
dotenv.config();

// app config
const app = express();
const port = process.env.PORT || 8000;
const __dirname = path.resolve();

// middlewares
app.use(cors());
app.use(express.json());

// file upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  })
);

// cron job to delete temp files
const tempDir = path.join(__dirname, "tmp");
cron.schedule("0 * * * *", async () => {
  console.log("[CLEAN] Running temp directory cleanup...");
  await cleanTempDirectory(tempDir);
});

// api routes
app.get("/", (req, res) => {
  res.send("Hello from RAG server!");
});

app.use("/rag/chunking", chunkingRoute);
app.use("/rag/retrieval", retrievalRoute);

// run server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
