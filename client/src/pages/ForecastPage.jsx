import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../services/api';

function ForecastPage() {
  const [forecasts, setForecasts] = useState([]);

  useEffect(() => {
    api.get('/analytics/forecasts')
      .then((response) => setForecasts(response.data))
      .catch(() => setForecasts([]));
  }, []);

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-4 text-brand-700">Demand & Workload Predictions</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Values</TableCell>
              <TableCell>Confidence</TableCell>
              <TableCell>Generated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forecasts.map((forecast) => (
              <TableRow key={forecast.id}>
                <TableCell>{forecast.forecast_type}</TableCell>
                <TableCell>{JSON.stringify(forecast.values)}</TableCell>
                <TableCell>{forecast.confidence}</TableCell>
                <TableCell>{new Date(forecast.generated_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ForecastPage;
