import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomeView = ({ data, users }) => {
  const navigate = useNavigate();

  return (
    <Container style={{ height: "100vh", overflow: "auto" }}>
      <List>
        {data &&
          Object.keys(data).map((userId) => (
            <ListItem
              button
              key={userId}
              onClick={() => navigate(`/user/${userId}`)}
            >
              <ListItemText primary={users[userId].name} />
            </ListItem>
          ))}
      </List>
    </Container>
  );
};

export default HomeView;
