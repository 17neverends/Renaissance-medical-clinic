import './App.css'
import { BrowserRouter } from 'react-router-dom';
import { AuthWrapper } from './auth/AuthWrapper';
import { UserHistoryProvider } from './components/pages/Account/CreateRecord/UserHistory/UserHistoryContext';
import { ToastContainer } from 'react-toastify';



export default function App() {
  return (
      <BrowserRouter>
            <UserHistoryProvider>

              <AuthWrapper/>
              <ToastContainer /> 

          </UserHistoryProvider>
          
       </BrowserRouter>
  )
}


