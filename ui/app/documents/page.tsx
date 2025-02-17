"use client";
import React, { useState } from "react";
import {
  FileText,
  Folder,
  Search,
  Square,
  CheckSquare,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

const DocumentListPage = () => {
  const router = useRouter();
  const [selectedDocs, setSelectedDocs] = useState(new Set());

  // Sample document data
  const documents = [
    {
      id: 1,
      title: "Project Proposal",
      type: "pdf",
      size: "2.4 MB",
      modified: "2024-02-17",
    },
    {
      id: 2,
      title: "Meeting Notes",
      type: "doc",
      size: "1.1 MB",
      modified: "2024-02-16",
    },
    {
      id: 3,
      title: "Budget Report",
      type: "xlsx",
      size: "3.7 MB",
      modified: "2024-02-15",
    },
    {
      id: 4,
      title: "Client Presentation",
      type: "ppt",
      size: "5.2 MB",
      modified: "2024-02-14",
    },
    {
      id: 5,
      title: "Research Paper",
      type: "pdf",
      size: "4.3 MB",
      modified: "2024-02-13",
    },
  ];

  // Sample folders
  const folders = [
    { id: 1, name: "Projects", count: 12 },
    { id: 2, name: "Reports", count: 8 },
    { id: 3, name: "Archives", count: 15 },
  ];

  const toggleDocument = (docId) => {
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center mb-4">
            <button
              onClick={handleReturn}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Return to chat"
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
              {selectedDocs.size > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedDocs.size} selected
                </span>
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Folders Section */}
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

        {/* Documents Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Recent Documents
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center">
                        <button
                          onClick={toggleAll}
                          className="mr-3 focus:outline-none"
                          aria-label={
                            selectedDocs.size === documents.length
                              ? "Deselect all"
                              : "Select all"
                          }
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
                            aria-label={
                              selectedDocs.has(doc.id)
                                ? `Deselect ${doc.title}`
                                : `Select ${doc.title}`
                            }
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DocumentListPage;
