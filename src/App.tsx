import React from 'react';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import Layout from './components/Layout';
import { AuthProvider } from './utils/token';
import { ChatRoute } from './components/ChatRoute';
import {
  createHashHistory,
  ReactLocation,
  Router,
} from "@tanstack/react-location";

const history = createHashHistory();
const location = new ReactLocation({ history });

function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'dark',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  return (
    <Router
      location={location}
      routes={[
        { path: "/chats/:chatId", element: <ChatRoute /> },
      ]}
    >
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <AuthProvider>
            <Layout />
          </AuthProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </Router>
  );
}

export default App;
