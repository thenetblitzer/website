import React from "react"
import PropTypes from "prop-types"


const TabPanel = (props) => {
  const { children, value, index, label, ...other } = props

  return (
    <div 
      className="tab-panel-wrapper"
      hidden={value !== index}
      id={`tab-panel-wrapper-${label}`}
      aria-labelledby={`tab-${label}`}
      >
        {value === index && children}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  label: PropTypes.any.isRequired,
}

export default TabPanel