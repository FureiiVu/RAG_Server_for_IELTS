import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface deleteClustersStore {
  message: string;
  clustersUUIDs: string[];
  isLoading: boolean;
  isCompleted: boolean;
  error: string | null;
  deleteClusters: (clusterIds: string[]) => Promise<void>;
  deleteCollection: () => Promise<void>;
  getClustersInDuration: (startDate: Date, endDate: Date) => Promise<void>;
  resetClustersUUIDs: () => void;
  cleanStore: () => void;
}

export const useDeleteClustersStore = create<deleteClustersStore>()((set) => ({
  message: "",
  clustersUUIDs: [],
  isLoading: false,
  isCompleted: false,
  error: null,

  deleteClusters: async (clusterIds: string[]) => {
    set({ isLoading: true, error: null });

    if (!clusterIds || !Array.isArray(clusterIds) || clusterIds.length === 0) {
      set({ isLoading: false, error: "No clusterId provided" });
      return;
    }

    try {
      const response = await axiosInstance.post(
        "retrieval/delete-clusters",
        { clusterIds: clusterIds },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      set({
        message: response.data.message,
        isCompleted: true,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Unable to delete clusters",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCollection: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.delete(
        "retrieval/delete-collection"
      );
      set({
        message: response.data.message,
        isCompleted: true,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Unable to delete all clusters",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  getClustersInDuration: async (startDate: Date, endDate: Date) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.post(
        "retrieval/get-clusters-in-duration",
        { startDate: startDate, endDate: endDate },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      set({
        message: response.data.message,
        clustersUUIDs: response.data.clustersUUIDs,
        isCompleted: true,
      });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          `Unable to get clusters created from ${startDate} to ${endDate}`,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  resetClustersUUIDs: () => {
    set({ clustersUUIDs: [] });
  },

  cleanStore: () => {
    set({
      message: "",
      clustersUUIDs: [],
      isLoading: false,
      isCompleted: false,
      error: null,
    });
  },
}));
