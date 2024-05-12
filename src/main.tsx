import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import Providers from "./utils/providers";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Providers>
       <App />
    </Providers>
);
