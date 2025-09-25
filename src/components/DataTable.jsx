import React, { useState } from "react";
import { ChevronUp, ChevronDown, Edit3, Check, X } from "lucide-react";

export const DataTable = ({
  books,
  onUpdateBook,
  currentPage,
  itemsPerPage,
  onPageChange,
  sortField,
  sortDirection,
  onSort,
}) => {
  const [editingCell, setEditingCell] = useState(null);

  const totalPages = Math.ceil(books.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = books.slice(startIndex, endIndex);

  const handleCellClick = (bookId, field, currentValue) => {
    if (field === "id" || field === "isModified" || field === "originalData")
      return;

    setEditingCell({
      bookId,
      field,
      value: String(currentValue),
    });
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;

    const value =
      editingCell.field === "publishedYear"
        ? parseInt(editingCell.value) || 0
        : editingCell.value;

    onUpdateBook(editingCell.bookId, editingCell.field, value);
    setEditingCell(null);
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 hover:text-blue-600 transition-colors"
    >
      {children}
      {sortField === field &&
        (sortDirection === "asc" ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        ))}
    </button>
  );

  const renderCell = (book, field) => {
    const value = book[field];
    const isEditing =
      editingCell?.bookId === book.id && editingCell?.field === field;
    const isModified =
      book.isModified &&
      book.originalData &&
      book.originalData[field] !== value;

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <input
            type={field === "publishedYear" ? "number" : "text"}
            value={editingCell.value}
            onChange={(e) =>
              setEditingCell({ ...editingCell, value: e.target.value })
            }
            onKeyDown={handleKeyPress}
            className="flex-1 px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
          <button
            onClick={handleSaveEdit}
            className="p-1 text-green-600 hover:text-green-700"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancelEdit}
            className="p-1 text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div
        onClick={() => handleCellClick(book.id, field, value)}
        className={`
          cursor-pointer hover:bg-gray-50 rounded px-2 py-1 min-h-[2rem] flex items-center
          ${isModified ? "bg-amber-50 border border-amber-200" : ""}
        `}
      >
        <span className="flex-1">{String(value)}</span>
        {field !== "id" &&
          field !== "isModified" &&
          field !== "originalData" && (
            <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
      </div>
    );
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No books match your current filters.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="title">Title</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="author">Author</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="genre">Genre</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="publishedYear">Year</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ISBN
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentBooks.map((book) => (
              <tr
                key={book.id}
                className={`group hover:bg-gray-50 ${
                  book.isModified ? "bg-amber-25" : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs">
                  {renderCell(book, "title")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs">
                  {renderCell(book, "author")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {renderCell(book, "genre")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {renderCell(book, "publishedYear")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {renderCell(book, "isbn")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, books.length)} of{" "}
              {books.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const maxVisiblePages = Math.min(5, totalPages);
                  let startPage = Math.max(
                    1,
                    currentPage - Math.floor(maxVisiblePages / 2)
                  );
                  let endPage = Math.min(
                    totalPages,
                    startPage + maxVisiblePages - 1
                  );

                  if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                  }

                  const pageNum = startPage + i;
                  if (pageNum > endPage) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        pageNum === currentPage
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
