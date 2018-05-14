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
    console.log("\n--- Management of products & inventory ------\n")
    console.log("\n---------------------------------------------\n")
    managerMain();
})

function managerMain() {
    askContinue();
}

function askManager1() {
    inquirer.prompt({
        type: "list",
        message: "Please choose an action to perform\n",
        name: "sel",
        choices: ["Display Products", "Display Low Inventory", "Add to Existing Products", "Add New Product"],
        default: "Display Products"
    }).then(function (inqresp) {
        switch (inqresp.sel) {
            case "Display Products":
                displayProds();
                break;
            case "Display Low Inventory":
                displayLow();
                break;
            case "Add to Existing Products":
                addExisting();
                break;
            case "Add New Product":
                addNew();
                break;
            default:
                displayProds();
        }
    })
}

function displayProds() {
    connection.query("SELECT * FROM products", function (err, resp) {
        var t = new cTable;
        var data = resp;
        data.forEach(function (product) {
            t = displayRow(product, t);
        })
        console.log("\n" + t.toString())
    })
    askContinue(1)
}

function displayRow(product, t) {
    t.cell('Product Id', product.item_id);
    t.cell('Product Name', product.product_name);
    t.cell('Category', product.department_name);
    t.cell('Price, USD', product.price);
    t.cell('Available Units', product.stock_quantity);
    t.newRow()
    return t
}

function displayLow() {
    connection.query("SELECT * FROM products WHERE products.stock_quantity < 5", function (err, resp) {
        var t = new cTable;
        var data = resp;
        data.forEach(function (product) {
            t = displayRow(product, t);
        })
        console.log("\n" + t.toString())
    })
    askContinue(1)
}

function addExisting() {
    connection.query("SELECT * FROM products", function (err, resp) {
        var prods = [];
        resp.forEach(e => { prods.push(e.product_name) });
        inquirer.prompt([{
            type: "list",
            message: "Which product do you want to add more inventory",
            name: "sel",
            choices: prods
        },
        {
            type: "input",
            message: "How many units do you want to add?",
            name: "num",
            validate: validateNumber
        }]).then(function (resp2) {
            connection.query("SELECT * FROM products WHERE ?", [{
                product_name: resp2.sel
            }],
                function (err, sqlresp) {
                    var newStock = Number(sqlresp[0].stock_quantity) + Number(resp2.num);
                    connection.query("UPDATE products SET  ? WHERE  ?", [{
                        stock_quantity: Number(newStock)
                    },{
                        product_name: resp2.sel
                    }],
                        function (err, sqlresp1) {
                            console.log("Stock quantity for " + resp2.sel + " is updated to " + newStock);
                            connection.query("SELECT * FROM products WHERE products.product_name = ?", [resp2.sel],
                                function (err, sqlresp2) {
                                    var t = new cTable;
                                    var product = sqlresp2[0];
                                    t = displayRow(product, t);
                                    console.log(t.toString());
                                    askContinue(1);
                                })
                        })
                });
        })
    })
}

function addNew() {
    inquirer.prompt([{
        type: "input",
        name: "name",
        message: "Product Description?"
    },{
        type: "input",
        name: "dept",
        message: "Which department does this product belong to?"
    },{
        type: "input",
        name: "price",
        message: "What is the unit price of this product?"
    },{
        type: "input",
        name: "quant",
        message: "How many units of this product do you want to add?" ,
        validate: validateNumber  
    }
    ]).then(function (resp) {
        connection.query("INSERT INTO products SET ?",
            [{
                product_name: resp.name,
                department_name: resp.dept,
                price: resp.price,
                stock_quantity: resp.quant
            }], function (err,res) {
                console.log(res.affectedRows + " product inserted!\n");
                displayProds();
            })
    })
}

function askContinue(x) {
    switch (x) {
        case 1:
            var msg = "Would you like to continue inventory management?";
            break;
        default:
            var msg = "Welcome Manager! Ready for inventory management?";
    };
    inquirer.prompt({
        type: 'confirm',
        message: msg,
        name: "cont",
        default: true
    }).then(function (inqresp) {
        if (inqresp.cont) {
            askManager1();
        } else {
            console.log("Thanks Manager! See you next time!\n")
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