import { AppBar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Header({ showLogOut, logOut }) {
  return (
    <AppBar
      sx={{
        zIndex: 1000,
        height: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link
        to="/"
        style={{ textDecoration: "none", color: "inherit" }} // Remove underline and keep text color
      >
        <Typography variant="h4" fontWeight={"bold"}>
          The Weather Report
        </Typography>
      </Link>
      <Typography>Hows The Weather?</Typography>
      {showLogOut && (
        <Button
          sx={{
            position: "absolute",
            right: 10,
            backgroundColor: "gray",
          }}
          variant="contained"
          onClick={logOut}
        >
          Log Out
        </Button>
      )}
    </AppBar>
  );
}

export default Header;
