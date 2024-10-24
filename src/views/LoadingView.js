import { CircularProgress, Box } from "@mui/material";

const LoadingView = () => {
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "400px",
        width: "100%",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingView;
