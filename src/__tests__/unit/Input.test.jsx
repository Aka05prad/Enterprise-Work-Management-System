import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../../components/common/Input';

describe('Input component', () => {
  it('renders with label', () => {
    render(<Input id="email" label="Email address" />);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
  });

  it('renders placeholder text', () => {
    render(<Input placeholder="Enter your email" />);
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('shows error message when error prop is provided', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error styling when error prop is given', () => {
    const { container } = render(<Input error="Required" />);
    expect(container.querySelector('input').className).toMatch(/border-red/);
  });

  it('does not show error message when no error', () => {
    render(<Input />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('forwards value and onChange correctly', () => {
    const onChange = jest.fn();
    render(<Input value="hello" onChange={onChange} />);
    const input = screen.getByRole('textbox');
    expect(input.value).toBe('hello');
    fireEvent.change(input, { target: { value: 'world' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('renders as password type', () => {
    const { container } = render(<Input type="password" />);
    expect(container.querySelector('input[type="password"]')).toBeInTheDocument();
  });
});