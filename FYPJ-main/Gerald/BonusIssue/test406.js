const assert = require("assert")    
const login = require("../../Login")
const BonusIssue = require("../../saf/BonusIssue")
const inbox = require("../../saf/Inbox")
const store = require("../../saf/Store")
const c = require("../../Const/Const")

// User add bonus issue for 2 items, approved by manager and loan out items

// testAddBonusIssue2Items()

async function testAddBonusIssue2Items() {
    // Login as User
    var idToken = login.getToken(c.user)

    // query if there is enough stock to be loaned out as bonus issue
    var checkStocks = await store.GetStoreItemByID(idToken,c.loanStoreId)
    assert.notEqual(typeof checkStocks, typeof false, `TEST 406 FAILED: Failed to get store item by ID `)
    for(var i=0;i<checkStocks.length;i++){
        if(checkStocks[i]["balance_quantity"] < c.bonusIssueQuantity){
            assert.fail("TEST 406 FAILED: Insufficient stocks to loan out ")
        }
    }

    // Add Bonus Issue with 2 items
    var addIssue = await BonusIssue.addNewBonusIssue2Items(idToken, c.loanStoreId, c.loanStartDate, c.loanEndDate, c.loanRequestorUser, c.bonusIssueItemId, c.bonusIssueQuantity, c.bonusIssueItemId2, c.bonusIssueQuantity2)
    assert.notEqual(typeof addIssue, typeof false, `TEST 406 FAILED: User cannot Add Bonus Issue`)

    console.log(addIssue)

    // query the status afrer adding bonus issue 
    console.log("\nBonus Issue ID: " + addIssue["id"])
    console.log("Current Status: " + addIssue["status"])
    console.log("")

    // Login as Manager
    var idToken2 = login.getToken(c.manager)

    // query inbox status before approval
    var getInbox = await inbox.GetYourInboxes(idToken2);
    assert.notEqual(typeof getInbox, typeof false, `TEST 406 FAILED: Manager cannot recieve inbox`)

    var pending
    var issueId
    for(var i=0;i<getInbox.length;i++){
        if(getInbox[i]["type"]== "bonus_issue" && getInbox[i]["status"] == "pending"){
            pending = getInbox[i]
            issueId = getInbox[i]["issue_id"]
        }
    }

    assert.equal(issueId, addIssue["id"], `TEST FAILED: ISSUE ID NOT THE SAME`)

    console.log(pending) // Display 
    console.log("")

    // Approve Bonus Issue 
    var approveIssue = await BonusIssue.approveIssue(idToken2, addIssue["id"])
    assert.notEqual(typeof approveIssue, typeof false, `TEST 406 FAILED: Failed to approve bonus issue`)

    // query inbox status after approval
    var getInbox = await inbox.GetYourInboxes(idToken2);
    assert.notEqual(typeof getInbox, typeof false, `TEST 406 FAILED: Failed to retrieve inbox `)
    
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

    // query store total quantity, balance quantity and loaned out quantity before loan out
    var currentCheckStore =await store.GetStoreItemByID(idToken2,c.loanStoreId)
    assert.notEqual(typeof currentCheckStore, typeof false, `TEST 406 FAILED: Failed to get store item by ID `)

    var balanceQuantity2
    var balanceQuantity3
    var loanedQuantity2
    var loanedQuantity3
    var totalQuantity2
    var totalQuantity3
    for(var i=0;i<currentCheckStore.length;i++){
       if(currentCheckStore[i]["item_nsn_number"]==c.bonusIssueItemId){
            balanceQuantity2 = currentCheckStore[i]["balance_quantity"]
            loanedQuantity2 = currentCheckStore[i]["loaned_quantity"]
            totalQuantity2 = currentCheckStore[i]["total_quantity"]
        }
       if(currentCheckStore[i]["item_nsn_number"]==c.bonusIssueItemId2){
            balanceQuantity3 = currentCheckStore[i]["balance_quantity"]
            loanedQuantity3 = currentCheckStore[i]["loaned_quantity"]
            totalQuantity3 = currentCheckStore[i]["total_quantity"]
        }
    }

    console.log("\n====== QUANTITY BEFORE LOANING OUT ======")
    console.log("\nItem nsn number: "+c.bonusIssueItemId)
    console.log("Current loaned out quantity: "+ loanedQuantity2)
    console.log("Current balance quantity: "+ balanceQuantity2)
    console.log("Current total quantity: "+ totalQuantity2)
    console.log("\nItem nsn number: "+c.bonusIssueItemId2)
    console.log("Current loaned out quantity: "+ loanedQuantity3)
    console.log("Current balance quantity: "+ balanceQuantity3)
    console.log("Current total quantity: "+ totalQuantity3)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Get Bonus Issue by id
    var getAllBonusIssue = await BonusIssue.getAllBonusIssue(idToken2)
    assert.notEqual(typeof getAllBonusIssue, typeof false, `TEST 406 FAILED: Failed to retrieve all bonus issues `)

    var Issue
    var quantity
    var Issue2
    var quantity2
    for(var i=0;i<getAllBonusIssue.length;i++){
        for(var j=0;j<getAllBonusIssue[i]["items"].length;j++){
            if(getAllBonusIssue[i]["items"][j]["item_nsn_number"] == c.bonusIssueItemId ){
                Issue = getAllBonusIssue[i]
                quantity = getAllBonusIssue[i]["items"][j]["quantity"]
            }
            if(getAllBonusIssue[i]["items"][j]["item_nsn_number"] == c.bonusIssueItemId2 ){
                Issue2 = getAllBonusIssue[i]
                quantity2 = getAllBonusIssue[i]["items"][j]["quantity"]
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
    console.log("\nItem nsn number: " + c.bonusIssueItemId)
    console.log("Loan Out Date: " + Issue2["loaned_out_date"])
    console.log("Status: NULL")
    console.log("Quantity of items to be loaned out: " + quantity2)

    // Login as User
    var idToken = login.getToken(c.user)

    // Loan out Bonus Issue
    var loiIssue = await BonusIssue.loanOutBonusIssue(idToken, approved["issue_id"], c.loanOutDate)
    assert.notEqual(typeof loiIssue, typeof false, `TEST 406 FAILED: Failed to loan out bonus issue items`)

    // query loan out 
    console.log("\nAfter Loaning out: ")
    console.log("Loan ID: " + loiIssue["id"])
    console.log("Loan Out Date: "+ loiIssue["loaned_out_date"])
    console.log("Status: " + loiIssue["status"])
    console.log("LOANED OUT SUCCESSFUL!!")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // query store total quantity, balance quantity and loaned out quantity after loan out
    var updatedCheckStore = await store.GetStoreItemByID(idToken, c.loanStoreId)
    assert.notEqual(typeof updatedCheckStore, typeof false, `TEST 406 FAILED: Failed to get store item by ID `)

    var loanedQuantity
    var loanedQuantity1
    var balanceQuantity
    var balanceQuantity1
    var totalQuantity
    var totalQuantity1
    var selectedItem
    var selectedItem1
    for(var i=0;i<updatedCheckStore.length;i++){
        if(updatedCheckStore[i]["item_nsn_number"]==c.bonusIssueItemId){
            loanedQuantity = updatedCheckStore[i]["loaned_quantity"]
            balanceQuantity = updatedCheckStore[i]["balance_quantity"]
            totalQuantity = updatedCheckStore[i]["total_quantity"]
            selectedItem = updatedCheckStore[i]
        }
        if(updatedCheckStore[i]["item_nsn_number"]==c.bonusIssueItemId2){
            loanedQuantity1 = updatedCheckStore[i]["loaned_quantity"]
            balanceQuantity1 = updatedCheckStore[i]["balance_quantity"]
            totalQuantity1 = updatedCheckStore[i]["total_quantity"]
            selectedItem1 = updatedCheckStore[i]
        }
    }

    console.log("\nUpdated Store: ")
    console.log(selectedItem)
    console.log(selectedItem1)
    console.log("\n====== QUANTITY AFTER LOANING OUT ======")
    console.log("\nItem nsn number: " + c.bonusIssueItemId)
    console.log("Loaned Out Quantity: " + loanedQuantity)
    console.log("Balance Quantity: "+ balanceQuantity)
    console.log("Total Quantity: " + totalQuantity)
    console.log("\nItem nsn number: " + c.bonusIssueItemId2)
    console.log("Loaned Out Quantity: " + loanedQuantity1)
    console.log("Balance Quantity: "+ balanceQuantity1)
    console.log("Total Quantity: " + totalQuantity1)

    // assert if balance quantity did not reduce and loaned out quantity did not increase
    assert.notEqual(balanceQuantity, balanceQuantity2, `TEST 406 FAILED: Balance quantity should reduce by ${c.bonusIssueQuantity} and loan out quantity should increase after loaning out bonus issue`)

    // assert if balance quantity did not reduce and loaned out quantity did not increase
    assert.notEqual(balanceQuantity1, balanceQuantity3, `TEST 406 FAILED: Balance quantity should reduce by ${c.bonusIssueQuantity2} and loan out quantity should increase after loaning out bonus issue`)

    console.log("\nTEST 406 SUCCESS: User is able to add bonus issue with 2 items and loan out bonus issue approved by manager")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")
}

module.exports = { testAddBonusIssue2Items }