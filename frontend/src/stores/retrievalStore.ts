import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface retrievalStore {
  message: string;
  clusterContent: string;
  isLoading: boolean;
  isCompleted: boolean;
  error: string | null;
  getClusterContents: (clusterId: string) => Promise<void>;
  cleanStore: () => void;
}

export const useRetrievalStore = create<retrievalStore>()((set) => ({
  message: "",
  clusterContent: "",
  isLoading: false,
  isCompleted: false,
  error: null,

  getClusterContents: async (clusterId: string) => {
    set({ isLoading: true, error: null });

    if (!clusterId) {
      set({ isLoading: false, error: "No clusterId provided" });
      return;
    }

    try {
      const response = await axiosInstance.post(
        "retrieval/get-cluster-contents",
        { clusterId: clusterId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      set({
        message: response.data.message,
        clusterContent: response.data.clusterContent,
        isCompleted: true,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Unable to get cluster contents",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  cleanStore: () => {
    set({
      message: "",
      clusterContent: "",
      isLoading: false,
      isCompleted: false,
      error: null,
    });
  },
}));
