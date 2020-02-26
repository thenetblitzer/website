import React, { Fragment } from 'react'
import Dialog from '@material-ui/core/Dialog'
import Slider from 'react-slick'
import ReactResizeDetector from 'react-resize-detector'
import ReactPlayer from 'react-player'

import FullscreenIcon from '@material-ui/icons/Fullscreen'
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit'
 
class MediaSlider extends React.Component {

  state = {
    width: 0,
    height: 0,
    fWidth: 0,
    fHeight: 0,
    fullscreen: false,
    currentSlide: 0,
  }

  onResize = (w, h) => {
    const { fullscreen } = this.state

    const width = w - (w % 16)
    const height = (width / 16) * 9
    
    this.setState({
      width,
      height,
    })
  }

  onFullscreenResize = (w, h) => {
    const maxWidth = w - (w % 16) - 64
    const maxHeight = h - (h % 9) - 64

    if (maxWidth / 16 * 9 > maxHeight) {
      this.setState({
        fWidth: maxHeight / 9 * 16,
        fHeight: maxHeight,
      })
    }
    else {
      this.setState({
        fWidth: maxWidth,
        fHeight: maxWidth / 16 * 9,
      })
    }
  }

  handleFullscreen = (open) => {
    this.setState({
      fullscreen: open,
    })
  }

  createMediaElement = (mediaObj, key) => {
    const { width, height, fWidth, fHeight, fullscreen } = this.state
    let mediaElement = null

    const w = fullscreen ? fWidth : width
    const h = fullscreen ? fHeight : height

    switch (mediaObj.type) {
      default:
      case "image":
        mediaElement = (
          <div key={key}>
            <img 
              src={mediaObj.source} 
              alt={mediaObj.alt || ""} 
            />
          </div>
        )
        break
      case "video":
        mediaElement = (
          <div key={key}>
            <ReactPlayer 
              url={mediaObj.source} 
              playing={false}
              controls
              width={w}
              height={h}
            />
          </div>
        )
        break
    }

    return mediaElement
  }

  render = () => {
    const { media } = this.props
    let { width, height, fullscreen, fWidth, fHeight, currentSlide } = this.state

    const sliderElements = media.map((mediaObj, arrayKey) => {
      const key = arrayKey
      return this.createMediaElement(mediaObj, key)
    })

    var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true,
      initialSlide: currentSlide
    }

    return (
      <Fragment>
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize}>
          <Slider {...settings} style={{width: `${width}px`, height: `${height}px`}} afterChange={index => this.setState({currentSlide: index})}>
            {sliderElements}
          </Slider>
          <button onClick={() => this.handleFullscreen(true)} className="media-slider-fullscreen-button">
            {
              (fullscreen ?
              <FullscreenExitIcon /> :
              <FullscreenIcon />
            )}
          </button>
        </ReactResizeDetector>
        <Dialog maxWidth={false} onClose={() => {this.handleFullscreen(false)}} open={fullscreen}>
          <div className="media-slider-fullscreen-wrapper">
            <ReactResizeDetector handleWidth handleHeight onResize={this.onFullscreenResize}>
              <div className="media-slider-fullscreen-inner" style={{width: `${fWidth}px`, height: `${fHeight}px`}}>
                <Slider {...settings} className="media-slider-fullscreen" style={{width: `${fWidth}px`, height: `${fHeight}px`}} afterChange={index => this.setState({currentSlide: index})}>
                  {sliderElements}
                </Slider>
                <button onClick={() => this.handleFullscreen(false)} className="media-slider-fullscreen-button">
                  {
                    (fullscreen ?
                    <FullscreenExitIcon /> :
                    <FullscreenIcon />
                  )}
                </button>
              </div>
            </ReactResizeDetector>
          </div>
        </Dialog>
      </Fragment>
    )
  }
}

export default MediaSlider