const division = {
  async createDivision(parent, args, { db }, info) {
    const { name, description } = args.data;
    return db.mutation.createDivision({
      data: { name, description },
      info
    })
  },

  async updateDivision(parent, args, { db }, info) {
    const { id, name, description } = args.data;
    return db.mutation.updateDivision({
      where: { id },
      data: { name, description },
      info
    })
  },

  async deleteDivision(parent, args, { db }, info) {
    const { id } = args.data;
    return db.mutation.deleteDivision({
      where: { id },
      info
    })
  }

};

module.exports = {
  division
};

