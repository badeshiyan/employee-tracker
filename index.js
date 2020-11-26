const inquirer = require("inquirer");
const mysql = require("mysql");
const figlet = require("figlet");
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

// package for application's intro text
figlet("Employee Tracker!!", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});

// function to initiate application
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
          "Update role",
          "Exit",
        ],
      },
    ])
    .then(function (answer) {
      switch (answer.userchoice) {
        case "View all employees":
          //   console.log("you chose to view all employees");
          viewAllEmployees();
          break;
        case "View all roles":
          //   console.log("you chose to view all roles");
          viewAllRoles();
          break;
        case "View all departments":
          //   console.log("viewing all departments");
          viewAllDepartments();
          break;
        case "Add employee":
          //   console.log("you chose to add an employee");
          addEmployee();
          break;
        case "Add role":
          //   console.log("you chose to add role");
          addRole();
          break;
        case "Add department":
          //   console.log("you chose to add department");
          addDepartment();
          break;
        case "Update role":
          //   console.log("you chose to add department");
          updateRole();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
}

// startApp();

// function for user to view all departments
function viewAllDepartments() {
  connection.query("SELECT department.name FROM department;", function (
    err,
    res
  ) {
    if (err) throw err;
    console.log(" ");
    // connection.end();
    console.table(res);
    startApp();
  });
}

// function for user to view all roles
function viewAllRoles() {
  connection.query(
    "SELECT role.title, role.salary, department.name FROM role LEFT JOIN department	ON role.department_id = department.id;",
    function (err, res) {
      if (err) throw err;
      //   console.log(res);
      console.table(res);
      startApp();
    }
  );
}

// function for user to view all employees
function viewAllEmployees() {
  connection.query(
    "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name FROM employee LEFT  JOIN role on employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;",
    function (err, res) {
      if (err) throw err;
      //   console.log(res);
      console.table(res);
      startApp();
    }
  );
}

// function for user to add an employee
function addEmployee() {
  connection.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          message: "what is the first name of the employee?",
          name: "firstName",
        },
        {
          type: "input",
          message: "what is the last name of the employee?",
          name: "lastName",
        },
        {
          type: "list",
          name: "roleName",
          choices: function () {
            let choicesArray = [];
            for (var i = 0; i < results.length; i++) {
              choicesArray.push({
                name: results[i].title,
                value: results[i].id,
              });
            }
            return choicesArray;
          },
          message: "what is the role of the employee?",
        },
        {
          type: "input",
          message:
            "if this particular employee reports to a manager, enter the manager's id. If not, press enter",
          name: "manager",
        },
      ])
      .then(function (answer) {
        let data = {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.roleName,
        };
        if (answer.manager) {
          data.manager_id = answer.manager;
        }
        console.log(answer);
        connection.query(
          "INSERT INTO employee SET ?",
          data,

          function (err) {
            if (err) throw err;
            console.log("the new employee is now added.");
            startApp();
          }
        );
      });
  });
}

// function for user to add a role
function addRole() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    console.log(results);
    inquirer
      .prompt([
        {
          type: "input",
          message: "what is the title of the role?",
          name: "title",
        },
        {
          type: "input",
          message: "what is the salary of the role?",
          name: "salary",
        },
        {
          type: "list",
          name: "deptName",
          choices: function () {
            let choicesArray = [];
            for (var i = 0; i < results.length; i++) {
              choicesArray.push({
                name: results[i].name,
                value: results[i].id,
              });
            }
            return choicesArray;
          },
          message: "what department is this role apart of?",
        },
      ])
      .then(function (answer) {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.deptName,
          },
          function (err) {
            if (err) throw err;
            console.log("the new role is now added.");
            startApp();
          }
        );
      });
  });
}

// function for user to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "deptName",
        message: "what is the name of the department?",
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO department SET ?",
        { name: answer.deptName },
        function (err) {
          if (err) throw err;
          console.log("the new department is now added.");
          startApp();
        }
      );
    });
}

// function for user to update a role
function updateRole() {
  connection.query("SELECT * FROM role", function (err, results) {
    inquirer
      .prompt([
        {
          type: "input",
          message: "what employee number are you wanting to update?",
          name: "employeeId",
        },
        {
          type: "list",
          name: "roleName",
          choices: function () {
            let choicesArray = [];
            for (var i = 0; i < results.length; i++) {
              choicesArray.push({
                name: results[i].title,
                value: results[i].id,
              });
            }
            return choicesArray;
          },
          message: "what is the new role for the employee?",
        },
      ])
      .then(function (answer) {
        connection.query(
          "UPDATE employee SET role_id=? WHERE id=?",
          [answer.roleName, answer.employeeId],
          function (err) {
            if (err) throw err;
            console.log("the role is now updated");
            startApp();
          }
        );
      });
  });
}
