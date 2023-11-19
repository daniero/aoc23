import '@mantine/core/styles.css';
import { Container, MantineProvider } from '@mantine/core';
import { theme } from './theme';
import { Header } from './components/Header.tsx';
import { Route, useRoute } from 'wouter';
import { Solution } from './components/Solution.tsx';
import { type ReactElement } from 'react';

export default function App(): ReactElement {
  const [matcb, params] = useRoute('/day:day');
  const day = matcb ? parseInt(params.day) : undefined;

  return (
    <MantineProvider theme={theme} defaultColorScheme={'dark'}>
      <Container size={'xl'}>
        <Header current={day} />
        <main>
          <Route path={'/'}>
            <h1>Welcome!</h1>
          </Route>
          <Route path={'/day:day'}>
            <Solution day={day ?? 0} />
          </Route>
        </main>
      </Container>
    </MantineProvider>
  );
}
