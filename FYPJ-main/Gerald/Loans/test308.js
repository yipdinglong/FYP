const assert = require("assert")    
const login = require("../../Login")
const loan = require("../../saf/Loan")
const store = require("../../saf/Store")
const inbox = require("../../saf/Inbox")
const c = require("../../Const/Const") 

// Test if the user is able to return rejected loans 
// low priority
// wont affect user flow
// DO NOT RUN THIS SCRIPT IT WILL MAKE THE CHANGE THE QUANTITY TO NEGATIVE

// testReturnRejectedLoans()
async function testReturnRejectedLoans() {

    // Login as User
    var idToken = login.getToken(c.user)

    // Query if store got enough stocks to be loaned out
    var checkStocks = await store.GetStoreItemByID(idToken,c.loanStoreId)
    assert.notEqual(typeof checkStocks, typeof false, `TEST 308 FAILED: Cannot get store item by ID `)
    for(var i=0;i<checkStocks.length;i++){
        if(checkStocks[i]["balance_quantity"] < c.loanQuantity){
            assert.fail("TEST 308 FAILED: Insufficient stocks to loan")
        }
    }

    // Query Store stocks- before add loans
    var storeStock3 = await store.GetStoreItemByID(idToken, c.loanStoreId) 
    assert.notEqual(typeof storeStock3, typeof false, `TEST 301 FAILED: Cannot get store item by ID `)

    var stockLoan
    var stockBalance
    var stockTotal
    for(var i=0; i<storeStock3.length;i++){
        if(storeStock3[i]["item_nsn_number"]==c.loanItemId)
        stockLoan = storeStock3[i]["loaned_quantity"]
        stockBalance = storeStock3[i]["balance_quantity"]
        stockTotal = storeStock3[i]["total_quantity"]
    }

    console.log("\n====== QUANTITY BEFORE ADDING OF LOAN ======")
    console.log("\nCurrent Item nsn number: "+c.loanItemId)
    console.log("Current loaned out quantity: "+ stockLoan)
    console.log("Current balance quantity: "+ stockBalance)
    console.log("Current total quantity: "+ stockTotal)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Add Loan
    var addLoan = await loan.addNewLoan(idToken, c.loanStoreId, c.loanStartDate, c.loanEndDate, c.loanActivityTypeUser, 
    c.loanActivity, c.loanRequestorUser, c.loanItemId, c.loanQuantity); 
    assert.notEqual(typeof addLoan, typeof false, `TEST 308 FAILED: User cannot Add Loan`)

    console.log(addLoan)

    console.log("\nLoan ID: " + addLoan["id"])
    console.log("Current loan status: " + addLoan["status"])
    console.log("")

    // Login as Manager
    var idToken2 = login.getToken(c.manager)

    // Check if the Manager recieved the request of loan approval
    var getInbox = await inbox.GetYourInboxes(idToken2);
    assert.notEqual(typeof getInbox, typeof false, `TEST 308 FAILED: Manager cannot recieve inbox`)

    var pending
    for(var i=0;i<getInbox.length;i++){
        if(getInbox[i]["type"]== "loan" && getInbox[i]["status"] == "pending"){
            pending = getInbox[i]
        }
    }

    console.log(pending) // Display 
    console.log("")

    // store item quantity before reject
    var currentCheckStore =await store.GetStoreItemByID(idToken2,c.loanStoreId)
    assert.notEqual(typeof currentCheckStore, typeof false, `TEST 308 FAILED: Failed to get store item by ID `)
    var balanceQuantity1
    var loanquantity1
    var totalQuantity1
    var selectedItem
    for(var i=0;i<currentCheckStore.length;i++){
       if(currentCheckStore[i]["item_nsn_number"]==c.loanItemId){
        balanceQuantity1 = currentCheckStore[i]["balance_quantity"]
        loanquantity1 = currentCheckStore[i]["loaned_quantity"]
        totalQuantity1 = currentCheckStore[i]["total_quantity"]
        selectedItem = currentCheckStore[i]
       }
    }

    console.log("\nUpdated Store: ")
    console.log(selectedItem)
    console.log("\n====== QUANTITY BEFORE REJECTING LOAN ======")
    console.log("\nCurrent Store ID: "+c.loanItemId)
    console.log("Current loaned out quantity: "+ loanquantity1)
    console.log("Current balance quantity: "+ balanceQuantity1)
    console.log("Current total quantity: "+ totalQuantity1)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Reject Loan
    var rejectLoan = await loan.rejectLoan(idToken2, addLoan["id"])
    assert.notEqual(typeof rejectLoan, typeof false, `TEST 308 FAILED: Cannot reject loan `)

    var getInbox = await inbox.GetYourInboxes(idToken2)
    assert.notEqual(typeof getInbox, typeof false, `TEST 308 FAILED: Manager cannot retrieve inbox `)
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
    console.log("")

    // Sign in as User
    var idToken = login.getToken(c.user)

    // Return Loan
    var retLoan = await loan.returnLoan(idToken, addLoan["id"], c.loanReturnDate, c.loanItemId, c.loanQuantity)
    assert.notEqual(typeof currentCheckStore, typeof false, `TEST 308 FAILED: Cannot return loan `)

    console.log("\nReturning Loan ID: " + addLoan["id"])
    console.log(retLoan)
    console.log("\nLoan ID: " + addLoan["id"] + " returned.")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Query Store 
    var CheckStore = await store.GetStoreItemByID(idToken, c.loanStoreId)
    assert.notEqual(typeof CheckStore, typeof false, `TEST 308 FAILED: Cannot get store item by ID `)

    var CurrentStoreQuantity3
    var loanQuantity
    var totalQuantity
    var selectedItem
    for(var i=0;i<CheckStore.length;i++){
        if(CheckStore[i]["item_nsn_number"]==c.loanItemId){
            loanQuantity = CheckStore[i]["loaned_quantity"]
            CurrentStoreQuantity3=CheckStore[i]["balance_quantity"]
            totalQuantity = CheckStore[i]["total_quantity"]
            selectedItem = CheckStore[i]
        }
    }
    console.log("\nUpdate Store: ")
    console.log(selectedItem)
    console.log("\n====== QUANTITY AFTER RETURNING OF LOAN ======")
    console.log("Loaned Out Quantity: " + loanQuantity)
    console.log("Balance Quantity: "+CurrentStoreQuantity3)
    console.log("Total Quantity: " + totalQuantity)
    console.log("TEST 308 FAILED: USer is able to return rejected loans")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")
    
}

module.exports = { testReturnRejectedLoans }
