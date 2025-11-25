import { Router } from "express";
import { uploadDocument } from "../controllers/chunkingController.js";

const router = Router();

router.post("/upload-document", uploadDocument);

export default router;
