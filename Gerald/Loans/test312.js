const assert = require("assert")    
const login = require("../../Login")
const loan = require("../../saf/Loan")
const store = require("../../saf/Store")
const inbox = require("../../saf/Inbox")
const c = require("../../Const/Const")

// User add new loans with 2 items, loan approved by manager but did not loan out

// testAddLoan2itemsNoLoi()

async function testAddLoan2itemsNoLoi() {

    // Login as User
    var idToken = login.getToken(c.user)

    // Query if store got enough stocks to be loaned out
    var checkStocks = await store.GetStoreItemByID(idToken,c.loanStoreId)
    assert.notEqual(typeof checkStocks, typeof false, `TEST 312 FAILED: Cannot get store item by ID `)
    for(var i=0;i<checkStocks.length;i++){
        if(checkStocks[i]["balance_quantity"] < c.loanQuantity){
            assert.fail("TEST 312 FAILED: Insufficient stocks to loan")
        } 
    }

    // Query Store stocks- before add loans
    var storeStock3 = await store.GetStoreItemByID(idToken, c.loanStoreId) 
    assert.notEqual(typeof storeStock3, typeof false, `TEST 312 FAILED: Cannot get store item by ID `)

    var stockLoan
    var stockLoan1
    var stockBalance
    var stockBalance1
    var stockTotal
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

    console.log("\n====== QUANTITY BEFORE ADDING OF LOAN ======")
    console.log("\nItem nsn number: "+c.loanItemId)
    console.log("Current loaned out quantity: "+ stockLoan)
    console.log("Current balance quantity: "+ stockBalance)
    console.log("Current total quantity: "+ stockTotal)
    console.log("\nItem nsn number: "+c.loanItemId)
    console.log("Current loaned out quantity: "+ stockLoan1)
    console.log("Current balance quantity: "+ stockBalance1)
    console.log("Current total quantity: "+ stockTotal1)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")


    // Add Loan with 2 items 
    var addLoan  = await loan.addNewLoan2(idToken, c.loanStoreId, c.loanStartDate, c.loanEndDate, c.loanActivityTypeUser,
        c.loanActivity, c.loanRequestorUser, c.loanItemId, c.loanQuantity, c.loanItemId2, c.loanQuantity2)
    assert.notEqual(typeof addLoan, typeof false, `TEST 312 FAILED: User cannot Add Loan`)

    console.log(addLoan)

    console.log("\n Loan ID: " + addLoan["id"])
    console.log("Current loan status: " + addLoan["status"])
    console.log("")

    // Login as Manager
    var idToken2 = login.getToken(c.manager)

    // Check if the Manager recieved the request of loan approval
    var getInbox = await inbox.GetYourInboxes(idToken2);
    assert.notEqual(typeof getInbox, typeof false, `TEST 312 FAILED: Manager cannot recieve inbox`)

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

    // Query store item nsn number's balance quantity before approval of loan
    var currentCheckStore =await store.GetStoreItemByID(idToken2,c.loanStoreId)
    assert.notEqual(typeof currentCheckStore, typeof false, `TEST 301 FAILED: Cannot get store item by ID `)
    var balanceQuantity3
    var loanQuantity3
    var totalQuantity3
    var balanceQuantity2
    var loanQuantity2
    var totalQuantity2

    for(var i=0;i<currentCheckStore.length;i++){
       if(currentCheckStore[i]["item_nsn_number"]==c.loanItemId){
            loanQuantity3=currentCheckStore[i]["loaned_quantity"]
            balanceQuantity3=currentCheckStore[i]["balance_quantity"]
            totalQuantity3=currentCheckStore[i]["total_quantity"]

       }
       if(currentCheckStore[i]["item_nsn_number"] == c.loanItemId2){
            loanQuantity2 = currentCheckStore[i]["loaned_quantity"]
            balanceQuantity2=currentCheckStore[i]["balance_quantity"]
            totalQuantity2=currentCheckStore[i]["total_quantity"]
 
       }
    }

    console.log("\n====== QUANTITY AFTER ADDING LOAN, BEFORE APPROVAL OF LOAN ======")
    console.log("\nCurrent Item nsn number: " + c.loanItemId)
    console.log("Current loaned out quantity: "+ loanQuantity3)
    console.log("Current balance quantity: "+ balanceQuantity3)
    console.log("Current total quantity: "+ totalQuantity3)
    console.log("\nItem nsn number: "+c.loanItemId2)
    console.log("Current loaned out quantity: "+ loanQuantity2)
    console.log("Current balance quantity: "+ balanceQuantity2)
    console.log("Current total quantity: "+ totalQuantity2)
    console.log("")

    // Approve Loan
    await loan.approveLoan(idToken2, addLoan["id"])
    assert.notEqual(typeof rejectLoan, typeof false, `TEST 312 FAILED: Manager cannot approve loan`)

    var getInbox = await inbox.GetYourInboxes(idToken2);
    assert.notEqual(typeof getInbox, typeof false, `TEST 312 FAILED: Manager cannot recieve inbox`)

    // query inbox => status="approved"
    var approved
    for(var i=0;i<getInbox.length;i++){
        if(getInbox[i]["loan_id"]== addLoan["id"] && getInbox[i]["status"] == "approved"){
            approved = getInbox[i]
        }
    }

    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")
    console.log("\nStatus before approval:")
    console.log("Approval Loan ID: "+ addLoan["id"] + ", Status: " + addLoan["status"])
    console.log("\nStatus after approval:")
    console.log("Query: Approval Loan ID: "+ approved["id"] + ", Status: " + approved["status"]) // Display Queries
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Query stocks to see if stocks got decrease after approval, but never LOI
    var currentCheckStore =await store.GetStoreItemByID(idToken,c.loanStoreId)
    assert.notEqual(typeof currentCheckStore, typeof false, `TEST 309 FAILED: Failed to get store item by ID `)
    var loanedQuantity1
    var loanedQuantity
    var balanceQuantity1
    var balanceQuantity
    var totalQuantity1
    var totalQuantity
    var selectedItem
    var selectedItem1
    for(var i=0;i<currentCheckStore.length;i++){
       if(currentCheckStore[i]["item_nsn_number"]==c.loanItemId){
            loanedQuantity1 =currentCheckStore[i]["loaned_quantity"]
            balanceQuantity1 = currentCheckStore[i]["balance_quantity"]
            totalQuantity1 = currentCheckStore[i]["balance_quantity"]
            selectedItem = currentCheckStore[i]
       }
       if(currentCheckStore[i]["item_nsn_number"] == c.loanItemId2){
            loanedQuantity =currentCheckStore[i]["loaned_quantity"]
            balanceQuantity = currentCheckStore[i]["balance_quantity"]
            totalQuantity = currentCheckStore[i]["total_quantity"]
            selectedItem1 = currentCheckStore[i]
       }
    }
    
    console.log("\nUpdated Store: ")
    console.log(selectedItem)
    console.log(selectedItem1)
    console.log("\n====== QUANTITY AFTER LOAN APPROVAL BUT NO LOI ======")
    console.log("\nItem nsn number: "+ c.loanItemId)
    console.log("Loaned Out Quantity: " + loanedQuantity1)
    console.log("Balance Quantity: "+ balanceQuantity1)
    console.log("Total Quantity: " + totalQuantity1)
    console.log("\nItem nsn number: "+ c.loanItemId2)
    console.log("Loaned Out Quantity: " + loanedQuantity)
    console.log("Balance Quantity: "+ balanceQuantity)
    console.log("Total Quantity: " + totalQuantity)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // assert if store balance quantity got reduce and loan out quantity increased 
    assert.notEqual(balanceQuantity, balanceQuantity3, `TEST 312 FAILED: Balance quantity should not reduce by ${c.loanQuantity} and loan out quantity should not increase after approval of loans`)

    
    // assert if store balance quantity got reduce and loan out quantity increased 
    assert.notEqual(balanceQuantity1, balanceQuantity2, `TEST 312 FAILED: Balance quantity should not reduce by ${c.loanQuantity2} and loan out quantity should not increase after approval of loans`)
    

    console.log("\nTEST 312 SUCCESS: Both item's quantities did not decrease or increase after loan approval")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

}

module.exports = { testAddLoan2itemsNoLoi }