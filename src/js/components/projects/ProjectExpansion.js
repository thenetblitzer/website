import React, { useState } from 'react'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Hidden from '@material-ui/core/Hidden'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'

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

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))
  let backgroundSize, backgroundPositionX
  if (!mobile) {
    backgroundSize = (project.headerSize ? project.headerSize : "auto 240px")
    backgroundPositionX = (project.headerXPos ? project.headerXPos : "100%")
  }
  else {
    backgroundSize = (project.headerSizeMobile ? project.headerSizeMobile : "auto 150px")
    backgroundPositionX = (project.headerXPosMobile ? project.headerXPosMobile : "100%")
  }

  return (
    <ExpansionPanel className="project-panel-wrapper" expanded={expanded}>
      <ExpansionPanelSummary
        aria-controls={`project-panel-header-${id}`}
        id={`project-panel-header-${id}`}
        className={`project-panel-header ${expanded ? "panel-expanded" : ""} ${project.expandable ? "" : "panel-empty"}`}
        onClick={project.expandable ? () => {setExpanded(!expanded)} : null}
        style={{ 
          backgroundImage: `url(${project.headerImage})`, 
          backgroundPositionX, 
          backgroundSize
        }}
      >
        <div className="project-panel-header-text-wrapper">
          <h2 className="project-title">
            {project.title}
          </h2>
          <Hidden smDown>
            {createDateText(project.dateType, project.date)}
            {project.shortDescription && <h5 className="project-short-description">
              {project.shortDescription}
            </h5>}
          </Hidden>
          <Hidden mdUp>
            {createDateText(project.dateType, project.dateShort)}
          </Hidden>
          {project.expandable && <h6 className="project-expansion-key">
            {"learn more"}
            {<KeyboardArrowDownIcon className="project-expansion-icon" />}
          </h6>}
        </div>
      </ExpansionPanelSummary>
      {project.expandable && <ExpansionPanelDetails className="project-panel-content">
        <div className="project-content-information">
          <div className="project-content-media">
            <MediaSlider media={project.media} />
          </div>
          <div className="project-content-text">
            {project.link && <div className="project-link project-text-box">
              <span>
                {"Link to view: "}
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  {project.linkShort || project.link}
                </a>
              </span>
            </div>}
            {project.role && <div className="project-role project-text-box">
              <span>
                {"Project role: "}
                {project.role}
              </span>
            </div>}
            {(project.longDescription || project.shortDescription) && <div className="project-long-description project-text-box">
              {descriptionBlocks}
            </div>}
            {project.technologies && createTechnologies(project.technologies)}
            <div className="project-collapse" onClick={project.expandable ? () => {setExpanded(!expanded)} : null} >
              {<KeyboardArrowDownIcon className="project-expansion-icon" />}
              {"close"}
            </div>
          </div>
        </div>
      </ExpansionPanelDetails>}
    </ExpansionPanel>
  )
}

const createDateText = (dateType, dateObject) => {
  let dateText

  switch (dateType) {
    case "range":
      dateText = (
        <h4 className="project-date">
          {`${dateObject.start} - ${dateObject.end}`}
        </h4>
      )
      break
    case "single":
      dateText = (
        <h4 className="project-date">
          {`${dateObject.date}`}
        </h4>
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