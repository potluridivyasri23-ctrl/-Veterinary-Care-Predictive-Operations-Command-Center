import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import api from '../services/api';

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Field Staff' });

  const fetchUsers = () => {
    api.get('/users')
      .then((response) => setUsers(response.data))
      .catch(() => setUsers([]));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async () => {
    await api.post('/users', form);
    setForm({ name: '', email: '', password: '', role: 'Field Staff' });
    fetchUsers();
  };

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-4 text-brand-700">User and Role Management</Typography>
      <Paper className="p-4 mb-6">
        <Typography variant="subtitle1" className="mb-3">Create New User</Typography>
        <Box className="grid gap-4 md:grid-cols-4">
          <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <TextField label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        </Box>
        <Button className="mt-4" variant="contained" onClick={createUser}>Create User</Button>
      </Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default UserManagementPage;
