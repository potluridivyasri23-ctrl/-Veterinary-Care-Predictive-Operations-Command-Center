import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../services/api';

function BillingPage() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    api.get('/billing')
      .then((response) => setBills(response.data))
      .catch(() => setBills([]));
  }, []);

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-4 text-brand-700">Billing</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bill ID</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>{bill.id}</TableCell>
                <TableCell>{bill.total_amount}</TableCell>
                <TableCell>{bill.paid_amount}</TableCell>
                <TableCell>{bill.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default BillingPage;
