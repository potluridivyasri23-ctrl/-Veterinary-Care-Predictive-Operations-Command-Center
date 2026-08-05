import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../services/api';

function RiskAnalysisPage() {
  const [risks, setRisks] = useState([]);

  useEffect(() => {
    api.get('/analytics/risks')
      .then((response) => setRisks(response.data))
      .catch(() => setRisks([]));
  }, []);

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-4 text-brand-700">Risk Analysis</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Risk Type</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {risks.map((risk) => (
              <TableRow key={risk.id}>
                <TableCell>{risk.risk_type}</TableCell>
                <TableCell>{risk.score}</TableCell>
                <TableCell>{risk.status}</TableCell>
                <TableCell>{JSON.stringify(risk.details)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default RiskAnalysisPage;
