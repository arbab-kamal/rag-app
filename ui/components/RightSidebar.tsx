import React from "react";
import { Settings, Search, Share2, Grid } from "lucide-react";
import { getThemeClasses, useTheme } from "./Theme";
import PDFUploader from "./PdfUploader";

interface Document {
  id: number;
  title: string;
  date: string;
  imageId: "1" | "2"; // Changed from image string to specific type
}

const RightSidebar = () => {
  const { theme } = useTheme();
  const themeClasses = getThemeClasses(theme);

  // Sample document data with simplified image references
  const sampleDocuments: Document[] = [
    {
      id: 1,
      title: "Project Report",
      date: "2024-02-05",
      imageId: "1",
    },
    { id: 2, title: "Business Proposal", date: "2024-02-07", imageId: "2" },
    { id: 3, title: "Technical Specs", date: "2024-01-15", imageId: "1" },
    { id: 4, title: "Meeting Notes", date: "2024-01-20", imageId: "2" },
    { id: 5, title: "Research Paper", date: "2024-02-08", imageId: "1" },
    { id: 6, title: "Financial Report", date: "2024-01-10", imageId: "2" },
  ];

  const themeHoverClasses = {
    light: {
      hover: "hover:bg-gray-200",
      text: "text-black",
      icon: "text-gray-600",
      sidebarText: "text-gray-700",
      loadingBg: "bg-gray-100",
    },
    dark: {
      hover: "hover:bg-gray-800",
      text: "text-white",
      icon: "text-gray-300",
      sidebarText: "text-gray-300",
      loadingBg: "bg-gray-800",
    },
    ocean: {
      hover: "hover:bg-blue-900/50",
      text: "text-blue-100",
      icon: "text-blue-200",
      sidebarText: "text-blue-200",
      loadingBg: "bg-blue-900/20",
    },
    forest: {
      hover: "hover:bg-green-900/50",
      text: "text-green-100",
      icon: "text-green-200",
      sidebarText: "text-green-200",
      loadingBg: "bg-green-900/20",
    },
    sunset: {
      hover: "hover:bg-orange-900/50",
      text: "text-orange-100",
      icon: "text-orange-200",
      sidebarText: "text-orange-200",
      loadingBg: "bg-orange-900/20",
    },
  };

  const currentThemeClasses =
    themeHoverClasses[theme] || themeHoverClasses.dark;

  // Filter documents for last 7 and 30 days
  const now = new Date();
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const recentDocs = sampleDocuments.filter(
    (doc) => new Date(doc.date) >= last7Days
  );
  const olderDocs = sampleDocuments.filter((doc) => {
    const docDate = new Date(doc.date);
    return docDate < last7Days && docDate >= last30Days;
  });

  const renderDocuments = (docs: Document[]) => {
    return docs.map((doc) => (
      <div
        key={doc.id}
        className={`px-4 py-3 ${currentThemeClasses.hover} ${currentThemeClasses.text} rounded cursor-pointer flex items-center gap-3`}
      >
        <div className="w-6 h-6 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
          {/* Using public path for images */}
          <img
            src={`/${doc.imageId}.png`}
            alt={doc.title}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-sm truncate">{doc.title}</span>
      </div>
    ));
  };

  return (
    <div
      className={`fixed right-0 top-0 min-h-screen w-64 ${themeClasses.background} ${currentThemeClasses.text} overflow-hidden`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <Settings className={`w-6 h-6 ${currentThemeClasses.icon}`} />
          <div className="flex gap-4">
            <Search className={`w-6 h-6 ${currentThemeClasses.icon}`} />
            <Share2 className={`w-6 h-6 ${currentThemeClasses.icon}`} />
          </div>
        </div>

        <nav className="space-y-4">
          <div
            className={`flex items-center gap-3 px-4 py-3 ${currentThemeClasses.hover} rounded cursor-pointer`}
          >
            <Grid className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Supernova PDF</span>
          </div>

          <div className="mt-4 px-3 py-2">
            <PDFUploader />
          </div>

          <div className="mt-6">
            <h3
              className={`px-4 text-xs font-medium ${currentThemeClasses.sidebarText} mb-2`}
            >
              Previous 7 Days
            </h3>
            <div className="space-y-1">{renderDocuments(recentDocs)}</div>
          </div>

          <div className="mt-6">
            <h3
              className={`px-4 text-xs font-medium ${currentThemeClasses.sidebarText} mb-2`}
            >
              Previous 30 Days
            </h3>
            <div className="space-y-1">{renderDocuments(olderDocs)}</div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default RightSidebar;
