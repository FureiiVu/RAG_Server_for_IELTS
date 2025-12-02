import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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

export const useDocumentStore = create<documentStore>()(
  persist(
    (set) => ({
      message: "",
      documentName: "",
      normalizedDocumentName: "",
      normalizedContent: "",
      isLoading: false,
      isCompleted: false,
      error: null,

      uploadDocument: async (document: File) => {
        set({ isLoading: true, error: null });

        if (!document) {
          set({ isLoading: false, error: "No document provided" });
          return;
        }

        try {
          const response = await axiosInstance.post(
            "chunking/upload-document",
            { document },
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          set({
            message: response.data.message,
            documentName: response.data.originalFileName,
            normalizedDocumentName: response.data.normalizedFileName,
            normalizedContent: response.data.normalizedContent,
            isCompleted: true,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Upload failed",
          });
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
    }),
    {
      name: "document-store",
      partialize: (state: any) => ({
        message: state.message,
        documentName: state.documentName,
        normalizedDocumentName: state.normalizedDocumentName,
        normalizedContent: state.normalizedContent,
        isCompleted: state.isCompleted,
      }),
    }
  )
);
