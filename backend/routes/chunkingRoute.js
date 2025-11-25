import { Router } from "express";
import {
  uploadDocument,
  handleRecursiveTokenChunker,
} from "../controllers/chunkingController.js";

const router = Router();

router.post("/upload-document", uploadDocument);
router.post("/recursive-token-chunker", handleRecursiveTokenChunker);

export default router;
