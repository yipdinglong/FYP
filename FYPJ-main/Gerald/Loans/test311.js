const assert = require("assert")    
const login = require("../../Login")
const loan = require("../../saf/Loan")
const store = require("../../saf/Store")
const inbox = require("../../saf/Inbox")
const c = require("../../Const/Const")

// Test scenario: User add loan with 2 items and loan got rejected by manager.

// testRejectLoan2Items()

async function testRejectLoan2Items() {
    // Login as User
    var idToken = login.getToken(c.user)

    // Query if store got enough stocks to be loaned out
    var checkStocks = await store.GetStoreItemByID(idToken,c.loanStoreId)
    assert.notEqual(typeof checkStocks, typeof false, `TEST 311 FAILED: Failed to get store item by ID `)
    for(var i=0;i<checkStocks.length;i++){
        if(checkStocks[i]["balance_quantity"] < c.loanQuantity){
            assert.fail("TEST 311 FAILED: Insufficient stocks to loan")
        }
    }   

    // Query Store stocks- before add loans
    var storeStock3 = await store.GetStoreItemByID(idToken, c.loanStoreId) 
    assert.notEqual(typeof storeStock3, typeof false, `TEST 301 FAILED: Cannot get store item by ID `)

    var stockLoan
    var stockBalance
    var stockTotal
    var stockLoan1
    var stockBalance1
    var stockTotal1
    for(var i=0; i<storeStock3.length;i++){
        if(storeStock3[i]["item_nsn_number"]==c.loanItemId){
            stockLoan = storeStock3[i]["loaned_quantity"]
            stockBalance = storeStock3[i]["balance_quantity"]
            stockTotal = storeStock3[i]["total_quantity"]
        }
        
        if(storeStock3[i]["item_nsn_number"]==c.loanItemId2){
            stockLoan1 = storeStock3[i]["loaned_quantity"]
            stockBalance1 = storeStock3[i]["balance_quantity"]
            stockTotal1 = storeStock3[i]["total_quantity"]
        }
    }

    console.log("\n====== QUANTITY BEFORE ADDING OF LOAN WITH 2 ITEMS ======")
    console.log("\nCurrent Item nsn number: "+c.loanItemId)
    console.log("Current loaned out quantity: "+ stockLoan)
    console.log("Current balance quantity: "+ stockBalance)
    console.log("Current total quantity: "+ stockTotal)
    console.log("\nItem nsn number: "+c.loanItemId2)
    console.log("Current loaned out quantity: "+ stockLoan1)
    console.log("Current balance quantity: "+ stockBalance1)
    console.log("Current total quantity: "+ stockTotal1)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Add Loan with 2 items 
    var addLoan  = await loan.addNewLoan2(idToken, c.loanStoreId, c.loanStartDate, c.loanEndDate, c.loanActivityTypeUser,
        c.loanActivity, c.loanRequestorUser, c.loanItemId, c.loanQuantity, c.loanItemId2, c.loanQuantity2)
    assert.notEqual(typeof addLoan, typeof false, `TEST 311 FAILED: User cannot Add Loan`)

    console.log(addLoan)

    console.log("\nLoan ID: " + addLoan["id"])
    console.log("Current loan status: " + addLoan["status"])
    console.log("")

    // Login as Manager
    var idToken2 = login.getToken(c.manager)

    // Check if the Manager recieved the request of loan approval
    var getInbox = await inbox.GetYourInboxes(idToken2);
    assert.notEqual(typeof getInbox, typeof false, `TEST 311 FAILED: Manager cannot recieve inbox`)

    var pending
    var loanId
    for(var i=0;i<getInbox.length;i++){
        if(getInbox[i]["type"]== "loan" && getInbox[i]["status"] == "pending"){
            pending = getInbox[i]
            loanId = getInbox[i]["loan_id"]
        }
    }

    console.log(pending) // Display 
    console.log("")

    assert.equal(loanId, addLoan["id"], `TEST FAILED: LOAN ID NOT THE SAME`)

    // store item quantity after adding loan and before reject
    var currentCheckStore =await store.GetStoreItemByID(idToken2,c.loanStoreId)
    assert.notEqual(typeof currentCheckStore, typeof false, `TEST 311 FAILED: Cannot get store item by ID `)
    var balanceQuantity1
    var loanQuantity1 
    var totalQuantity1
    var balanceQuantity2
    var loanQuantity2
    var totalQuantity2
    for(var i=0;i<currentCheckStore.length;i++){
        if(currentCheckStore[i]["item_nsn_number"]==c.loanItemId){
            loanQuantity1=currentCheckStore[i]["loaned_quantity"]
            balanceQuantity1=currentCheckStore[i]["balance_quantity"]
            totalQuantity1=currentCheckStore[i]["total_quantity"]
        }
        if(currentCheckStore[i]["item_nsn_number"] == c.loanItemId2){
            loanQuantity2 = currentCheckStore[i]["loaned_quantity"]
            balanceQuantity2=currentCheckStore[i]["balance_quantity"]
            totalQuantity2=currentCheckStore[i]["total_quantity"]
        }
    }
    
    console.log("\n====== QUANTITY AFTER ADDING LOAN, BEFORE REJECTION OF LOAN ======")
    console.log("\nCurrent Item nsn number: " + c.loanItemId)
    console.log("Current loaned out quantity: "+ loanQuantity1)
    console.log("Current balance quantity: "+ balanceQuantity1)
    console.log("Current total quantity: "+ totalQuantity1)
    console.log("\nItem nsn number: "+c.loanItemId2)
    console.log("Current loaned out quantity: "+ loanQuantity2)
    console.log("Current balance quantity: "+ balanceQuantity2)
    console.log("Current total quantity: "+ totalQuantity2)
    // Reject Loan
    var rejectLoan = await loan.rejectLoan(idToken2, addLoan["id"])
    assert.notEqual(typeof rejectLoan, typeof false, `TEST 311 FAILED: Manager cannot reject loan`)

    var getInbox = await inbox.GetYourInboxes(idToken2)
    assert.notEqual(typeof getInbox, typeof false, `TEST 311 FAILED: Manager cannot recieve inbox`)

    // query inbox => status="rejected"
    var rejected
    var reason
    for(var i=0;i<getInbox.length;i++){
        if(getInbox[i]["loan_id"]== addLoan["id"] && getInbox[i]["status"] == "rejected"){
            rejected = getInbox[i]
            reason = getInbox[i]["reject_reason"]
        }
     }

    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")
    console.log("\nStatus before rejection:")
    console.log("Approval Loan ID: "+ addLoan["id"] + ", Status: " + addLoan["status"])
    console.log("\nStatus after rejection:")
    console.log("Query: Loan ID: "+ rejected["id"] + ", Status: " + rejected["status"] + ", Reason: " + reason) // Display Queries
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // check the store 561 item nsn 55 & 56's balance quantity got go down by 20 
    var updatedCheckStore = await store.GetStoreItemByID(idToken2, c.loanStoreId)
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
    console.log("\n====== QUANTITY AFTER REJECTION OF LOAN ======")
    console.log("\nItem nsn number: "+ c.loanItemId)
    console.log("Loaned Out Quantity: " + loanedQuantity)
    console.log("Balance Quantity: "+ balanceQuantity)
    console.log("Total Quantity: " + totalQuantity)
    console.log("\nItem nsn number: "+ c.loanItemId2)
    console.log("Loaned Out Quantity: " + loanedQuantity3)
    console.log("Balance Quantity: "+ balanceQuantity3)
    console.log("Total Quantity: " + totalQuantity2)
    
    // assert compare balance quantity for item 55
    assert.equal(balanceQuantity, balanceQuantity1, `TEST 311 FAILED: Balance quantity should not reduce by ${c.loanQuantity} and loan out quantity should not increase after rejection`)

    // assert compare balance quantity for item 
    assert.equal(balanceQuantity, balanceQuantity1, `TEST 311 FAILED: Balance quantity should not reduce by ${c.loanQuantity2} and loan out quantity should not increase after rejection`)

    console.log("\nTEST 311 SUCCESS: Loan with 2 items has successfully rejected, both item nsn number balance quantity and loaned quantity remains the same")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")
}

module.exports = { testRejectLoan2Items }