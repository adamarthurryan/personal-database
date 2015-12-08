import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import routes from '../common/routes.js'
import { match, RoutingContext } from 'react-router'

export default class Renderer {
  constructor (store) {
    this.store = store
  }


  handleRender(req, res) {
    let store = this.store

    // Send the rendered page back to the client
    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message)
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      } else if (renderProps) {
        // Render the component to a string
        const html = renderToString(
          <Provider store={store}>
            <RoutingContext {...renderProps} />    
          </Provider>
        )

        // Grab the initial state from our Redux store
        const initialState = store.getState()

        res.status(200).send(renderFullPage(html, initialState))
      } else {
        res.status(404).send('Not found')
      }
    })

  }
}

function renderFullPage(html, initialState) {
    return `
      <!doctype html>
      <html>
        <head>
          <title>Redux Universal Example</title>
          
          <!-- Mobile-specific -->
          <meta name="viewport" content="width=device-width, initial-scale=1">

          <!-- Font -->
          <link href='//fonts.googleapis.com/css?family=Raleway:400,300,600' rel='stylesheet' type='text/css'>

          <!-- CSS -->
          <link href="/assets/lib/normalize.css" rel="stylesheet">
          <link href="/assets/lib/skeleton.css" rel="stylesheet">

          <!-- Masonry -->
          <!--That I even considered this! <script src="https://cdnjs.cloudflare.com/ajax/libs/masonry/3.3.2/masonry.pkgd.min.js"></script>-->

          <!-- Favicon -->
          <link rel="shortcut icon" href="/assets/favicon.png">

        </head>
        <body>
          <div id="app">${html}</div>
          <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
          </script>
          <!-- <script>__REACT_DEVTOOLS_GLOBAL_HOOK__ = parent.__REACT_DEVTOOLS_GLOBAL_HOOK__</script> -->
          <script type="text/javascript" src="/assets/app.js"></script>
        </body>
      </html>
      `
}
