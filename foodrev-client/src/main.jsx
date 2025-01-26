import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import Routepaths from './Routepaths'
import { ContextProvider } from './Context';
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ContextProvider>
        <Routepaths></Routepaths>
        </ContextProvider>
    </BrowserRouter>

)
