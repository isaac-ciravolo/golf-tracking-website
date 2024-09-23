import React from "react";
import { Box, TextField, Checkbox, Typography, MenuItem } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  smallInput: {
    "& .MuiInputBase-root": {
      height: "30px",
      padding: "1px 1px",
      fontSize: "14px",
    },
    "& input": {
      height: "22px",
    },
  },
  label: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "0.75rem !important",
  },
  labelContainer: {
    flex: "1 1 0",
    minWidth: 0,
  },
});

export const CustomNumberInput = ({
  name,
  onChange,
  defaultValue,
  stepValue = 1,
}) => {
  const classes = useStyles();
  return (
    <Box display="flex" alignItems="center" gap={2} sx={{ height: "30px" }}>
      <Box className={classes.labelContainer}>
        <Typography className={classes.label}>{name}</Typography>
      </Box>
      <Box className={classes.labelContainer}>
        <TextField
          className={classes.smallInput}
          type="number"
          value={defaultValue}
          onChange={onChange}
          fullWidth
          slotProps={{ htmlInput: { step: stepValue } }}
        />
      </Box>
    </Box>
  );
};

export const CustomCheckBox = ({ name, onChange, defaultValue }) => {
  const classes = useStyles();
  return (
    <Box display="flex" alignItems="center" gap={2} sx={{ height: "30px" }}>
      <Box className={classes.labelContainer}>
        <Typography className={classes.label}>{name}</Typography>
      </Box>
      <Box
        className={classes.labelContainer}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Checkbox onChange={onChange} checked={defaultValue} />
      </Box>
    </Box>
  );
};

export const CustomSelect = ({ name, onChange, defaultValue, options }) => {
  const classes = useStyles();
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography fontWeight="bold" textAlign={"left"} sx={{ width: "150px" }}>
        {name}
      </Typography>
      <TextField
        className={classes.smallInput}
        select
        defaultValue={defaultValue}
        onChange={onChange}
        sx={{ width: "500px" }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{ fontSize: "12px" }}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};
