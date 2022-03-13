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
    primary: "#31589B",
    secondary: "#63A375"
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
    secondary: "#63A375"
  },
  mode: 'dark'
};