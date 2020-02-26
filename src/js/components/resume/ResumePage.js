import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import ReactResizeDetector from 'react-resize-detector'
import { Document, Page } from 'react-pdf'

class ResumePage extends Component {
  
  state = {
    loaded: false,
    pageCount: null,
    pageNumber: 1,
    height: 0,
  }

  onResize = (w, h) => {
    let height
    const width = h / 11 * 8.5

    if (width > (w - 32)) {
      height = (w - 32) / 8.5 * 11
    }
    else {
      height = h - 32
    }

    this.setState({
      height,
    })
  }

  onLoadSuccess = (data) => {
    const { pageCount } = data
    
    this.setState({
      loaded: true,
      pageCount,
    })
  }

  render = () => {
    const { loaded, pageCount, pageNumber, height } = this.state

    return (
      <div className="resume-wrapper">
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize}>
          <Document
            file="/data/resume.pdf"
            onLoadSuccess={this.onLoadSuccess}
            loading={(
              <div className="resume-background">
                <CircularProgress />
              </div>
            )}
          >
            <Page height={height} pageNumber={pageNumber} />
          </Document>
        </ReactResizeDetector>
      </div>
    )
  }
}

export default ResumePage