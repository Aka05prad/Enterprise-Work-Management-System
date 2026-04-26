import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../../features/tasks/TaskCard';

const mockTask = {
  id: 't1', projectId: 'p1',
  title: 'Fix login redirect bug',
  type: 'bug', status: 'todo', priority: 'high',
  tags: ['frontend', 'safari'],
  comments: [{ id: 'c1' }, { id: 'c2' }],
  dueDate: '2099-12-01',
  assignee: { id: '1', name: 'Alice Admin' },
  attachments: [],
};

describe('TaskCard component', () => {
  it('renders task title', () => {
    render(<TaskCard task={mockTask} onClick={() => {}} />);
    expect(screen.getByText('Fix login redirect bug')).toBeInTheDocument();
  });

  it('renders task type badge', () => {
    render(<TaskCard task={mockTask} onClick={() => {}} />);
    expect(screen.getByText('bug')).toBeInTheDocument();
  });

  it('renders assignee first name', () => {
    render(<TaskCard task={mockTask} onClick={() => {}} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('renders tags', () => {
    render(<TaskCard task={mockTask} onClick={() => {}} />);
    expect(screen.getByText('#frontend')).toBeInTheDocument();
    expect(screen.getByText('#safari')).toBeInTheDocument();
  });

  it('shows comment count', () => {
    render(<TaskCard task={mockTask} onClick={() => {}} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const handler = jest.fn();
    render(<TaskCard task={mockTask} onClick={handler} />);
    fireEvent.click(screen.getByText('Fix login redirect bug'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('shows Unassigned when no assignee', () => {
    render(<TaskCard task={{ ...mockTask, assignee: null }} onClick={() => {}} />);
    expect(screen.getByText('Unassigned')).toBeInTheDocument();
  });

  it('applies dragging styles when dragging prop is true', () => {
    const { container } = render(<TaskCard task={mockTask} onClick={() => {}} dragging={true} />);
    expect(container.firstChild.className).toMatch(/rotate/);
  });
});