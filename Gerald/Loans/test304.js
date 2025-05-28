const assert = require("assert")    
const login = require("../../Login")
const loan = require("../../saf/Loan")
const store = require("../../saf/Store")
const inbox = require("../../saf/Inbox")
const c = require("../../Const/Const")

// TEST SENARIO: User add loans, manager/admin rejects the loans. See whether the status is rejected.

// testRejectLoans()
async function testRejectLoans() {

    // Login as User
    var idToken = login.getToken(c.user)

    // Query if store got enough stocks to be loaned out
    var checkStocks = await store.GetStoreItemByID(idToken,c.loanStoreId)
    assert.notEqual(typeof checkStocks, typeof false, `TEST 304 FAILED: Failed to get store item by ID `)
    for(var i=0;i<checkStocks.length;i++){
        if(checkStocks[i]["balance_quantity"] < c.loanQuantity){
            assert.fail("TEST 304 FAILED: Insufficient stocks to loan")
        }
    }   

    // Query Store stocks- before add loans
    var storeStock3 = await store.GetStoreItemByID(idToken, c.loanStoreId) 
    assert.notEqual(typeof storeStock3, typeof false, `TEST 304 FAILED: Cannot get store item by ID `)

    var stockLoan
    var stockBalance
    var stockTotal
    for(var i=0; i<storeStock3.length;i++){
        if(storeStock3[i]["item_nsn_number"]==c.loanItemId) {
            stockLoan = storeStock3[i]["loaned_quantity"]
            stockBalance = storeStock3[i]["balance_quantity"]
            stockTotal = storeStock3[i]["total_quantity"]
        }
    }

    console.log("\nCurrent Item nsn number: "+c.loanItemId)
    console.log("Current loaned out quantity: "+ stockLoan)
    console.log("Current balance quantity: "+ stockBalance)
    console.log("Current total quantity: "+ stockTotal)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Add Loan
    var addLoan = await loan.addNewLoan(idToken, c.loanStoreId, c.loanStartDate, c.loanEndDate, c.loanActivityTypeUser, 
        c.loanActivity, c.loanRequestorUser, c.loanItemId, c.loanQuantity); 
    assert.notEqual(typeof addLoan, typeof false, `TEST 304 FAILED: User cannot Add Loan`)

    console.log(addLoan)

    console.log("\nLoan ID: " + addLoan["id"])
    console.log("Current loan status: " + addLoan["status"])
    console.log("")

    // Login as Manager
    var idToken2 = login.getToken(c.manager)

    // Check if the Manager recieved the request of loan approval
    var getInbox = await inbox.GetYourInboxes(idToken2);
    assert.notEqual(typeof getInbox, typeof false, `TEST 304 FAILED: Manager cannot recieve inbox`)

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
    
    // Query Store stocks- before add loans
    var storeStock3 = await store.GetStoreItemByID(idToken2, c.loanStoreId) 
    assert.notEqual(typeof storeStock3, typeof false, `TEST 304 FAILED: Failed to get store item by ID `)
    var stockLoan 
    var stockBalance
    var stockTotal
    for(var i=0; i<storeStock3.length;i++){
        if(storeStock3[i]["item_nsn_number"]==c.loanItemId) {
            stockLoan = storeStock3[i]["loaned_quantity"]
            stockBalance = storeStock3[i]["balance_quantity"]
            stockTotal = storeStock3[i]["total_quantity"]
        }
    }

    console.log("\n====== QUANTITY BEFORE REJECTING LOAN ======")
    console.log("\nCurrent Item nsn number: "+c.loanItemId)
    console.log("Current loaned out quantity: "+ stockLoan)
    console.log("Current balance quantity: "+ stockBalance)
    console.log("Current total quantity: "+ stockTotal)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Reject Loan
    await loan.rejectLoan(idToken2, addLoan["id"], c.rejectLoanReason)
    var getInbox = await inbox.GetYourInboxes(idToken2)

    // query inbox => status="rejected"
    var rejected
    var reason
    for(var i=0;i<getInbox.length;i++){
        if(getInbox[i]["loan_id"]== addLoan["id"] && getInbox[i]["status"] == "rejected"){
            rejected = getInbox[i]
            reason = getInbox[i]["reason"]
        }
     }

    console.log(rejected)

    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")
    console.log("\nStatus before rejection:")
    console.log("Approval Loan ID: "+ addLoan["id"] + ", Status: " + addLoan["status"])
    console.log("\nStatus after rejection:")
    console.log("Query: Loan ID: "+ rejected["id"] + ", Status: " + rejected["status"] + ", Reason: " + reason)

    // check the store 561 item nsn 55 & 56's balance quantity got go down by 20 
    var updatedCheckStore = await store.GetStoreItemByID(idToken2, c.loanStoreId)
    assert.notEqual(typeof updatedCheckStore, typeof false, `TEST 304 FAILED: Failed to get store item by ID `)
    var loanedQuantity
    var balanceQuantity
    var totalQuantity
    for(var i=0;i<updatedCheckStore.length;i++){
        if(updatedCheckStore[i]["item_nsn_number"]==c.loanItemId){
            loanedQuantity = updatedCheckStore[i]["loaned_quantity"]
            balanceQuantity = updatedCheckStore[i]["balance_quantity"]
            totalQuantity=updatedCheckStore[i]["total_quantity"]
            selectedItem = updatedCheckStore[i]
        }
    }

    console.log("\nUpdated Store: ")
    console.log(selectedItem) 
    console.log("\n====== QUANTITY AFTER REJECTING OF LOAN ======")
    console.log("\nItem nsn number: "+ c.loanItemId)
    console.log("Loaned Out Quantity: " + loanedQuantity)
    console.log("Balance Quantity: "+ balanceQuantity)
    console.log("Total Quantity: " + totalQuantity)
    
    // assert compare balance quantity for item 55
    assert.equal(balanceQuantity, stockBalance, `TEST 304 FAILED: Balance quantity should not reduce by ${c.loanQuantity} and loan out quantity should not increase after rejection`)

    console.log("\nTEST 304 SUCCESS: Manger is able to reject user loans successfully")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")
}


module.exports={ testRejectLoans }