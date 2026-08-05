import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../services/api';

function OwnersPage() {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    api.get('/owners')
      .then((response) => setOwners(response.data))
      .catch(() => setOwners([]));
  }, []);

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-4 text-brand-700">Owner Management</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {owners.map((owner) => (
              <TableRow key={owner.id}>
                <TableCell>{owner.name}</TableCell>
                <TableCell>{owner.phone}</TableCell>
                <TableCell>{owner.email}</TableCell>
                <TableCell>{owner.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default OwnersPage;
