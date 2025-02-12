import { useState, useRef, useCallback } from "react";
import { Upload, FileIcon, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Progress } from "@/components/ui/progress";
import { getThemeClasses, useTheme } from "./Theme";

const PDF_UPLOADER = "http://localhost:8080/upload";

const MultiplePDFUploader = () => {
  const { theme } = useTheme();
  const themeClasses = getThemeClasses(theme);

  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      file: File;
      progress: number;
      status: "idle" | "uploading" | "completed" | "error";
      error?: string;
    }>
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File, fileIndex: number) => {
    setUploadedFiles((prev) =>
      prev.map((item, index) =>
        index === fileIndex
          ? {
              ...item,
              status: "uploading" as const,
              progress: 0,
              error: undefined,
            }
          : item
      )
    );

    const formData = new FormData();
    formData.append("file", file);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadedFiles((prev) =>
            prev.map((item, index) =>
              index === fileIndex ? { ...item, progress } : item
            )
          );
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setUploadedFiles((prev) =>
            prev.map((item, index) =>
              index === fileIndex
                ? { ...item, status: "completed" as const, progress: 100 }
                : item
            )
          );
        } else {
          throw new Error(`Upload failed with status: ${xhr.status}`);
        }
      };

      xhr.onerror = () => {
        throw new Error("Upload failed due to network error");
      };

      xhr.open("POST", PDF_UPLOADER);
      await xhr.send(formData);
    } catch (error) {
      setUploadedFiles((prev) =>
        prev.map((item, index) =>
          index === fileIndex
            ? {
                ...item,
                status: "error" as const,
                error: error instanceof Error ? error.message : "Upload failed",
                progress: 0,
              }
            : item
        )
      );
      console.error("Upload error:", error);
    }
  }, []);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      const validFiles = files.filter(
        (file) => file.type === "application/pdf"
      );

      if (validFiles.length) {
        setIsOpen(false);
        const newFiles = validFiles.map((file) => ({
          file,
          progress: 0,
          status: "idle" as const,
        }));

        setUploadedFiles((prev) => [...prev, ...newFiles]);

        // Upload each file
        validFiles.forEach((file, index) => {
          const fileIndex = uploadedFiles.length + index;
          uploadFile(file, fileIndex);
        });
      } else {
        console.warn("Please upload valid PDF files.");
      }
    },
    [uploadFile, uploadedFiles.length]
  );

  const handleRemoveFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const truncateFileName = useCallback(
    (name: string, maxLength: number = 20) => {
      if (name.length <= maxLength) return name;
      return `${name.slice(0, maxLength)}...`;
    },
    []
  );

  const getProgressColor = useCallback((progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  }, []);

  const buttonVariant = theme === "dark" ? "secondary" : "outline";
  const dialogContentClasses = `
    sm:max-w-[425px] 
    ${
      theme === "dark"
        ? "bg-gray-800 text-white border-gray-700"
        : "bg-white text-black border-gray-300"
    }
  `;

  const dropzoneClasses = `
    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition
    ${
      theme === "dark"
        ? "border-gray-600 hover:bg-gray-700 bg-gray-800 text-white"
        : "border-gray-300 hover:bg-gray-100 bg-white text-black"
    }
  `;

  const fileListClasses = `
    fixed bottom-4 right-4 w-80 shadow-lg rounded-lg p-4 z-50 border space-y-4
    ${
      theme === "dark"
        ? "bg-gray-800 border-gray-700 text-white"
        : "bg-white border-gray-300 text-black"
    }
  `;

  return (
    <div className={`relative ${themeClasses.background}`}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant={buttonVariant}
            className={
              theme === "dark" ? "bg-gray-800 text-white hover:bg-gray-700" : ""
            }
          >
            <div className="flex items-center gap-2">
              <Upload
                className={`w-4 h-4 mr-2 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              />
              <span className={theme === "dark" ? "text-white" : "text-black"}>
                Upload PDFs
              </span>
            </div>
          </Button>
        </DialogTrigger>

        <DialogContent className={dialogContentClasses}>
          <VisuallyHidden>
            <DialogTitle>Upload PDFs</DialogTitle>
          </VisuallyHidden>

          <div className="grid gap-4 py-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              aria-label="PDF files input"
            />
            <div
              className={dropzoneClasses}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && fileInputRef.current?.click()
              }
            >
              <Upload
                className={`mx-auto h-10 w-10 mb-4 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <p className="text-sm">
                Click to select PDF files or drag and drop
              </p>
              <p className="text-xs mt-2 text-gray-500">
                Multiple files allowed
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {uploadedFiles.length > 0 && (
        <div className={fileListClasses}>
          {uploadedFiles.map((fileData, index) => (
            <div key={`${fileData.file.name}-${index}`} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 max-w-[80%]">
                  <FileIcon
                    className={`w-4 h-4 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium truncate ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                    title={fileData.file.name}
                  >
                    {truncateFileName(fileData.file.name)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {fileData.status === "uploading" && (
                    <Loader2
                      className={`w-4 h-4 animate-spin ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  )}
                  <button
                    className={`p-1 ${
                      theme === "dark"
                        ? "text-red-300 hover:bg-red-900"
                        : "text-red-500 hover:bg-red-100"
                    } rounded-full`}
                    onClick={() => handleRemoveFile(index)}
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {fileData.status === "error" ? (
                <div className="text-red-500 text-sm mt-2 text-center">
                  {fileData.error}
                </div>
              ) : (
                <>
                  <Progress
                    value={fileData.progress}
                    className={`h-2 w-full ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    } ${getProgressColor(fileData.progress)}`}
                  />
                  <div
                    className={`mt-2 text-xs text-center ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {fileData.status === "completed"
                      ? "Completed"
                      : `${fileData.progress}% Uploaded`}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiplePDFUploader;
