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

      /* 数据请求失败 Promise 处理（容错处理）
      * item.route.loadData(store) 是对应一个个组件的 Promise 对象
      * 若其中部分组件数据请求失败或请求过慢，会触发其 catch 或处于 pending 状态
      * 此时加载错误的 Promise 会走 Promise.all.catch
      * 为了使所有 Promise（无论成功与否）都走 Promise.all.then
      * 将 item.route.loadData(store) 再包成一个 Promise
      * 无论 item.route.loadData(store) 触发 then 或 catch 都 resolve（外部 promise 永远是成功的）
      * */
      const promise = new Promise(resolve => {
        item.route.loadData(store).then(resolve).catch(resolve);
      });

      promises.push(promise);
    }
  });

  Promise.all(promises).then(() => {

    // 定义 staticRouter 的 context
    const context = {};
    const html = render(req, store, routes, context);

    if (context.notFound) { // 如果进入 404 页面会改写 context
      res.status(404);
      res.send(html);
    } else if (context.action === 'REPLACE') { // 页面重定向时改写状态码
      res.redirect(301, context.url);
    } else { // 200
      res.send(html);
    }

  });

});

app.listen(3000, () => console.log('app listening on port 3000...'));
