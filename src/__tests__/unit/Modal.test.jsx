import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../../components/common/Modal';

describe('Modal component', () => {
  const onClose = jest.fn();

  beforeEach(() => onClose.mockClear());

  it('renders children when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={onClose} title="Test"><p>Modal body</p></Modal>);
    expect(screen.getByText('Modal body')).toBeInTheDocument();
  });

  it('renders title when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={onClose} title="My Title"><div /></Modal>);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={onClose} title="Hidden"><p>Secret</p></Modal>);
    expect(screen.queryByText('Secret')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('calls onClose when X button is clicked', () => {
    render(<Modal isOpen={true} onClose={onClose} title="Closeable"><div /></Modal>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={onClose} title="Backdrop test"><div /></Modal>
    );
    // Click the backdrop div (first child of fixed container)
    const backdrop = container.querySelector('.absolute.inset-0');
    if (backdrop) fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<Modal isOpen={true} onClose={onClose} title="Escape test"><div /></Modal>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});