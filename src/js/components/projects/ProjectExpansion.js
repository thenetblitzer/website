import React, { useState } from 'react'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Hidden from '@material-ui/core/Hidden'

import MediaSlider from '../shared/MediaSlider'

const ProjectExpansion = (props) => {
  const { project, id } = props

  const [expanded, setExpanded] = useState(false)
  const longDescription = project.longDescription || project.shortDescription
  let descriptionBlocks = longDescription.split('\n')
  descriptionBlocks = descriptionBlocks.map((block, key) => {
    const keyID = key
    return (
      <p key={keyID}>
        {block}
      </p>
    )
  })

  return (
    <ExpansionPanel className="project-panel-wrapper" expanded={expanded}>
      <ExpansionPanelSummary
        aria-controls={`project-panel-header-${id}`}
        id={`project-panel-header-${id}`}
        className={`project-panel-header${expanded ? " panel-expanded" : ""}`}
        onClick={() => {setExpanded(!expanded)}}
        style={{ 
          backgroundImage: `url(${project.headerImage})`, 
          backgroundPositionX: (project.headerXPos ? project.headerXPos : "100%"), 
          backgroundSize: (project.headerSize ? project.headerSize : "60%") 
        }}
      >
        <div className="project-title">
          {project.title}
        </div>
        <Hidden smDown>
          {createDateText(project.dateType, project.date)}
          {project.shortDescription && <div className="project-short-description">
            {project.shortDescription}
          </div>}
        </Hidden>
        <Hidden mdUp>
          {createDateText(project.dateType, (project.dateShort | project.date))}
        </Hidden>
        <div className="project-expansion-key">
          Click to view more...
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className="project-panel-content">
        <div className="project-content-information">
          <div className="project-content-media">
            <MediaSlider media={project.media} />
          </div>
          
          {project.link && <div className="project-link project-text-box">
            <span>
              {"Link to view: "}
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                {project.linkShort || project.link}
              </a>
            </span>
          </div>}
          {(project.longDescription || project.shortDescription) && <div className="project-long-description project-text-box">
            <span>
              Description:
            </span>
            {descriptionBlocks}
          </div>}
          {project.technologies && createTechnologies(project.technologies)}
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

const createDateText = (dateType, dateObject) => {
  let dateText

  switch (dateType) {
    case "range":
      dateText = (
        <div className="project-date">
          {`${dateObject.start} - ${dateObject.end}`}
        </div>
      )
      break
    case "single":
      dateText = (
        <div className="project-date">
          {`${dateObject.date}`}
        </div>
      )
      break
    default:
      dateText = null
  }

  return dateText
}

const createTechnologies = (techs) => {
  let techList = []

  techs.forEach((tech, key) => {
    const keyID = key
    techList.push(<li key={keyID} className="project-tech-item">{tech}</li>)
  })

  return (
    <div className="project-tech-list-wrapper project-text-box">
      <span>
        Technologies:
      </span>
      <ul className="project-tech-list">
        {techList}
      </ul>
    </div>
  )
}

export default ProjectExpansion