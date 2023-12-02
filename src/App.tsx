import '@mantine/core/styles.css';
import { Container, MantineProvider } from '@mantine/core';
import { theme } from './theme';
import { Header } from './components/Header.tsx';
import { Route, useRoute } from 'wouter';
import { Solution } from './components/Solution.tsx';
import { type ReactElement } from 'react';
import { Welcome } from './Welcome.tsx';

export default function App(): ReactElement {
  const [match, params] = useRoute('/day:day');
  const day = match ? parseInt(params.day) : undefined;

  return (
    <MantineProvider theme={theme} defaultColorScheme={'dark'}>
      <Container size={'xl'}>
        <Header current={day} />
        <main>
          <Route path={'/'}>
            <Welcome />
          </Route>
          <Route path={'/day:day'}>
            <Solution day={day ?? 0} />
          </Route>
        </main>
      </Container>
    </MantineProvider>
  );
}
