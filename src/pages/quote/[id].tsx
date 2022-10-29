import Header from "@/components/header";
import { usePropertyStore } from "@/stores/property";
import { inferMutationOutput, trpc } from "@/utils/trpc";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";
import { NextPageWithLayout } from "../_app";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import TabList from "@mui/lab/TabList";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import cx from "classnames";
import { useUsageStore } from "@/stores/usage";
import { useFilterStore } from "@/stores/filter";
import { FaHome, FaSolarPanel } from "react-icons/fa";
import Map from "@/components/map";
import { SolarPower } from "@mui/icons-material";
import { GrSolaris } from "react-icons/gr";
import Button from "@/components/button";

type Quote = inferMutationOutput<"quote.public.create">[0];

const SingleQuotePage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const { propertyType, monthlyUsage } = useUsageStore();
  const { filter } = useFilterStore();
  const { id: address } = usePropertyStore();
  const utils = trpc.useContext();
  const data = utils.getInfiniteQueryData([
    "quote.public.infiniteQuotes",
    {
      limit: 10,
      address,
      bill: { propertyType, monthlyUsage },
      filters: filter,
    },
  ]);
  const quote = data?.pages
    .map((page) => {
      return page.quotes.find((item) => item.id === id);
    })
    .filter((val) => val !== undefined)[0];

  const [tabItem, setTabItem] = useState("1");
  if (!quote) {
    router.push("/quote");
    return <></>;
  }
  const handleTabChange = (event: React.SyntheticEvent, value: string) => {
    setTabItem(value);
  };
  return (
    <div className="max-w-7xl mx-auto bg-slate-50">
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={tabItem}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleTabChange}
              aria-label="lab API tabs example"
            >
              <Tab label="Overview" value="1" />
              <Tab label="Cost & Savings" value="2" />
              <Tab label="Equipment" value="3" />
              <Tab label="Installer" value="4" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <div
              className="bg-slate-100 p-5 text-2xl font-bold"
              style={{ margin: "0 -24px" }}
            >
              {quote.quote.address.street}
              <br />
              {quote.quote.address.city}, {quote.quote.address.state}
            </div>
            <div className="flex flex-col gap-7 my-5">
              <div className="flex justify-between">
                <div>Energy Needs Met</div>
                <div>{quote.actualOffset * 100}%</div>
              </div>
              <div className="flex justify-between">
                <div>Production</div>
                <div></div>
              </div>
              <div className="flex justify-between">
                <div>Size</div>
                <div>{quote.size} kW</div>
              </div>
              <div className="flex justify-between">
                <div># of Panels</div>
                <div>{quote.panelCount}</div>
              </div>
              <div className="flex justify-between">
                <div>Panel Model</div>
                <div>
                  {quote.panel.manufacturer} {quote.panel.model}
                </div>
              </div>
              <div className="flex justify-between">
                <div>Inverter</div>
                <div>TODO</div>
              </div>
              <div className="flex justify-between">
                <div>Installer</div>
                <div>{quote.installer.name}</div>
              </div>
            </div>
            <div className="flex items-center justify-between border-b-4 py-3">
              <div className="flex items-end gap-4">
                <FaHome className="text-6xl" />
                <h2 className="text-xl leading-6">
                  Added <br /> Home Value
                </h2>
              </div>
              <span className="text-3xl">
                {parseInt(quote.addedHomeValue).toLocaleString("en-US", {
                  style: "currency",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                  currency: "USD",
                })}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-1/2">
                <h3 className="text-4xl py-4">Savings</h3>
              </div>
              <div className="relative aspect-video w-full sm:w-1/2 my-8 md:m-12">
                <Image
                  src={quote.panel.images[0]?.url ?? "/images/neighborhood.jpg"}
                  alt={quote.panel.name}
                  layout="fill"
                />
              </div>
            </div>
            <hr />
            <div>
              <h3 className="text-3xl py-4">Add-Ons</h3>
              <Map center={{ lat: 0, lng: 0 }} />
            </div>
            <hr />
            <div className="flex p-8 justify-between">
              <div className="relative aspect-video w-0 sm:w-1/4 sm:m-12">
                <Image
                  src={quote.installer.image}
                  alt={quote.installer.name}
                  layout="fill"
                />
              </div>
              <div className="w-full sm:w-96 flex flex-col gap-5">
                <div className="flex justify-between">
                  <div className="text-xl">Upfront Price</div>
                  <div className="text-xl font-bold">
                    ${quote.upfrontCost.toLocaleString()}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-xl">Tax Credit</div>
                  <div className="text-xl font-bold">
                    - ${quote.taxCredit.toLocaleString()}
                  </div>
                </div>
                <div className="flex justify-between mb-4">
                  <div className="text-xl">Discounts</div>
                  <div className="text-xl font-bold"></div>
                </div>
                <div className="flex justify-between">
                  <div className="text-2xl font-bold">Total</div>
                  <div className="text-xl font-bold">
                    ${quote.netCost.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel value="2">
            <table className="table-fixed text-right w-full">
              <thead className="bg-slate-300">
                <tr>
                  <th className="p-4"></th>
                  <th className="p-4">No Solar</th>
                  <th className="p-4">With Solar</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-slate-100 border-b-slate-200 border-b-2">
                  <td className="p-4">
                    Electric Bill
                    <br />
                    (Monthly)
                  </td>
                  <td className="p-4">${quote.monthlyBill.toLocaleString()}</td>
                  <td className="p-4">
                    ${quote.newMonthlyBill.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-slate-100">
                  <td className="p-4">
                    Electric Bill
                    <br />
                    (Annual)
                  </td>
                  <td className="p-4">
                    ${(quote.monthlyBill * 12).toLocaleString()}
                  </td>
                  <td className="p-4">
                    ${(quote.newMonthlyBill * 12).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
            <hr className="my-8 mx-6" />
            <h2 className="text-green text-2xl font-medium mb-6">
              Total Savings
            </h2>
            <div className="flex flex-col gap-5">
              {Object.keys(quote.savings.year).map((year) => (
                <div className="flex justify-between" key={year}>
                  <div className="text-xl">Year {year}</div>
                  <div className="text-xl">
                    {/*//@ts-ignore*/}$
                    {(quote.savings.year[year] as number).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center my-6 text-sm">
              Assumes 4% annual utility inflation (
              <a
                className="underline underline-offset-1"
                href="https://www.eia.gov/todayinenergy/detail.php?id=51438"
                target="_blank"
                rel="noreferrer"
              >
                Energy Information Administration, DOE
              </a>
              )
            </p>
            <hr className="my-8 mx-6" />
            <h2 className="text-2xl font-medium mb-6">
              Estimated Added Home Value
            </h2>
            <div>${quote.addedHomeValue.toLocaleString()}</div>
            <p className="text-center my-6 text-sm">
              Estimates based on Zillow data,
              <a
                className="underline underline-offset-1"
                href="https://www.nber.org/papers/w17200"
                target="_blank"
                rel="noreferrer"
              >
                collaborative research from National Bureau of Economic Research
              </a>
              , and{" "}
              <a
                className="underline underline-offset-1"
                href="https://newscenter.lbl.gov/2015/01/13/berkeley-lab-illuminates-price-premiums-u-s-solar-home-sales/"
                target="_blank"
                rel="noreferrer"
              >
                Berkeley Labs
              </a>
            </p>
          </TabPanel>
          <TabPanel value="3">
            <div className="">
              <div className="text-3xl mb-8">{quote.panel.name}</div>
              <div className="flex gap-16 flex-col md:flex-row md:mt-8">
                <div className="mb-8 order-2">
                  <p className="">
                    The {quote.panel.model} manufactured by{" "}
                    {quote.panel.manufacturer} is a {quote.panel.wattage} watt{" "}
                    {quote.panel.material} solar panel. The panel is
                    manufactured in{" "}
                    {quote.panel.countries
                      .map((country) => country.name)
                      .join(", ")}
                    . After 25 years, the expected output is{" "}
                    {(quote.panel.output25 as unknown as number) * 100}% of the
                    original output. The panel has {quote.panel.colors.cell}{" "}
                    cells, a {quote.panel.colors.frame} frame, and a{" "}
                    {quote.panel.colors.backsheet} backsheet.
                  </p>
                </div>
                <Panel {...quote.panel} className="order-1 flex-shrink-0" />
              </div>
            </div>
          </TabPanel>
          <TabPanel value="4">
            <div>
              <Installer {...quote.installer} />
              {/* <pre>{JSON.stringify(quote, null, 4)}</pre> */}
            </div>
          </TabPanel>
        </TabContext>
      </Box>
      <div className="p-8"></div>
    </div>
  );
};

export function ScrollableTabsButtonAuto() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: "background.paper" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        <Tab label="Item One" />
        <Tab label="Item Two" />
        <Tab label="Item Three" />
        <Tab label="Item Four" />
        <Tab label="Item Five" />
        <Tab label="Item Six" />
        <Tab label="Item Seven" />
      </Tabs>
    </Box>
  );
}

type Installer = Quote["installer"];
interface InstallerProps extends Installer {
  className?: string;
}

const Installer = ({
  name,
  image,
  warranty,
  founded,
  subcontract,
  solarinsure,
  className,
}: InstallerProps) => (
  <div className={className}>
    <div className="flex flex-col md:flex-row">
      {image && (
        <Image
          src={image}
          alt={"Product image of " + name + " solar panel"}
          width={200}
          height={200}
        />
      )}
      <div className="flex flex-col gap-4 md:ml-8 w-80">
        <div className="flex justify-between">
          <div>Name</div>
          <div>{name}</div>
        </div>
        <div className="flex justify-between">
          <div>Warranty</div>
          <div>{warranty} yr</div>
        </div>
        <div className="flex justify-between">
          <div>Founded</div>
          <div>{founded.toLocaleDateString()}</div>
        </div>
        <div className="flex justify-between">
          <div>Subcontract</div>
          <div>{subcontract ? "Yes" : "No"}</div>
        </div>
        <div className="flex justify-between">
          <div>Annual Degredation</div>
          <div>{solarinsure ? "Yes" : "No"}</div>
        </div>
      </div>
    </div>
  </div>
);

type Panel = Quote["panel"];

interface PanelProps extends Panel {
  className?: string;
}

const Panel = ({
  className,
  name,
  productImage,
  wattage,
  warranty,
  output25,
  degradation,
  efficiency,
  manufacturer,
}: PanelProps) => (
  <div className={cx(className)}>
    <div className="flex justify-center">
      {productImage && (
        <Image
          src={productImage}
          alt={"Product image of " + name + " solar panel"}
          width={230}
          height={300}
        />
      )}
      <div className="flex flex-col gap-4 md:ml-8 w-80">
        <div className="flex justify-between">
          <div>Manufacturer</div>
          <div>{manufacturer}</div>
        </div>
        <div className="flex justify-between">
          <div>Power</div>
          <div>{wattage} Watts</div>
        </div>
        <div className="flex justify-between">
          <div>Warranty</div>
          <div>{warranty} yr</div>
        </div>
        <div className="flex justify-between">
          <div>Output at Warranty End</div>
          <div>{(output25 as unknown as number) * 100}%</div>
        </div>
        <div className="flex justify-between">
          <div>Efficiency</div>
          <div>{(efficiency as unknown as number) * 100}%</div>
        </div>
        <div className="flex justify-between">
          <div>Annual Degredation</div>
          <div>{(degradation as unknown as number) * 100}%</div>
        </div>
      </div>
    </div>
  </div>
);

const ActionBar = () => (
  <div className="fixed bottom-0 left-0 w-full bg-slate-200 p-4 flex justify-between">
    <Button className="bg-slate-50 py-9">Request Proposal</Button>
    <Button>Free Consult</Button>
  </div>
);

SingleQuotePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Header sticky={true} />
      {page}
      <ActionBar />
    </>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default SingleQuotePage;
