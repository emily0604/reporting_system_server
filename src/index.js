const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const createServer = require('./createServer');

const server = createServer();
const db = require('./db');

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

// Populates the user cookie on each request
server.express.use(async (req, res, next) => {
  if (!req.userId) return next();
  const user = await db.query.user({ where: { id: req.userId } }, `{ id, email, name }`);
  const roles = await db.query.roles(
    {
      where: {
        users_some: {
          id: user.id
        }
      }
    },
    `{ name }`
  );
  req.user = user;
  req.roles = roles;

  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONT_END_URL
    }
  },
  () => console.log(`Server is running on http://localhost:${process.env.PORT}`)
);
