import fs from "fs";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { getDocument } from "pdfjs-dist";
import Tesseract from "tesseract.js";
import { createCanvas } from "canvas";

// Lọc ký tự thừa, chuẩn hóa xuống dòng
const normalizeText = (text) => {
  if (!text) return "";
  return text
    .normalize("NFC")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

// Xử lý OCR cho PDF scanned
const ocrPdf = async (buffer) => {
  const pdf = await getDocument({ data: buffer }).promise;

  let finalText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });

    // Render PDF page → canvas
    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext("2d");

    await page.render({
      canvasContext: ctx,
      viewport: viewport,
    }).promise;

    const imgBuffer = canvas.toBuffer("image/png");

    // OCR
    const result = await Tesseract.recognize(imgBuffer, "eng");
    finalText += result.data.text + "\n";
  }

  return finalText;
};

// Chuẩn hóa file Word
const normalizeDocx = async (filePath) => {
  console.log(`[NORMALIZING] Using mammoth for DOCX: ${filePath}`);
  const result = await mammoth.extractRawText({ path: filePath });
  return normalizeText(result.value);
};

// Chuẩn hóa PDF với OCR fallback
const normalizePdf = async (filePath) => {
  const buffer = fs.readFileSync(filePath);

  console.log(`[NORMALIZING] Using pdf-parse for PDF: ${filePath}`);

  // B1: cố parse bằng pdf-parse
  const parser = new PDFParse({ data: buffer });
  const data = await parser.getText();

  if (data.text && data.text.trim().length > 0) {
    // PDF có text → dùng pdf-parse
    return normalizeText(data.text);
  }

  console.log(
    `[NORMALIZING] Unable to parse text. Falling back to OCR for PDF: ${filePath}`
  );

  // B2: nếu text trống → PDF scanned → dùng OCR
  const ocrText = await ocrPdf(buffer);
  return normalizeText(ocrText);
};

export async function normalizeDocument(filePath, mimeType) {
  if (mimeType.includes("word") || mimeType.includes("officedocument")) {
    return await normalizeDocx(filePath);
  }

  if (mimeType === "application/pdf") {
    return await normalizePdf(filePath);
  }

  throw new Error("Unsupported file type");
}
