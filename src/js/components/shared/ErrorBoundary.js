import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReplayIcon from '@material-ui/icons/Replay'
import Button from '@material-ui/core/Button'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)

    this.state = {
        hasError: false,
    }
  }

  static getDerivedStateFromError = (error) => {
    return { hasError: true, }
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
    })
  }

  tryReloadContent = () => {
    this.setState({
      hasError: false,
    })
  }

  render = () => {
    const { hasError } = this.state
    const { children, className, canRetry } = this.props

    if (hasError) {
      return (
        <div className={`error-boundary-wrapper ${className}`}>
          <div className="error-boundary-inner">
            <h4>An error occurred.</h4>
            {canRetry ? 
              (
                <div className="error-boundary-retry">
                  <p>
                    Click below to reload the content.
                  </p>
                  <Button onClick={this.tryReloadContent} variant="contained">
                    <ReplayIcon />
                  </Button>
                </div>
              ) :
              (
                <p>
                  Check your network connection and reload the page.
                </p>
              )
            }
          </div>
        </div>
      )
    }

    return children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  canRetry: PropTypes.bool,
}

ErrorBoundary.defaultProps = {
  className: "",
  canRetry: false,
}

export default ErrorBoundary