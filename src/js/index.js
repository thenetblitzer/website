import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import { theme } from './theme'
import App from './components/App'

import { pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const Root = (props) => {

  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  )
}

export default Root