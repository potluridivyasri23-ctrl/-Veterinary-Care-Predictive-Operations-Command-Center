import { Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <Box className="min-h-screen flex flex-col items-center justify-center p-6">
      <Typography variant="h3" className="mb-4">404</Typography>
      <Typography variant="h6" className="mb-4">Page not found.</Typography>
      <Button component={Link} to="/" variant="contained" color="primary">Return home</Button>
    </Box>
  );
}

export default NotFoundPage;
