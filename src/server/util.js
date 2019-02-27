import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import Routes from '../Routes'

export const render = req => {
  const content = renderToString((
    <StaticRouter context={{}} location={ req.path }>
      { Routes }
    </StaticRouter>
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
      <script src="/index.js"></script>
    </html>
  `;
};
