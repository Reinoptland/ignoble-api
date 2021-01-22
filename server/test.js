const yup = require("yup");
// [x] Try out yup, to see what I get
// Try out yup in route to validate, year and type and limit and offset
// Try and write a middleware which I can plug in to many routes (cheated: I looked at an example)

// let schema = yup.object().shape({
//   name: yup.string().required(),
//   age: yup.number().required().positive().integer(),
//   email: yup.string().email(),
//   website: yup.string().url(),
//   createdOn: yup.date().default(function () {
//     return new Date();
//   }),
// });

// async function check() {
//   try {
//     const result = await schema.validate(
//       {
//         age: 24,
//         email: "bla",
//       },
//       { abortEarly: false }
//     );
//     console.log(result);
//   } catch (error) {
//     console.log(error);
//     console.log(error.errors);
//   }
// }

// check();

let schema = yup.object().shape({
  year: yup.number().integer().min(1991).max(new Date().getFullYear()),
  type: yup.string().uppercase(),
  limit: yup.number().integer().min(1).default(20),
  offset: yup.number().integer().min(0).default(0),
});

async function check() {
  try {
    const result = await schema.validate(
      {
        year: 2020,
        type: "PEACE",
        offset: 0,
        limit: 1000,
        bla: '<script>window.alert("hello world")</script>',
      },
      { abortEarly: false, stripUnknown: true }
    );
    console.log(result);
    const limit = Math.min(1000, 500);
    console.log("LIMIT:", limit);
  } catch (error) {
    console.log(error);
    console.log(error.errors);
  }
}

check();
