const createServer = require('./createServer');
const session = require('express-session');

const server = createServer();

server.express.use(
  session({
    name: 'qid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
);

const cors = {
  credentials: true,
  origin: process.env.FRONT_END_URL
};

server.start({ cors }, () =>
  console.log(`Server is running on ${process.env.GRAPHQL_SERVER_ENDPOINT}`)
);
