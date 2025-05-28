const assert = require("assert")    
const login = require("../../Login")
const BonusIssue = require("../../saf/BonusIssue")
const inbox = require("../../saf/Inbox")
const store = require("../../saf/Store")
const c = require("../../Const/Const")

// Test senario: User add Bonus issue and manager approved but didnt loan out
// query if balance quantity got reduce and loaned quantity got increase *if have = test failed 

// testNoLoiUser()

async function testNoLoiUser(){
    // Login as User
    var idToken = login.getToken(c.user)

    // query if there is enough stock to be loaned out as bonus issue
    var checkStocks = await store.GetStoreItemByID(idToken,c.loanStoreId)
    assert.notEqual(typeof checkStocks, typeof false, `TEST 403 FAILED: Failed to get store item by ID `)
    for(var i=0;i<checkStocks.length;i++){
        if(checkStocks[i]["balance_quantity"] < c.bonusIssueQuantity){
            assert.fail("TEST 403 FAILED: Insufficient stocks to loan out ")
        }
    }

    // query store item stock before add bonus issue
    var currentCheckStore =await store.GetStoreItemByID(idToken,c.loanStoreId)
    assert.notEqual(typeof currentCheckStore, typeof false, `TEST 403 FAILED: Failed to get store item by ID `)

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
    var addIssue = await BonusIssue.addNewBonusIssue(idToken, c.loanStoreId, c.loanStartDate, c.loanEndDate, c.loanRequestorUser, c.bonusIssueItemId, c.bonusIssueQuantity)
    assert.notEqual(typeof addIssue, typeof false, `TEST 403 FAILED: User cannot Add Bonus Issue`)
    
    console.log(addIssue)

    // query the status afrer adding bonus issue 
    console.log("\nBonus Issue ID: " + addIssue["id"])
    console.log("\nCurrent Status: " + addIssue["status"])
    console.log("")

    // Login as Manager
    var idToken2 = login.getToken(c.manager)

    // Approve Bonus Issue 
    var approveIssue = await BonusIssue.approveIssue(idToken2, addIssue["id"])
    assert.notEqual(typeof approveIssue, typeof false, `TEST 403 FAILED: Failed to approve bonus issue`)

    // query inbox status after approval
    var getInbox = await inbox.GetYourInboxes(idToken2);
    assert.notEqual(typeof getInbox, typeof false, `TEST 403 FAILED: Failed to retrieve inbox `)

    var approved
    var issueId
    for(var i=0;i<getInbox.length;i++){
        if(getInbox[i]["issue_id"]== addIssue["id"] && getInbox[i]["status"] == "approved"){
            approved = getInbox[i]
            issueId = getInbox[i]["issue_id"]

        }
    }

    console.log(approved)

    assert.equal(issueId, addIssue["id"], `TEST FAILED: ISSUE ID NOT THE SAME`)

    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")
    console.log("\nStatus before approval:")
    console.log("Bonus Issue ID: "+ addIssue["id"] + ", Status: " + addIssue["status"])
    console.log("\nStatus after approval:")
    console.log("Query: Bonus Issue ID: "+ approved["issue_id"] + ", Status: " + approved["status"])
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

   // query store total quantity, balance quantity and loaned out quantity before loaning out 
   var currentCheckStore =await store.GetStoreItemByID(idToken2,c.loanStoreId)
   assert.notEqual(typeof currentCheckStore, typeof false, `TEST 403 FAILED: Failed to get store item by ID `)
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
    assert.equal(balanceQuantity, balanceQuantity2 , `TEST 403 FAILED: Balance quantity should not reduce by ${c.bonusIssueQuantity} and loan out quantity should not increase after approval of bonus issue`)

    console.log("\nTEST 403 SUCCESS: User is able to add bonus issue and bonus issue approved by manager but didnt loan out and store stocks quantity did not decrease")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

}

module.exports={ testNoLoiUser }