const assert = require("assert")    
const login = require("../../Login")
const loan = require("../../saf/Loan")
const store = require("../../saf/Store")
const c = require("../../Const/Const")
const loanId2 = require("../../Gerald/Loans/test309")

// Test Case: Test if user's approve loans with 2 items can be return and each item's balance quantity got increased using user account

// testReturnLoan2Items()

async function testReturnLoan2Items(){
    // Add Loan
    var addLoan = await loanId2.testAddNewLoan2Items()

    // Sign in as User
    var idToken = login.getToken(c.user)

    // check the store 561 item nsn 55 & 56's balance quantity got go down by 20 
    var updatedCheckStore = await store.GetStoreItemByID(idToken, c.loanStoreId)
    assert.notEqual(typeof updatedCheckStore, typeof false, `TEST 310 FAILED: Failed to get store item by ID `)

    var loanedQuantity
    var loanedQuantity2
    var balanceQuantity1
    var balanceQuantity2
    var totalQuantity
    var totalQuantity2
    for(var i=0;i<updatedCheckStore.length;i++){
        if(updatedCheckStore[i]["item_nsn_number"]==c.loanItemId){
            loanedQuantity = updatedCheckStore[i]["loaned_quantity"]
            balanceQuantity1 = updatedCheckStore[i]["balance_quantity"]
            totalQuantity=updatedCheckStore[i]["total_quantity"]
        }
        if(updatedCheckStore[i]["item_nsn_number"]==c.loanItemId2){
            loanedQuantity2 = updatedCheckStore[i]["loaned_quantity"]
            balanceQuantity2 = updatedCheckStore[i]["balance_quantity"]
            totalQuantity2 =updatedCheckStore[i]["total_quantity"]
        }
    }

    console.log("\n====== QUANTITY BEFORE RETURNING OF LOAN WITH 2 ITEMS ======")
    console.log("\nItem nsn number: "+ c.loanItemId)
    console.log("Loaned Out Quantity: " + loanedQuantity)
    console.log("Balance Quantity: "+ balanceQuantity1)
    console.log("Total Quantity: " + totalQuantity)
    console.log("\nItem nsn number: "+ c.loanItemId2)
    console.log("Loaned Out Quantity: " + loanedQuantity2)
    console.log("Balance Quantity: "+ balanceQuantity2)
    console.log("Total Quantity: " + totalQuantity2)

    // Return Loan
    var retLoan = await loan.returnLoan2Items(idToken, addLoan, c.loanReturnDate, c.loanItemId, c.loanQuantity, c.loanItemId2, c.loanQuantity2)
    assert.equal(typeof retLoan, typeof "", `TEST 310 FAILED: User cannot return loan`)

    console.log("\nReturning Loan ID: " + addLoan)
    console.log(retLoan)
    console.log("\nLoan ID: " + addLoan + " has successfully returned.")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Query Store 
    var CheckStore = await store.GetStoreItemByID(idToken, c.loanStoreId)
    assert.notEqual(typeof CheckStore, typeof false, `TEST 310 FAILED: Failed to get store item by ID `)
    var loanedQuantity
    var loanedQuantity3
    var balanceQuantity
    var balanceQuantity3
    var totalQuantity
    var totalQuantity3
    var selectedItem
    var selectedItem1
    for(var i=0;i<CheckStore.length;i++){
        if(CheckStore[i]["item_nsn_number"]==c.loanItemId){
            loanedQuantity = CheckStore[i]["loaned_quantity"]
            balanceQuantity = CheckStore[i]["balance_quantity"]
            totalQuantity=CheckStore[i]["total_quantity"]
            selectedItem = CheckStore[i]
        }
        if(CheckStore[i]["item_nsn_number"]==c.loanItemId2){
            loanedQuantity2 = CheckStore[i]["loaned_quantity"]
            balanceQuantity2 = CheckStore[i]["balance_quantity"]
            totalQuantity2 =CheckStore[i]["total_quantity"]
            selectedItem1 = CheckStore[i]
        }
    }
    console.log("\nUpdated Store: ")
    console.log(selectedItem)
    console.log(selectedItem1)
    console.log("\n====== QUANTITY AFTER RETURNING OF LOAN WITH 2 ITEMS ======")
    console.log("\nReturned Item nsn number: " + c.loanItemId)
    console.log("Loaned Out Quantity: " + loanedQuantity)
    console.log("Balance Quantity: "+ balanceQuantity)
    console.log("Total Quantity: " + totalQuantity)
    console.log("\nReturned Item nsn number: " + c.loanItemId2)
    console.log("Loaned Out Quantity: " + loanedQuantity3)
    console.log("Balance Quantity: "+ balanceQuantity3)
    console.log("Total Quantity: " + totalQuantity3)

    // assert if both item balance quantity got increased and loaned quantity got reduce after being returned
    assert.notEqual(balanceQuantity, balanceQuantity1, `TEST 310 FAILED: Balance quantity should reduce by ${c.loanQuantity} and loan out quantity should increase after loaning out loans`)

    assert.notEqual(balanceQuantity3, balanceQuantity2, `TEST 310 FAILED: Balance quantity should reduce by ${c.loanQuantity2} and loan out quantity should increase after loaning out loans`)

    console.log("\nTEST 310 SUCCESS: User is able to add loan with 2 items, loan out approved loans by manager and return loan with 2 items successfully")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")
    
}

module.exports={ testReturnLoan2Items }