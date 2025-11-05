import React from "react";
import {
  PageInfo,
  PageInput,
  PageSizeSelect,
  PaginationButton,
  PaginationControls,
  PaginationGroup,
  PaginationWrapper,
  RowCount,
  StyledTable,
  TableScrollContainer,
  TableWrapper,
  Tbody,
  Td,
  Th,
  Thead,
} from "./styled";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  initialPageSize?: number;
}

export function Table<T>({
  data,
  columns,
  initialPageSize = 5,
}: TableProps<T>) {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [pageInputValue, setPageInputValue] = React.useState("1");

  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  React.useEffect(() => {
    setPageInputValue(String(table.getState().pagination.pageIndex + 1));
  }, [table.getState().pagination.pageIndex]);

  return (
    <TableWrapper>
      <TableScrollContainer>
        <StyledTable>
          <caption
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              padding: 0,
              margin: "-1px",
              overflow: "hidden",
              clip: "rect(0,0,0,0)",
              whiteSpace: "nowrap",
              borderWidth: 0,
            }}
          >
            Orders list showing {table.getRowCount()} total orders
          </caption>

          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id} scope="col">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </Th>
                ))}
              </tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </tr>
            ))}
          </Tbody>
        </StyledTable>
      </TableScrollContainer>
      <PaginationWrapper>
        <PaginationControls>
          <PaginationGroup>
            <PaginationButton
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Go to first page"
            >
              {"<<"}
            </PaginationButton>
            <PaginationButton
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Go to previous page"
            >
              {"<"}
            </PaginationButton>
            <PaginationButton
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Go to next page"
            >
              {">"}
            </PaginationButton>
            <PaginationButton
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Go to last page"
            >
              {">>"}
            </PaginationButton>
            <PageInfo>
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount().toLocaleString()}
              </strong>
            </PageInfo>
          </PaginationGroup>
          <PaginationGroup>
            <PageInfo>
              Go to page:
              <PageInput
                type="number"
                min="1"
                max={table.getPageCount()}
                value={pageInputValue}
                onChange={(e) => {
                  setPageInputValue(e.target.value);
                }}
                onBlur={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  const maxPage = table.getPageCount() - 1;
                  const validPage = Math.max(0, Math.min(page, maxPage));
                  table.setPageIndex(validPage);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const page = e.currentTarget.value
                      ? Number(e.currentTarget.value) - 1
                      : 0;
                    const maxPage = table.getPageCount() - 1;
                    const validPage = Math.max(0, Math.min(page, maxPage));
                    table.setPageIndex(validPage);
                  }
                }}
                aria-label="Jump to page number"
              />
            </PageInfo>
            <PageSizeSelect
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              aria-label="Select number of rows per page"
            >
              {[5, 10, 15, 20, 25].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </PageSizeSelect>
          </PaginationGroup>
        </PaginationControls>
      </PaginationWrapper>

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          left: "-10000px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}, showing {table.getRowModel().rows.length} of{" "}
        {table.getRowCount()} rows
      </div>

      <RowCount>
        Showing {table.getRowModel().rows.length.toLocaleString()} of{" "}
        {table.getRowCount().toLocaleString()} Rows
      </RowCount>
    </TableWrapper>
  );
}
