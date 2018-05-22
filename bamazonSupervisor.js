var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("easy-table");

connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + " \n");
    console.log("\n-------- BAMAZON CONTROL CENTER--------------\n")
    console.log("\n-- Financial Managment & Analysis Utility ---\n")
    console.log("\n---------------------------------------------\n")
    supervisorMain();
})

function supervisorMain() {
    askContinue();
}

function askSupervisor() {
    inquirer.prompt({
        type: "list",
        message: "Please choose an action to perform\n",
        name: "sel",
        choices: ["View Product Sales by Department", "Create New Department"],
        default: "View Product Sales by Department"
    }).then(function (inqresp) {
        switch (inqresp.sel) {
            case "View Product Sales by Department":
                displayDepts();
                break;
            case "Create New Department":
                addDept();
                break;
            default:
                displayDepts();
        }
    })
}

function displayDepts() {
    connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs,"+ 
    "SUM(products.product_sales) AS product_sales, SUM(products.product_sales)-departments.over_head_costs AS total_profit" + 
    " FROM products INNER JOIN departments ON products.department_name = departments.department_name GROUP BY department_id;", function (err, resp) {
        if (err) throw err;
        var t = new cTable;
        var data = resp;
        data.forEach(function (department) {
            t = displayRow(department, t);
        })
        console.log("\n" + t.toString())
    })
    askContinue(1)
}

function displayRow(department, t) {
    t.cell('Department Id', department.department_id);
    t.cell('Department Name', department.department_name);
    t.cell('Overhead Costs', department.over_head_costs);
    t.cell('Total Sales', department.product_sales);
    t.cell('Total Profit', department.total_profit);
    t.newRow()
    return t
}

function addDept(){
    inquirer.prompt([{
        type: "input",
        name: "name",
        message: "Department Name?"
    },{
        type: "input",
        name: "overhead",
        message: "What is the overhead cost of this department?",
        validate: validateNumber
    }
    ]).then(function (resp) {
        connection.query("INSERT INTO departments SET ?",
            [{
                department_name: resp.name,                
                over_head_costs: resp.overhead
            }], function (err,res) {
                if (err) throw err;
                console.log(res.affectedRows + " departments added!\n");
                displayDepts();
            })
    });   
}

function askContinue(x) {
    switch (x) {
        case 1:
            var msg = "Would you like to continue financial management?";
            break;
        default:
            var msg = "Welcome Supervisor! Ready for financial management?";
    };
    inquirer.prompt({
        type: 'confirm',
        message: msg,
        name: "cont",
        default: true
    }).then(function (inqresp) {
        if (inqresp.cont) {
            askSupervisor();
        } else {
            console.log("Thanks Supervisor! See you next time!\n")
            connection.end();
        }
    })
}

function validateNumber(val) {
    if (isNaN(Number(val)) || val === "" || Number(val) <= 0) {
        console.log("Please enter a valid number greater than 0\n")
        return false;
    } else {
        return true;
    }
}