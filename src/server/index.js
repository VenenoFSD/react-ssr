import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import Home from '../containers/Home'

const app = express();
const content = renderToString(<Home/>);

app.use(express.static('public'));

app.get('/', (req, res) => res.send(`
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
`));

app.listen(3000, () => console.log('app listening on port 3000...'));
