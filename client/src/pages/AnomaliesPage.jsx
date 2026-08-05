import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import api from '../services/api';

function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState([]);
  const [form, setForm] = useState({ description: '', severity: 'warning', evidence: '' });

  useEffect(() => {
    api.get('/anomalies')
      .then((response) => setAnomalies(response.data))
      .catch(() => setAnomalies([]));
  }, []);

  const handleSubmit = async () => {
    await api.post('/anomalies', { ...form, evidence: { notes: form.evidence } });
    setForm({ description: '', severity: 'warning', evidence: '' });
    const response = await api.get('/anomalies');
    setAnomalies(response.data);
  };

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-4 text-brand-700">Anomaly Tracking</Typography>
      <Paper className="p-4 mb-6">
        <Typography variant="subtitle1" className="mb-3">Create Anomaly</Typography>
        <Box className="grid gap-4 md:grid-cols-3">
          <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <TextField label="Severity" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} />
          <TextField label="Evidence" value={form.evidence} onChange={(e) => setForm({ ...form, evidence: e.target.value })} />
        </Box>
        <Button className="mt-4" variant="contained" onClick={handleSubmit}>Log Anomaly</Button>
      </Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Evidence</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {anomalies.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.severity}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{JSON.stringify(item.evidence)}</TableCell>
                <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AnomaliesPage;
