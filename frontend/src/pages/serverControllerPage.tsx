import { FileUploadInput } from "@/components/cards/fileUploadInput";
import { DocumentChunkingCard } from "@/components/cards/documentChunking";
import { GetClusterContentCard } from "@/components/cards/getClusterContent";
import { Button } from "@/components/ui/button";

import { useDocumentStore } from "@/stores/documentStore";
import { useRecursiveTokenChunkingStore } from "@/stores/recursiveTokenChunkingStore";
import { useClusterSemanticChunkingStore } from "@/stores/clusterSemanticChunkingStore";
import { useRetrievalStore } from "@/stores/retrievalStore";

const ServerControllerPage = () => {
  const { cleanStore: cleanDocumentStore } = useDocumentStore();
  const { cleanStore: cleanRecursiveTokenChunkingStore } =
    useRecursiveTokenChunkingStore();
  const { cleanStore: cleanClusterSemanticChunkingStore } =
    useClusterSemanticChunkingStore();
  const { cleanStore: cleanRetrievalStore } = useRetrievalStore();

  const cleanAllStores = () => {
    cleanDocumentStore();
    useDocumentStore.persist.clearStorage();

    cleanRecursiveTokenChunkingStore();
    useRecursiveTokenChunkingStore.persist.clearStorage();

    cleanClusterSemanticChunkingStore();
    useClusterSemanticChunkingStore.persist.clearStorage();

    cleanRetrievalStore();
    useRetrievalStore.persist.clearStorage();
  };

  return (
    <>
      <FileUploadInput />
      <DocumentChunkingCard />
      <GetClusterContentCard />

      <div className="w-full max-w-[60%] mx-auto my-2.5 flex justify-end space-x-2.5">
        <Button variant="secondary" className="px-8" onClick={cleanAllStores}>
          Upload new file
        </Button>
        <Button className="px-8">Evaluate server</Button>
      </div>
    </>
  );
};

export default ServerControllerPage;
