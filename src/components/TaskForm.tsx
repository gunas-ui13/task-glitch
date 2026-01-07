import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { Priority, Status, Task } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id'> & { id?: string }) => void;
  existingTitles: string[];
  initial?: Task | null;
}

export default function TaskForm({ open, onClose, onSubmit, existingTitles, initial }: Props) {
  const [title, setTitle] = useState('');
  const [revenue, setRevenue] = useState<string | number>('');
  const [timeTaken, setTimeTaken] = useState<string | number>('');
  const [priority, setPriority] = useState<Priority>('Low');
  
  // FIX 1: Default status to 'Todo' to prevent empty string error
  const [status, setStatus] = useState<Status>('Todo'); 
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      if (initial) {
        setTitle(initial.title);
        setRevenue(initial.revenue);
        setTimeTaken(initial.timeTaken);
        setPriority(initial.priority);
        setStatus(initial.status);
        setNotes(initial.notes || '');
      } else {
        // Reset form for new task
        setTitle('');
        setRevenue('');
        setTimeTaken('');
        setPriority('Low');
        setStatus('Todo');
        setNotes('');
      }
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    // FIX 2: Ensure status is never empty by using || 'Todo'
    // FIX 3: Add createdAt and completedAt to satisfy TypeScript
    onSubmit({
      id: initial?.id,
      title,
      revenue: Number(revenue),
      timeTaken: Number(timeTaken),
      priority,
      status: (status || 'Todo') as Status, 
      notes,
      createdAt: initial?.createdAt || new Date().toISOString(),
      completedAt: initial?.completedAt,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{initial ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              error={!initial && existingTitles.includes(title)}
              helperText={!initial && existingTitles.includes(title) ? 'Title already exists' : ''}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Revenue ($)"
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                fullWidth
              />
              <TextField
                label="Time Taken (h)"
                type="number"
                value={timeTaken}
                onChange={(e) => setTimeTaken(e.target.value)}
                fullWidth
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                fullWidth
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </TextField>
              <TextField
                select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                fullWidth
              >
                <MenuItem value="Todo">Todo</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </TextField>
            </Stack>
            <TextField
              label="Notes"
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!title || (!initial && existingTitles.includes(title))}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}