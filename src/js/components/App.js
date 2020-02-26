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
  state = {
    currentTab: 1,
    projects: undefined,
    loading: true,
    drawerOpen: false,
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

  toggleDrawer = (open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    this.setState({
      drawerOpen: open,
    })
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
              onChange={(e, value) => {this.setState({ currentTab: value })}}
              aria-label="Portfolio navigation"
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
            <a>
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
