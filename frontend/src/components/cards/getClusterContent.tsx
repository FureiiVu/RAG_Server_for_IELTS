import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { useRetrievalStore } from "@/stores/retrievalStore";

export const GetClusterContentCard = () => {
  const [clusterId, setClusterId] = useState("");
  const { clusterContent, getClusterContents, isLoading, isCompleted, error } =
    useRetrievalStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClusterId(e.target.value);
  };

  const handleGetContent = () => {
    if (!clusterId || isLoading) return;
    getClusterContents(clusterId);
  };

  const wrapperClasses = `w-full max-w-[60%] mx-auto my-2.5 border p-4 rounded-sm transition-colors duration-200 ${
    error
      ? "border-red-500 bg-red-50"
      : isCompleted
      ? "border-green-500 bg-green-50"
      : "border-zinc-300"
  }`;

  return (
    <div className={wrapperClasses}>
      <div className="grid gap-2.5">
        <h2 className="text-lg font-bold">Check cluster content</h2>

        <div>
          <Label htmlFor="cluster-id" className="font-semibold mb-2">
            ID
          </Label>

          <div className="flex justify-between space-x-2.5">
            <Input id="cluster-id" type="text" onChange={handleInputChange} />

            <Button
              onClick={handleGetContent}
              disabled={isLoading || isCompleted}
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : isCompleted ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                "Check"
              )}
            </Button>
          </div>
        </div>

        <div className="mt-2">
          <Label htmlFor="cluster-content" className="font-semibold mb-2">
            Content
          </Label>

          {error ? (
            <div className="p-4 mt-2 border rounded-md bg-zinc-50">
              <div className="flex items-start space-x-2 text-red-600">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          ) : (
            <pre className="max-h-[400px] overflow-y-auto p-3 bg-white border rounded-md text-sm whitespace-pre-wrap">
              {clusterContent ? clusterContent : "No content available."}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
