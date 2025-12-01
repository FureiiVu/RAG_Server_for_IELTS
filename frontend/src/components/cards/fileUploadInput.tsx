import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useDocumentStore } from "@/stores/documentStore";

export const FileUploadInput = () => {
  const [file, setFile] = useState<File | null>(null);
  const { uploadDocument } = useDocumentStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  const handleUpload = () => {
    if (!file) return;

    // Gọi hàm xử lý upload từ store
    uploadDocument(file);

    console.log("Uploading file:", file);
  };

  return (
    <div className="grid gap-2.5">
      <Label htmlFor="document" className="text-lg">
        Document
      </Label>

      <div className="flex justify-between space-x-2.5">
        <Input
          id="document"
          type="file"
          accept=".pdf, .doc, .docx"
          onChange={handleFileChange}
        />

        <Button onClick={handleUpload}>Upload</Button>
      </div>
    </div>
  );
};
