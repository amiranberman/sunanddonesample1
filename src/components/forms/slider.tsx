import { SliderState, useSliderState } from "react-stately";
import classnames from "classnames";
import styles from "@/styles/slider.module.scss";

import {
  AriaSliderProps,
  AriaSliderThumbOptions,
  mergeProps,
  useFocusRing,
  useNumberFormatter,
  useSlider,
  useSliderThumb,
  VisuallyHidden,
} from "react-aria";
import React from "react";
import { useObjectRef } from "@react-aria/utils";
import { useController, UseControllerProps } from "react-hook-form";

interface SliderProps
  extends Omit<UseControllerProps, "defaultValue">,
    AriaSliderProps {
  label?: string;
}

export const Slider = ({ control, name, ...otherProps }: SliderProps) => {
  const {
    field: { onChange, onBlur, value, ref },
    // fieldState: { invalid, isTouched, isDirty },
    // formState: { touchedFields, dirtyFields }
  } = useController({
    name,
    control,
    rules: { required: true },
    defaultValue: "",
  });

  return (
    <ControlledSlider
      onChange={(value: number[]) => onChange(value[0])}
      value={[value]}
      name={name}
      ref={ref}
      {...otherProps}
    />
  );
};

interface ControlledSliderProps
  extends AriaSliderProps,
    Omit<UseControllerProps, "defaultValue"> {
  formatOptions?: Intl.NumberFormatOptions;
  onChange?: (e: any) => void;
}

export const ControlledSlider = React.forwardRef<
  HTMLInputElement,
  ControlledSliderProps
>((props, forwardedRef) => {
  let trackRef = React.useRef(null);
  const ref = useObjectRef(forwardedRef);
  let numberFormatter = useNumberFormatter(props.formatOptions);
  let state = useSliderState({ ...props, numberFormatter });
  let { groupProps, trackProps, labelProps, outputProps } = useSlider(
    props,
    state,
    ref
  );
  const { onChange, name, label } = props;

  return (
    <div
      {...groupProps}
      className={classnames(styles.slider, styles[state.orientation])}
    >
      {/* Create a container for the label and output element. */}
      {props.label && (
        <div className={classnames(styles["label-container"])}>
          <label {...labelProps}>{label}</label>
          <output {...outputProps}>{state.getThumbValueLabel(0)}</output>
        </div>
      )}
      {/* The track element holds the visible track line and the thumb. */}
      <div
        {...trackProps}
        ref={trackRef}
        className={classnames(styles.track, {
          [styles.disabled as string]: state.isDisabled,
        })}
      >
        <Thumb
          index={0}
          state={state}
          ref={ref}
          inputRef={ref}
          trackRef={trackRef}
          {...{ onChange, name }}
        />
      </div>
    </div>
  );
});

ControlledSlider.displayName = "ControlledSlider";

interface ThumbProps extends AriaSliderThumbOptions {
  state: SliderState;
  onChange?: (e: any) => void;
  name: string;
}

export const Thumb = React.forwardRef<HTMLInputElement, ThumbProps>(
  (props, forwardedRef) => {
    let { state, trackRef, inputRef: _, index, ...registerProps } = props;
    let inputRef = useObjectRef(forwardedRef);
    let { thumbProps, inputProps, isDragging } = useSliderThumb(
      {
        index,
        trackRef,
        inputRef,
      },
      state
    );
    let { focusProps, isFocusVisible } = useFocusRing();
    return (
      <div
        {...thumbProps}
        className={classnames(styles.thumb, {
          [styles.focus as string]: isFocusVisible,
          [styles.dragging as string]: isDragging,
        })}
      >
        <VisuallyHidden>
          <input
            ref={inputRef}
            {...mergeProps(inputProps, focusProps)}
            {...registerProps}
          />
        </VisuallyHidden>
      </div>
    );
  }
);

Thumb.displayName = "Thumb";
