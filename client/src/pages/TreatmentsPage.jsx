import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../services/api';

function TreatmentsPage() {
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    api.get('/treatments')
      .then((response) => setTreatments(response.data))
      .catch(() => setTreatments([]));
  }, []);

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-4 text-brand-700">Treatments</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Appointment</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Medications</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {treatments.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.appointment_id}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.medications}</TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TreatmentsPage;
