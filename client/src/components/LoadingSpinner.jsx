import { CircularProgress, Box } from '@mui/material';

function LoadingSpinner() {
  return (
    <Box className="flex items-center justify-center h-full">
      <CircularProgress />
    </Box>
  );
}

export default LoadingSpinner;
