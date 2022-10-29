import {
  PaginationState,
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";
import classNames from "classnames";
import { useMemo, useState } from "react";
import { GrFormSearch } from "react-icons/gr";
import { useDebounce } from "react-use";
import { Button, PageButton } from "../Button";
import { DOTS, useCustomPagination } from "../useCustomPagination";

export function GlobalFilter({ globalFilter, setGlobalFilter, placeholder }) {
  const [value, setValue] = useState(globalFilter);
  useDebounce(
    () => {
      setGlobalFilter(value || undefined);
    },
    300,
    [value, setGlobalFilter]
  );

  return (
    <span className="flex justify-between  pt-10 pb-10 ">
      <GrFormSearch
        fontSize={38}
        color="gray"
        className="absolute text-center text-gray-500 mt-3 ml-3 min-w-40"
      />
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className="w-8/12 rounded-xl border p-4 text-gray-500 cursor-pointer pl-12"
        type="search"
        placeholder={placeholder}
      />
    </span>
  );
}

export function StatusPill({ value }) {
  const status = value ? value : "unknown";

  return (
    <span
      className={classNames(
        "px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm",
        status.startsWith("Successful") ? "bg-green-100 text-green-700" : null,
        status.startsWith("Progressing")
          ? "bg-yellow-100 text-yellow-700"
          : null,
        status.startsWith("Failed") ? "bg-red-100 text-red-700" : null
      )}
    >
      {status}
    </span>
  );
}

export function AvatarCell({ value, column, row }) {
  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 h-10 w-10">
        <img
          className="h-10 w-10 rounded-full"
          src={row.original[column.imgAccessor]}
          alt=""
        />
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">
          {row.original[column.numAccessor]}
        </div>
      </div>
    </div>
  );
}

type TableProps<T, D> = {
  columns: ColumnDef<T>[];
  data: D;
};
const Table = ({ columns, data }: TableProps<any, any>) => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data,
    columns,
    // pageCount: dataQuery.data?.pageCount ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    // getPaginationRowModel: getPaginationRowModel(), // If only doing manual pagination, you don't need this
    debugTable: true,
  });
  const paginationRange = useCustomPagination({
    totalPageCount: table.getPageCount(),
    currentPage: pageIndex,
  });

  return (
    <div className="p-8 max-w-7xl m-auto">
      <GlobalFilter
        globalFilter={table.getState().globalFilter}
        setGlobalFilter={table.setGlobalFilter}
        placeholder={"Search"}
      />
      <div className="mt-2 flex flex-col">
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <th
                            key={header.id}
                            colSpan={header.colSpan}
                            className="px-6 py-5 text-left text-20 font-medium text-gray-400 uppercase rounded-sm tracking-wider"
                          >
                            {header.isPlaceholder ? null : (
                              <div>
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </div>
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td
                              key={cell.id}
                              className="px-6 py-10 whitespace-nowrap"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="py-3 flex items-center text-center justify-center pt-10">
        <div className="flex-1 flex justify-between md:hidden">
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        <div
          className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
          aria-label="Pagination"
        >
          <div
            className="relative z-0 inline-flex items-center ml-auto mr-auto rounded-md shadow-sm space-x-10"
            aria-label="Pagination"
          >
            {paginationRange?.map((pageNumber, index) => {
              if (pageNumber === DOTS) {
                return <PageButton key={index}>...</PageButton>;
              }

              if (pageNumber - 1 === pageIndex) {
                return (
                  <PageButton
                    key={index}
                    className=" active:bg-gray-500 active:border-gray-300"
                    onClick={() => table.setPageIndex(pageNumber - 1)}
                  >
                    {pageNumber}
                  </PageButton>
                );
              }

              return (
                <PageButton
                  key={index}
                  className="active:bg-gray-500 active:border-gray-300"
                  onClick={() => table.setPageIndex(pageNumber - 1)}
                >
                  {pageNumber}
                </PageButton>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
