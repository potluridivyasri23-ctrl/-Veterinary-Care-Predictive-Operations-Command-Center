import { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import api from '../services/api';

function AIPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reviewComment, setReviewComment] = useState('');
  const [status, setStatus] = useState('approved');

  useEffect(() => {
    api.get('/ai/recommendations')
      .then((response) => setRecommendations(response.data))
      .catch(() => setRecommendations([]));
  }, []);

  const refresh = () => {
    api.get('/ai/recommendations')
      .then((response) => setRecommendations(response.data))
      .catch(() => setRecommendations([]));
  };

  const handleReview = (item) => {
    setSelected(item);
    setReviewComment(item.review_comment || '');
    setStatus(item.status || 'pending');
  };

  const submitReview = async () => {
    if (!selected) return;
    await api.patch(`/ai/recommendations/${selected.id}`, {
      status,
      review_comment: reviewComment,
    });
    setSelected(null);
    setReviewComment('');
    refresh();
  };

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-4 text-brand-700">AI Recommendation Center</Typography>
      <Paper className="p-4">
        <List>
          {recommendations.map((item) => (
            <ListItem key={item.id} className="flex flex-col items-start gap-2 border-b border-slate-200 pb-3 mb-3">
              <ListItemText
                primary={item.subject}
                secondary={`Confidence: ${item.confidence} • Status: ${item.status || 'pending'}`}
              />
              <Typography variant="body2" className="whitespace-pre-wrap">{item.response?.summary || JSON.stringify(item.response)}</Typography>
              <Typography variant="caption" color="textSecondary">Last reviewed: {item.reviewed_at || 'not reviewed'}</Typography>
              <Box className="flex gap-2 mt-2">
                <Button variant="outlined" size="small" onClick={() => handleReview(item)}>Review</Button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth>
        <DialogTitle>Review AI Recommendation</DialogTitle>
        <DialogContent className="space-y-4">
          <Typography variant="subtitle1">{selected?.subject}</Typography>
          <Typography variant="body2" className="whitespace-pre-wrap">{selected?.response?.summary || JSON.stringify(selected?.response)}</Typography>
          <TextField
            label="Review comment"
            fullWidth
            multiline
            minRows={3}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          />
          <TextField
            label="Decision"
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            helperText="approved, rejected, or pending"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Cancel</Button>
          <Button variant="contained" onClick={submitReview}>Submit Review</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AIPage;
