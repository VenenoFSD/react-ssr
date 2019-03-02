import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { renderRoutes } from 'react-router-config'

export const render = (req, store, routes) => {
  const content = renderToString((
    <Provider store={ store }>
      <StaticRouter context={{}} location={ req.path }>
        <div>{ renderRoutes(routes) }</div>
      </StaticRouter>
    </Provider>
  ));

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>ssr</title>
      </head>
      <body>
        <div id="root">${content}</div>
      </body>
      <script>
        window.context = {
          state: ${JSON.stringify(store.getState())}
        }
      </script>
      <script src="/index.js"></script>
    </html>
  `;
};
