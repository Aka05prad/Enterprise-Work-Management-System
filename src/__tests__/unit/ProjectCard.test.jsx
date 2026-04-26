import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { buildStore, MOCK_PROJECT } from '../utils/testUtils';
import ProjectCard from '../../features/projects/ProjectCard';

const renderCard = (props = {}) =>
  render(
    <Provider store={buildStore()}>
      <ProjectCard project={MOCK_PROJECT} onClick={() => {}} onEdit={() => {}} {...props} />
    </Provider>
  );

describe('ProjectCard component', () => {
  it('renders project name', () => {
    renderCard();
    expect(screen.getByText('Apollo Redesign')).toBeInTheDocument();
  });

  it('renders project description', () => {
    renderCard();
    expect(screen.getByText(/Full redesign/)).toBeInTheDocument();
  });

  it('renders progress percentage', () => {
    renderCard();
    expect(screen.getByText('72%')).toBeInTheDocument();
  });

  it('renders status badge', () => {
    renderCard();
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('renders priority badge', () => {
    renderCard();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const handler = jest.fn();
    renderCard({ onClick: handler });
    fireEvent.click(screen.getByText('Apollo Redesign'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('renders manager name', () => {
    renderCard();
    expect(screen.getByText('Mark Manager')).toBeInTheDocument();
  });

  it('renders tags', () => {
    renderCard();
    expect(screen.getByText('#design')).toBeInTheDocument();
    expect(screen.getByText('#frontend')).toBeInTheDocument();
  });
});