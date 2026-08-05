import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../services/api';

function MedicalRecordsPage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get('/medical-records')
      .then((response) => setRecords(response.data))
      .catch(() => setRecords([]));
  }, []);

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-4 text-brand-700">Medical Records</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Animal ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Created By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.animal_id}</TableCell>
                <TableCell>{record.record_type}</TableCell>
                <TableCell>{record.notes}</TableCell>
                <TableCell>{record.created_by}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default MedicalRecordsPage;
