import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import api from '../services/api';

function AnalyticsDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [trends, setTrends] = useState([]);
  const [capacityPlans, setCapacityPlans] = useState([]);

  useEffect(() => {
    api.get('/analytics/dashboard').then((res) => setDashboard(res.data)).catch(() => setDashboard(null));
    api.get('/analytics/trends').then((res) => setTrends(res.data)).catch(() => setTrends([]));
    api.get('/analytics/capacity-plans').then((res) => setCapacityPlans(res.data)).catch(() => setCapacityPlans([]));
  }, []);

  const runJobs = async () => {
    await api.post('/analytics/run-jobs');
    const [dashboardRes, trendsRes, capacityRes] = await Promise.all([
      api.get('/analytics/dashboard'),
      api.get('/analytics/trends'),
      api.get('/analytics/capacity-plans')
    ]);
    setDashboard(dashboardRes.data);
    setTrends(trendsRes.data);
    setCapacityPlans(capacityRes.data);
  };

  return (
    <Box className="p-6">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4" className="text-brand-700">Operations Analytics</Typography>
        <Button variant="contained" onClick={runJobs}>Refresh Forecasts</Button>
      </Box>
      <Grid container spacing={3}>
        {dashboard?.kpis && Object.entries(dashboard.kpis).map(([key, value]) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" className="uppercase text-slate-500">{key.replace(/_/g, ' ')}</Typography>
                <Typography variant="h4" className="mt-2">{value ?? 'N/A'}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} className="mt-6">
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-3">Trend Summary (Last 7 days)</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Volume</TableCell>
                    <TableCell>Wait</TableCell>
                    <TableCell>Procedure Load</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trends.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                      <TableCell>{row.case_volume}</TableCell>
                      <TableCell>{Math.round(row.waiting_time)}</TableCell>
                      <TableCell>{row.procedure_load}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-3">Capacity Plans</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Capacity Details</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {capacityPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>{new Date(plan.plan_date).toLocaleDateString()}</TableCell>
                      <TableCell>{JSON.stringify(plan.capacity_details)}</TableCell>
                      <TableCell>{plan.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AnalyticsDashboardPage;
