import { AppBar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/AuthContext";

function Header() {
  const navigate = useNavigate();
  const { userData } = useAuth();
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
      <img
        src={"/images/logo192.png"}
        alt="Logo"
        style={{
          position: "absolute",
          left: 60,
          height: "130px",
        }}
      />

      <Link
        to="/"
        style={{ textDecoration: "none", color: "inherit" }} // Remove underline and keep text color
      >
        <Box
          sx={{
            overflow: "hidden",
            marginTop: "20px",
            width: "500px",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={"/images/eeaLogoEdit.png"}
            alt="Logo"
            style={{
              height: "300px",
            }}
          />
        </Box>
      </Link>
      {userData != null && (
        <Button
          sx={{
            position: "absolute",
            right: 10,
            backgroundColor: "gray",
          }}
          variant="contained"
          onClick={() => {
            navigate("/settings");
          }}
        >
          Settings
        </Button>
      )}
    </AppBar>
  );
}

export default Header;
