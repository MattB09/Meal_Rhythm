const shared = {
  Button: {
    buttonStyle: {
      borderRadius: 30
    }
  },
}

export const customLight = {
  ...shared,
  colors: {
    primary: "#83A2D8",
    secondary: "#7EB48E"
  },
  mode: 'light'
};

export const customDark = {
  ...shared,
  View: {
    backgroundColor: "black",
  },
  colors: {
    primary: "#31589B",
    secondary: "#5B9A6D"
  },
  mode: 'dark'
};