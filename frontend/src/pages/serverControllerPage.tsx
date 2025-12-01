import { FileUploadInput } from "@/components/cards/fileUploadInput";

const ServerControllerPage = () => {
  return (
    <>
      <div className="w-full max-w-[60%] mx-auto my-2.5 border p-4 rounded-sm">
        <FileUploadInput />
      </div>
    </>
  );
};

export default ServerControllerPage;
