import './App.css';
import muiTheme from 'theme';
import { ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import NavBar from 'components/shared/navbar';
import { allRoutes } from 'components/shared/routes/const';
import AllRoutes from 'components/shared/routes';

const App = () => {
  return (
    <ThemeProvider theme={muiTheme}>
        <BrowserRouter>
            <NavBar listRoutes={allRoutes}/>
            <AllRoutes />
        </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
