import { render } from '@testing-library/react';
import BaseTemplate from './BaseTemplate';

it('renders without crashing', () => {
  render(<BaseTemplate prop="test" />);
});
