import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface documentStore {
  message: string;
  clusterCount: number;
  clustersUUIDs: string[];
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
      clusterCount: 0,
      clustersUUIDs: [],
      isLoading: false,
      isCompleted: false,
      error: null,

      initiateCscChunking: async () => {
        set({ isLoading: true, error: null });

        try {
          // Gửi yêu cầu chunking tài liệu bằng Recursive Token Chunker
          const cscResponse = await axiosInstance.post(
            "chunking/cluster-semantic-chunker"
          );

          const clustersUUIDs = cscResponse.data?.clustersUUIDS ?? {};

          set({
            message: cscResponse.data.message,
            clusterCount: cscResponse.data.clusterCount,
            clustersUUIDs: Object.values(clustersUUIDs),
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
          clusterCount: 0,
          clustersUUIDs: [],
          isLoading: false,
          isCompleted: false,
          error: null,
        });
      },
    }),
    {
      name: "cluster-semantic-chunking-store",
      partialize: (state: any) => ({
        message: state.message,
        clusterCount: state.clusterCount,
        clustersUUIDs: state.clustersUUIDs,
        isCompleted: state.isCompleted,
      }),
    }
  )
);
