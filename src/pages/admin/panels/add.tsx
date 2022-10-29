import { useAppStore } from "@/stores/app";
import { inferQueryOutput, trpc } from "@/utils/trpc";
import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import type { NextPage } from "next";
import Button from "@/components/button";
import { useZodForm } from "@/utils/useZodForm";
import { SolarPanelModel } from "@/prisma/solarpanel";
import { useState } from "react";
import { Controller } from "react-hook-form";

type Panel = inferQueryOutput<"panels.public.get">[0];

const panelDefaultValues = {
  model: "",
  wattage: "",
  efficiency: "",
  rating: "",
  degradation: "",
  output25: "",
  warranty: "",
  material: "",
  manufacturer: "",
  energySageLink: "",
};

const Add: NextPage = () => {
  const panels = trpc.useQuery(["panels.public.get"]);
  const installers = trpc.useQuery(["installers.public.get"]);
  const [disabled, setDisabled] = useState(false);
  const { headerHeight } = useAppStore();
  const methods = useZodForm({
    schema: SolarPanelModel,
    defaultValues: panelDefaultValues,
  });
  const energySageLink = methods.watch("energySageLink");
  const energysage = trpc.useQuery(
    ["panels.private.getFromEnergysage", { url: energySageLink }],
    {
      onSuccess: (data) => {
        methods.reset(data);
      },
    }
  );
  const handleSubmit = methods.handleSubmit((values: any) => {
    console.log(values);
  });
  const handleEnergySage = () => {
    energysage.refetch();
  };

  return (
    <div style={{ marginTop: `${headerHeight}px` }}>
      <form onSubmit={handleSubmit} className="pt-12 max-w-6xl mx-auto">
        <Autocomplete
          disablePortal
          options={panels.data ? panels.data : []}
          getOptionLabel={(option) => `${option.manufacturer} ${option.model}`}
          loading={panels.isLoading}
          sx={{ width: 300 }}
          onChange={(_, value, reason) => {
            if (value) {
              setDisabled(true);
              methods.reset(value);
            }
            if (reason === "clear") {
              setDisabled(false);
              methods.reset({});
              methods.reset();
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Solar Panel" />
          )}
        />

        <Autocomplete
          disablePortal
          options={installers.data ? installers.data : []}
          getOptionLabel={(option) => option.name}
          loading={installers.isLoading}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Installer" />}
        />
        <div className="flex gap-4 flex-wrap my-8">
          <Controller
            control={methods.control}
            name="energySageLink"
            render={({ field }) => (
              <TextField
                label="Energy Sage Link"
                disabled={disabled}
                {...field}
              />
            )}
          />
          {/* <Button onClick={handleEnergySage}>Load</Button> */}
          <Controller
            control={methods.control}
            name="model"
            render={({ field }) => (
              <TextField label="Model" disabled={disabled} {...field} />
            )}
          />
          <Controller
            control={methods.control}
            name="wattage"
            render={({ field }) => (
              <TextField
                label="Wattage"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">W</InputAdornment>
                  ),
                }}
                disabled={disabled}
                {...field}
              />
            )}
          />
          <Controller
            control={methods.control}
            name="efficiency"
            render={({ field }) => (
              <TextField label="Efficiency" disabled={disabled} {...field} />
            )}
          />
          <Controller
            control={methods.control}
            name="rating"
            render={({ field }) => (
              <TextField label="Rating" disabled={disabled} {...field} />
            )}
          />
          <Controller
            control={methods.control}
            name="degradation"
            render={({ field }) => (
              <TextField label="Degradation" disabled={disabled} {...field} />
            )}
          />
          <Controller
            control={methods.control}
            name="output25"
            render={({ field }) => (
              <TextField label="Output 25" disabled={disabled} {...field} />
            )}
          />
          <Controller
            control={methods.control}
            name="warranty"
            render={({ field }) => (
              <TextField label="Warranty" disabled={disabled} {...field} />
            )}
          />
          <Controller
            control={methods.control}
            name="material"
            render={({ field }) => (
              <TextField label="Material" disabled={disabled} {...field} />
            )}
          />
          <Controller
            control={methods.control}
            name="manufacturer"
            render={({ field }) => (
              <TextField label="Manufacturer" disabled={disabled} {...field} />
            )}
          />
        </div>
        <button type="submit">sub</button>
        <Button onClick={handleSubmit}>Submit</Button>
      </form>
    </div>
  );
};

export default Add;
