import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type Submission = {
  id: string;
  createdAt: string;
  data: any;
};

type SubmissionsResponse = {
  submissions: Submission[];
  totalCount: number;
  totalPages: number;
};

const columnHelper = createColumnHelper<Submission>();

export default function SubmissionsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  
  const { data, isLoading, isError } = useQuery<SubmissionsResponse>({
    queryKey: ["submissions", page, limit, sortOrder],
    queryFn: async () => {
      const res = await axios.get(
        "https://matbook-backend-1.onrender.com/api/submissions",
        { params: { page, limit, sortOrder } }
      );
      return res.data;
    },
  });

 
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("createdAt", {
      header: () => (
        <button
          className="font-semibold"
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
        >
          Created At {sortOrder === "asc" ? "▲" : "▼"}
        </button>
      ),
      cell: (info) => new Date(info.getValue()).toLocaleString(),
    }),

    columnHelper.accessor("data", {
      header: "View",
      cell: () => <button className="text-blue-600">View</button>,
    }),
  ];

  const table = useReactTable({
    data: data?.submissions || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p>Loading submissions...</p>;
  if (isError) return <p>Error loading submissions</p>;

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4">Submissions</h2>

     
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          Total submissions: <strong>{data?.totalCount}</strong>
        </p>

        <select
          className="border p-2 rounded"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
        >
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n} per page
            </option>
          ))}
        </select>
      </div>

      <table className="min-w-full border">
        <thead>
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th key={header.id} className="border px-2 py-1">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border px-2 py-1">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

   
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>

        <p className="text-sm">
          Page {page} of {data?.totalPages}
        </p>

        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === data?.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
