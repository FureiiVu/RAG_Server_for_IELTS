import { Router } from "express";

import { handleTestRetrieval } from "../controllers/retrievalController.js";

const router = Router();

router.post("/test-retrieval", handleTestRetrieval);

export default router;
