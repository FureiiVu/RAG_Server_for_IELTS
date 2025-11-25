import { normalizeDocument } from "../middleware/normalizeDocument.js";

export const uploadDocument = async (req, res) => {
  try {
    if (!req.files || !req.files.document) {
      return res.status(400).json({ error: "No document uploaded" });
    }

    // Nhận file upload
    const document = req.files.document;
    console.log(`[UPLOADED] Received document: ${document.tempFilePath}`);

    // Chuẩn hóa file thành plain text
    const outputFile = await normalizeDocument(
      document.tempFilePath,
      document.mimetype
    );

    console.log(`[FINISHED] Normalized document: ${document.tempFilePath}`);

    res.status(200).json({
      message: "Document uploaded and normalized successfully",
      fileName: document.name,
      outputFile: outputFile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
