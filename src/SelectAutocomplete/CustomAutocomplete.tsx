import * as React from "react";
import { forwardRef } from "react";
import {
  Autocomplete,
  CircularProgress,
  TextField,
  TextFieldVariants,
  Tooltip,
  Zoom,
} from "@mui/material";
import find from "lodash/find";
import i18next from 'i18next';
import en from './i18n/en';
import ms from './i18n/ms';
import { useTranslation } from "react-i18next";

i18next.addResourceBundle('en', 'Autocomplete', en);
i18next.addResourceBundle('ms', 'Autocomplete', ms);

type CommonAutocompleteProps = {
  label: string;
  isTooltipShow?: boolean;
  variant?: TextFieldVariants;
  onChange: (newValue: string) => void;
  options: (string | { id: string | number; label: string })[];
  error?: string;
  required?: boolean;
  isSmall?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
  isUpperCase?: boolean;
  getListboxProps?: any;
  ref?: React.Ref<HTMLElement>;
};
type AdditionalProps = {
  [key: string]: any;
};

type CustomAutocompleteProps = CommonAutocompleteProps & AdditionalProps;
const CustomAutocomplete: React.FC<CustomAutocompleteProps> = (
  (
    {
      label,
      isTooltipShow = true,
      variant = "filled",
      onChange,
      loading = false,
      options = [],
      error = "",
      required = false,
      value,
      isSmall = false,
      style = {},
      isUpperCase = true,
      getListboxProps = {},
      ref,
      ...props
    }: CustomAutocompleteProps,
  ) => {
    const { t } = useTranslation('Autocomplete');

    options = options || [];
    let selectedValues = value;
    if (options.length > 0 && typeof options[0] === "object") {
      selectedValues = find(options, (option: any) => option.id == value);
    }

    const handleOnChange = (event, selectedOption) => {
      if (selectedOption) {
        selectedOption =
          typeof selectedOption === "object"
            ? { ...selectedOption, label: selectedOption.label }
            : selectedOption;
      }
      onChange(selectedOption);
    };

    return (
      <Tooltip
        title={isTooltipShow ? label : ""}
        arrow
        TransitionComponent={Zoom}
        placement="top-start"
      >
        <span>
          <Autocomplete
            {...props}
            onChange={handleOnChange}
            options={options}
            getOptionLabel={(option: any) =>
              isUpperCase
                ? option?.label?.toUpperCase() || option?.toUpperCase()
                : option?.label || option
            }
            ref={ref}
            defaultValue={selectedValues}
            value={selectedValues || null}
            renderOption={(props, option) => (
              <li {...props} key={option.id || option.label || option}>
                {option.label || option}
              </li>
            )}
            ListboxProps={{
              onScroll: getListboxProps.onScroll,  // Attach the scroll event to the listbox
            }}
            loading={loading}
            loadingText={t("LOADING")}
            noOptionsText={!loading ? t("NO_OPTION_AVAILABLE") : ''}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                required={required}
                size={isSmall ? "small" : "medium"}
                variant={variant}
                error={!!error}
                helperText={error}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? (
                        <CircularProgress color="primary" size={15} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                  sx: style,
                }}
              />
            )}
          />
        </span>
      </Tooltip>
    );
  }
);

export default CustomAutocomplete;
