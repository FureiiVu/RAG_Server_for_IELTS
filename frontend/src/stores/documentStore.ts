import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface documentStore {
  message: string;
  documentName: string;
  normalizeDocumentName: string;
  isLoading: boolean;
  error: string | null;
  uploadDocument: (document: File) => Promise<void>;
}

export const useDocumentStore = create<documentStore>((set) => ({
  message: "",
  documentName: "",
  normalizeDocumentName: "",
  isLoading: false,
  error: null,

  uploadDocument: async (document: File) => {
    // Sửa isLoading thành true khi bắt đầu tải lên
    set({ isLoading: true, error: null });

    if (!document) {
      set({ isLoading: false, error: "No document provided" });
      return;
    }

    try {
      // Gửi yêu cầu tải lên tài liệu
      const response = await axiosInstance.post(
        "chunking/upload-document",
        {
          document,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Cập nhật trạng thái với phản hồi từ server
      set({
        message: response.data.message,
        documentName: response.data.originalFileName,
        normalizeDocumentName: response.data.normalizedFileName,
      });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Upload failed" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
