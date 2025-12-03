import { Router } from "express";

import {
  handleRetrievalAndSendRequest,
  handleGetClusterContents,
} from "../controllers/retrievalController.js";

const router = Router();

router.post("/retrieval-send-request", handleRetrievalAndSendRequest);
router.post("/get-cluster-contents", handleGetClusterContents);

export default router;
