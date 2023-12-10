import { Anchor, Button, Group } from '@mantine/core';
import { type MouseEventHandler, type ReactElement } from 'react';
import { Link } from 'wouter';
import '@mantine/core/styles/UnstyledButton.css';
import '@mantine/core/styles/Button.css';
import { daysSolved } from '../days-solved.ts';
import steez from './Header.module.scss';

export function Header({ current }: { current?: number }): ReactElement {
  const prevent: MouseEventHandler = (event) => {
    event.preventDefault();
  };

  return (
    <header>
      <Link href="/">
        <Anchor c={'white'} className={steez.logo}>
          <span className={steez.aoc}>Advent of Code</span>{' '}
          <span className={steez.y23}>2023</span>
        </Anchor>
      </Link>
      <nav>
        <Group gap={3}>
          {Object.entries(daysSolved).map(([day, solved]) => {
            const isCurrentPage = current?.toString() === day;
            return (
              <Link
                key={day}
                href={'/day' + day}
                onClick={solved === false ? prevent : undefined}
              >
                <Button
                  component={'a'}
                  size={'xs'}
                  radius={'xl'}
                  color={'xred'}
                  classNames={
                    solved === 'fancy'
                      ? { root: steez.fancySolution }
                      : undefined
                  }
                  disabled={solved === false}
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
