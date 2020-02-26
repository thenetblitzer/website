import { createMuiTheme } from '@material-ui/core/styles'

export const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#CEFFB5",
    },
  },
  overrides: {
    MuiTab: {
      textColorPrimary: {
        fontWeight: 500,
        fontSize: '1.15rem',
        fontFamily: "'Lato', sans-serif",
        color: '#aaa',
        '&.Mui-selected': {
          color: "#eaeaea",
        },
        '&.logo-tab': {
          color: '#eaeaea',
          paddingLeft: '20px',  
        },
        transition: "all 0.3s",
      }
    },
    PrivateTabIndicator: {
      colorPrimary: {
        backgroundColor: "#eaeaea",
        '@media (max-width: 960px)': {
          opacity: 0,
        }
      },
    },
    MuiExpansionPanel: {
      root: {
        borderRadius: 0,
        '&.Mui-expanded': {
          margin: 0,
        },
      },
      rounded: {
        borderRadius: 0,
        '&:first-child': {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        },
        '&:last-child': {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }
      }
    },
    MuiExpansionPanelSummary: {
      content: {
        flexDirection: "column",
        margin: 0,
        '&.Mui-expanded': {
          margin: 0,
        }
      }
    },
    MuiDrawer: {
      paper: {
        background: "#2a2a2a",
      }
    },
    MuiList: {
      padding: {
        paddingTop: 0,
      }
    },
    MuiListItem: {
      button: {
        minWidth: "160px",
        color: "#eaeaea",
      }
    },
    MuiListItemText: {
      root: {
        marginTop: 0,
        marginBottom: 0,
      }
    },
    MuiTypography: {
      body1: {
        fontFamily: "'Lato', sans-serif",
        fontSize: "1.25rem",
        fontWeight: 300,
      }
    },
    MuiPaper: {
      root: {
        backgroundColor: "rgba(0, 0, 0, 0)",
      },
      elevation24: {
        boxShadow: "none",
      },
    },
  }
})