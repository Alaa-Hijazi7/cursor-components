import { extendTheme, theme as DefaultTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "Italiana, sans-serif",
    body: "Italiana, sans-serif"
  },
  shadows: {
    outline: "0 0 0 3px var(--chakra-colors-pink-400)"
  }
});

export default theme;
