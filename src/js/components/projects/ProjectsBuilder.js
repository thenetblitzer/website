import React, { Component } from 'react'

import ProjectExpansion from './ProjectExpansion'
import LoadingBlock from '../shared/LoadingBlock'

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
          ? <LoadingBlock className="bright-text" />
          : this.createProjects(projects)
        }
      </div>
    )
  }
}

export default ProjectsBuilder