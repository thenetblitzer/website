import React, { Component } from 'react'
import axios from 'axios'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import MenuIcon from '@material-ui/icons/Menu'
import ListItemText from '@material-ui/core/ListItemText'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'

import TabPanel from './shared/TabPanel'
import ProjectsBuilder from './projects/ProjectsBuilder'
import ResumePage from './resume/ResumePage'
import AboutPage from './about/AboutPage'
import HomePage from './home/HomePage'

import '../../css/main.css'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

class App extends Component {
  constructor(props) {
    super(props)

    this.navRef = React.createRef()

    this.state = {
      currentTab: 1,
      projects: undefined,
      loading: true,
      drawerOpen: false,
    }
  }

  a11yProps (label) {
    return {
      id: `tab-panel-${label}`,
      'aria-controls': `tab-${label}`,
    };
  }

  componentDidMount () {
    axios.get("/data/projects.json")
    .then(res => {
      const data = res.data

      this.setState({
        projects: data.projects,
        loading: false,
      })
    })
  }

  componentWillUnmount = () => {
    clearInterval(this.intervalClock)
  }

  setupRainbowTab = (element) => {
    if (element && element.offsetParent) {
      this.tabIndicator = element

      const tabText = document.querySelector('nav .Mui-selected>span')

      const colorSteps = 4
      let colorString = 'linear-gradient(to right, '

      for (let i = 0; i < colorSteps; i++) {
        const hue = (1 * i / (colorSteps - 1)) * 1.5
        console.log(hue)
        
        const sat = 1, val = 1
        const chroma = sat * val
        const x = chroma * (1 - Math.abs((hue % 2) - 1))
        let r = 0, g = 0, b = 0
        if (hue >= 0 && hue <= 1) {
          g = x
          r = chroma
        } else if (hue > 1 && hue <= 2) {
          r = x
          g = chroma
        } else if (hue > 2 && hue <= 3) {
          b = x
          g = chroma
        } else if (hue > 3 && hue <= 4) {
          g = x
          b = chroma
        } else if (hue > 4 && hue <= 5) {
          r = x
          b = chroma
        } else if (hue > 5 && hue <= 6) {
          b = x
          r = chroma
        }
        const m = val - chroma
        const color = {
          r: (r + m) * 255,
          g: (g + m) * 255,
          b: (b + m) * 255,
        }
        colorString = `${colorString}rgb(${color.r}, ${color.g}, ${color.b})`

        if (i < colorSteps - 1) {
          colorString = `${colorString}, `
        }
        else {
          colorString = `${colorString})`
        }
      }

      this.tabIndicator.style.background = colorString
    }
  }

  toggleDrawer = (open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    this.setState({
      drawerOpen: open,
    })
  }

  changeTab = (e, value) => {
    console.dir(e)
    
    if (this.tabIndicator) {
      const colorSteps = 4
      let colorString = 'linear-gradient(to right, '

      for (let i = 0; i < colorSteps; i++) {
        const hue = ((value - 1) + (1 * i / (colorSteps - 1))) * 1.5
        
        const sat = 1, val = 1
        const chroma = sat * val
        const x = chroma * (1 - Math.abs((hue % 2) - 1))
        let r = 0, g = 0, b = 0
        if (hue >= 0 && hue <= 1) {
          g = x
          r = chroma
        } else if (hue > 1 && hue <= 2) {
          r = x
          g = chroma
        } else if (hue > 2 && hue <= 3) {
          b = x
          g = chroma
        } else if (hue > 3 && hue <= 4) {
          g = x
          b = chroma
        } else if (hue > 4 && hue <= 5) {
          r = x
          b = chroma
        } else if (hue > 5 && hue <= 6) {
          b = x
          r = chroma
        }
        const m = val - chroma
        const color = {
          r: (r + m) * 255,
          g: (g + m) * 255,
          b: (b + m) * 255,
        }
        colorString = `${colorString}rgb(${color.r}, ${color.g}, ${color.b})`

        if (i < colorSteps - 1) {
          colorString = `${colorString}, `
        }
      }

      this.tabIndicator.style.background = `${colorString})`
    }

    this.setState({ currentTab: value })
  }

  render () {
    const { currentTab, loading, projects, drawerOpen } = this.state

    const sideList = (
      <div
        className="nav-mobile-drawer"
        role="presentation"
        onClick={this.toggleDrawer(false)}
        onKeyDown={this.toggleDrawer(false)}
      >
        <List>
          <ListItem button key="Home" onClick={() => this.setState({ currentTab: 1})}>
            <ListItemText primary="HOME" />
          </ListItem>
          <ListItem button key="Projects" onClick={() => this.setState({ currentTab: 2})}>
            <ListItemText primary="PROJECTS" />
          </ListItem>
          <ListItem button key="About" onClick={() => this.setState({ currentTab: 3})}>
            <ListItemText primary="ABOUT" />
          </ListItem>
          <ListItem button key="Resume" onClick={() => this.setState({ currentTab: 4})}>
            <ListItemText primary="RESUME" />
          </ListItem>
        </List>
      </div>
    )

    return (
      <div className="App">
        <nav className="nav-wrapper">
          <Hidden smDown>
            <Tabs
              value={currentTab}
              indicatorColor="primary"
              textColor="primary"
              onChange={this.changeTab}
              aria-label="Portfolio navigation"
              TabIndicatorProps={{
                ref: this.setupRainbowTab
              }}
            >
              <Tab 
                label="Luke Miller" 
                disabled
                className="logo-tab" />
              <Tab 
                label="Home" 
                {...this.a11yProps("home")}
                disabled={loading} />
              <Tab 
                label="Projects" 
                {...this.a11yProps("projects")}
                disabled={loading} />
              <Tab 
                label="About" 
                {...this.a11yProps("about")}
                disabled={loading} />
              <Tab 
                label="Resume" 
                {...this.a11yProps("resume")}
                disabled={loading} />
            </Tabs>
          </Hidden>
          <Hidden mdUp>
            <div className="nav-mobile">
              <Tabs
                value={0}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab 
                  label="Luke Miller" 
                  disabled
                  className="logo-tab" />
                <Tab 
                  icon={<MenuIcon />} 
                  onClick={this.toggleDrawer(true)}
                  className="mobile-menu-tab" />
              </Tabs>
              <Drawer open={drawerOpen} onClose={this.toggleDrawer(false)} anchor="right" >
                {sideList}
              </Drawer>
            </div>
          </Hidden>
        </nav>
        <TabPanel
          value={currentTab}
          index={1}
          label="home"
          >
            <HomePage />
        </TabPanel>
        <TabPanel
          value={currentTab}
          index={2}
          label="projects"
          >
            <ProjectsBuilder projects={projects} />
        </TabPanel>
        <TabPanel
          value={currentTab}
          index={3}
          label="about"
          >
            <AboutPage />
        </TabPanel>
        <TabPanel
          value={currentTab}
          index={4}
          label="resume"
          >
            <ResumePage />
        </TabPanel>
        <footer className="footer-wrapper">
          <div className="footer-inner-container">
            <span>
              &copy; 2020 Luke Miller
            </span>
            <span className="spacer">|</span>
            <a href="mailto:lukemillergames@gmail.com">
              lukemillergames@gmail.com
            </a>
            <span className="spacer">|</span>
            <a href="https://linkedin.com/ln/lukemillergames" rel="noopener noreferrer" target="_blank">
              LinkedIn
            </a>
          </div>
        </footer>
      </div>
    )
  }
}

export default App;
