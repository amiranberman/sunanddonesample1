import React from "react";
import { usePropertyStore } from "@/stores/property";
import { inferMutationOutput, trpc } from "@/utils/trpc";
import cx from "classnames";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Slider,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useToggle } from "react-use";
import { FaFilter } from "react-icons/fa";
import { GrClose } from "react-icons/gr";
import { useUsageStore } from "@/stores/usage";
import { useAppStore } from "@/stores/app";
import { useFilterStore } from "@/stores/filter";

type Props = {
  style?: React.CSSProperties;
};

function formatValuePercent(value: any) {
  return value + "%";
}

function formatValueDollar(value: any) {
  return "$" + value;
}

const panelRanges = [[6, 10], [11, 15], [16, 20], [21, 25], [26]];

const QuoteFilter = (props: Props) => {
  const { id: address, rate } = usePropertyStore();
  const { propertyType, monthlyUsage, setUsage } = useUsageStore();
  const { unload } = useAppStore();
  const { setFilter, filter } = useFilterStore();
  const { control, reset, ...methods } = useForm({
    defaultValues: {
      monthlyBill: monthlyUsage * (rate!.residential as unknown as number),
      ...filter,
    },
  });
  const utils = trpc.useContext();
  const [open, toggle] = useToggle(false);
  const handleSubmit = methods.handleSubmit(({ monthlyBill, ...filter }) => {
    const monthlyUsage = monthlyBill / (rate!.residential as unknown as number);
    setUsage({
      monthlyUsage,
      propertyType,
    });
    setFilter(filter);
    utils.invalidateQueries("quote.public.infiniteQuotes");
  });

  return (
    <>
      <div
        className="flex items-center gap-1 justify-center bg-black w-24 rounded-full text-white p-3 drop-shadow-md absolute z-50 bottom-3 right-2 cursor-pointer md:hidden"
        onClick={toggle}
      >
        <FaFilter />
        <span>Filter</span>
      </div>
      <form
        className={cx(
          "absolute z-50 h-full bg-gray-100 p-4 w-full flex flex-col md:relative md:w-96 overflow-y-auto",
          { "hidden md:block": !open }
        )}
        style={props.style}
        onSubmit={handleSubmit}
      >
        <div className="flex items-center gap-4 mb-4 md:hidden">
          <div
            className="p-2 bg-red-200 w-8 cursor-pointer md:hidden"
            onClick={toggle}
          >
            <GrClose />
          </div>
          <span>Sort & Filter</span>
          <span className="ml-auto p-2 cursor-pointer" onClick={() => reset()}>
            Clear
          </span>
        </div>
        <hr className="md:hidden" />
        <FormControl
          sx={{ m: 3, display: "flex" }}
          component="fieldset"
          variant="standard"
        >
          <div className="flex items-center gap-2 justify-between">
            <FormLabel component="legend">Monthly Electric Bill</FormLabel>
            <FormLabel component="legend">
              ${methods.watch("monthlyBill")}
            </FormLabel>
          </div>
          <FormGroup>
            <Controller
              name="monthlyBill"
              control={control}
              render={({ field }) => (
                <Slider
                  {...field}
                  defaultValue={100}
                  step={10}
                  marks
                  min={10}
                  max={1000}
                  aria-label="Monthly Electric Bill"
                  getAriaValueText={formatValueDollar}
                  valueLabelFormat={formatValueDollar}
                  valueLabelDisplay="auto"
                />
              )}
            />
          </FormGroup>
        </FormControl>
        <hr />
        <FormControl
          sx={{ m: 3, display: "flex" }}
          component="fieldset"
          variant="standard"
        >
          <FormLabel component="legend">Quote Type</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox name="gilad" />}
              label="Finance"
            />
            <FormControlLabel
              control={<Checkbox name="jason" />}
              label="Cash"
            />
          </FormGroup>
        </FormControl>
        <hr />
        <FormControl
          sx={{ m: 3, display: "flex" }}
          component="fieldset"
          variant="standard"
        >
          <div className="flex items-center gap-2 justify-between">
            <FormLabel component="legend">Desired Offset</FormLabel>
            <FormLabel component="legend">
              {(methods.watch("desiredOffset")! * 100).toFixed(0)}%
            </FormLabel>
          </div>
          <FormGroup>
            <Controller
              name="desiredOffset"
              control={control}
              defaultValue={1}
              render={({ field }) => (
                <Slider
                  {...field}
                  step={0.1}
                  marks
                  min={0.1}
                  max={2}
                  aria-label="Desired Offset"
                  getAriaValueText={formatValuePercent}
                  valueLabelFormat={(value: any) =>
                    (value * 100).toFixed(0) + "%"
                  }
                  valueLabelDisplay="auto"
                />
              )}
            />
          </FormGroup>
        </FormControl>
        <div
          className="cursor-pointer text-white bg-orange inline-flex px-4 py-3 rounded-lg items-center text-center max-w-xs mx-auto self-center"
          onClick={handleSubmit}
        >
          Fetch Quotes
        </div>
        <hr />
        <FormControl
          sx={{ m: 3, display: "flex" }}
          component="fieldset"
          variant="standard"
        >
          <FormLabel component="legend">Inverter Type</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox name="gilad" />}
              label="Central Inverter"
            />
            <FormControlLabel
              control={<Checkbox name="jason" />}
              label="Micro Inverter"
            />
          </FormGroup>
        </FormControl>
        <hr />
        <div>
          <FormControl
            sx={{ m: 3, display: "flex" }}
            component="fieldset"
            variant="standard"
          >
            <FormLabel component="legend">Panel Count</FormLabel>
            <FormGroup>
              <Controller
                name="panelCount"
                control={control}
                defaultValue={[]}
                render={({ field }) =>
                  //@ts-ignore
                  panelRanges.map((range) => (
                    <FormControlLabel
                      {...field}
                      key={range[0]}
                      label={`${range[0]}${range[1] ? " - " + range[1] : "+"}`}
                      control={
                        <Checkbox
                          onChange={() => {
                            if (!field.value!.includes(range)) {
                              field.onChange([...field.value!, range]);
                              return;
                            }
                            const newRanges = field.value!.filter(
                              (item: any) => range !== item
                            );
                            field.onChange(newRanges);
                          }}
                        />
                      }
                    />
                  ))
                }
              />
            </FormGroup>
          </FormControl>
        </div>
        <hr />
        <FormControl
          sx={{ m: 3, display: "flex" }}
          component="fieldset"
          variant="standard"
        >
          <FormLabel component="legend">Installer Rating</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox name="gilad" />}
              label="4.5+"
            />
            <FormControlLabel
              control={<Checkbox name="jason" />}
              label="4.0+"
            />
          </FormGroup>
        </FormControl>
      </form>
    </>
  );
};

export default QuoteFilter;
