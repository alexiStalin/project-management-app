import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import store from './store/store';

import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <HashRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </HashRouter>
);

reportWebVitals();
