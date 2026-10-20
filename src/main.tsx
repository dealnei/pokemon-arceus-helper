import React from 'react';
import {createRoot} from 'react-dom/client';
import {MantineProvider,createTheme} from '@mantine/core';
import '@mantine/core/styles.css';
import './styles.css';
import App from './App';
const theme=createTheme({primaryColor:'teal',fontFamily:'Inter, sans-serif',headings:{fontFamily:'Cinzel, Georgia, serif'},defaultRadius:'md'});
createRoot(document.getElementById('root')!).render(<React.StrictMode><MantineProvider theme={theme} defaultColorScheme="light"><App/></MantineProvider></React.StrictMode>);
