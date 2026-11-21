import { createRoot } from 'react-dom/client';
import Home from '../../app/page';
import Pharmacy from '../../app/pharmacy/page';
import PrintView from '../../components/PrintView';
import '../../app/globals.css';

const path = location.pathname.replace(/\/$/, '');
const page = path === '/pharmacy' ? <Pharmacy /> : path.startsWith('/print/') ? <PrintView id={decodeURIComponent(path.slice(7))} /> : <Home />;
createRoot(document.getElementById('root')!).render(page);

