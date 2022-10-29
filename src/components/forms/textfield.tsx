import { useObjectRef } from "@react-aria/utils";
import React from "react";
import { AriaTextFieldProps, useTextField } from "react-aria";

interface TextFieldProps extends AriaTextFieldProps {
  unit?: string;
  onChange?: (e: any) => void;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (props: TextFieldProps, forwardedRef) => {
    let { label, onChange, onBlur, name } = props;

    const ref = useObjectRef(forwardedRef);

    // let ref = React.useRef<HTMLInputElement>(null);
    let { labelProps, inputProps, descriptionProps, errorMessageProps } =
      useTextField(props, ref);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 200,
          color: "#6c7d8c",
        }}
      >
        <label {...labelProps}>{label}</label>
        <div style={{ display: "inline-flex" }}>
          <input
            {...inputProps}
            style={{
              width: "100%",
              border: "0.5px solid #6c7d8c",
              borderRight: "none",
              padding: "8px",
            }}
            {...{ onChange, onBlur, name, ref }}
          />
          {props.unit && (
            <div
              style={{
                border: "0.5px solid #6c7d8c",
                borderLeft: "none",
                padding: "0 8px",
                color: "#000",
                display: "flex",
                alignItems: "center",
              }}
            >
              {props.unit}
            </div>
          )}
        </div>
        {props.description && (
          <div {...descriptionProps} style={{ fontSize: 12 }}>
            {props.description}
          </div>
        )}
        {props.errorMessage && (
          <div {...errorMessageProps} style={{ color: "red", fontSize: 12 }}>
            {props.errorMessage}
          </div>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";
