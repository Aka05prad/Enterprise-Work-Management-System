import { render, screen } from '@testing-library/react';
import Badge from '../components/common/Badge';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>admin</Badge>);
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('applies danger variant class', () => {
    const { container } = render(<Badge variant="danger">overdue</Badge>);
    expect(container.firstChild.className).toMatch(/red/);
  });

  it('applies success variant class', () => {
    const { container } = render(<Badge variant="success">done</Badge>);
    expect(container.firstChild.className).toMatch(/green/);
  });
});