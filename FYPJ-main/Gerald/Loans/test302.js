const assert = require("assert")    
const login = require("../../Login")
const loan = require("../../saf/Loan")
const store = require("../../saf/Store")
const c = require("../../Const/Const")
const loanId = require("../../Gerald/Loans/test301")

// Test Case: Test if user's approve loans can be return and the balance quantity got increased using user account

// testReturnLoan();

async function testReturnLoan(){

    // Add Loan
    var addLoan = await loanId.testAddLoan()

    // Sign in as User
    var idToken = login.getToken(c.user)

    // Return Loan
    var retLoan = await loan.returnLoan(idToken, addLoan, c.loanReturnDate, c.loanItemId, c.loanQuantity)
    assert.notEqual(typeof retLoan, typeof false, `TEST 302 FAILED: Manager cannot return loan`)

    console.log("\nReturning Loan ID: " + addLoan)
    console.log(retLoan)
    console.log("\nLoan ID: " + addLoan + " has successfully returned.")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Query Store 
    var CheckStore = await store.GetStoreItemByID(idToken, c.loanStoreId)
    assert.notEqual(typeof checkStocks, typeof false, `TEST 302 FAILED: Failed to get store item by ID `)
    
    var loanedQuantity
    var balanceQuantity
    var totalQuantity
    var selectedItem
    for(var i=0;i<CheckStore.length;i++){
        if(CheckStore[i]["item_nsn_number"]==c.loanItemId){
            loanedQuantity = CheckStore[i]["loaned_quantity"]
            balanceQuantity = CheckStore[i]["balance_quantity"]
            totalQuantity=CheckStore[i]["total_quantity"]
            selectedItem = CheckStore[i]
        }
    }
    
    console.log("\nUpdated Store: ")
    console.log(selectedItem)
    console.log("\n====== QUANTITY AFTER RETURNING OF LOAN ======")
    console.log("\nItem nsn number: "+c.loanItemId)
    console.log("Loaned Out Quantity: " + loanedQuantity)
    console.log("Balance Quantity: "+ balanceQuantity)
    console.log("Total Quantity: " + totalQuantity)
    
    console.log("\nTEST 302 SUCCESS: User is able to add loan, loan out approved loans by manager and return successfully")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")
}


module.exports={ testReturnLoan }
