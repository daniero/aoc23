import { createTheme, type MantineColorsTuple } from '@mantine/core';

const xred: MantineColorsTuple = [
  '#ffeaec',
  '#fdd4d6',
  '#f4a7ac',
  '#ec777e',
  '#e64f57',
  '#e3353f',
  '#e22732',
  '#c91a25',
  '#b31220',
  '#9e0419',
];

const xgreen: MantineColorsTuple = [
  '#f1faef',
  '#e1f3df',
  '#bee6b8',
  '#98d98f',
  '#79ce6c',
  '#66c857',
  '#5bc54a',
  '#4bad3c',
  '#419a34',
  '#338528',
];

export const theme = createTheme({
  primaryColor: 'xred',
  colors: {
    xred,
    xgreen,
  },
});
