function formatQuery(query, searchAbleProperties) {
  const formattedQuery = {};
  // [year, type]
  for (const searchAbleProperty of searchAbleProperties) {
    //  { year: 2020, limit: 10 }
    const value = query[searchAbleProperty];

    if (value) {
      formattedQuery[searchAbleProperty] = value; // { year: 2020 }
    }
  }

  return formattedQuery;
}

function validateQuery(query, permittedProperties, searchAbleProperties) {
  const keys = Object.keys(query);
  const valid = keys.every((key) => permittedProperties.includes(key));

  if (valid) {
    const formattedQuery = formatQuery(query, searchAbleProperties);
    return [formattedQuery, null];
  } else {
    return [
      null,
      `Invalid parameter, acceptable parameters are: ${permittedProperties.join(
        ", "
      )}`,
    ];
  }
}

module.exports = {
  validateQuery,
  formatQuery,
};
