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

    if (width > w) {
      height = w / 8.5 * 11
    }
    else {
      height = h
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
        <div className="resume-inner">
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
        <div className="resume-opener">
          <a rel="noopener noreferrer" target="_blank" href="/data/resume.pdf">
            open in new tab
          </a>
        </div>
      </div>
    )
  }
}

export default ResumePage