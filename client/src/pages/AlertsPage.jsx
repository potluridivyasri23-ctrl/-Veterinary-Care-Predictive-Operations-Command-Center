import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField } from '@mui/material';
import api from '../services/api';

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState({ target_type: 'Appointment', target_id: '', severity: 'warning', message: '', status: 'open' });

  const fetchAlerts = () => {
    api.get('/alerts')
      .then((response) => setAlerts(response.data))
      .catch(() => setAlerts([]));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const createAlert = async () => {
    await api.post('/alerts', form);
    setForm({ target_type: 'Appointment', target_id: '', severity: 'warning', message: '', status: 'open' });
    fetchAlerts();
  };

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-4 text-brand-700">Alerts</Typography>
      <Paper className="p-4 mb-6">
        <Typography variant="subtitle1" className="mb-3">Raise an alert</Typography>
        <Box className="grid gap-4 md:grid-cols-3">
          <TextField label="Target type" value={form.target_type} onChange={(e) => setForm({ ...form, target_type: e.target.value })} />
          <TextField label="Target id" value={form.target_id} onChange={(e) => setForm({ ...form, target_id: e.target.value })} />
          <TextField label="Severity" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} />
        </Box>
        <TextField label="Message" fullWidth className="my-4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <Button variant="contained" onClick={createAlert}>Create Alert</Button>
      </Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Target</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>{`${alert.target_type} ${alert.target_id}`}</TableCell>
                <TableCell>{alert.severity}</TableCell>
                <TableCell>{alert.message}</TableCell>
                <TableCell>{alert.status}</TableCell>
                <TableCell>{new Date(alert.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AlertsPage;
