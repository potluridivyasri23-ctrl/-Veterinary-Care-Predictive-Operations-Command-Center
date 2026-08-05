import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, List, ListItem, ListItemText, IconButton, Stack, Chip } from '@mui/material';
import api from '../services/api';
import CheckIcon from '@mui/icons-material/Check';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loadingClear, setLoadingClear] = useState(false);

  const fetchNotifications = () => {
    api.get('/notifications')
      .then((response) => setNotifications(response.data))
      .catch(() => setNotifications([]));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    fetchNotifications();
  };

  const clearAll = async () => {
    setLoadingClear(true);
    try {
      await api.delete('/notifications/clear');
      fetchNotifications();
    } finally {
      setLoadingClear(false);
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <Box className="p-6">
      <Stack direction="row" justifyContent="space-between" alignItems="center" className="mb-4">
        <Stack>
          <Typography variant="h4" className="text-brand-700">Notifications</Typography>
          <Typography variant="body2" color="text.secondary">
            {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
          </Typography>
        </Stack>
        <Button variant="contained" color="secondary" onClick={clearAll} disabled={loadingClear}>
          {loadingClear ? 'Clearing…' : 'Clear All'}
        </Button>
      </Stack>
      <Paper>
        <List>
          {notifications.length ? (
            notifications.map((notification) => (
              <ListItem key={notification.id} divider secondaryAction={
                !notification.read ? (
                  <IconButton edge="end" onClick={() => markRead(notification.id)}>
                    <CheckIcon />
                  </IconButton>
                ) : null
              }>
                <ListItemText
                  primary={notification.message}
                  secondary={`${notification.category} • ${new Date(notification.created_at).toLocaleString()}`}
                />
                <Chip label={notification.read ? 'Read' : 'Unread'} size="small" color={notification.read ? 'default' : 'primary'} />
              </ListItem>
            ))
          ) : (
            <Typography className="p-4">No notifications available.</Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
}

export default NotificationsPage;
