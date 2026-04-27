import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { buildStore } from '../utils/testUtils';
import UserFormModal from '../../features/users/UserFormModal';

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const Wrapper = ({ children }) => (
  <Provider store={buildStore()}>{children}</Provider>
);

describe('UserFormModal', () => {
  it('renders create title when no user prop', () => {
    render(
      <Wrapper>
        <UserFormModal isOpen={true} onClose={() => {}} user={null} />
      </Wrapper>
    );
    expect(screen.getByText('Add new user')).toBeInTheDocument();
  });

  it('shows password field only on create mode', () => {
    render(
      <Wrapper>
        <UserFormModal isOpen={true} onClose={() => {}} user={null} />
      </Wrapper>
    );
    expect(screen.getByLabelText(/Temporary password/i)).toBeInTheDocument();
  });

  it('renders edit title when user prop is given', () => {
    const user = {
      id: '1', name: 'Test User', email: 'test@x.com',
      role: 'employee', department: 'HR', phone: '',
    };
    render(
      <Wrapper>
        <UserFormModal isOpen={true} onClose={() => {}} user={user} />
      </Wrapper>
    );
    expect(screen.getByText('Edit user')).toBeInTheDocument();
  });

  it('does NOT show password field in edit mode', () => {
    const user = {
      id: '1', name: 'Test', email: 'test@x.com',
      role: 'employee', department: 'HR', phone: '',
    };
    render(
      <Wrapper>
        <UserFormModal isOpen={true} onClose={() => {}} user={user} />
      </Wrapper>
    );
    expect(screen.queryByLabelText(/Temporary password/i)).not.toBeInTheDocument();
  });

  it('renders Cancel and Save buttons in edit mode', () => {
    const user = {
      id: '1', name: 'Test', email: 'test@x.com',
      role: 'employee', department: 'HR', phone: '',
    };
    render(
      <Wrapper>
        <UserFormModal isOpen={true} onClose={() => {}} user={user} />
      </Wrapper>
    );
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });
});