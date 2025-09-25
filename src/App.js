import React, { useState, useMemo, useCallback } from "react";
import { Download, RotateCcw, BookOpen } from "lucide-react";
import { UploadZone } from "./components/UploadZone";
import { FilterBar } from "./components/FilterBar";
import { DataTable } from "./components/DataTable";
import { downloadCSV } from "./utils/csvUtils";

function App() {
  const [books, setBooks] = useState([]);
  const [originalBooks, setOriginalBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [filters, setFilters] = useState({
    title: "",
    author: "",
    genre: "",
    year: "",
  });

  const handleDataLoaded = useCallback((loadedBooks) => {
    setIsLoading(true);
    setTimeout(() => {
      setBooks(loadedBooks);
      setOriginalBooks([...loadedBooks]);
      setCurrentPage(1);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ title: "", author: "", genre: "", year: "" });
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback(
    (field) => {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
      setCurrentPage(1);
    },
    [sortField, sortDirection]
  );

  const handleUpdateBook = useCallback(
    (bookId, field, value) => {
      setBooks((prev) =>
        prev.map((book) => {
          if (book.id === bookId) {
            const originalBook = originalBooks.find(
              (orig) => orig.id === bookId
            );
            const updatedBook = { ...book, [field]: value };

            if (!book.originalData && originalBook) {
              updatedBook.originalData = { ...originalBook };
            }

            const isModified =
              originalBook &&
              Object.keys(originalBook).some((k) => {
                if (["id", "isModified", "originalData"].includes(k))
                  return false;
                return originalBook[k] !== updatedBook[k];
              });

            updatedBook.isModified = Boolean(isModified);

            return updatedBook;
          }
          return book;
        })
      );
    },
    [originalBooks]
  );

  const handleResetAll = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to reset all edits? This action cannot be undone."
      )
    ) {
      setBooks([...originalBooks]);
    }
  }, [originalBooks]);

  const handleDownload = useCallback(() => {
    downloadCSV(books, "edited-books.csv");
  }, [books]);

  const filteredAndSortedBooks = useMemo(() => {
    let filtered = books.filter((book) => {
      return (
        book.title.toLowerCase().includes(filters.title.toLowerCase()) &&
        book.author.toLowerCase().includes(filters.author.toLowerCase()) &&
        book.genre.toLowerCase().includes(filters.genre.toLowerCase()) &&
        (filters.year === "" ||
          book.publishedYear.toString().includes(filters.year))
      );
    });

    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === "string" && typeof bValue === "string") {
          const result = aValue.localeCompare(bValue);
          return sortDirection === "asc" ? result : -result;
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          const result = aValue - bValue;
          return sortDirection === "asc" ? result : -result;
        }

        return 0;
      });
    }

    return filtered;
  }, [books, filters, sortField, sortDirection]);

  const modifiedCount = useMemo(() => {
    return books.filter((book) => book.isModified).length;
  }, [books]);

  if (books.length === 0) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">
                CSV Book Manager
              </h1>
            </div>
          </div>

          <UploadZone onDataLoaded={handleDataLoaded} isLoading={isLoading} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-gray-400 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">
              CSV Book Manager
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetAll}
              disabled={modifiedCount === 0}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All Edits
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </button>
          </div>
        </div>

        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          totalCount={books.length}
          filteredCount={filteredAndSortedBooks.length}
          modifiedCount={modifiedCount}
        />

        <DataTable
          books={filteredAndSortedBooks}
          onUpdateBook={handleUpdateBook}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>
    </div>
  );
}

export default App;
