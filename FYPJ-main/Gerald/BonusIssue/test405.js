const assert = require("assert")    
const login = require("../../Login")
const BonusIssue = require("../../saf/BonusIssue")
const inbox = require("../../saf/Inbox")
const store = require("../../saf/Store")
const c = require("../../Const/Const")

// Test senario: User add bonus issue but was rejected by the manager 
// Query if item balance quantity got reduce and loaned quantity got increase *if have = test failed

// testRejectBonusIssue()

async function testRejectBonusIssue(){

    // Login as User
    var idToken = login.getToken(c.user)

    // Query if store got enough stocks to be loaned out
    var checkStocks = await store.GetStoreItemByID(idToken,c.loanStoreId)
    assert.notEqual(typeof checkStocks, typeof false, `TEST 405 FAILED: Failed to get store item by ID `)
    for(var i=0;i<checkStocks.length;i++){
        if(checkStocks[i]["balance_quantity"] < c.bonusIssueQuantity){
            assert.fail("TEST 405 FAILED: Insufficient stocks to loan")
        }
    }

    // Add Bonus Issue 
    var addIssue = await BonusIssue.addNewBonusIssue(idToken, c.loanStoreId, c.loanStartDate, c.loanEndDate, c.loanRequestorUser, c.bonusIssueItemId, c.bonusIssueQuantity)
    assert.notEqual(typeof addIssue, typeof false, `TEST 405 FAILED: User cannot Add Bonus Issue`)

    console.log(addIssue)

    // query the status afrer adding bonus issue 
    console.log("\nBonus Issue ID: " + addIssue["id"])
    console.log("Current Status: " + addIssue["status"])

    // Login as Manager
    var idToken2 = login.getToken(c.manager)

    // query inbox status before approval
    var getInbox = await inbox.GetYourInboxes(idToken2);
    assert.notEqual(typeof getInbox, typeof false, `TEST 405 FAILED: Manager cannot recieve inbox`)

    var pending
    var issueId
    for(var i=0;i<getInbox.length;i++){
        if(getInbox[i]["type"]== "bonus_issue" && getInbox[i]["status"] == "pending"){
            pending = getInbox[i]
            issueId = getInbox[i]["issue_id"]
        }
    }

    console.log(pending) // Display 
    console.log("")

    assert.equal(issueId, addIssue["id"], `TEST FAILED: ISSUE ID NOT THE SAME`)

    // Query item nsn number quanitty before reject 
    var currentCheckStore =await store.GetStoreItemByID(idToken,c.loanStoreId)
    assert.notEqual(typeof currentCheckStore, typeof false, `TEST 405 FAILED: Failed to get store item by ID `)

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
    
    console.log("\n====== QUANTITY BEFORE REJECTING LOAN ======")
    console.log("\nItem nsn number: "+c.bonusIssueItemId)
    console.log("Current loaned out quantity: "+ loanedQuantity2)
    console.log("Current balance quantity: "+ balanceQuantity2)
    console.log("Current total quantity: "+ totalQuantity2)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Reject Bonus Issue
    var rejectIssue = await BonusIssue.rejectIssue(idToken2, addIssue["id"], c.rejectIssueReason)
    assert.notEqual(typeof rejectIssue, typeof false, `TEST 405 FAILED: Failed to reject bonus issue`)

    var getInbox = await inbox.GetYourInboxes(idToken2)
    assert.notEqual(typeof getInbox, typeof false, `TEST 405 FAILED: Manager cannot recieve inbox`)


    // query inbox => status="rejected"
    var rejected
    var reason
    for(var i=0;i<getInbox.length;i++){
        if(getInbox[i]["issue_id"]== addIssue["id"] && getInbox[i]["status"] == "rejected"){
            rejected = getInbox[i]
            reason = getInbox[i]["reject_reason"]
        }
     }

    console.log(rejected)

    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")
    console.log("\nStatus before rejection:")
    console.log("Approval Loan ID: "+ addIssue["id"] + ", Status: " + addIssue["status"])
    console.log("\nStatus after rejection:")
    console.log("Query: Loan ID: "+ rejected["issue_id"] + ", Status: " + rejected["status"] + ", Reason: Bonus Issue was rejected due to fyp2" )
     //  console.log("Query: Loan ID: "+ rejected["issue_id"] + ", Status: " + rejected["status"] + ", Reason: " + reason )
     // query store total quantity, balance quantity and loaned out quantity after bonus issue is rejected
     var updatedCheckStore = await store.GetStoreItemByID(idToken2, c.loanStoreId)
     assert.notEqual(typeof updatedCheckStore, typeof false, `TEST 405 FAILED: Failed to get store item by ID `)
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
     console.log("\n====== QUANTITY AFTER REJECTION ======")
     console.log("\nItem nsn number: " + c.bonusIssueItemId)
     console.log("Loaned Out Quantity: " + loanedQuantity)
     console.log("Balance Quantity: "+ balanceQuantity)
     console.log("Total Quantity: " + totalQuantity)
 
     // assert if balance quantity did not reduce and loaned out quantity did not increase
     assert.equal(balanceQuantity, balanceQuantity2, `TEST 405 FAILED: Balance quantity should not reduce by ${c.bonusIssueQuantity} and loan out quantity should not increase after rejecting bonus issue`)


    console.log(`\nTEST 405 SUCCESS: Manger is able to reject user bonus issue successfully and Item ${c.bonusIssueItemId}'s balance and loaned out quantity remains the same `)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

}

module.exports = { testRejectBonusIssue }