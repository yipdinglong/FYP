const assert = require("assert")    
const login = require("../../Login")
const BonusIssue = require("../../saf/BonusIssue")
const inbox = require("../../saf/Inbox")
const store = require("../../saf/Store")
const c = require("../../Const/Const")

// Test senario: Manager add bonus issue but did not loan out
// Query if item balance quantity got reduce and loaned quantity got increase *if have = test failed

// testNoLoiAM()

async function testNoLoiAM() {

    // Sign in as Manager
    var idToken2 = login.getToken(c.manager)

    // Query if store got enough stocks to be loaned out
    var checkStocks = await store.GetStoreItemByID(idToken2,c.loanStoreId)
    assert.notEqual(typeof checkStocks, typeof false, `TEST 404 FAILED: Failed to get store item by ID `)
    for(var i=0;i<checkStocks.length;i++){
        if(checkStocks[i]["balance_quantity"] < c.bonusIssueQuantity){
            assert.fail("TEST 404 FAILED: Insufficient stocks to issue a bonus issue")
        }
    }

    // query store item stock before add bonus issue
    var currentCheckStore =await store.GetStoreItemByID(idToken2,c.loanStoreId)
    assert.notEqual(typeof currentCheckStore, typeof false, `TEST 404 FAILED: Failed to get store item by ID `)

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

    // Add Bonus Issue 
    var addIssue = await BonusIssue.addNewBonusIssue(idToken2, c.loanStoreId, c.loanStartDate, c.loanEndDate, c.loanRequestorUser, c.bonusIssueItemId, c.bonusIssueQuantity)
    assert.notEqual(typeof addIssue, typeof false, `TEST 404 FAILED: Manager cannot Add Bonus Issue`)

    console.log(addIssue)
    
    // query the status if its => "approved" and not "pending" after adding bonus issue
    console.log("\nBonus Issue ID: " + addIssue["id"])
    console.log("Current Status: " + addIssue["status"])
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // query store total quantity, balance quantity and loaned out quantity before loaning out 
   var currentCheckStore =await store.GetStoreItemByID(idToken2,c.loanStoreId)
   assert.notEqual(typeof currentCheckStore, typeof false, `TEST 404 FAILED: Failed to get store item by ID `)
   var balanceQuantity
   var loanedQuantity
   var totalQuantity
   var selectedItem
   for(var i=0;i<currentCheckStore.length;i++){
       if(currentCheckStore[i]["item_nsn_number"]==c.bonusIssueItemId){
           balanceQuantity = currentCheckStore[i]["balance_quantity"]
           loanedQuantity = currentCheckStore[i]["loaned_quantity"]
           totalQuantity = currentCheckStore[i]["total_quantity"]
           selectedItem = currentCheckStore[i]
       }
   }
   console.log("\nUpdated Store: ")
   console.log(selectedItem)
   console.log("\n====== QUANTITY AFTER ADDING BONUS ISSUE ======")
   console.log("\nItem nsn number: " + c.bonusIssueItemId)
   console.log("Loaned Out Quantity: " + loanedQuantity)
   console.log("Balance Quantity: "+ balanceQuantity)
   console.log("Total Quantity: " + totalQuantity)

    // assert if store balance quantity got reduce and loan out quantity increased 
    assert.equal(balanceQuantity, balanceQuantity2, `TEST 404 FAILED: Balance quantity should not reduce by ${c.bonusIssueQuantity} and loan out quantity should not increase after adding bonus issue`)

    console.log("\nTEST 404 SUCCESS: Manager is able to add bonus issue, the bonus issue added is approved instantly and manager did not loan out items. Store stocks did not change ")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

}

module.exports = { testNoLoiAM }