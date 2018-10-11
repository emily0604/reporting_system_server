const division = {
  createDivision: async (parent, args, {db}, info) => {
    const {name, description} = args.data;
    return db.mutation.createDivision({
      data: { name, description },
      info
    })
  },

  updateDivision: async (parent, args, {db}, info) => {
    const {id, name, description} = args.data;
    return db.mutation.updateDivision({
      where: { id },
      data: { name, description },
      info
    })
  },

  deleteDivision: async (parent, args, {db}, info) => {
    const {id} = args.data;
    return db.mutation.deleteDivision({
      where: {id},
      info
    })
  }
};

module.exports = {division};

