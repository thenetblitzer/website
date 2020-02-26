import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'

const LoadingBlock = (props) => {
  const { className } = props

  return (
    <div className={`loading-block-wrapper ${className}`}>
      <div className="loading-block-inner">
        <h4>
          Loading...
        </h4>
        <CircularProgress color="secondary" />
      </div>
    </div>
  )
}

LoadingBlock.propTypes = {
  className: PropTypes.string,
}

LoadingBlock.defaultProps = {
  className: "",
}

export default LoadingBlock