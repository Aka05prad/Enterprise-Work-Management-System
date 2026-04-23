import { render, screen } from '@testing-library/react';
import StatsCard from '../components/charts/StatsCard';
import { FolderKanban } from 'lucide-react';

describe('StatsCard', () => {
  it('renders title and value', () => {
    render(<StatsCard title="Total projects" value={12} icon={FolderKanban} />);
    expect(screen.getByText('Total projects')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<StatsCard title="Tasks" value={8} subtitle="3 active" icon={FolderKanban} />);
    expect(screen.getByText('3 active')).toBeInTheDocument();
  });

  it('renders trend badge when trend is provided', () => {
    render(<StatsCard title="Tasks" value={8} icon={FolderKanban} trend="up" trendValue="+5 today" />);
    expect(screen.getByText('+5 today')).toBeInTheDocument();
  });
});