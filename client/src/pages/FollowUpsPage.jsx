import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../services/api';

function FollowUpsPage() {
  const [followups, setFollowups] = useState([]);

  useEffect(() => {
    api.get('/follow-ups')
      .then((response) => setFollowups(response.data))
      .catch(() => setFollowups([]));
  }, []);

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-4 text-brand-700">Follow-up Management</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Appointment</TableCell>
              <TableCell>Animal</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Scheduled</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {followups.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.appointment_id}</TableCell>
                <TableCell>{item.animal_id}</TableCell>
                <TableCell>{item.owner_id}</TableCell>
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

export default FollowUpsPage;
