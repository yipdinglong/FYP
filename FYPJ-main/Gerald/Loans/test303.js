const assert = require("assert")    
const login = require("../../Login")
const loan = require("../../saf/Loan")
const store = require("../../saf/Store")
const inbox = require("../../saf/Inbox")
const c = require("../../Const/Const")


// TEST SENARIO: User add loans, manager/admin approved the loans but the user didnt loan out items

// testNoLoi()

async function testNoLoi(){
    // Login as User
    var idToken = login.getToken(c.user)

    // Query if store got enough stocks to be loaned out
    var checkStocks = await store.GetStoreItemByID(idToken,c.loanStoreId)
    assert.notEqual(typeof checkStocks, typeof false, `TEST 303 FAILED: Failed to get store item by ID `)
    for(var i=0;i<checkStocks.length;i++){
        if(checkStocks[i]["balance_quantity"] < c.loanQuantity){
            assert.fail("TEST 303 FAILED: Insufficient stocks to loan")
        }
    }   

    // Query Store stocks- before add loans
    var storeStock3 = await store.GetStoreItemByID(idToken, c.loanStoreId) 
    assert.notEqual(typeof storeStock3, typeof false, `TEST 303 FAILED: Failed to get store item by ID `)
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

    console.log("\n====== QUANTITY BEFORE ADDING OF LOAN ======")
    console.log("\nCurrent Item nsn number: "+c.loanItemId)
    console.log("Current loaned out quantity: "+ stockLoan)
    console.log("Current balance quantity: "+ stockBalance)
    console.log("Current total quantity: "+ stockTotal)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Add Loan
    var addLoan = await loan.addNewLoan(idToken, c.loanStoreId, c.loanStartDate, c.loanEndDate, c.loanActivityTypeUser, 
        c.loanActivity, c.loanRequestorUser, c.loanItemId, c.loanQuantity); 
    assert.notEqual(typeof addLoan, typeof false, `TEST 303 FAILED: User cannot Add Loan`)

    console.log(addLoan)
    
    console.log("\nLoan ID: " + addLoan["id"])
    console.log("Current loan status: " + addLoan["status"])
    console.log("")

     // store item quantity before approval and after adding loan 
     var currentCheckStore =await store.GetStoreItemByID(idToken,c.loanStoreId)
     assert.notEqual(typeof currentCheckStore, typeof false, `TEST 303 FAILED: Cannot get store item by ID `)

     console.log("THOOSSSS", currentCheckStore)

     var loanQuantity1
     var balanceQuantity1
     var totalQuantity1
     for(var i=0;i<currentCheckStore.length;i++){
        if(currentCheckStore[i]["item_nsn_number"]==c.loanItemId){
            loanQuantity1 = currentCheckStore[i]["loaned_quantity"]
            balanceQuantity1 = currentCheckStore[i]["balance_quantity"]
            totalQuantity1 = currentCheckStore[i]["total_quantity"]
        }
     }

     console.log("\n====== QUANTITY AFTER ADDING LOAN, BEFORE APPROVAL OF LOAN ======")
     console.log("\nCurrent Item nsn number: " + c.loanItemId)
     console.log("Current loaned out quantity: "+ loanQuantity1)
     console.log("Current balance quantity: "+ balanceQuantity1)
     console.log("Current total quantity: "+ totalQuantity1)
     console.log("")

    // Login as Manager
    var idToken2 = login.getToken(c.manager)

    // Check if the Manager recieved the request of loan approval
    var getInbox = await inbox.GetYourInboxes(idToken2);
    assert.notEqual(typeof getInbox, typeof false, `TEST 303 FAILED: Manager cannot recieve inbox`)

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

    // Approve Loan
    var approveLoan = await loan.approveLoan(idToken2, addLoan["id"])
    assert.notEqual(typeof approveLoan, typeof false, `TEST 303 FAILED: Failed to approve bonus issue`)

    var getInbox = await inbox.GetYourInboxes(idToken2);
    assert.notEqual(typeof getInbox, typeof false, `TEST 303 FAILED: Manager cannot retrieve inbox `)
    
    // query inbox => status="approved"
    var approved
    for(var i=0;i<getInbox.length;i++){
        if(getInbox[i]["loan_id"]== addLoan["id"] && getInbox[i]["status"] == "approved"){
            approved = getInbox[i]
        }
     }

    console.log(approved) // Display 
    console.log("")

    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")
    console.log("\nStatus before approval:")
    console.log("Approval Loan ID: "+ addLoan["id"] + ", Status: " + addLoan["status"])
    console.log("Status after approval:")
    console.log("Query: Approval Loan ID: "+ approved["loan_id"] + ", Status: " + approved["status"]) // Display Queries
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Query stocks to see if stocks got decrease after approval, but never LOI
    var storeStock2 = await store.GetStoreItemByID(idToken, c.loanStoreId)
    assert.notEqual(typeof storeStock2, typeof false, `TEST 303 FAILED: Failed to get store item by ID `) 
    var stockLoan1 
    var stockBalance1
    var stockTotal1
    var selectedItem
    for(var i=0; i<storeStock2.length;i++){
        if(storeStock2[i]["item_nsn_number"]==c.loanItemId)
        {
            stockLoan1 = storeStock2[i]["loaned_quantity"]
            stockBalance1 = storeStock2[i]["balance_quantity"]
            stockTotal1 = storeStock2[i]["total_quantity"]
            selectedItem = storeStock2[i]
        }
        
    }
    console.log("\nUpdated Store: ")
    console.log(selectedItem)
    console.log("\n====== QUANTITY AFTER APPROVAL OF LOAN ======")
    console.log("\nCurrent Item nsn number: "+c.loanItemId)
    console.log("Current loaned out quantity: "+ stockLoan1)
    console.log("Current balance quantity: "+ stockBalance1)
    console.log("Current total quantity: "+ stockTotal1)

    // assert if store balance quantity got reduce and loan out quantity increased 
    assert.equal(stockBalance1, stockBalance, `TEST 303 FAILED: Balance quantity should not reduce by ${c.loanQuantity} and loan out quantity should not increase after approval of loans`)
    

    console.log("\nTEST 303 SUCCESS: Stock did not decrease after loan approval")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

}

module.exports={ testNoLoi }