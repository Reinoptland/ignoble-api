const yup = require("yup");

const schema = yup
  .object()
  .shape({
    year: yup.number().integer().min(1991).max(new Date().getFullYear()),
    type: yup.string().uppercase(),
    limit: yup.number().integer().min(1).default(20),
    offset: yup.number().integer().min(0).default(0),
  })
  .noUnknown();

module.exports = schema;
