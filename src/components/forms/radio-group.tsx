import React, { forwardRef, ReactNode } from "react";
import styles from "@/styles/radio-group.module.scss";

import {
  useFocusRing,
  VisuallyHidden,
  useRadioGroup,
  useRadio,
  AriaRadioProps,
  AriaRadioGroupProps,
} from "react-aria";
import { RadioGroupState, useRadioGroupState } from "react-stately";
import { chain, mergeProps, useObjectRef } from "@react-aria/utils";
import { useController, UseControllerProps } from "react-hook-form";

interface RadioProps extends UseControllerProps, AriaRadioProps {}

// export const Radio = ({ control, name, ...otherProps }: RadioProps) => {
//   const {
//     field: { onChange, onBlur, value, ref },
//     // fieldState: { invalid, isTouched, isDirty },
//     // formState: { touchedFields, dirtyFields }
//   } = useController({
//     name,
//     control,
//     rules: { required: true },
//     defaultValue: "",
//   });
//
//   return (
//     <ControlledRadio
//       onChange={onChange}
//       onBlur={onBlur}
//       value={value}
//       name={name}
//       inputRef={ref}
//       {...otherProps}
//     />
//   );
// };
//
//

interface RadioGroupProps
  extends Omit<AriaRadioGroupProps, "name" | "defaultValue">,
    UseControllerProps {
  children: React.ReactNode;
}

export function RadioGroup(props: RadioGroupProps) {
  let { children, control, name, defaultValue } = props;
  const {
    field: { onChange, onBlur, value, ref },
    // fieldState: { invalid, isTouched, isDirty },
    // formState: { touchedFields, dirtyFields }
  } = useController({
    name,
    control,
    rules: { required: true },
    defaultValue,
  });
  return (
    <ControlledRadioGroup {...props} onChange={onChange} onBlur={onBlur}>
      {children}
    </ControlledRadioGroup>
  );
}

interface ControlledRadioGroupProps extends AriaRadioGroupProps {
  children: React.ReactNode;
  onBlur: () => void;
}

export function ControlledRadioGroup(props: ControlledRadioGroupProps) {
  let { children, label, onChange, onBlur } = props;
  let state = useRadioGroupState(props);
  let { radioGroupProps, labelProps } = useRadioGroup(props, state);

  return (
    <div {...radioGroupProps} className={styles.container}>
      <span {...labelProps}>{label}</span>
      <div className={styles.group}>
        {React.Children.map<ReactNode, ReactNode>(children, (child) =>
          React.isValidElement(child)
            ? //@ts-ignore
              React.cloneElement(child, { state, onChange, onBlur })
            : child
        )}
      </div>
    </div>
  );
}

interface ControlledRadioProps extends AriaRadioProps {
  children: React.ReactNode;
  label?: string;
  state?: RadioGroupState;
  onChange?: (e: any) => void;
}

export const Radio = React.forwardRef<HTMLInputElement, ControlledRadioProps>(
  (props, forwardedRef) => {
    let { children, onChange, onBlur } = props;
    const { state } = props;
    let ref = useObjectRef(forwardedRef);
    let { inputProps, isSelected, isDisabled } = useRadio(props, state!, ref);
    let { isFocusVisible, focusProps } = useFocusRing();
    let strokeWidth = isSelected ? 6 : 2;

    return (
      <label
        style={{
          display: "flex",
          alignItems: "center",
          opacity: isDisabled ? 0.4 : 1,
        }}
      >
        <VisuallyHidden>
          <input
            ref={ref}
            {...mergeProps(focusProps, inputProps)}
            onChange={chain(onChange, inputProps.onChange)}
            onBlur={chain(onBlur, inputProps.onBlur)}
          />
        </VisuallyHidden>
        <svg
          width={24}
          height={24}
          aria-hidden="true"
          style={{ marginRight: 4 }}
        >
          <circle
            cx={12}
            cy={12}
            r={8 - strokeWidth / 2}
            fill="none"
            stroke={isSelected ? "orange" : "gray"}
            strokeWidth={strokeWidth}
          />
          {isFocusVisible && (
            <circle
              cx={12}
              cy={12}
              r={11}
              fill="none"
              stroke="orange"
              strokeWidth={2}
            />
          )}
        </svg>
        {children}
      </label>
    );
  }
);

Radio.displayName = "Radio";
