import app from './app';

require('./db/mongoose');

const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
