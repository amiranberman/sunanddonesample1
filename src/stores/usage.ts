// import { calculationTypeSchema, propertyTypeSchema } from "@/schemas/usage";
// import { z } from "zod";
import { Prisma } from "@prisma/client";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";

// type Step<T> = {
//   name: string;
//   data: T;
// };
//
// type Steps = [
//   Step<z.infer<typeof propertyTypeSchema>>,
//   Step<z.infer<typeof calculationTypeSchema>>
// ];
//
// export const useUsageStore = create<{
//   step: (num?: number) => Steps[number];
//   steps: Steps;
//   activeStep: number;
//   hasPreviousStep: boolean;
//   hasNextStep: boolean;
//   nextStep: () => void;
//   previousStep: () => void;
//   submitStep: (data: Steps[number]["data"]) => void;
// }>()(
//   devtools((set, get) => ({
//     activeStep: 1,
//     steps: [
//       { name: "Property", data: { propertyType: "home" } },
//       { name: "Calculation", data: { calculationType: "bill" } },
//     ],
//     hasPreviousStep: false,
//     hasNextStep: true,
//     step: (num) =>
//       num ? get().steps[num - 1]! : get().steps[get().activeStep - 1]!,
//
//     submitStep: (data) =>
//       set((state) => {
//         const tempSteps = state.steps;
//         tempSteps[state.activeStep - 1]!.data = data;
//         console.log(tempSteps, data);
//         return {
//           steps: tempSteps,
//         };
//       }),
//     nextStep: () =>
//       set((state) => {
//         const activeStep = Math.min(state.steps.length, state.activeStep + 1);
//         return {
//           activeStep,
//           hasNextStep: activeStep !== state.steps.length,
//           hasPreviousStep: activeStep !== 1,
//         };
//       }),
//     previousStep: () =>
//       set((state) => {
//         const activeStep = Math.max(1, state.activeStep - 1);
//         return {
//           activeStep,
//           hasNextStep: activeStep !== state.steps.length,
//           hasPreviousStep: activeStep !== 1,
//         };
//       }),
//   }))
// );
//

interface UsageState extends Prisma.BillCreateInput {
  setUsage: (usage: Prisma.BillCreateInput) => void;
}

export const useUsageStore = create<UsageState>()(
  devtools(
    persist(
      (set) => ({
        propertyType: "RESIDENTIAL",
        monthlyUsage: 100,
        setUsage: (usage) => set(() => usage),
      }),
      { name: "usage-storage" }
    )
  )
);
