import { Router } from "express";

import {
  handleRetrievalAndSendRequest,
  handleGetClusterContents,
  handleDeleteClusters,
  getClustersInDuration,
  deleteAllClusters,
} from "../controllers/retrievalController.js";

const router = Router();

router.post("/retrieval-send-request", handleRetrievalAndSendRequest);
router.post("/get-cluster-contents", handleGetClusterContents);
router.post("/delete-clusters", handleDeleteClusters);
router.post("/get-clusters-in-duration", getClustersInDuration);
router.delete("/delete-collection", deleteAllClusters);

export default router;
