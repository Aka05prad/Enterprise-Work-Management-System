import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../components/common/Modal';

describe('Modal', () => {
  it('renders children when open', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="Test modal"><p>Hello world</p></Modal>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="My modal"><div /></Modal>);
    expect(screen.getByText('My modal')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<Modal isOpen={false} onClose={() => {}} title="Hidden"><p>Secret</p></Modal>);
    expect(screen.queryByText('Secret')).not.toBeInTheDocument();
  });

  it('calls onClose when X is clicked', () => {
    const close = jest.fn();
    render(<Modal isOpen={true} onClose={close} title="Close test"><div /></Modal>);
    fireEvent.click(screen.getByRole('button'));
    expect(close).toHaveBeenCalled();
  });
});