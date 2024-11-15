import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase"; // Import your Firestore database configuration

const TitleDateInput = () => {
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
      // Add to Firestore
      await addDoc(collection(db, "events"), {
        title,
        date: date.toISOString(), // Store date as ISO string for easy conversion
      });

      alert("Event saved successfully!");
      setTitle("");
      setDate(null);
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
