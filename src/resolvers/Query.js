const Query = {
  info: () => `This is the API of a Reporting System`,
  divisions: (parent, args, { db }, info) => {
    return db.query.divisions({}, info)
  }
};

module.exports = {Query};

