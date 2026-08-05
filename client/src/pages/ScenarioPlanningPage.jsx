import { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../services/api';

function ScenarioPlanningPage() {
  const [scenario, setScenario] = useState({ name: '', demandMultiplier: 1, capacityAdjustment: 0 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runScenario = async () => {
    setLoading(true);
    try {
      const response = await api.post('/analytics/scenario', scenario);
      setResult(response.data);
    } catch (error) {
      console.error(error);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-4 text-brand-700">Scenario Planning</Typography>
      <Paper className="p-4 mb-6">
        <Typography variant="subtitle1" className="mb-3">Run a scenario</Typography>
        <Box className="grid gap-4 md:grid-cols-3">
          <TextField
            label="Scenario name"
            value={scenario.name}
            onChange={(e) => setScenario({ ...scenario, name: e.target.value })}
          />
          <TextField
            type="number"
            label="Demand multiplier"
            value={scenario.demandMultiplier}
            onChange={(e) => setScenario({ ...scenario, demandMultiplier: Number(e.target.value) })}
          />
          <TextField
            type="number"
            label="Capacity adjustment"
            value={scenario.capacityAdjustment}
            onChange={(e) => setScenario({ ...scenario, capacityAdjustment: Number(e.target.value) })}
          />
        </Box>
        <Button className="mt-4" variant="contained" onClick={runScenario} disabled={loading}>
          {loading ? 'Running…' : 'Run Scenario'}
        </Button>
      </Paper>
      {result && (
        <Paper className="p-4">
          <Typography variant="h6">Scenario result</Typography>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Scenario</TableCell>
                  <TableCell>{result.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Current demand</TableCell>
                  <TableCell>{result.current_demand}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Projected demand</TableCell>
                  <TableCell>{result.projected_demand}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Current capacity</TableCell>
                  <TableCell>{result.current_capacity}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Adjusted capacity</TableCell>
                  <TableCell>{result.adjusted_capacity}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Capacity gap</TableCell>
                  <TableCell>{result.capacity_gap}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Recommendation</TableCell>
                  <TableCell>{result.recommendation}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Generated at</TableCell>
                  <TableCell>{new Date(result.generated_at).toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}

export default ScenarioPlanningPage;
