import React, { useEffect } from "react";
import {
  Box,
  TextField,
  Checkbox,
  Typography,
  MenuItem,
  FormControl,
  Select,
  Button,
} from "@mui/material";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  smallInput: {
    "& .MuiInputBase-root": {
      height: "30px !important",
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
          defaultValue={structuredClone(defaultValue)}
          onChange={onChange}
          fullWidth
          slotProps={{ htmlInput: { step: stepValue } }}
        />
      </Box>
    </Box>
  );
};

export const CustomCheckBox = ({
  name,
  onChange,
  defaultValue,
  isDynamic = true,
}) => {
  const classes = useStyles();
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      sx={{ width: "100%", height: "30px" }}
    >
      <Box className={classes.labelContainer}>
        <Typography className={classes.label}>{name}</Typography>
      </Box>
      <Box
        className={classes.labelContainer}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        {isDynamic ? (
          <Checkbox onChange={onChange} checked={defaultValue} />
        ) : (
          <Checkbox onChange={onChange} defaultChecked={defaultValue} />
        )}
      </Box>
    </Box>
  );
};

export const CustomSelect = ({ name, onChange, defaultValue, options }) => {
  const classes = useStyles();
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      sx={{ width: "100%", height: "30px", zIndex: 100 }}
    >
      <Box className={classes.labelContainer}>
        <Typography className={classes.label}>{name}</Typography>
      </Box>
      <Box
        className={classes.labelContainer}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <TextField
          className={classes.smallInput}
          select
          value={defaultValue}
          onChange={onChange}
          fullWidth
        >
          {options.map(
            (option) =>
              option && (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={{ fontSize: "12px" }}
                >
                  {option.label}
                </MenuItem>
              )
          )}
        </TextField>
      </Box>
    </Box>
  );
};

export const CustomCheckboxDropdown = ({
  name,
  selectedItems,
  setSelectedItems,
  items,
}) => {
  const classes = useStyles();

  const handleChange = (event) => {
    const value = event.target.value;
    console.log("value: ", value);
    setSelectedItems(value);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      sx={{ width: "100%", height: "30px" }}
    >
      <Box className={classes.labelContainer}>
        <Typography className={classes.label}>{name}</Typography>
      </Box>
      <Box
        className={classes.labelContainer}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <FormControl fullWidth>
          <Select
            className={classes.smallInput}
            sx={{ height: "30px", fontSize: "14px" }}
            multiple
            value={selectedItems}
            onChange={handleChange}
            renderValue={(selected) => `${selected.length} selected`}
          >
            <MenuItem key={"Select All"} value={"Select All"}>
              <Button variant="contained" onClick={() => {}} fullWidth>
                Select All
              </Button>
            </MenuItem>
            <MenuItem key={"Deselect All"} value={"Deselect All"}>
              <Button variant="contained" onClick={() => {}} fullWidth>
                Deselect All
              </Button>
            </MenuItem>
            {items.map((item) => (
              <MenuItem key={item} value={item}>
                <CustomCheckBox
                  name={item.title ? item.title : item}
                  onChange={() => {}}
                  defaultValufe={selectedItems.indexOf(item) > -1}
                  isDynamic={true}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};
