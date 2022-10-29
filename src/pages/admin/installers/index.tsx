import LongMenu from "@/components/tables/panels/menu";
import Table from "@/components/tables/panels/table";
import { useAppStore } from "@/stores/app";
import { inferQueryOutput, trpc } from "@/utils/trpc";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import type { NextPage } from "next";
import Image from "next/image";
import { useMemo } from "react";

type Installer = inferQueryOutput<"installers.public.get">[0];
const columnHelper = createColumnHelper<Installer>();

const Installers: NextPage = () => {
  const { headerHeight } = useAppStore();
  const columns = useMemo<ColumnDef<Installer>[]>(
    () => [
      columnHelper.accessor("image", {
        id: (props) => props.getValue().id,
        header: "",
        width: 100,
        cell: (props) => (
          <Image
            src={props.getValue()}
            alt="Manufacturer Logo"
            width="80"
            height="80"
          />
        ),
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor("", {
        header: "Name",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
      columnHelper.display({
        id: "actions",
        cell: (props) => <LongMenu id={props.row.original.id} />,
      }),
    ],
    []
  );
  const query = trpc.useQuery(["installers.public.get"]);
  return (
    <div style={{ marginTop: `${headerHeight}px` }}>
      <Table columns={columns} data={query.data ?? []} />
    </div>
  );
};

export default Installers;
