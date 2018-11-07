const DailyReportList = {
  dailyReports({ dailyReportIds, orderBy }, args, ctx, info) {
    const dailyReportIdsFilter = { id_in: dailyReportIds };
    return ctx.db.query.dailyReports({ where: dailyReportIdsFilter, orderBy }, info);
  }
};

module.exports = { DailyReportList };
