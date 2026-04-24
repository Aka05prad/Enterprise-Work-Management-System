import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import UserFormModal from '../features/users/UserFormModal';

const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

describe('UserFormModal', () => {
  it('renders create form when no user prop', () => {
    render(
      <Wrapper>
        <UserFormModal isOpen={true} onClose={() => {}} user={null} />
      </Wrapper>
    );
    expect(screen.getByText('Add new user')).toBeInTheDocument();
  });

  it('shows password field only on create', () => {
    render(
      <Wrapper>
        <UserFormModal isOpen={true} onClose={() => {}} user={null} />
      </Wrapper>
    );
    expect(screen.getByLabelText(/Temporary password/i)).toBeInTheDocument();
  });

  it('renders edit title when user prop given', () => {
    const user = { id: '1', name: 'Test', email: 'test@x.com', role: 'employee', department: 'HR', phone: '' };
    render(
      <Wrapper>
        <UserFormModal isOpen={true} onClose={() => {}} user={user} />
      </Wrapper>
    );
    expect(screen.getByText('Edit user')).toBeInTheDocument();
  });
});