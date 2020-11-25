const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

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
  startApp();
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
          "View all roles",
          "View all departments",
          "Add employee",
          "Add role",
          "Add department",
          "Exit",
        ],
      },
    ])
    .then(function (answer) {
      switch (answer.userchoice) {
        case "View all employees":
          console.log("you chose to view all employees");
          viewAllEmployees();
          break;
        case "View all roles":
          console.log("you chose to view all roles");
          viewAllRoles();
          break;
        case "View all departments":
          console.log("viewing all departments");
          viewAllDepartments();
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
        case "Exit":
          connection.end();
          break;
      }
    });
}

// startApp();

function viewAllDepartments() {
  connection.query("SELECT department.name FROM department;", function (
    err,
    res
  ) {
    if (err) throw err;
    console.log(res);
    // connection.end();
    console.table(res);
    startApp();
  });
}

function viewAllRoles() {
  connection.query(
    "SELECT role.title, role.salary, department.name FROM role LEFT JOIN department	ON role.department_id = department.id;",
    function (err, res) {
      if (err) throw err;
      //   console.log(res);
      console.table(res);
    }
  );
}

function viewAllEmployees() {
  connection.query(
    "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name FROM employee LEFT  JOIN role on employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;",
    function (err, res) {
      if (err) throw err;
      //   console.log(res);
      console.table(res);
    }
  );
}

function addRole() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    console.log(results);
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the title of the role?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary of the role?",
        },
        {
          name: "deptName",
          type: "list",
          choices: function () {
            let choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push({ name: results[i].name, value: results[i].id });
            }
            return choiceArray;
          },
          message: "What department does this role apart of?",
        },
      ])
      .then(function (answer) {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.title,
            salary: answer.pay,
            department_id: answer.deptName,
          },
          function (err) {
            if (err) throw err;
            console.log("Your new role has been created.");
            startApp();
          }
        );
      });
  });
}
