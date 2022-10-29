import styles from "@/styles/usage.module.scss";
// import { Radio, RadioGroup } from "@/components/forms/radio-group";
import { TextField } from "@/components/forms/textfield";
import { ComboBox } from "@/components/forms/combobox";
import { Item } from "react-stately";
import { Controller } from "react-hook-form";
import { useZodForm } from "../../../hooks/useZodForm";
import { trpc } from "@/utils/trpc";
import { validationSchema } from "@/schemas/usage";
import { NextPageWithLayout } from "@/pages/_app";
import { ReactElement, useState } from "react";
import { useUsageStore } from "@/stores/usage";
import Button from "@/components/button";
import MapLayout from "@/layouts/map";
import UsageLayout from "@/layouts/usage";
import Header from "@/components/header";
import Head from "next/head";
import { FaInfoCircle } from "react-icons/fa";
import { useRouter } from "next/router";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { usePropertyStore } from "@/stores/property";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import FormGroup from "@mui/material/FormGroup";
import Slider from "@mui/material/Slider";

function formatValuePercent(value: any) {
  return value + "%";
}

function formatValueDollar(value: any) {
  return "$" + value;
}

interface ErrorDialogProps extends DialogProps {}
const ErrorDialog = ({ open, onClose }: ErrorDialogProps) => (
  <Dialog
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    open={open}
    onClose={onClose}
  >
    <DialogTitle id="alert-dialog-title">
      {"Renters not yet supported"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        Unfortunately, we are only catering to home and business owners at this
        time. We encourage you to{" "}
        <a
          href="https://sunanddone.com/refer"
          target="_blank"
          rel="noreferrer"
          className="text-orange italic"
        >
          refer an eligible friend or family member
        </a>{" "}
        to earn $500.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose as any}>Close</Button>
    </DialogActions>
  </Dialog>
);

const Usage: NextPageWithLayout = () => {
  const methods = useZodForm({
    schema: validationSchema,
    mode: "onChange",
    defaultValues: {
      propertyType: "RESIDENTIAL",
      calculationType: "estimation",
    },
  });
  const { id: address, rate } = usePropertyStore();

  const utils = trpc.useContext();

  function renderEstimation() {
    return (
      <FormGroup>
        <FormLabel component="legend">Estimated monthly bill</FormLabel>
        <Controller
          name="estimation"
          control={methods.control}
          defaultValue={500}
          render={({ field }) => (
            <Slider
              {...field}
              step={10}
              marks
              min={10}
              max={1000}
              aria-label="Estimated monthly bill"
              getAriaValueText={formatValueDollar}
              valueLabelFormat={formatValueDollar}
              valueLabelDisplay="auto"
            />
          )}
        />
      </FormGroup>
      // <Slider
      //   label="Estimated monthly bill"
      //   minValue={0}
      //   maxValue={500}
      //   control={methods.control}
      //   name="estimation"
      //   step={10}
      // />
    );
  }

  function renderBillPeriod() {
    methods.resetField("estimation");
    return (
      <FormControl>
        <FormLabel id="period">
          My bill shows my last 12 months of usage
        </FormLabel>
        <Controller
          name="period"
          control={methods.control}
          render={({ field }) => (
            <RadioGroup {...field} aria-labelledby="period" row>
              <FormControlLabel
                value="annual"
                control={<Radio />}
                label="Yes"
              />
              <FormControlLabel
                value="monthly"
                control={<Radio />}
                label="No"
              />
            </RadioGroup>
          )}
        />
      </FormControl>
    );
  }

  function renderMonthlyUsage() {
    methods.resetField("annualUsage");
    return (
      <>
        <div>
          <TextField
            label="Monthly usage"
            unit="kwH"
            {...methods.register("monthlyUsage", {
              valueAsNumber: true,
            })}
          />
          <div className={styles.help}>
            <FaInfoCircle />
            Where can I find this on my bill?
          </div>
        </div>
        <ComboBox
          label="Month"
          {...methods.register("month", {
            valueAsNumber: true,
          })}
        >
          <Item key="1">January</Item>
          <Item key="2">February</Item>
          <Item key="3">March</Item>
          <Item key="4">April</Item>
          <Item key="5">May</Item>
          <Item key="6">June</Item>
          <Item key="7">July</Item>
          <Item key="8">August</Item>
          <Item key="9">September</Item>
          <Item key="10">October</Item>
          <Item key="11">November</Item>
          <Item key="12">December</Item>
        </ComboBox>
      </>
    );
  }

  function renderAnnualUsage() {
    methods.resetField("monthlyUsage");
    methods.resetField("month");
    return (
      <div>
        <TextField
          label="Annual usage"
          unit="kwH"
          {...methods.register("annualUsage", {
            valueAsNumber: true,
          })}
        />
        <div className={styles.help}>
          <FaInfoCircle />
          Where can I find this on my bill?
        </div>
      </div>
    );
  }

  const watchCalculationType = methods.watch("calculationType");
  const watchAnnualUsage = methods.watch("period");
  const watchPropertyType = methods.watch("propertyType");

  const router = useRouter();
  const { setUsage } = useUsageStore();

  const [dialog, setDialog] = useState(false);

  const handleSubmit = methods.handleSubmit(
    ({ annualUsage, monthlyUsage, estimation, propertyType }) => {
      if (annualUsage) {
        monthlyUsage = Math.round(annualUsage / 12);
      }
      if (estimation) {
        monthlyUsage = estimation / (rate!.residential! as unknown as number);
      }
      setUsage({
        monthlyUsage: monthlyUsage!,
        propertyType: propertyType!,
      });
      router.push({ pathname: "/quote" });
    }
  );

  return (
    <div className={styles.wrapper}>
      <ErrorDialog open={dialog} onClose={() => setDialog(false)} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-8 text-left">
        <FormControl>
          <FormLabel id="propertyType">This property is my</FormLabel>
          <Controller
            name="propertyType"
            control={methods.control}
            render={({ field }) => (
              <RadioGroup {...field} aria-labelledby="propertyType" row>
                <FormControlLabel
                  value="RESIDENTIAL"
                  control={<Radio />}
                  label="Home"
                />
                <FormControlLabel
                  value="RENTAL"
                  control={<Radio />}
                  label="Rental"
                  onClick={() => setDialog(true)}
                />
                <FormControlLabel
                  value="COMMERCIAL"
                  control={<Radio />}
                  label="Business"
                />
              </RadioGroup>
            )}
          />
        </FormControl>
        <FormControl>
          <FormLabel id="calculationType">
            I have a copy of my utility bill with me
          </FormLabel>
          <Controller
            name="calculationType"
            control={methods.control}
            render={({ field }) => (
              <RadioGroup {...field} aria-labelledby="calculationType" row>
                <FormControlLabel
                  value="bill"
                  control={<Radio />}
                  label="Yes"
                />
                <FormControlLabel
                  value="estimation"
                  control={<Radio />}
                  label="No"
                />
              </RadioGroup>
            )}
          />
        </FormControl>
        <>
          {watchCalculationType === "bill" && renderBillPeriod()}
          {watchCalculationType === "estimation" && renderEstimation()}
          {watchAnnualUsage === "annual" && renderAnnualUsage()}
          {watchAnnualUsage === "monthly" && renderMonthlyUsage()}
        </>
        <div>
          <Button onClick={handleSubmit} secondary>
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

Usage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <style>
          {`
          body {
          background: var(--color-primary);
          }
        `}
        </style>
      </Head>
      <Header sticky />
      <UsageLayout>
        <MapLayout>{page}</MapLayout>
      </UsageLayout>
    </>
  );
};

export default Usage;
