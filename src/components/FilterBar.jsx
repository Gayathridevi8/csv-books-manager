import React from "react";
import { Search, Filter, X } from "lucide-react";

export const FilterBar = ({
  filters,
  onFilterChange,
  onClearFilters,
  totalCount,
  filteredCount,
  modifiedCount,
}) => {
  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="ml-auto flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filters.title}
              onChange={(e) => onFilterChange("title", e.target.value)}
              placeholder="Search titles..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Author
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filters.author}
              onChange={(e) => onFilterChange("author", e.target.value)}
              placeholder="Search authors..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Genre
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filters.genre}
              onChange={(e) => onFilterChange("genre", e.target.value)}
              placeholder="Search genres..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <input
            type="number"
            value={filters.year}
            onChange={(e) => onFilterChange("year", e.target.value)}
            placeholder="e.g. 2020"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <span>
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredCount.toLocaleString()}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">
            {totalCount.toLocaleString()}
          </span>{" "}
          records
        </span>
        {modifiedCount > 0 && (
          <span className="text-amber-600">
            <span className="font-semibold">
              {modifiedCount.toLocaleString()}
            </span>{" "}
            modified
          </span>
        )}
      </div>
    </div>
  );
};
