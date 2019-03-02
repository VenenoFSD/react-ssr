import express from 'express'
import { render } from './util'
import { matchRoutes } from 'react-router-config'
import { getStore } from '../store'
import routes from '../Routes'
import proxy from 'express-http-proxy'

const app = express();

app.use(express.static('public'));

// 请求代理转发
app.use('/api', proxy('localhost:1201', {
  proxyReqPathResolver: req => {
    return req.url;
  }
}));

app.get('*', (req, res) => {

  const store = getStore();
  const matchedRoutes = matchRoutes(routes, req.path);
  const promises = [];

  // matchedRoutes 中的组件的 loadData 都要执行一次
  matchedRoutes.forEach(item => {
    if (item.route.loadData) {
      promises.push(item.route.loadData(store));
    }
  });

  Promise.all(promises).then(() => {
    res.send(render(req, store, routes));
  });

});

app.listen(3000, () => console.log('app listening on port 3000...'));
