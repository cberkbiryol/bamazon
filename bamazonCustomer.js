var mysql = require ("mysql");
var inquirer = require ("inquirer");
var cTable = require("easy-table");

var cstmrProd= {
    id:0,
    stock:0,
    price:0,
    total:0,
    sales:0,    
}

connection = mysql.createConnection({
    host: "localhost",
    user:"root",
    password: "",
    database: "bamazon"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("connected as id " + connection.threadId + " \n");
    console.log("\n------------WELCOME TO BAMAZON!--------------\n")
    console.log("\n---...where quality meets affordable prices--\n")
    console.log("\n---------------------------------------------\n")         
    bamazonMain();    
})

function bamazonMain(){       
    askContinue(); 
    displayProds();           
}

function askCustomer1(){    
    inquirer.prompt({
        type:"input",
        message: "Please provide the Id of the product that you would like to purchase\n",
        name: "id",        
        validate: function(input){
            if (isNaN(input || input==="")){
                console.log("Please enter a valid numeric value!");
                return fasle;
            } else {
                return true;
            }
        }
    }).then(function(inqresp){
        connection.query("SELECT * FROM products WHERE products.item_id = ?",[inqresp.id],
        function(err,sqlresp){       
            var t = new cTable;
            var product = sqlresp[0];            
            t = displayRow(product,t);
            cstmrProd.id=sqlresp[0].item_id;
            cstmrProd.stock=sqlresp[0].stock_quantity;
            cstmrProd.price=sqlresp[0].price;
            console.log(t.toString());            
            askCustomer2();
        })
    })
}

function askCustomer2(){    
    inquirer.prompt({
        type:"input",
        message: "How many units would you like to buy?\n",
        name: "num",        
        validate: function(input){
            if (isNaN(input) || input===""){
                console.log("Please enter a valid numeric value!");
                return fasle;
            } else {
                return true;
            }
        }
    }).then(function(inqresp){              
        if (Number(inqresp.num) <= cstmrProd.stock){
            cstmrProd.sales=Number(inqresp.num)*cstmrProd.price;
            cstmrProd.total+=Number(inqresp.num)*cstmrProd.price;
            cstmrProd.stock-=Number(inqresp.num);       
            updateProds();  
        } else {
            console.log("Sorry! Our stocks are limitted and we were unable to meet your request\n")
            console.log("Please enter new ammount\n")
            askCustomer2();
        }        
    })
}

function displayProds(){
    connection.query("SELECT * FROM products",function(err,resp){
        var t = new cTable;
        var data = resp;        
        data.forEach(function(product) {
            t = displayRow(product,t);
          })       
        console.log("\n" + t.toString())
        })                
}

function displayRow(product,t){
    t.cell('Product Id', product.item_id);
    t.cell('Product Name', product.product_name);
    t.cell('Category', product.department_name);
    t.cell('Price, USD', product.price);
    t.cell('Available Units', product.stock_quantity);
    t.newRow()       
    return t
}

function updateProds(){
    connection.query("UPDATE products SET ?  WHERE  ?",[{
        stock_quantity: cstmrProd.stock,
        product_sales: cstmrProd.sales
        },
        {item_id: cstmrProd.id
        }],
    function(err,sqlresp){  
        console.log("Your current total is $" + cstmrProd.total );     
        askContinue(1);        
    })
}

function askContinue(x) {
    switch (x){        
        case 1:
            var msg="Would you like to continue shopping?";
            break;          
        default:
            var msg="Welcome! Ready for your cli-based shopping experience?";
    };
    inquirer.prompt({
        type:'confirm',
        message: msg,
        name: "cont",
        default: true
    }).then(function(inqresp){
        if (inqresp.cont) {
            askCustomer1();          
        } else {
            console.log("Thanks for choosing us! See you next time!\n")
            connection.end();
        }                        
    })
};
