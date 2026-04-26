import { render, screen } from '@testing-library/react';
import StatsCard from '../../components/charts/StatsCard';
import { FolderKanban } from 'lucide-react';

describe('StatsCard component', () => {
  it('renders title correctly', () => {
    render(<StatsCard title="Total projects" value={12} icon={FolderKanban} />);
    expect(screen.getByText('Total projects')).toBeInTheDocument();
  });

  it('renders value correctly', () => {
    render(<StatsCard title="Tasks" value={42} icon={FolderKanban} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<StatsCard title="Tasks" value={8} subtitle="3 active" icon={FolderKanban} />);
    expect(screen.getByText('3 active')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<StatsCard title="Tasks" value={8} icon={FolderKanban} />);
    expect(screen.queryByText('3 active')).not.toBeInTheDocument();
  });

  it('renders trend badge when trend and trendValue provided', () => {
    render(<StatsCard title="Tasks" value={8} icon={FolderKanban} trend="up" trendValue="+5 today" />);
    expect(screen.getByText('+5 today')).toBeInTheDocument();
  });

  it('does not render trend badge when trend not provided', () => {
    render(<StatsCard title="Tasks" value={8} icon={FolderKanban} />);
    expect(screen.queryByText('+5 today')).not.toBeInTheDocument();
  });

  it('renders string values correctly', () => {
    render(<StatsCard title="Completion" value="72%" icon={FolderKanban} />);
    expect(screen.getByText('72%')).toBeInTheDocument();
  });
});