import { AppBar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Header() {
  return (
    <AppBar
      sx={{
        zIndex: 1000,
        height: "100px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Use Link to wrap the title */}
      <Link
        to="/"
        style={{ textDecoration: "none", color: "inherit" }} // Remove underline and keep text color
      >
        <Typography variant="h4" fontWeight={"bold"}>
          The Weather Report
        </Typography>
      </Link>
      <Typography>Hows The Weather?</Typography>
    </AppBar>
  );
}

export default Header;
