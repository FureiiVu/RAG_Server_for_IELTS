import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface documentStore {
  message: string;
  documentName: string;
  normalizedDocumentName: string;
  normalizedContent: string;
  isLoading: boolean;
  isCompleted: boolean;
  error: string | null;
  uploadDocument: (document: File) => Promise<void>;
  cleanStore: () => void;
}

export const useDocumentStore = create<documentStore>((set) => ({
  message: "",
  documentName: "",
  normalizedDocumentName: "",
  normalizedContent: "",
  isLoading: false,
  isCompleted: false,
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
        normalizedDocumentName: response.data.normalizedFileName,
        normalizedContent: response.data.normalizedContent,
        isCompleted: true,
      });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Upload failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  cleanStore: () => {
    set({
      message: "",
      documentName: "",
      normalizedDocumentName: "",
      normalizedContent: "",
      isLoading: false,
      isCompleted: false,
      error: null,
    });
  },
}));
