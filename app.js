const express = require("express");
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/config')();
require('./startup/db')();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("App running on http://localhost:" + PORT);
});