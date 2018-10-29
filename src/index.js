const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const createServer = require('./createServer');

const server = createServer();

server.express.use(cookieParser());

// Decode the JWT so we can get the user Id on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId onto the req for future requests to access
    req.userId = userId;
  }
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONT_END_URL,
    },
  },
  () => console.log(`Server is running on ${process.env.GRAPHQL_SERVER_ENDPOINT}`)
);
