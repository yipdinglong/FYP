const assert = require("assert")    
const login = require("../../Login")
const loan = require("../../saf/Loan")
const store = require("../../saf/Store")
const c = require("../../Const/Const")
const loanId = require("../../Gerald/Loans/test305")

// Test Case: Manager add loan, loan out, return loans

// testReturnLoanAM();

async function testReturnLoanAM(){

    // Add Loan
    var addLoan = await loanId.testAddLoanAM()

    // Sign in as Manager
    var idToken2 = login.getToken(c.manager)
    
    // Return Loan
    var retLoan = await loan.returnLoan(idToken2, addLoan, c.loanReturnDate, c.loanItemId, c.loanQuantity)
    assert.notEqual(typeof retLoan, typeof false, `TEST 307 FAILED: Manager cannot return the loans`)

    console.log("\nReturning Loan ID: " + addLoan)
    console.log(retLoan)
    console.log("\nLoan ID: " + addLoan + " has successfully returned.")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Query Store 
    var CheckStore = await store.GetStoreItemByID(idToken2, c.loanStoreId)
    assert.notEqual(typeof CheckStore, typeof false, `TEST 307 FAILED: Failed to get store item by ID `)
    var loanQuantity
    var balanceQuantity
    var totalQuantity
    var selectedItem
    for(var i=0;i<CheckStore.length;i++){
        if(CheckStore[i]["item_nsn_number"]==c.loanItemId){
            loanQuantity = CheckStore[i]["loaned_quantity"]
            balanceQuantity = CheckStore[i]["balance_quantity"]
            totalQuantity = CheckStore[i]["total_quantity"]
            selectedItem = CheckStore[i]
        }
    }
    console.log("\nUpdated Store: ")
    console.log(selectedItem)
    console.log("\n====== QUANTITY AFTER RETURNING OF LOAN ======")
    console.log("Loaned Out Quantity: " + loanQuantity)
    console.log("Balance Quantity: "+ balanceQuantity)
    console.log("Total Quantity: " + totalQuantity)
    
    console.log("\nTEST 307 SUCCESS: Manager is able to add and approved loans and loan out straight and return successfully")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")
}


module.exports={ testReturnLoanAM }
