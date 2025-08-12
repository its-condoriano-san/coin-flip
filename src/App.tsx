import AppProvider from './providers';
import AppRouter from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
      <ToastContainer
        theme="dark"
        className="mt-[100px]"
        draggable
        position="top-right"
        limit={5}
      />
    </AppProvider>
  );
}
