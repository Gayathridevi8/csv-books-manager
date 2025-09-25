import React, { useCallback } from "react";
import { Upload, FileText } from "lucide-react";
import { parseCSV } from "../utils/csvUtils";

export const UploadZone = ({ onDataLoaded, isLoading }) => {
  const handleFileUpload = useCallback(
    (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target?.result;
        try {
          const books = parseCSV(csvText);
          onDataLoaded(books);
        } catch (error) {
          console.error("Error parsing CSV:", error);
          alert("Error parsing CSV file. Please check the format.");
        }
      };
      reader.readAsText(file);
    },
    [onDataLoaded]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      const csvFile = files.find(
        (file) => file.type === "text/csv" || file.name.endsWith(".csv")
      );

      if (csvFile) {
        handleFileUpload(csvFile);
      } else {
        alert("Please upload a CSV file.");
      }
    },
    [handleFileUpload]
  );

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
      <div className="text-center">
       

        <div>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50"
          >
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Upload CSV File
              </p>

              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Select CSV File
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Expected CSV format: Title, Author, Genre, PublishedYear, ISBN</p>
        </div>
      </div>
    </div>
  );
};
