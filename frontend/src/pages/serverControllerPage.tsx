import { FileUploadInput } from "@/components/cards/fileUploadInput";
import { DocumentChunkingCard } from "@/components/cards/documentChunking";
import { GetClusterContentCard } from "@/components/cards/getClusterContent";
import { DeleteClustersCard } from "@/components/cards/deleteClusters";
import { Button } from "@/components/ui/button";

import { useDocumentStore } from "@/stores/documentStore";
import { useRecursiveTokenChunkingStore } from "@/stores/recursiveTokenChunkingStore";
import { useClusterSemanticChunkingStore } from "@/stores/clusterSemanticChunkingStore";
import { useRetrievalStore } from "@/stores/retrievalStore";
import { useDeleteClustersStore } from "@/stores/deleteClustersStore";

const ServerControllerPage = () => {
  const { cleanStore: cleanDocumentStore } = useDocumentStore();
  const { cleanStore: cleanRecursiveTokenChunkingStore } =
    useRecursiveTokenChunkingStore();
  const { cleanStore: cleanClusterSemanticChunkingStore } =
    useClusterSemanticChunkingStore();
  const { cleanStore: cleanRetrievalStore } = useRetrievalStore();
  const { cleanStore: cleanDeleteClustersStore } = useDeleteClustersStore();

  const cleanAllStores = () => {
    cleanDocumentStore();
    useDocumentStore.persist.clearStorage();

    cleanRecursiveTokenChunkingStore();
    useRecursiveTokenChunkingStore.persist.clearStorage();

    cleanClusterSemanticChunkingStore();
    useClusterSemanticChunkingStore.persist.clearStorage();

    cleanRetrievalStore();
    cleanDeleteClustersStore();
  };

  return (
    <div className="min-h-screen w-full bg-[#192841] py-10 px-6">
      {/* Header */}
      <div className="w-full max-w-5xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-wide text-white mb-2">
          RAG Server Controller
        </h1>
        <p className="text-gray-400 text-lg">
          Manage your RAG processing pipeline with a clean and modern interface
        </p>
      </div>

      {/* Main content container */}
      <div className="w-full space-y-6">
        <FileUploadInput />
        <DocumentChunkingCard />
        <GetClusterContentCard />
        <DeleteClustersCard />

        {/* Buttons */}
        <div className="w-full flex justify-end max-w-[60%] mx-auto space-x-3 pt-4">
          <Button
            variant="secondary"
            className="px-8 bg-[#3D4C66] text-white hover:bg-[#4A5A78]"
            onClick={cleanAllStores}
          >
            Upload new file
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServerControllerPage;
