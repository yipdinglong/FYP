const assert = require("assert")    
const login = require("../../Login")
const loan = require("../../saf/Loan")
const store = require("../../saf/Store")
const inbox = require("../../saf/Inbox")
const c = require("../../Const/Const")

// User add new loans with 2 items, loan approved by manager and proceed to loan out.

// testAddNewLoan2Items()

async function testAddNewLoan2Items() {

    // Login as User
    var idToken = login.getToken(c.user)

    // Query if store got enough stocks to be loaned out
    var checkStocks = await store.GetStoreItemByID(idToken,c.loanStoreId)
    assert.notEqual(typeof checkStocks, typeof false, `TEST 309 FAILED: Cannot to get store item by ID `)
    for(var i=0;i<checkStocks.length;i++){
        if(checkStocks[i]["balance_quantity"] < c.loanQuantity){
            assert.fail("TEST 309 FAILED: Insufficient stocks to loan")
        }
    }
    
    // Query Store stocks- before add loans
    var storeStock3 = await store.GetStoreItemByID(idToken, c.loanStoreId) 
    assert.notEqual(typeof storeStock3, typeof false, `TEST 309 FAILED: Cannot get store item by ID `)

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
    console.log("\nItem nsn number: "+c.loanItemId2)
    console.log("Current loaned out quantity: "+ stockLoan1)
    console.log("Current balance quantity: "+ stockBalance1)
    console.log("Current total quantity: "+ stockTotal1)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Add Loan with 2 items 
    var addLoan  = await loan.addNewLoan2(idToken, c.loanStoreId, c.loanStartDate, c.loanEndDate, c.loanActivityTypeUser,
        c.loanActivity, c.loanRequestorUser, c.loanItemId, c.loanQuantity, c.loanItemId2, c.loanQuantity2)
    assert.notEqual(typeof addLoan, typeof false, `TEST 309 FAILED: User cannot Add Loan`)

    console.log(addLoan)

    console.log("\nLoan ID: " + addLoan["id"])
    console.log("Current loan status: " + addLoan["status"])
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // store item quantity before approval and after adding loan 
    var currentCheckStore =await store.GetStoreItemByID(idToken,c.loanStoreId)
    // currentCheckStore = JSON.parse(currentCheckStore)
    assert.notEqual(typeof currentCheckStore, typeof false, `TEST 309 FAILED: Cannot get store item by ID `)

    var loanQuantity1
    var loanQuantity4
    var balanceQuantity1
    var balanceQuantity4
    var totalQuantity1
    var totalQuantity4
    for(var i=0;i<currentCheckStore.length;i++){
       if(currentCheckStore[i]["item_nsn_number"]==c.loanItemId){
            loanQuantity1 = currentCheckStore[i]["loaned_quantity"]
            balanceQuantity1 = currentCheckStore[i]["balance_quantity"]
            totalQuantity1 = currentCheckStore[i]["total_quantity"]
        }
        if(currentCheckStore[i]["item_nsn_number"]==c.loanItemId2){
            loanQuantity4 = currentCheckStore[i]["loaned_quantity"]
            balanceQuantity4 = currentCheckStore[i]["balance_quantity"]
            totalQuantity4 = currentCheckStore[i]["total_quantity"]
        }
    }

    console.log("\n====== QUANTITY AFTER ADDING LOAN, BEFORE APPROVAL OF LOAN ======")
    console.log("\nItem nsn number: " + c.loanItemId)
    console.log("Current loaned out quantity: "+ loanQuantity1)
    console.log("Current balance quantity: "+ balanceQuantity1)
    console.log("Current total quantity: "+ totalQuantity1)
    console.log("\nItem nsn number: " + c.loanItemId2)
    console.log("Current loaned out quantity: "+ loanQuantity4)
    console.log("Current balance quantity: "+ balanceQuantity4)
    console.log("Current total quantity: "+ totalQuantity4)
    console.log("")

    // Login as Manager
    var idToken2 = login.getToken(c.manager)

    // Check if the Manager recieved the request of loan approval
    var getInbox = await inbox.GetYourInboxes(idToken2);
    assert.notEqual(typeof getInbox, typeof false, `TEST 309 FAILED: Manager cannot recieve inbox`)

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
    assert.notEqual(typeof approveLoan, typeof false, `TEST 309 FAILED: Failed to approve loan`)

    var getInbox = await inbox.GetYourInboxes(idToken2);
    assert.notEqual(typeof getInbox, typeof false, `TEST 309 FAILED: Manager cannot retrieve inbox `)

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
    console.log("Status after approval:")
    console.log("Query: Approval Loan ID: "+ approved["id"] + ", Status: " + approved["status"]) // Display Queries
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // store quantity before loaning out 
    var currentCheckStore =await store.GetStoreItemByID(idToken,c.loanStoreId)
    assert.notEqual(typeof currentCheckStore, typeof false, `TEST 309 FAILED: Failed to get store item by ID `)
    var loanedQuantity1
    var loanedQuantity2
    var balanceQuantity1
    var balanceQuantity2
    var totalQuantity1
    var totalQuantity2
    var beforeLoanOut1
    var beforeLoanOut2
    for(var i=0;i<currentCheckStore.length;i++){
        if(currentCheckStore[i]["item_nsn_number"]==c.loanItemId){
            loanedQuantity1 =currentCheckStore[i]["loaned_quantity"]
            balanceQuantity1 = currentCheckStore[i]["balance_quantity"]
            totalQuantity1 = currentCheckStore[i]["total_quantity"]
            beforeLoanOut1 = currentCheckStore[i]
        }
        if(currentCheckStore[i]["item_nsn_number"] == c.loanItemId2){
            loanedQuantity2 =currentCheckStore[i]["loaned_quantity"]
            balanceQuantity2 = currentCheckStore[i]["balance_quantity"]
            totalQuantity2 = currentCheckStore[i]["total_quantity"]
            beforeLoanOut2 = currentCheckStore[i]
        }
    }
    
    console.log("\n====== QUANTITY BEFORE LOANING OUT ======")
    console.log("\nItem nsn number: "+ c.loanItemId)
    console.log(beforeLoanOut1)
    console.log("Loaned Out Quantity: " + loanedQuantity1)
    console.log("Balance Quantity: "+ balanceQuantity1)
    console.log("Total Quantity: " + totalQuantity1)
    console.log("\nItem nsn number: "+ c.loanItemId2)
    console.log(beforeLoanOut2)
    console.log("Loaned Out Quantity: " + loanedQuantity2)
    console.log("Balance Quantity: "+ balanceQuantity2)
    console.log("Total Quantity: " + totalQuantity2)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Get loan by id
    var getAllLoan = await loan.getAllLoan(idToken)
    assert.notEqual(typeof getAllLoan, typeof false, `TEST 309 FAILED: Failed to retrieve all loans `)

    var Loans
    var quantity
    var quantity2
    for(var i=0;i<getAllLoan.length;i++){
        if(getAllLoan[i]["id"]== addLoan["id"]){
            Loans = getAllLoan[i]
        }
        for(var j=0;j<getAllLoan[i]["items"].length;j++){
            if(getAllLoan[i]["items"][j]["item_nsn_number"] == c.loanItemId ){
                quantity = getAllLoan[i]["items"][j]["quantity"]
            }
            if(getAllLoan[i]["items"][j]["item_nsn_number"] == c.loanItemId2) {
                quantity2 = getAllLoan[i]["items"][j]["quantity"]
            } 
        }
    }

    // query loan to make sure can see the loan
    console.log("\nLoan ID: " + Loans["id"])
    console.log(Loans)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // loan out items 
    console.log("\nBefore Loaning out: ")
    console.log("\nLoan Out Date: " + Loans["loaned_out_date"])
    console.log("Status: NULL")
    console.log("Item: " + c.loanItemId) 
    console.log("umber of quantity of items to be loaned out: " + quantity) 
    console.log("\nItem: " + c.loanItemId2) 
    console.log("Number of quantity of items to be loaned out: " + quantity2) 
    console.log("")

    // Login as User 
    var idToken = login.getToken(c.user)

    var loanOut = await loan.loiLoan(idToken, approved["loan_id"], c.loanOutDate)
    assert.notEqual(typeof loanOut, typeof false, `TEST 309 FAILED: USer cannot loan out loan items`)

    // query loan out 
    console.log("\nAfter Loaning out: ")
    console.log(loanOut)
    console.log("\nLoan ID: " + loanOut["id"])
    console.log("Loan Out Date: "+ loanOut["loaned_out_date"])
    console.log("Status: " + loanOut["status"])
    console.log("LOANED OUT SUCCESSFUL!!")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // check the store 561 item nsn 55 & 56's balance quantity got go down by 20 
    var updatedCheckStore = await store.GetStoreItemByID(idToken, c.loanStoreId)
    assert.notEqual(typeof updatedCheckStore, typeof false, `TEST 309 FAILED: Failed to get store item by ID `)
    var loanedQuantity
    var loanedQuantity3
    var balanceQuantity
    var balanceQuantity3
    var totalQuantity
    var totalQuantity2
    var selectedItem1
    var selectedItem
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
    console.log("\n====== QUANTITY AFTER LOANING OUT ITEMS ======")
    console.log("\nItem nsn number: "+ c.loanItemId)
    console.log("Loaned Out Quantity: " + loanedQuantity)
    console.log("Balance Quantity: "+ balanceQuantity)
    console.log("Total Quantity: " + totalQuantity)
    console.log("\nItem nsn number: "+ c.loanItemId2)
    console.log("Loaned Out Quantity: " + loanedQuantity3)
    console.log("Balance Quantity: "+ balanceQuantity3)
    console.log("Total Quantity: " + totalQuantity2)

    // assert compare balance quantity for item 55
    assert.notEqual(balanceQuantity, balanceQuantity1, `TEST 309 FAILED: Balance quantity should reduce by ${c.loanQuantity} and loan out quantity should increase after loaning out loans`)
3
    // assert compare balance quantity for item 
    assert.notEqual(balanceQuantity3, balanceQuantity2, `TEST 309 FAILED: Balance quantity should reduce by ${c.loanQuantity2} and loan out quantity should increase after loaning out loans`)

    console.log("\nTEST 309 SUCCESS: User is able to add loan with 2 items and loan out loans approved by manager")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    return addLoan["id"]

}

module.exports={ testAddNewLoan2Items }