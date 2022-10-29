import classNames from "classnames";
import usePlacesAutocomplete, { Suggestion } from "use-places-autocomplete";
import styles from "@/styles/autocomplete.module.scss";

interface Props {
  onChange?: (value: Suggestion) => void;
  placeholder?: string;
  children?: React.ReactNode;
}

const AutocompleteAddress: React.FC<Props> = ({
  onChange,
  children,
  placeholder = "Enter an address",
}) => {
  const {
    ready,
    value,
    suggestions: { status, data: suggestions },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {},
    debounce: 300,
  });

  const handleInput = (e: any) => {
    setValue(e.target.value);
  };

  const handleSelect = (suggestion: Suggestion) => () => {
    const { description } = suggestion;
    setValue(description, false);
    if (onChange) onChange(suggestion);
    clearSuggestions();
  };

  const className = classNames(styles.container, {
    [styles.focused as string]: status === "OK",
  });

  return (
    <div className={className}>
      <input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder={placeholder}
      />
      {status === "OK" && (
        <Suggestions suggestions={suggestions} onClick={handleSelect} />
      )}
      {children}
    </div>
  );
};

export interface SuggestionProps {
  suggestions: Suggestion[];
  onClick: (suggestion: Suggestion) => () => void;
}

export const Suggestions = ({ suggestions, onClick }: SuggestionProps) => {
  const renderSuggestions = suggestions.map((suggestion) => {
    const {
      place_id,
      structured_formatting: { main_text, secondary_text },
    } = suggestion;

    return (
      <li key={place_id} onClick={onClick(suggestion)}>
        <strong>{main_text}</strong> <small>{secondary_text}</small>
      </li>
    );
  });

  return <ul>{renderSuggestions}</ul>;
};

export default AutocompleteAddress;
