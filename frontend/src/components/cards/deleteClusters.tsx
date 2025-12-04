import { useState } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useDeleteClustersStore } from "@/stores/deleteClustersStore";

export const DeleteClustersCard = () => {
  const [clusterIds, setClusterIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>(() => {
    return new Date(1975, 0, 1);
  });
  const [endDate, setEndDate] = useState<Date>(() => new Date());
  const [isOpen, setIsOpen] = useState(false);
  const {
    isLoading,
    isCompleted,
    error,
    clustersUUIDs,
    deleteClusters,
    deleteCollection,
    getClustersInDuration,
    resetClustersUUIDs,
  } = useDeleteClustersStore();

  const wrapperClasses = `w-full max-w-[60%] mx-auto my-2.5 border p-4 rounded-sm transition-colors duration-200 ${
    error
      ? "border-red-500 bg-red-50"
      : isCompleted
      ? "border-green-500 bg-green-50"
      : "border-zinc-300"
  }`;

  const handleTextareaChange = (ids: string) => {
    const normalizedInput = ids.split(/[^a-zA-Z0-9-]+/).filter(Boolean);
    setClusterIds(normalizedInput);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    setStartDate(new Date(e.target.value));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    setEndDate(new Date(e.target.value));
  };

  const handleDeleteClusters = () => {
    if (!clusterIds || clusterIds.length === 0) {
      console.log("No cluster IDs provided");
      return;
    }

    if (clusterIds.length === 1 && clusterIds[0] === "All") {
      deleteCollection();
      return;
    }

    deleteClusters(clusterIds);
    resetClustersUUIDs();
    setClusterIds([]);
  };

  const handleFilterClusterIDs = () => {
    getClustersInDuration(startDate, endDate);
  };

  return (
    <div className={wrapperClasses}>
      <div className="grid gap-2.5">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Delete cluster</h2>
          {isLoading ? (
            <Loader2 className="animate-spin w-4 h-4 text-zinc-500" />
          ) : isCompleted ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : null}
        </div>

        <div>
          <Label htmlFor="cluster-ids" className="font-semibold mb-2">
            Cluster IDs
          </Label>

          <Textarea
            id="cluster-ids"
            placeholder="Type your list of cluster IDs here"
            disabled={isLoading}
            onChange={(e) => handleTextareaChange(e.target.value)}
          />
        </div>

        <p className="text-sm text-zinc-500 italic">
          *Note: Provide a list of cluster IDs to delete, or type "All" to
          delete every cluster. To retrieve cluster IDs created within a
          specific time range, please use the filter feature below.
        </p>

        <div className="flex justify-between space-x-2.5">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "Close ID Filter" : "Show ID Filter"}
          </Button>

          <Button
            onClick={handleDeleteClusters}
            disabled={isLoading}
            className="flex-1"
            variant="destructive"
          >
            Delete
          </Button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="document-upload-details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="p-4 mt-2 border rounded-md bg-zinc-50 grid gap-2.5">
                <h2 className="text-lg font-bold">Filter clusters' IDs</h2>

                <div className="flex justify-between space-x-2.5">
                  <div className="flex-1">
                    <Label htmlFor="startDate" className="font-semibold mb-2">
                      Start Date
                    </Label>
                    <Input
                      type="date"
                      id="startDate"
                      onChange={handleStartDateChange}
                      value={startDate.toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="flex-1">
                    <Label htmlFor="endDate" className="font-semibold mb-2">
                      End Date
                    </Label>
                    <Input
                      type="date"
                      id="endDate"
                      onChange={handleEndDateChange}
                      value={endDate.toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleFilterClusterIDs}
                  disabled={isLoading}
                  className="w-full mb-2"
                >
                  Filter IDs
                </Button>

                {error ? (
                  <div className="p-4 mt-2 border rounded-md bg-white">
                    <div className="flex items-start space-x-2 text-red-600">
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Label htmlFor="cluster-id-list" className="font-semibold">
                      Result
                    </Label>
                    <pre
                      id="cluster-id-list"
                      className="max-h-[400px] overflow-y-auto p-3 bg-white border rounded-md text-sm whitespace-pre-wrap"
                    >
                      {clustersUUIDs.length > 0
                        ? clustersUUIDs.join("\n")
                        : "No cluster ID found"}
                    </pre>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
