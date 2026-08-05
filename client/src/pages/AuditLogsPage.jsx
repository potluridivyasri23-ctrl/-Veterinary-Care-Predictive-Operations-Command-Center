import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../services/api';

function AuditLogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/audit')
      .then((response) => setLogs(response.data))
      .catch(() => setLogs([]));
  }, []);

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-4 text-brand-700">Audit Logs</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>When</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.user_name || 'System'}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{`${log.target_type} ${log.target_id || ''}`}</TableCell>
                <TableCell>{JSON.stringify(log.details)}</TableCell>
                <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AuditLogsPage;
