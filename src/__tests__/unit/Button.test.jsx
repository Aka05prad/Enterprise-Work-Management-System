import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../components/common/Button';

describe('Button component', () => {
  it('renders children text correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handler = jest.fn();
    render(<Button onClick={handler}>Submit</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading prop is true', () => {
    render(<Button loading>Saving</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onClick when disabled', () => {
    const handler = jest.fn();
    render(<Button disabled onClick={handler}>Blocked</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('applies primary variant classes by default', () => {
    const { container } = render(<Button>Primary</Button>);
    // expect(container.firstChild.className).toMatch(/bg-primary/);
    expect(container.firstChild.className).toMatch(/indigo/);

  });

  it('applies danger variant classes', () => {
    const { container } = render(<Button variant="danger">Delete</Button>);
    // expect(container.firstChild.className).toMatch(/bg-red/);
    expect(container.firstChild.className).toMatch(/rose/);
  });

  it('applies secondary variant classes', () => {
    const { container } = render(<Button variant="secondary">Cancel</Button>);
    expect(container.firstChild.className).toMatch(/bg-white/);
  });

  it('renders spinner when loading', () => {
    const { container } = render(<Button loading>Wait</Button>);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });
});