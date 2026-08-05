import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import api from '../services/api';

function ConfigurationPage() {
  const [configs, setConfigs] = useState([]);
  const [form, setForm] = useState({ key: '', value: '', description: '' });

  useEffect(() => {
    api.get('/configurations')
      .then((response) => setConfigs(response.data))
      .catch(() => setConfigs([]));
  }, []);

  const handleSubmit = async () => {
    await api.put('/configurations', form);
    setForm({ key: '', value: '', description: '' });
    const response = await api.get('/configurations');
    setConfigs(response.data);
  };

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-4 text-brand-700">System Configuration</Typography>
      <Paper className="p-4 mb-6">
        <Typography variant="subtitle1" className="mb-3">Update Configuration</Typography>
        <Box className="grid gap-4 md:grid-cols-3">
          <TextField label="Key" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} />
          <TextField label="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Box>
        <Button className="mt-4" variant="contained" onClick={handleSubmit}>Save</Button>
      </Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {configs.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.key}</TableCell>
                <TableCell>{JSON.stringify(item.value)}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{new Date(item.updated_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ConfigurationPage;
