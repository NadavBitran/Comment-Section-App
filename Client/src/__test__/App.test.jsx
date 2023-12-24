import {describe , expect , it} from 'vitest';
import { render, screen } from '../../test-utils';
import App from "../App";


describe('App Render', () => {
  it('renders the App component correctly', () => {
    render(<App />)
  });
}); 