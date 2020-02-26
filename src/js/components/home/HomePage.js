import React, { Component, Suspense } from 'react'

import ErrorBoundary from '../shared/ErrorBoundary'
import LoadingBlock from '../shared/LoadingBlock'
const SplashArt = React.lazy(() => import('./SplashArt'))

class HomePage extends Component {

  render = () => {

    return (
      <div className="home-wrapper">
        <ErrorBoundary canRetry>
          <Suspense fallback={<LoadingBlock className="bright-text"/>}>
            <SplashArt />
          </Suspense>
        </ErrorBoundary>
      </div>
    )
  }
}

export default HomePage