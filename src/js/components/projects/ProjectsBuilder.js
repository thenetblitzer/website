import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

import ProjectExpansion from './ProjectExpansion'

class ProjectsBuilder extends Component {
  
  createProjects = (projects) => {
    let projectArray = []
    projects.forEach((project, key) => {
      const keyID = key
      projectArray.push(
        <ProjectExpansion 
          project={project}
          id={keyID}
          key={keyID}
        />
      )
    })

    return projectArray
  }

  render = () => {
    const { projects } = this.props

    return (
      <div className="projects-wrapper">
        {projects === undefined
          ? <CircularProgress />
          : this.createProjects(projects)
        }
      </div>
    )
  }
}

export default ProjectsBuilder