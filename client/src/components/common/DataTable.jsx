import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsUpDown, FolderOpen } from 'lucide-react';
import { TableSkeleton } from './Loader';

export const DataTable = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No records found matching your criteria',
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  sortField,
  sortOrder,
  onSort,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  className={`px-5 py-3.5 ${col.className || ''}`}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                >
                  <div
                    className={`flex items-center gap-1.5 ${
                      col.sortable ? 'cursor-pointer select-none hover:text-slate-800' : ''
                    }`}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-normal">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <TableSkeleton rows={5} cols={columns.length} />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <FolderOpen className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, rowIdx) => (
                <tr
                  key={item._id || item.id || rowIdx}
                  className="hover:bg-slate-50/75 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key || colIdx}
                      className={`px-5 py-4 ${col.className || ''}`}
                    >
                      {col.render ? col.render(item, rowIdx) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 bg-white px-5 py-3.5 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-700">{data.length}</span> of{' '}
            <span className="font-semibold text-slate-700">{totalItems}</span> results
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-medium text-slate-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
