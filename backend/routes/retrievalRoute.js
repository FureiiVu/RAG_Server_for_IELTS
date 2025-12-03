import { Router } from "express";

import {
  handleRetrievalAndSendRequest,
  handleGetClusterContents,
  handleDeleteClusters,
  getClustersInDuration,
} from "../controllers/retrievalController.js";

const router = Router();

router.post("/retrieval-send-request", handleRetrievalAndSendRequest);
router.post("/get-cluster-contents", handleGetClusterContents);
router.post("/delete-clusters", handleDeleteClusters);
router.post("/get-clusters-in-duration", getClustersInDuration);

export default router;
