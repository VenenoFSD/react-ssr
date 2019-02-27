import express from 'express'
import { render } from './util'

const app = express();

app.use(express.static('public'));

app.get('*', (req, res) => {
  res.send(render(req));
});

app.listen(3000, () => console.log('app listening on port 3000...'));
