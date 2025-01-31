import React, { useState } from "react";
import { TextField, Tooltip, Zoom } from "@mui/material";

const CommonTextField = ({
  label = "",
  onChange,
  variant = "filled",
  error = null,
  isTextUpperCase = true,
  ...props
}) => {
  const [textFieldValue, setTextFieldValue] = useState("");

  const handleChange = (event) => {
    const newValue = event.target.value;
    setTextFieldValue(newValue);
    onChange(newValue);
  };

  const handleBlur = () => {
    if (isTextUpperCase && textFieldValue) {
      const uppercaseValue = textFieldValue.toUpperCase();
      setTextFieldValue(uppercaseValue);
      onChange(uppercaseValue);
    }
  };

  return (
    <Tooltip
      title={label}
      arrow
      TransitionComponent={Zoom}
      placement="top-start"
    >
      <span>
        <TextField
          label={label || ""}
          value={textFieldValue}
          variant={variant as "standard" | "filled" | "outlined"}
          onChange={handleChange}
          onBlur={handleBlur}
          inputProps={{
            style: { textTransform: isTextUpperCase ? "uppercase" : "none" },
          }}
          error={!!error}
          helperText={error ? error.message : ""}
          {...props}
        />
      </span>
    </Tooltip>
  );
};

export default CommonTextField;
