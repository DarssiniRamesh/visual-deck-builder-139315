import { render, screen } from '@testing-library/react';
import App from './App';

test('renders workflow diagram title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Current Infrastructure Integration/i);
  expect(titleElement).toBeInTheDocument();
});
