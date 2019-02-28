import React from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import routes from '../Routes'
import { Provider } from 'react-redux'
import { getClientStore } from '../store'

const App = () => (
  <Provider store={ getClientStore() }>
    <BrowserRouter>
      <div>
        {
          routes.map(route => (
            <Route {...route} />
          ))
        }
      </div>
    </BrowserRouter>
  </Provider>
);

ReactDom.hydrate(<App/>, document.getElementById('root'));
