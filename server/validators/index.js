const validationMiddleWareFactory = require("./middleware");
const prizeSchema = require("./schemas/prizes");

module.exports = {
  validatePrizesQueries: validationMiddleWareFactory(prizeSchema),
};
