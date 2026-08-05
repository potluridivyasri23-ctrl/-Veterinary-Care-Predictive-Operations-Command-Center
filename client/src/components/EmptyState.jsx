import { Box, Typography } from '@mui/material';

function EmptyState({ title, description }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        border: '1px solid rgba(148, 163, 184, 0.16)',
        boxShadow: '0 20px 48px rgba(15, 23, 42, 0.18)'
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#60a5fa' }}>{title}</Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8' }}>{description}</Typography>
      </Box>
    </Paper>
  );
}

export default EmptyState;
