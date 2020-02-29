const auth = require("./auth");
const {
  companies,
  jobs
} = require("./jobs");
const {
  user
} = require("./jobs/user");

module.exports = function () {
  return {
    auth: auth(),
    jobs: jobs(),
    user: user(),
    companies: companies(),
  };
};
