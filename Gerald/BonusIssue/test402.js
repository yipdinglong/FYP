const assert = require("assert")    
const login = require("../../Login")
const BonusIssue = require("../../saf/BonusIssue")
const inbox = require("../../saf/Inbox")
const store = require("../../saf/Store")
const c = require("../../Const/Const")

// Test senario: Manager add and query the bonus issue status is approved and loan out bonus issue straight 

// testAddBonusIssueAM()

async function testAddBonusIssueAM() {
    // Sign in as Manager
    var idToken2 = login.getToken(c.manager)

    // Query if store got enough stocks to be loaned out
    var checkStocks = await store.GetStoreItemByID(idToken2,c.loanStoreId)
    assert.notEqual(typeof checkStocks, typeof false, `TEST 402 FAILED: Failed to get store item by ID `)
    for(var i=0;i<checkStocks.length;i++){
        if(checkStocks[i]["balance_quantity"] < c.bonusIssueQuantity){
            assert.fail("TEST 402 FAILED: Insufficient stocks to issue a bonus issue")
        }
    }

    // Add Bonus Issue 
    var addIssue = await BonusIssue.addNewBonusIssue(idToken2, c.loanStoreId, c.loanStartDate, c.loanEndDate, c.loanRequestorUser, c.bonusIssueItemId, c.bonusIssueQuantity)
    assert.notEqual(typeof addIssue, typeof false, `TEST 402 FAILED: User cannot Add Bonus Issue`)

    console.log(addIssue)

    // query the status if its => "approved" after adding bonus issue
    console.log("\nBonus Issue ID: " + addIssue["id"])
    console.log("Current Status: " + addIssue["status"])
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    var currentCheckStore =await store.GetStoreItemByID(idToken2,c.loanStoreId)
    assert.notEqual(typeof currentCheckStore, typeof false, `TEST 402 FAILED: Failed to get store item by ID `)

    var balanceQuantity2
    var loanedQuantity2
    var totalQuantity2
    for(var i=0;i<currentCheckStore.length;i++){
       if(currentCheckStore[i]["item_nsn_number"]==c.bonusIssueItemId){
            balanceQuantity2 = currentCheckStore[i]["balance_quantity"]
            loanedQuantity2 = currentCheckStore[i]["loaned_quantity"]
            totalQuantity2 = currentCheckStore[i]["total_quantity"]
       }
    }
    
    console.log("\n====== QUANTITY BEFORE LOANING OUT ======")
    console.log("\nItem nsn number: "+c.bonusIssueItemId)
    console.log("Current loaned out quantity: "+ loanedQuantity2)
    console.log("Current balance quantity: "+ balanceQuantity2)
    console.log("Current total quantity: "+ totalQuantity2)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Get Bonus Issue by id
    var getAllBonusIssue = await BonusIssue.getAllBonusIssue(idToken2)
    assert.notEqual(typeof getAllBonusIssue, typeof false, `TEST 402 FAILED: Failed to retrieve all bonus issues `)

    var Issue
    var quantity
    for(var i=0;i<getAllBonusIssue.length;i++){
        for(var j=0;j<getAllBonusIssue[i]["items"].length;j++){
        if(getAllBonusIssue[i]["items"][j]["item_nsn_number"] == c.bonusIssueItemId ){
            Issue = getAllBonusIssue[i]
            quantity = getAllBonusIssue[i]["items"][j]["quantity"]
            } 
        }
    }

    // query loan to make sure can see the loan
    console.log("\nBonus Issue ID: " + Issue["id"])
    console.log(Issue)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // loan out items 
    console.log("\nBefore Loaning out: ")
    console.log("Item nsn number: " + c.bonusIssueItemId)
    console.log("Loan Out Date: " + Issue["loaned_out_date"])
    console.log("Status: NULL")
    console.log("Quantity of items to be loaned out: " + quantity) 
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Loan out Bonus Issue
    var loiIssue = await BonusIssue.loanOutBonusIssue(idToken2, Issue["id"], c.loanOutDate)
    assert.notEqual(typeof loiIssue, typeof false, `TEST 402 FAILED: Failed to loan out bonus issue items`)
    
    // query loan out 
    console.log("\nAfter Loaning out: ")
    console.log("Loan ID: " + loiIssue["id"])
    console.log("Loan Out Date: "+ loiIssue["loaned_out_date"])
    console.log("Status: " + loiIssue["status"])
    console.log("LOANED OUT SUCCESSFUL!!")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // query store total quantity, balance quantity and loaned out quantity after loan out
    var updatedCheckStore = await store.GetStoreItemByID(idToken2, c.loanStoreId)
    assert.notEqual(typeof updatedCheckStore, typeof false, `TEST 402 FAILED: Failed to get store item by ID `)
    var loanedQuantity
    var balanceQuantity
    var totalQuantity
    var selectedItem
    for(var i=0;i<updatedCheckStore.length;i++){
        if(updatedCheckStore[i]["item_nsn_number"]==c.bonusIssueItemId){
            loanedQuantity = updatedCheckStore[i]["loaned_quantity"]
            balanceQuantity = updatedCheckStore[i]["balance_quantity"]
            totalQuantity = updatedCheckStore[i]["total_quantity"]
            selectedItem = updatedCheckStore[i]
        }
    }

    console.log("\nUpdated Store: ")
    console.log(selectedItem)
    console.log("\n====== QUANTITY AFTER LOANING OUT ======")
    console.log("\nItem nsn number: " + c.bonusIssueItemId)
    console.log("Loaned Out Quantity: " + loanedQuantity)
    console.log("Balance Quantity: "+ balanceQuantity)
    console.log("Total Quantity: " + totalQuantity)

    // assert if balance quantity did not reduce and loaned out quantity did not increase
    assert.notEqual(balanceQuantity, balanceQuantity2, `TEST 402 FAILED: Balance quantity should reduce by ${c.bonusIssueQuantity} and loan out quantity should increase after loaning out bonus issue`)
    
    console.log("\nTEST 402 SUCCESS: User is able to add bonus issue and loan out bonus issue approved by manager")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    

}
module.exports = { testAddBonusIssueAM }