import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../services/api';

function VaccinationsPage() {
  const [vaccinations, setVaccinations] = useState([]);

  useEffect(() => {
    api.get('/vaccinations')
      .then((response) => setVaccinations(response.data))
      .catch(() => setVaccinations([]));
  }, []);

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-4 text-brand-700">Vaccination Schedule</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Animal</TableCell>
              <TableCell>Vaccine</TableCell>
              <TableCell>Dose</TableCell>
              <TableCell>Scheduled</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vaccinations.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.animal_id}</TableCell>
                <TableCell>{item.vaccine_name}</TableCell>
                <TableCell>{item.dose}</TableCell>
                <TableCell>{item.scheduled_date}</TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default VaccinationsPage;
