/** @type {import('tailwindcss').Config} */

export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
  extend: {
    spacing: {
      '14': '3.5rem',
    },
    width: {
      '64': '16rem',
      '96': '24rem',
    },
    height: {
      'custom': '32rem',
    },
    fontSize: {
      '18': '1.125rem',
    },
    screen:{
      'xs':'280',
      'xsm':'400',
    },
    textColor: {
      'custom': '#21D0B2',
    },
    borderColor: {
      'custom': '#21D0B2',
    },

    
  },
};
export const variants = {};
export const plugins = [];