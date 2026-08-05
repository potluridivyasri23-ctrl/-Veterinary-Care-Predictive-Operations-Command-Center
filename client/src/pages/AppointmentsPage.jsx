import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../services/api';

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api.get('/appointments')
      .then((response) => setAppointments(response.data.data || response.data))
      .catch(() => setAppointments([]));
  }, []);

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-4 text-brand-700">Appointments</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.appointment_date}</TableCell>
                <TableCell>{appointment.service_type}</TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell>{appointment.priority}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AppointmentsPage;
