import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useDocumentStore } from "@/stores/documentStore";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Check, AlertCircle } from "lucide-react";

export const FileUploadInput = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, isCompleted, error, normalizedContent, uploadDocument } =
    useDocumentStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  const handleUpload = () => {
    if (!file || isLoading) return;
    uploadDocument(file);
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
        <Label htmlFor="document" className="text-lg font-bold">
          Upload document
        </Label>

        <div className="flex justify-between space-x-2.5">
          <Input
            id="document"
            type="file"
            accept=".pdf, .doc, .docx"
            onChange={handleFileChange}
          />

          <Button onClick={handleUpload} disabled={isLoading || isCompleted}>
            {isLoading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : isCompleted ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              "Upload"
            )}
          </Button>
        </div>

        <p className="text-sm text-zinc-500 italic">
          *Note: Only PDF, DOC, and DOCX files are supported.
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
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="p-4 mt-2 border rounded-md bg-zinc-50">
                {error ? (
                  <div className="flex items-start space-x-2 text-red-600">
                    <AlertCircle className="w-5 h-5 mt-0.5" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold mb-2">Document Information</h3>
                    {file ? (
                      <div className="text-sm text-zinc-700 space-y-1">
                        <p>
                          <strong>File name:</strong> {file.name}
                        </p>
                        <p>
                          <strong>Size:</strong> {(file.size / 1024).toFixed(1)}{" "}
                          KB
                        </p>
                        <p>
                          <strong>Type:</strong> {file.type}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500 italic">
                        No file selected yet.
                      </p>
                    )}
                  </>
                )}
              </div>
              {normalizedContent && (
                <div className="p-4 mt-2 border rounded-md bg-zinc-50">
                  <h3 className="font-semibold mb-2">Normalized content</h3>
                  <pre className="max-h-[400px] overflow-y-auto p-3 bg-white border rounded-md text-sm whitespace-pre-wrap">
                    {normalizedContent}
                  </pre>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
