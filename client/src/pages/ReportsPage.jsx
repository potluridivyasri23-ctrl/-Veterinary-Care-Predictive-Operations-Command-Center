import { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Button, Stack, Divider } from '@mui/material';
import api from '../services/api';

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = () => {
    api.get('/reports')
      .then((response) => setReports(response.data))
      .catch(() => setReports([]));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    try {
      await api.post('/reports/generate', {
        type: 'Operational',
        name: `Weekly Operations Summary ${new Date().toLocaleDateString()}`,
        filters: { dateRange: 'last_7_days' }
      });
      fetchReports();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = async (report) => {
    try {
      const response = await api.get(`/reports/${report.id}/export`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${report.name.replace(/\s+/g, '_') || 'report'}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed', error);
    }
  };

  return (
    <Box className="p-6">
      <Stack direction="row" justifyContent="space-between" alignItems="center" className="mb-4">
        <Typography variant="h4" className="text-brand-700">Reports & Analytics</Typography>
        <Button variant="contained" onClick={generateReport} disabled={loading}>
          {loading ? 'Generating…' : 'Generate Weekly Report'}
        </Button>
      </Stack>
      <Paper className="p-4">
        <List>
          {reports.length ? (
            reports.map((report) => (
              <Box key={report.id}>
                <ListItem divider>
                  <ListItemText
                    primary={report.name}
                    secondary={`${report.type} · ${new Date(report.created_at).toLocaleDateString()} · ${report.status}`}
                  />
                  <Button variant="outlined" size="small" onClick={() => downloadCsv(report)}>
                    Download CSV
                  </Button>
                </ListItem>
                <Divider />
              </Box>
            ))
          ) : (
            <Typography>No reports available yet.</Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
}

export default ReportsPage;
