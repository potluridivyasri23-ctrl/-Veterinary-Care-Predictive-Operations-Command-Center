import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../services/api';

function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState([]);

  useEffect(() => {
    api.get('/diagnostics')
      .then((response) => setDiagnostics(response.data))
      .catch(() => setDiagnostics([]));
  }, []);

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-4 text-brand-700">Diagnostics</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Appointment</TableCell>
              <TableCell>Findings</TableCell>
              <TableCell>Tests Ordered</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {diagnostics.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.appointment_id}</TableCell>
                <TableCell>{item.findings}</TableCell>
                <TableCell>{item.tests_ordered}</TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default DiagnosticsPage;
