import { AppBar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/AuthContext";
import Logo from "../components/eaglePic.jpg";

function Header() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
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
        src={Logo}
        alt="Logo"
        style={{
          position: "absolute",
          left: 10,
          width: "80px",
          height: "80px",
        }}
      />
      <Link
        to="/"
        style={{ textDecoration: "none", color: "inherit" }} // Remove underline and keep text color
      >
        <Typography variant="h4" fontWeight={"bold"}>
          Eagle Eye Analytics
        </Typography>
      </Link>
      {currentUser != null && (
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
