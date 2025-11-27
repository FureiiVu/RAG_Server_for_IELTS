import { Router } from "express";
import {
  uploadDocument,
  handleRecursiveTokenChunker,
  handleClusterSemanticChunker,
} from "../controllers/chunkingController.js";

const router = Router();

router.post("/upload-document", uploadDocument);
router.post("/recursive-token-chunker", handleRecursiveTokenChunker);
router.post("/cluster-semantic-chunker", handleClusterSemanticChunker);

export default router;
