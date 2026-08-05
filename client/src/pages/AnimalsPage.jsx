import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../services/api';

function AnimalsPage() {
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    api.get('/animals')
      .then((response) => setAnimals(response.data))
      .catch(() => setAnimals([]));
  }, []);

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-4 text-brand-700">Animal Management</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Species</TableCell>
              <TableCell>Breed</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {animals.map((animal) => (
              <TableRow key={animal.id}>
                <TableCell>{animal.name}</TableCell>
                <TableCell>{animal.species}</TableCell>
                <TableCell>{animal.breed}</TableCell>
                <TableCell>{animal.age}</TableCell>
                <TableCell>{animal.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AnimalsPage;
