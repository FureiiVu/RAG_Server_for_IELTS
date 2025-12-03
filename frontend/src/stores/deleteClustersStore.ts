import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface deleteClustersStore {
  message: string;
  clustersUUIDs: string[];
  isLoading: boolean;
  isCompleted: boolean;
  error: string | null;
  deleteClustersInDuration: (clusterIds: string[]) => Promise<void>;
  getClustersInDuration: (startDate: Date, endDate: Date) => Promise<void>;
  cleanStore: () => void;
}

export const useDeleteClustersStore = create<deleteClustersStore>()(
  persist(
    (set) => ({
      message: "",
      clustersUUIDs: [],
      isLoading: false,
      isCompleted: false,
      error: null,

      deleteClustersInDuration: async (clusterIds: string[]) => {
        set({ isLoading: true, error: null });

        if (
          !clusterIds ||
          !Array.isArray(clusterIds) ||
          clusterIds.length === 0
        ) {
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
            error: error.response?.data?.message || "Unable to delete clusters",
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
              error.response?.data?.message ||
              `Unable to get clusters created from ${startDate} to ${endDate}`,
          });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "delete-clusters-store",
      partialize: (state: any) => ({
        clustersUUIDs: state.clustersUUIDs,
        isCompleted: state.isCompleted,
      }),
    }
  )
);
