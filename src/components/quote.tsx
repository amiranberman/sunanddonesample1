import React from "react";
import Rating from "@mui/material/Rating";
import { useToggle } from "react-use";
import Image from "next/image";
import { inferMutationOutput } from "@/utils/trpc";
import CheckedIcon from "@/assets/checked.svg";
import UncheckedIcon from "@/assets/unchecked.svg";
import SolarPanel from "@/assets/solarpanel.svg";
import { useRouter } from "next/router";
import { SolarPowerRounded } from "@mui/icons-material";

type Quote = inferMutationOutput<"quote.public.create">[0];

interface Props extends Quote {}

const Quote = ({
  quote: {},
  actualSize,
  panelCount,
  panel,
  quote,
  installer,
  lifetimeSavings,
  netCost,
  inverterCount,
  paybackPeriod,
  actualOffset,
}: Props) => {
  const [expanded, toggleExpanded] = useToggle(false);
  const [expandedPanel, toggleExpandedPanel] = useToggle(false);
  const [favorite, toggleFavorite] = useToggle(false);
  const router = useRouter();

  function handleFavorite() {
    toggleFavorite();
  }

  function handleSelect() {
    router.push("/quote/" + quote.product.id);
  }
  return (
    <div
      className="rounded-lg bg-slate-50 select-none shadow-md hover:shadow-xl transition-all max-w-3xl relative flex flex-col lg:flex-row cursor-pointer"
      onClick={handleSelect}
    >
      <div className="p-4 relative h-52 flex flex-col justify-between lg:w-72 flex-shrink-0">
        <div className="w-full h-full bg-black opacity-60 absolute z-10 top-0 left-0 rounded-t-lg lg:rounded-l-lg lg:rounded-r-none"></div>
        <div className="text-white z-10 relative text-2xl flex justify-between items-start">
          <div className="drop-shadow-md bg-slate-400 bg-opacity-40 backdrop-blur-sm px-4 py-2 rounded-md">
            <div className="relative z-10 text-white drop-shadow-md text-base">
              <span className="text-2xl">
                {(actualOffset * 100).toFixed(0)}%
              </span>
              <br />
              energy needs met
            </div>
          </div>
          <div
            onClick={handleFavorite}
            className="cursor-pointer bg-white rounded-full p-1"
          >
            {favorite ? (
              <CheckedIcon className="w-8 h-8" />
            ) : (
              <UncheckedIcon className="w-8 h-8" />
            )}
          </div>
        </div>
        <div
          className="inline-flex gap-1 px-2 py-1 items-center text-white drop-shadow-md relative z-10 text-lg bg-slate-50 bg-opacity-20 backdrop-blur-sm"
          style={{ margin: "-1rem" }}
        >
          <SolarPanel className="fill-white w-12 h-12" />
          {panel.manufacturer} {panel.wattage} W
        </div>
        <Image
          className="rounded-t-lg z-0 lg:rounded-l-lg lg:rounded-r-none"
          src={panel.images[0]?.url || "/images/neighborhood.jpg"}
          alt={panel.name + " solar panel mounted on a roof"}
          layout="fill"
        />
      </div>
      <div className="flex justify-between p-4 items-center w-full lg:items-start">
        <div className="flex gap-4 flex-col">
          <div className="flex items-baseline flex-col">
            <div className="flex items-center mb-1">{installer.name}</div>
            <div>
              <div
                className="flex items-center justify-between"
                style={{ marginLeft: "-0.25rem" }}
              >
                <Rating readOnly defaultValue={5} precision={0.5} />
              </div>
              <div className="flex items-center text-xs">27 Reviews</div>
              <div className="bg-black text-white text-sm px-6 py-0.5 mt-2 rounded-full">
                Top Installer
              </div>
            </div>
          </div>
          <div className="hidden items-baseline flex-col lg:flex">
            <div className="flex items-center mb-1">{installer.name}</div>
            <div>
              <div
                className="flex items-center justify-between"
                style={{ marginLeft: "-0.25rem" }}
              >
                <Rating readOnly defaultValue={5} precision={0.5} />
              </div>
              <div className="flex items-center text-xs">38 Reviews</div>
            </div>
          </div>
        </div>
        <div className="cursor-pointer text-white bg-green flex px-4 py-2 rounded-lg items-center">
          <div className="drop-shadow-md text-xl">
            ${netCost.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

interface BoxProps {
  value: any;
  label: string;
}

const Box = ({ value, label }: BoxProps) => (
  <div className="flex bg-slate-100 gap-2 p-3 rounded-md">
    <div>
      <div className="p-2 bg-slate-300 w-14 inline-flex items-center justify-center rounded-sm">
        {value}
      </div>{" "}
      {label}
    </div>
  </div>
);

export default Quote;
