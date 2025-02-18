"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  Folder,
  Search,
  Square,
  CheckSquare,
  ArrowLeft,
  Upload,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import MultiplePDFUploader from "@/components/PdfUploader";

interface Document {
  id: number;
  title: string;
  type: string;
  size: string;
  modified: string;
}

const DocumentListPage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocs, setSelectedDocs] = useState(new Set());
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const folders = [
    { id: 1, name: "Projects", count: 12 },
    { id: 2, name: "Reports", count: 8 },
    { id: 3, name: "Archives", count: 15 },
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/files", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      const fileNames = await response.json();

      const transformedDocs: Document[] = fileNames.map(
        (fileName: string, index: number) => ({
          id: index + 1,
          title: fileName,
          type: fileName.split(".").pop()?.toUpperCase() || "PDF",
          size: "-- KB",
          modified: new Date().toLocaleDateString(),
        })
      );

      setDocuments(transformedDocs);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch documents"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    try {
      const documentToDelete = documents.find((doc) => doc.id === docId);
      if (!documentToDelete) return;

      const response = await fetch(
        `http://localhost:8080/delete?fileName=${encodeURIComponent(
          documentToDelete.title
        )}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      // Remove the deleted document from the documents state
      setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== docId));

      // Remove from selected docs if it was selected
      const newSelected = new Set(selectedDocs);
      newSelected.delete(docId);
      setSelectedDocs(newSelected);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete document"
      );
      // Refresh documents list in case of error to ensure consistency
      fetchDocuments();
    }
  };

  const toggleDocument = (docId: number) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocs(newSelected);
  };

  const toggleAll = () => {
    if (selectedDocs.size === documents.length) {
      setSelectedDocs(new Set());
    } else {
      setSelectedDocs(new Set(documents.map((doc) => doc.id)));
    }
  };

  const handleReturn = () => {
    router.push("/chat");
  };

  const handleDeleteSelected = async () => {
    try {
      const deletePromises = Array.from(selectedDocs).map((docId) =>
        handleDeleteDocument(docId as number)
      );
      await Promise.all(deletePromises);
      setSelectedDocs(new Set());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete documents"
      );
      // Refresh documents list in case of error
      fetchDocuments();
    }
  };

  // Add refresh handler for when new files are uploaded
  const handleUploadComplete = () => {
    fetchDocuments();
  };

  // Rest of the component remains the same ...
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center mb-4">
            <button
              onClick={handleReturn}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Return to Chat</span>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Documents
            </h1>
            <div className="flex items-center space-x-4">
              <MultiplePDFUploader onUploadComplete={handleUploadComplete} />

              {selectedDocs.size > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Selected</span>
                </button>
              )}

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {uploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Folders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Folder className="h-6 w-6 text-blue-500" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {folder.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {folder.count} items
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Documents
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {loading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Loading documents...
              </div>
            ) : documents.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No documents found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <div className="flex items-center">
                          <button
                            onClick={toggleAll}
                            className="mr-3 focus:outline-none"
                          >
                            {selectedDocs.size === documents.length ? (
                              <CheckSquare className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Square className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                          Name
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Modified
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {documents.map((doc) => (
                      <tr
                        key={doc.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleDocument(doc.id)}
                              className="mr-3 focus:outline-none"
                            >
                              {selectedDocs.has(doc.id) ? (
                                <CheckSquare className="h-4 w-4 text-blue-500" />
                              ) : (
                                <Square className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {doc.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                            {doc.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {doc.size}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {doc.modified}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-500 hover:text-red-700 focus:outline-none"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DocumentListPage;
