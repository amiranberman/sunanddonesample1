import LongMenu from "@/components/tables/panels/menu";
import Table from "@/components/tables/panels/table";
import { useAppStore } from "@/stores/app";
import { inferQueryOutput, trpc } from "@/utils/trpc";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import type { NextPage } from "next";
import { useMemo } from "react";

type Panel = inferQueryOutput<"panels.public.get">[0];
const columnHelper = createColumnHelper<Panel>();

const Panels: NextPage = () => {
  const { headerHeight } = useAppStore();
  const columns = useMemo<ColumnDef<Panel>[]>(
    () => [
      columnHelper.accessor("manufacturer", {
        header: "Manufacturer",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor("model", {
        header: "Model",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor("wattage", {
        header: "Wattage",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        enableGlobalFilter: false,
      }),
      columnHelper.accessor("efficiency", {
        header: "Efficiency",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        enableGlobalFilter: false,
      }),
      columnHelper.accessor("warranty", {
        header: "Warranty",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        enableGlobalFilter: false,
      }),
      columnHelper.display({
        id: "actions",
        cell: (props) => <LongMenu id={props.row.original.id} />,
      }),
    ],
    []
  );
  const query = trpc.useQuery(["panels.public.get"]);
  return (
    <div style={{ marginTop: `${headerHeight}px` }}>
      <Table columns={columns} data={query.data ?? []} />
    </div>
  );
};

export default Panels;
