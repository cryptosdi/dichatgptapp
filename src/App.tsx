import React from 'react';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import Layout from './components/Layout';
import { AuthProvider } from './utils/token';
import { ChatRoute } from './routes/ChatRoute';
import { IndexRoute } from './routes/IndexRoute';
import {
  createHashHistory,
  ReactLocation,
  Router,
} from "@tanstack/react-location";
import { Notifications } from "@mantine/notifications";

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
        { path: "/", element: <IndexRoute /> },
        { path: "/chats/:chatId", element: <ChatRoute /> },
      ]}
    >
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <AuthProvider>
            <Layout />
            <Notifications />
          </AuthProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </Router>
  );
}

export default App;
