const assert = require("assert")    
const login = require("../../Login")
const loan = require("../../saf/Loan")
const store = require("../../saf/Store")
const inbox = require("../../saf/Inbox")
const c = require("../../Const/Const")
const loan2 = require("../../Gerald/Loans/test313")

// Manager add loans with 2 items, loan out items and return the loans

// testAMadd2itemReturn()

async function testAMadd2itemReturn() {

    // Add loan with 2 items 
    var addLoan = await loan2.testAddLoan2ItemsAM()

    // Login as Manager 
    var idToken2 = login.getToken(c.manager)

    // Return loan with 2 items
    var retLoan = await loan.returnLoan2Items(idToken2, addLoan, c.loanReturnDate, c.loanItemId, c.loanItemId2, c.loanQuantity, c.loanQuantity2)
    assert.notEqual(typeof retLoan, typeof false, `TEST 315 FAILED: Manager cannot return loans with 2 items`)
    
    console.log("\nReturning Loan ID: " + addLoan)
    console.log(retLoan)
    console.log("\nLoan ID: " + addLoan + " has successfully returned.")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // check the store 561 item nsn 55 & 56's balance quantity got go down by 20 
    var updatedCheckStore = await store.GetStoreItemByID(idToken2, c.loanStoreId)
    assert.notEqual(typeof updatedCheckStore, typeof false, `TEST 315 FAILED: Failed to get store item by ID `)
    var loanedQuantity
    var loanedQuantity3
    var balanceQuantity
    var balanceQuantity3
    var totalQuantity
    var totalQuantity2
    var selectedItem
    var selectedItem1
    for(var i=0;i<updatedCheckStore.length;i++){
        if(updatedCheckStore[i]["item_nsn_number"]==c.loanItemId){
            loanedQuantity = updatedCheckStore[i]["loaned_quantity"]
            balanceQuantity = updatedCheckStore[i]["balance_quantity"]
            totalQuantity=updatedCheckStore[i]["total_quantity"]
            selectedItem = updatedCheckStore[i]
        }
        if(updatedCheckStore[i]["item_nsn_number"]==c.loanItemId2){
            loanedQuantity3 = updatedCheckStore[i]["loaned_quantity"]
            balanceQuantity3 = updatedCheckStore[i]["balance_quantity"]
            totalQuantity2 =updatedCheckStore[i]["total_quantity"]
            selectedItem1 = updatedCheckStore[i]
        }
    }

    console.log("\nUpdated Store: ")
    console.log(selectedItem)
    console.log(selectedItem1)
    console.log("\n====== QUANTITY AFTER RETURNING LOAN ======")
    console.log("\nItem nsn number: "+ c.loanItemId)
    console.log("Loaned Out Quantity: " + loanedQuantity)
    console.log("Balance Quantity: "+ balanceQuantity)
    console.log("Total Quantity: " + totalQuantity)
    console.log("\nItem nsn number: "+ c.loanItemId2)
    console.log("Loaned Out Quantity: " + loanedQuantity3)
    console.log("Balance Quantity: "+ balanceQuantity3)
    console.log("Total Quantity: " + totalQuantity2)

    console.log("\nTEST 315 SUCCESS: Manager is able to return loan with 2 items successfully")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")
}

module.exports={ testAMadd2itemReturn }