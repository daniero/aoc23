import { Anchor, Button, Group } from '@mantine/core';
import { type MouseEventHandler, type ReactElement } from 'react';
import { Link } from 'wouter';
import '@mantine/core/styles/UnstyledButton.css';
import '@mantine/core/styles/Button.css';
import { daysSolved } from '../days-solved.ts';

export function Header({ current }: { current?: number }): ReactElement {
  const prevent: MouseEventHandler = (event) => {
    event.preventDefault();
  };

  return (
    <header>
      <Link href="/">
        <Anchor c={'white'}>
          <span style={{ fontFamily: 'HELLO Holidays', fontSize: 70 }}>
            Advent of Code
          </span>{' '}
          <span
            style={{
              display: 'inline-block',
              fontSize: 28,
              transform: 'rotate(-10deg) translate(6px,-23px)',
            }}
          >
            2023
          </span>
        </Anchor>
      </Link>
      <nav>
        <Group gap={'3px'}>
          {Object.entries(daysSolved).map(([day, solved]) => {
            const isCurrentPage = current?.toString() === day;
            return (
              <Link
                key={day}
                href={'/day' + day}
                onClick={solved ? undefined : prevent}
              >
                <Button
                  component={'a'}
                  size={'xs'}
                  radius={'xl'}
                  color={'xred'}
                  disabled={!solved}
                  variant={isCurrentPage ? 'filled' : 'default'}
                  aria-current={isCurrentPage && 'page'}
                >
                  {day}
                </Button>
              </Link>
            );
          })}
        </Group>
      </nav>
    </header>
  );
}
