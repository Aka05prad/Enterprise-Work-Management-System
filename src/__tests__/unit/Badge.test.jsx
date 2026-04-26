import { render, screen } from '@testing-library/react';
import Badge from '../../components/common/Badge';

describe('Badge component', () => {
  it('renders children correctly', () => {
    render(<Badge>admin</Badge>);
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('applies success variant — green classes', () => {
    const { container } = render(<Badge variant="success">done</Badge>);
    expect(container.firstChild.className).toMatch(/green/);
  });

  it('applies danger variant — red classes', () => {
    const { container } = render(<Badge variant="danger">overdue</Badge>);
    expect(container.firstChild.className).toMatch(/red/);
  });

  it('applies warning variant — yellow classes', () => {
    const { container } = render(<Badge variant="warning">pending</Badge>);
    expect(container.firstChild.className).toMatch(/yellow/);
  });

  it('applies info variant — blue classes', () => {
    const { container } = render(<Badge variant="info">employee</Badge>);
    expect(container.firstChild.className).toMatch(/blue/);
  });

  it('applies default variant when no variant given', () => {
    const { container } = render(<Badge>default</Badge>);
    expect(container.firstChild.className).toMatch(/gray/);
  });

  it('renders as a span element', () => {
    const { container } = render(<Badge>test</Badge>);
    expect(container.firstChild.tagName).toBe('SPAN');
  });
});