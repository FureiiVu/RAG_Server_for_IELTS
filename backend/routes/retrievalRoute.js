import { Router } from "express";

import { handleRetrievalAndSendRequest } from "../controllers/retrievalController.js";

const router = Router();

router.post("/retrieval-send-request", handleRetrievalAndSendRequest);

export default router;
