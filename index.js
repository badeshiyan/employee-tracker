const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");
const figlet = require("figlet");

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mysqlpassword1",
  database: "employees_db",
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
});

figlet("Employee Tracker!!", function (err, data) {
  if (err) {
    console.log("intro");
    console.dir(err);
    return;
  }
  console.log(data);
});

function startApp() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "what would you like to do?",
        name: "userchoice",
        choices: [
          "View all employees",
          "Add employee",
          "Add role",
          "Add department",
          "View all roles",
          "View all departments",
          "Exit",
        ],
      },
    ])
    .then(function (Response) {
      switch (Response.userchoice) {
        case "View all employees":
          console.log("you chose to view all employees");
          viewAllEmployees();
          break;
        case "Add employee":
          console.log("you chose to add an employee");
          addEmployee();
          break;
        case "Add role":
          console.log("you chose to add role");
          addRole();
          break;
        case "Add department":
          console.log("you chose to add department");
          addDepartment();
          break;
        case "View all roles":
          console.log("you chose to view all roles");
          viewAllRoles();
          break;
        case "View all departments":
          console.log("viewing all departments");
          viewAllDepartments();
          startApp();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
}

startApp();

function viewAllDepartments() {
  connection.query("SELECT department.name FROM department;", function (
    err,
    res
  ) {
    if (err) throw err;
    console.log(res);
    connection.end();
  });
}

function viewAllRoles() {
  connection.query(
    "SELECT role.title, role.salary, department.name FROM role LEFT JOIN department	ON role.department_id = department.id;",
    function (err, res) {
      if (err) throw err;
      console.log(res);
      connection.end();
    }
  );
}

function viewAllEmployees() {
  connection.query(
    "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name FROM employee LEFT  JOIN role on employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;",
    function (err, res) {
      if (err) throw err;
      console.log(res);
      connection.end();
    }
  );
}
