import fs from "fs";
import path from "path";

import { normalizeDocument } from "../middleware/normalizeDocument.js";
import { RecursiveTokenChunker } from "../chunking_strategies/recursiveTokenChunker.js";
import {
  insertChunksToWeaviate,
  fetchAllChunksFromCollection,
} from "../middleware/crudWeaviate.js";
import { ClusterSemanticChunker } from "../chunking_strategies/clusterSemanticChunker.js";

export const uploadDocument = async (req, res) => {
  try {
    if (!req.files || !req.files.document) {
      return res
        .status(400)
        .json({ api: "Upload Document", error: "No document uploaded" });
    }

    // Nhận file upload
    const document = req.files.document;
    console.log(`[UPLOADED] Received document: ${document.tempFilePath}`);

    // Chuẩn hóa file thành plain text
    const normalizedContent = await normalizeDocument(
      document.tempFilePath,
      document.mimetype
    );

    console.log(`[FINISHED] Normalized document: ${document.tempFilePath}`);

    // Kiểm tra và tạo thư mục lưu trữ nếu chưa tồn tại
    const outputDir = path.join(process.cwd(), "normalized_data");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Tạo tên file tạm dựa trên tên file gốc + timestamp
    const timestamp = Date.now();
    const outputFileName = `${path.parse(document.name).name}_${timestamp}.txt`;
    const outputFilePath = path.join(outputDir, outputFileName);

    // Lưu nội dung chuẩn hóa vào file
    await fs.promises.writeFile(outputFilePath, normalizedContent, "utf-8");

    res.status(200).json({
      message: "Document uploaded and normalized successfully",
      originalFileName: document.name,
      normalizedFileName: outputFileName,
    });
  } catch (err) {
    console.error(
      `[ERROR] Unable to upload and normalize document: ${err.message}`
    );
    res.status(500).json({ api: "Upload Document", error: err.message });
  }
};

export const handleRecursiveTokenChunker = async (req, res) => {
  try {
    const dataDirPath = path.join(process.cwd(), "normalized_data");
    const requestedFileName = req.body.dataFileName;

    if (!requestedFileName) {
      return res.status(400).json({
        api: "Handle Recursive Token Chunker",
        error: "Missing dataFileName in request body",
      });
    }

    // Đọc toàn bộ file trong normalized_data
    const files = fs.readdirSync(dataDirPath);

    // Kiểm tra xem file có tồn tại trong thư mục hay không
    const matchedFile = files.find((file) => file === requestedFileName);

    if (!matchedFile) {
      return res.status(404).json({
        api: "Handle Recursive Token Chunker",
        error: "File not found in normalized data folder",
      });
    }

    // Đường dẫn tuyệt đối CHẮC CHẮN đúng
    const dataFilePath = path.join(dataDirPath, matchedFile);
    const dataContent = await fs.promises.readFile(dataFilePath, "utf-8");

    console.log(
      `[CHUNKING] Handling Recursive Token Chunker for file: ${requestedFileName}`
    );

    // Khởi tạo RecursiveTokenChunker với cấu hình mặc định
    const chunker = new RecursiveTokenChunker();

    // Thực hiện chunking theo kỹ thuật Recursive Token Chunker
    const chunks = chunker.splitText(dataContent);
    console.log(
      `[CHUNKING] Finished Recursive Token Chunker for file: ${requestedFileName}`
    );

    const chunksObjects = chunks.map((chunk, index) => ({
      content: chunk,
      metadata: { source: requestedFileName, chunkIndex: index },
    }));
    const uuids = await insertChunksToWeaviate("TempCollection", chunksObjects);

    // Xóa file sau khi chunking xong (nếu cần)
    await fs.promises.unlink(dataFilePath);
    console.log(
      `[CLEANUP] Deleted normalized file: ${requestedFileName} after chunking`
    );

    res.status(200).json({
      message: "Chunking completed",
      fileName: requestedFileName,
      chunkCount: chunks.length,
      chunksUUIDS: uuids,
    });
  } catch (err) {
    console.error(
      `[ERROR] Unable to handle recursive token chunker: ${err.message}`
    );
    res.status(500).json({
      api: "Handle Recursive Token Chunker",
      error: err.message,
    });
  }
};

export const handleClusterSemanticChunker = async (req, res) => {
  try {
    const { miniChunksContent, miniChunksVectors } =
      await fetchAllChunksFromCollection("TempCollection");

    const cluster = new ClusterSemanticChunker({
      contents: miniChunksContent,
      vectors: miniChunksVectors,
    });

    console.log(`[CHUNKING] Vectors: `, miniChunksVectors);

    const semanticChunks = cluster.build();

    res.status(200).json({
      message: "Cluster Semantic Chunker handled successfully",
      chunks: semanticChunks,
    });
  } catch (error) {
    console.error(
      `[ERROR] Unable to handle cluster semantic chunker: ${error.message}`
    );
    res.status(500).json({
      api: "Handle Cluster Semantic Chunker",
      error: error.message,
    });
  }
};
