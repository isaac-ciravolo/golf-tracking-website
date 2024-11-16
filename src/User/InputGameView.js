import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { addGame, fetchGames } from "../DatabaseFunctions";

const TitleDateInput = ({ userId }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title || !date) {
      alert("Please fill out both the title and date.");
      return;
    }

    try {
      const res = await addGame(userId, {
        createdDate: new Date().getTime() / 1000,
        title: title,
        holes: [],
        gameDate: date.unix(),
      });

      if (res === "Success!") {
        setTitle("");
        setDate(null);
      } else {
        console.error("Error saving document:", res);
        alert("Error saving event. Please try again.");
      }
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Error saving event. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            value={date}
            onChange={(newDate) => setDate(newDate)}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" required />
            )}
          />
        </LocalizationProvider>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ margin: "10px" }}
        >
          Save Event
        </Button>
      </form>
    </div>
  );
};

export default TitleDateInput;
