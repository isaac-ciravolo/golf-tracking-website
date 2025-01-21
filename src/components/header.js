import { AppBar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/AuthContext";
import LogoEdit from "../images/eeaLogoEdit.png";
import Logo from "../images/logo192.png";

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
          left: 60,
          height: "130px",
        }}
      />

      <Link
        to="/"
        style={{ textDecoration: "none", color: "inherit" }} // Remove underline and keep text color
      >
        <img
          src={LogoEdit}
          alt="Logo"
          style={{
            marginTop: "20px",
            height: "300px",
          }}
        />
        {/* <Typography variant="h4" fontWeight={"bold"}>
          Eagle Eye Analytics
        </Typography> */}
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
