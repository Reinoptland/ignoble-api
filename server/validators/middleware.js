function validationMiddleWareFactory(schema) {
  return async function validationMiddleWare(req, res, next) {
    try {
      const { limit, offset, ...validatedQuery } = await schema.validate(
        req.query,
        {
          abortEarly: false,
        }
      );

      req.limit = limit;
      req.offset = offset;
      req.validatedQuery = validatedQuery;
      next();
    } catch (error) {
      res.status(400).json({ message: "Bad request", errors: error.errors });
    }
  };
}

module.exports = validationMiddleWareFactory;
