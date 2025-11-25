import fs from "fs/promises";
import path from "path";

// Xóa file cũ hơn 30p
const FILE_TTL_MINUTES = 30;

export const cleanTempDirectory = async (tempDir) => {
  try {
    // Nếu thư mục không tồn tại → dừng
    await fs.access(tempDir).catch(() => null);

    const files = await fs.readdir(tempDir);

    const now = Date.now();

    for (const file of files) {
      const filePath = path.join(tempDir, file);

      try {
        const stat = await fs.stat(filePath);

        // Nếu là thư mục → xóa đệ quy
        if (stat.isDirectory()) {
          await fs.rm(filePath, { recursive: true, force: true });
          console.log(`[CLEAN] Removed folder: ${file}`);
          continue;
        }

        const ageMinutes = (now - stat.mtimeMs) / 1000 / 60;

        // Chỉ xóa khi file cũ hơn TTL
        if (ageMinutes > FILE_TTL_MINUTES) {
          await fs.unlink(filePath);
          console.log(
            `[CLEAN] Deleted: ${file} (${ageMinutes.toFixed(1)} min old)`
          );
        }
      } catch (err) {
        console.error(`[CLEAN] Error processing ${file}:`, err.message);
      }
    }
  } catch (err) {
    console.error("[CLEAN] Failed to clean temp directory:", err.message);
  }
};
