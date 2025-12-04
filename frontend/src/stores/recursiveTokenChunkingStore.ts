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
  initiateRtcChunking: (normalizedDocumentName: string) => Promise<void>;
  cleanStore: () => void;
}

export const useRecursiveTokenChunkingStore = create<documentStore>()(
  persist(
    (set) => ({
      message: "",
      chunkCount: 0,
      chunksUUIDs: [],
      isLoading: false,
      isCompleted: false,
      error: null,

      initiateRtcChunking: async (normalizedDocumentName: string) => {
        set({ isLoading: true, error: null });

        if (!normalizedDocumentName) {
          set({ isLoading: false, error: "No document name provided" });
          return;
        }

        try {
          // Gửi yêu cầu chunking tài liệu bằng Recursive Token Chunker
          const rtcResponse = await axiosInstance.post(
            "chunking/recursive-token-chunker",
            {
              dataFileName: normalizedDocumentName,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const chunksUUIDs = rtcResponse.data?.chunksUUIDS ?? {};

          set({
            message: rtcResponse.data.message,
            chunkCount: rtcResponse.data.chunkCount,
            chunksUUIDs: Object.values(chunksUUIDs),
            isCompleted: true,
          });
        } catch (error: any) {
          set({
            error:
              error.response?.data?.error || "Recursive Token Chunking failed",
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
