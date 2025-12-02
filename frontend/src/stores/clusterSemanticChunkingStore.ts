import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface documentStore {
  message: string;
  chunkCount: number;
  chunksUUIDs: string[];
  isLoading: boolean;
  isCompleted: boolean;
  error: string | null;
  initiateCscChunking: () => Promise<void>;
  cleanStore: () => void;
}

export const useClusterSemanticChunkingStore = create<documentStore>()(
  persist(
    (set) => ({
      message: "",
      chunkCount: 0,
      chunksUUIDs: [],
      isLoading: false,
      isCompleted: false,
      error: null,

      initiateCscChunking: async (normalizedDocumentName: string) => {
        set({ isLoading: true, error: null });

        if (!normalizedDocumentName) {
          set({ isLoading: false, error: "No document name provided" });
          return;
        }

        try {
          // Gửi yêu cầu chunking tài liệu bằng Recursive Token Chunker
          const cscResponse = await axiosInstance.post(
            "chunking/recursive-token-chunker"
          );

          set({
            message: cscResponse.data.message,
            chunkCount: cscResponse.data.chunkCount,
            chunksUUIDs: cscResponse.data.chunksUUIDs,
            isCompleted: true,
          });
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message ||
              "Cluster Semantic Chunking failed",
          });
        } finally {
          set({ isLoading: false });
        }
      },

      cleanStore: () => {
        set({
          message: "",
          chunkCount: 0,
          chunksUUIDs: [],
          isLoading: false,
          isCompleted: false,
          error: null,
        });
      },
    }),
    {
      name: "recursive-token-chunking-store",
      partialize: (state: any) => ({
        message: state.message,
        chunkCount: state.chunkCount,
        chunksUUIDs: state.chunksUUIDs,
        isCompleted: state.isCompleted,
      }),
    }
  )
);
