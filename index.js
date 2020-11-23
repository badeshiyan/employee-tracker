const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mysqlpassword1",
  database: "employees_db",
});

// connection.query("select * from employee", function (err, res) {
//   if (err) throw err;
//   console.table(res);
// });

function startApp() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Select what type of employee you would like to add",
        name: "userchoice",
        choices: ["manager", "engineer", "intern", "build team"],
      },
    ])
    .then(function (res) {
      console.log(res);
    });
}

startApp();
