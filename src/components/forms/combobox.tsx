import { DismissButton, useOverlay } from "@react-aria/overlays";
import { FocusScope } from "@react-aria/focus";
import React, { RefObject } from "react";
import { useButton } from "@react-aria/button";
import { useComboBox } from "@react-aria/combobox";
import { useComboBoxState } from "@react-stately/combobox";
import { useFilter } from "@react-aria/i18n";
import { AriaListBoxOptions, useListBox, useOption } from "@react-aria/listbox";
import { ComboBoxStateOptions } from "react-stately";

// interface ComboBoxProps extends (Partial<AriaComboBoxOptions<{}>> & Pick<AriaComboBoxOptions<{}>, "listRef">) {}
interface ComboBoxProps extends ComboBoxStateOptions<{}> {}

export function ComboBox(props: ComboBoxProps) {
  // Setup filter function and state.
  let { contains } = useFilter({ sensitivity: "base" });
  let state = useComboBoxState({ ...props, defaultFilter: contains });

  // Setup refs and get props for child elements.
  let buttonRef = React.useRef(null);
  let inputRef = React.useRef(null);
  let listBoxRef = React.useRef(null);
  let popoverRef = React.useRef(null);

  let {
    buttonProps: triggerProps,
    inputProps,
    listBoxProps,
    labelProps,
  } = useComboBox(
    {
      ...props,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef,
    },
    state
  );

  // Call useButton to get props for the button element. Alternatively, you can
  // pass the triggerProps to a separate Button component using useButton
  // that you might already have in your component library.
  let { buttonProps } = useButton(triggerProps, buttonRef);

  return (
    <div style={{ display: "inline-flex", flexDirection: "column" }}>
      <label {...labelProps}>{props.label}</label>
      <div style={{ position: "relative", display: "inline-block" }}>
        <div style={{ display: "inline-flex" }}>
          <input
            {...inputProps}
            ref={inputRef}
            style={{
              height: 24,
              boxSizing: "border-box",
              marginRight: 0,
              fontSize: 16,
            }}
          />
          <button
            {...buttonProps}
            ref={buttonRef}
            style={{
              height: 24,
              marginLeft: 0,
            }}
          >
            <span aria-hidden="true" style={{ padding: "0 2px" }}>
              ▼
            </span>
          </button>
        </div>
        {state.isOpen && (
          <Popover
            popoverRef={popoverRef}
            isOpen={state.isOpen}
            onClose={state.close}
          >
            <ListBox {...listBoxProps} listBoxRef={listBoxRef} state={state} />
          </Popover>
        )}
      </div>
    </div>
  );
}

interface PopoverProps {
  popoverRef: RefObject<HTMLDivElement>;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

function Popover(props: PopoverProps) {
  let ref = React.useRef(null);
  let { popoverRef = ref, isOpen, onClose, children } = props;

  // Handle events that should cause the popup to close,
  // e.g. blur, clicking outside, or pressing the escape key.
  let { overlayProps } = useOverlay(
    {
      isOpen,
      onClose,
      shouldCloseOnBlur: true,
      isDismissable: true,
    },
    popoverRef
  );

  // Add a hidden <DismissButton> component at the end of the popover
  // to allow screen reader users to dismiss the popup easily.
  return (
    <FocusScope restoreFocus>
      <div
        {...overlayProps}
        ref={popoverRef}
        style={{
          position: "absolute",
          width: "100%",
          border: "1px solid gray",
          background: "lightgray",
          marginTop: 4,
        }}
      >
        {children}
        <DismissButton onDismiss={onClose} />
      </div>
    </FocusScope>
  );
}

interface ListBoxProps extends AriaListBoxOptions<{}> {
  listBoxRef: RefObject<HTMLUListElement>;
  state: any;
}

function ListBox(props: ListBoxProps) {
  let ref = React.useRef(null);
  let { listBoxRef = ref, state } = props;
  let { listBoxProps } = useListBox(props, state, listBoxRef);

  return (
    <ul
      {...listBoxProps}
      ref={listBoxRef}
      style={{
        margin: 0,
        padding: 0,
        listStyle: "none",
        maxHeight: "150px",
        overflow: "auto",
      }}
    >
      {[...state.collection].map((item) => (
        <Option key={item.key} item={item} state={state} />
      ))}
    </ul>
  );
}

interface OptionProps {
  state: any;
  item: any;
}

function Option({ item, state }: OptionProps) {
  let ref = React.useRef(null);
  let { optionProps, isSelected, isFocused, isDisabled } = useOption(
    { key: item.key },
    state,
    ref
  );

  let backgroundColor;
  let color = "black";

  if (isSelected) {
    backgroundColor = "blueviolet";
    color = "white";
  } else if (isFocused) {
    backgroundColor = "gray";
  } else if (isDisabled) {
    backgroundColor = "transparent";
    color = "gray";
  }

  return (
    <li
      {...optionProps}
      ref={ref}
      style={{
        background: backgroundColor,
        color: color,
        padding: "2px 5px",
        outline: "none",
        cursor: "pointer",
      }}
    >
      {item.rendered}
    </li>
  );
}
