import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
// import { Provider } from 'react-redux';
// import { store } from './app/store';
import App from './App';

test('renders key bindings', () => {
    const { getByText } = render( <App />);

    expect(getByText(/key bindings/i)).toBeInTheDocument();
});
