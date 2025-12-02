import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useDocumentStore } from "@/stores/documentStore";
import { useRecursiveTokenChunkingStore } from "@/stores/recursiveTokenChunkingStore";
import { useClusterSemanticChunkingStore } from "@/stores/clusterSemanticChunkingStore";
import { Loader2, Check, AlertCircle } from "lucide-react";

export const DocumentChunkingCard = () => {
  // Khai báo biến và sử dụng các Store
  const [isOpen, setIsOpen] = useState(false);

  const { normalizedDocumentName, isCompleted: isDocumentUploadCompleted } =
    useDocumentStore();

  const {
    message: rtcMessage,
    isLoading: rtcIsLoading,
    isCompleted: rtcIsCompleted,
    error: rtcError,
    initiateRtcChunking,
    chunkCount: rtcChunkCount,
    chunksUUIDs: rtcChunksUUIDs,
  } = useRecursiveTokenChunkingStore();

  const {
    message: cscMessage,
    isLoading: cscIsLoading,
    isCompleted: cscIsCompleted,
    error: cscError,
    initiateCscChunking,
    chunkCount: cscChunkCount,
    chunksUUIDs: cscChunksUUIDs,
  } = useClusterSemanticChunkingStore();

  const wrapperClasses = `w-full max-w-[60%] mx-auto my-2.5 border p-4 rounded-sm transition-colors duration-200 ${
    rtcError || cscError
      ? "border-red-500 bg-red-50"
      : rtcIsCompleted || cscIsCompleted
      ? "border-green-500 bg-green-50"
      : "border-zinc-300"
  }`;

  return (
    <div className={wrapperClasses}>
      <div className="grid gap-2.5">
        <h2 className="text-lg font-bold">Document Chunking</h2>
        <p className="text-sm text-zinc-500 italic">
          *Description: Normalized document will be chunked into pieces with
          maximum length of 200 tokens using Recursive Token Chunking technique.
          After that, those mini-chunks with nearest semantic similarity will be
          grouped into clusters using Cluster Semantic Chunking technique and
          stored in vector database. Each cluster contains no more than 5
          mini-chunks.
        </p>

        <Button
          variant="secondary"
          className="mt-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Hide Details" : "Show Details"}
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="document-chunking-details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="p-4 mt-2 border rounded-md bg-zinc-50">
                {rtcError ? (
                  <div className="flex items-start space-x-2 text-red-600">
                    <AlertCircle className="w-5 h-5 mt-0.5" />
                    <p className="text-sm font-medium">{rtcError}</p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold mb-2">
                      Recursive Token Chunking Information
                    </h3>
                    {rtcMessage && rtcChunkCount && rtcChunksUUIDs ? (
                      <div className="text-sm text-zinc-700 space-y-1">
                        <p>
                          <strong>Chunk count:</strong> {rtcChunkCount}
                        </p>
                        <p>
                          <strong>Response message:</strong> {rtcMessage}
                        </p>
                        <div className="mt-2">
                          <strong>Chunks UUIDs:</strong>
                          <ul className="list-disc list-inside space-y-1 mt-1">
                            {rtcChunksUUIDs.map((uuid) => (
                              <li
                                key={uuid}
                                className="font-mono text-xs bg-zinc-100 p-1 rounded cursor-pointer hover:bg-zinc-200 transition"
                                title="Click to copy"
                              >
                                {uuid}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500 italic">
                        This chunking technique has not been performed yet.
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="p-4 mt-2 border rounded-md bg-zinc-50">
                {cscError ? (
                  <div className="flex items-start space-x-2 text-red-600">
                    <AlertCircle className="w-5 h-5 mt-0.5" />
                    <p className="text-sm font-medium">{cscError}</p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold mb-2">
                      Cluster Semantic Chunking Information
                    </h3>
                    {cscMessage && cscChunkCount && cscChunksUUIDs ? (
                      <div className="text-sm text-zinc-700 space-y-1">
                        <p>
                          <strong>Chunk count:</strong> {cscChunkCount}
                        </p>
                        <p>
                          <strong>Response message:</strong> {cscMessage}
                        </p>
                        <div className="mt-2">
                          <strong>Chunks UUIDs:</strong>
                          <ul className="list-disc list-inside space-y-1 mt-1">
                            {cscChunksUUIDs.map((uuid) => (
                              <li
                                key={uuid}
                                className="font-mono text-xs bg-zinc-100 p-1 rounded cursor-pointer hover:bg-zinc-200 transition"
                                title="Click to copy"
                              >
                                {uuid}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500 italic">
                        This chunking technique has not been performed yet.
                      </p>
                    )}
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
