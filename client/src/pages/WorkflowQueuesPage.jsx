import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, FormControl, InputLabel, Select, MenuItem, Stack, Chip, Button } from '@mui/material';
import api from '../services/api';

function WorkflowQueuesPage() {
  const [appointments, setAppointments] = useState([]);
  const [owners, setOwners] = useState({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  useEffect(() => {
    Promise.all([
      api.get('/appointments'),
      api.get('/owners')
    ])
      .then(([appointmentsRes, ownersRes]) => {
        const appointmentData = appointmentsRes.data.data || appointmentsRes.data;
        setAppointments(appointmentData || []);
        const ownerMap = (ownersRes.data || []).reduce((acc, owner) => {
          acc[owner.id] = owner.name;
          return acc;
        }, {});
        setOwners(ownerMap);
      })
      .catch(() => {
        setAppointments([]);
        setOwners({});
      });
  }, []);

  const filtered = appointments.filter((appointment) => {
    const term = search.toLowerCase();
    const slaRisk = appointment.wait_minutes > 30 ? 'high' : 'normal';

    const matchesSearch =
      appointment.service_type?.toLowerCase().includes(term) ||
      appointment.status?.toLowerCase().includes(term) ||
      appointment.priority?.toLowerCase().includes(term) ||
      owners[appointment.owner_id]?.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || slaRisk === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  const activeCount = appointments.filter((appt) => appt.status !== 'completed').length;
  const highRiskCount = appointments.filter((appt) => appt.wait_minutes > 30).length;

  return (
    <Box className="p-6">
      <Stack direction="row" justifyContent="space-between" alignItems="center" className="mb-4" spacing={2}>
        <Typography variant="h4" className="text-brand-700">Live Workflow Queues</Typography>
        <Stack direction="row" spacing={1}>
          <Chip label={`Active tasks: ${activeCount}`} color="primary" />
          <Chip label={`High SLA risk: ${highRiskCount}`} color={highRiskCount > 0 ? 'error' : 'success'} />
        </Stack>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} className="mb-4">
        <TextField
          label="Search workflow"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="scheduled">Scheduled</MenuItem>
            <MenuItem value="in progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>SLA Risk</InputLabel>
          <Select value={riskFilter} label="SLA Risk" onChange={(e) => setRiskFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Owner</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due</TableCell>
              <TableCell>SLA Risk</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((appointment) => {
              const slaRisk = appointment.wait_minutes > 30 ? 'High' : 'Normal';
              return (
                <TableRow key={appointment.id}>
                  <TableCell>{owners[appointment.owner_id] || `Owner ${appointment.owner_id}`}</TableCell>
                  <TableCell>{appointment.service_type}</TableCell>
                  <TableCell>{appointment.priority}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                  <TableCell>{new Date(appointment.appointment_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={slaRisk}
                      color={slaRisk === 'High' ? 'error' : 'success'}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {!filtered.length && (
        <Typography variant="body2" className="mt-4 text-slate-500">No matching workflow items found. Adjust filters or search terms.</Typography>
      )}
    </Box>
  );
}

export default WorkflowQueuesPage;
