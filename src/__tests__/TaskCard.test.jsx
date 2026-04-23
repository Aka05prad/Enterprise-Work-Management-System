import { render, screen } from '@testing-library/react';
import TaskCard from '../features/tasks/TaskCard';

const mockTask = {
  id: 't1', title: 'Fix login bug', type: 'bug', status: 'todo',
  priority: 'high', tags: ['frontend'], comments: [{ id: 'c1' }],
  dueDate: '2025-12-01', assignee: { id: '1', name: 'Alice Admin' },
};

describe('TaskCard', () => {
  it('renders task title', () => {
    render(<TaskCard task={mockTask} onClick={() => {}} />);
    expect(screen.getByText('Fix login bug')).toBeInTheDocument();
  });

  it('renders assignee name', () => {
    render(<TaskCard task={mockTask} onClick={() => {}} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('renders tag', () => {
    render(<TaskCard task={mockTask} onClick={() => {}} />);
    expect(screen.getByText('#frontend')).toBeInTheDocument();
  });

  it('shows comment count', () => {
    render(<TaskCard task={mockTask} onClick={() => {}} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});