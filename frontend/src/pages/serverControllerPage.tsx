import { FileUploadInput } from "@/components/cards/fileUploadInput";
import { DocumentChunkingCard } from "@/components/cards/documentChunking";

const ServerControllerPage = () => {
  return (
    <>
      <FileUploadInput />
      <DocumentChunkingCard />
    </>
  );
};

export default ServerControllerPage;
