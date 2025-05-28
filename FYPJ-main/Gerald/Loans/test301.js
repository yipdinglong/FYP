const assert = require("assert")    
const login = require("../../Login")
const loan = require("../../saf/Loan")
const inbox = require("../../saf/Inbox")
const store = require("../../saf/Store")
const c = require("../../Const/Const")

// TEST SENCARIO: User add loans, loans approved by manager/admin and loaning out the items

// testAddLoan()
async function testAddLoan(){
    // Login as User
    var idToken = login.getToken(c.user)

    // Query if store got enough stocks to be loaned out
    var checkStocks = await store.GetStoreItemByID(idToken,c.loanStoreId)
    assert.notEqual(typeof checkStocks, typeof false, `TEST 301 FAILED: Failed to get store item by ID `)
    
    for(var i=0;i<checkStocks.length;i++){
        if(checkStocks[i]["balance_quantity"] < c.loanQuantity){
            assert.fail("TEST 301 FAILED: Insufficient stocks to loan")
        }
    }
    
    // Query Store stocks- before add loans
    var storeStock3 = await store.GetStoreItemByID(idToken, c.loanStoreId) 
    assert.notEqual(typeof storeStock3, typeof false, `TEST 301 FAILED: Cannot get store item by ID `)

    var stockLoan
    var stockBalance
    var stockTotal
    var beforeAddLoan
    for(var i=0; i<storeStock3.length;i++){
        if(storeStock3[i]["item_nsn_number"]==c.loanItemId)
        {
            console.log("THis is Item ID: " + c.loanItemId)
            stockLoan = storeStock3[i]["loaned_quantity"]
            stockBalance = storeStock3[i]["balance_quantity"]
            stockTotal = storeStock3[i]["total_quantity"]
            beforeAddLoan = storeStock3[i]
        }
    }

    console.log("\n====== QUANTITY BEFORE ADDING OF LOAN ======")
    console.log(beforeAddLoan)
    console.log("\nCurrent Item nsn number: "+c.loanItemId)
    console.log("Current loaned out quantity: "+ stockLoan)
    console.log("Current balance quantity: "+ stockBalance)
    console.log("Current total quantity: "+ stockTotal)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Add Loan
    var addLoan = await loan.addNewLoan(idToken, c.loanStoreId, c.loanStartDate, c.loanEndDate, c.loanActivityTypeUser, 
        c.loanActivity, c.loanRequestorUser, c.loanItemId, c.loanQuantity); 
    assert.notEqual(typeof addLoan, typeof false, `TEST 301 FAILED: User cannot Add Loan`)

    console.log(addLoan)

    console.log("\nLoan ID: " + addLoan["id"])
    console.log("\nCurrent loan status: " + addLoan["status"])
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // store item quantity before approval and after adding loan 
    var currentCheckStore =await store.GetStoreItemByID(idToken,c.loanStoreId)
    assert.notEqual(typeof currentCheckStore, typeof false, `TEST 301 FAILED: Cannot get store item by ID `)

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
    assert.notEqual(typeof getInbox, typeof false, `TEST 301 FAILED: Manager cannot recieve inbox`)

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
    assert.notEqual(typeof approveLoan, typeof false, `TEST 301 FAILED: Failed to approve bonus issue`)


    var getInbox = await inbox.GetYourInboxes(idToken2);
    assert.notEqual(typeof getInbox, typeof false, `TEST 301 FAILED: Manager cannot retrieve inbox `)

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
    console.log("\nStatus after approval:")
    console.log("Query: Approval Loan ID: "+ approved["id"] + ", Status: " + approved["status"]) // Display Queries
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // store quantity before loaning out 
    var currentCheckStore =await store.GetStoreItemByID(idToken,c.loanStoreId)
    assert.notEqual(typeof currentCheckStore, typeof false, `TEST 301 FAILED: Failed to get store item by ID `)
    var balanceQuantity1
    var loanquantity1
    var totalQuantity1
    var beforeLoanOut
    for(var i=0;i<currentCheckStore.length;i++){
       if(currentCheckStore[i]["item_nsn_number"]==c.loanItemId){
        loanquantity1 = currentCheckStore[i]["loaned_quantity"]
        balanceQuantity1 = currentCheckStore[i]["balance_quantity"]
        totalQuantity1 = currentCheckStore[i]["total_quantity"]
        beforeLoanOut = currentCheckStore[i]
       }
    }

    console.log("\n====== QUANTITY BEFORE LOANING OUT ======")
    console.log(beforeLoanOut)
    console.log("\nItem nsn number: "+c.loanItemId)
    console.log("Current loaned out quantity: "+ loanquantity1)
    console.log("Current balance quantity: "+ balanceQuantity1)
    console.log("Current total quantity: "+ totalQuantity1)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Get loan by id
    var getAllLoan = await loan.getAllLoan(idToken)
    assert.notEqual(typeof getAllLoan, typeof false, `TEST 301 FAILED: Failed to retrieve all loans `)

    var Loans
    var quantity
    for(var i=0;i<getAllLoan.length;i++){
        if(getAllLoan[i]["id"]== addLoan["id"]){
            Loans = getAllLoan[i]
        }
        for(var j=0;j<getAllLoan[i]["items"].length;j++){
            if(getAllLoan[i]["items"][j]["item_nsn_number"] == c.loanItemId ){
                quantity = getAllLoan[i]["items"][j]["quantity"]
            } 
        }
    }

    // query loan to make sure can see the loan
    console.log("\nLoan ID: " + Loans["id"])
    console.log(Loans)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // loan out items 
    console.log("\nBefore Loaning out: ")
    console.log("Item nsn number: " + c.loanItemId)
    console.log("Loan Out Date: " + Loans["loaned_out_date"])
    console.log("Loan out status: NULL")
    console.log("Quantity of items to be loaned out: " + quantity) 
    console.log("")

    // Login as User 
    var idToken = login.getToken(c.user)

    var loanOut = await loan.loiLoan(idToken, Loans["id"], c.loanOutDate)
    assert.notEqual(typeof loanOut, typeof false, `TEST 301 FAILED: Failed to loan out loan items`)

    // query loan out 
    console.log("\nAfter Loaning out: ")
    console.log("Loan ID: " + loanOut["id"])
    console.log("Loan Out Date: "+ loanOut["loaned_out_date"])
    console.log("Loan out status: " + loanOut["status"])
    console.log("LOANED OUT SUCCESSFUL!!")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // check item nsn number 55's balance quantity got go down by 20 
    var updatedCheckStore = await store.GetStoreItemByID(idToken, c.loanStoreId)
    assert.notEqual(typeof updatedCheckStore, typeof false, `TEST 301 FAILED: Failed to get store item by ID `)
    var loanedQuantity
    var balanceQuantity
    var totalQuantity
    var selectedItem
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
    console.log("\n====== QUANTITY AFTER LOANING OUT ======")
    console.log("\nItem nsn number: " + c.loanItemId)
    console.log("Loaned Out Quantity: " + loanedQuantity)
    console.log("Balance Quantity: "+ balanceQuantity)
    console.log("Total Quantity: " + totalQuantity)

    // assert compare balance quantity
    assert.notEqual(balanceQuantity, balanceQuantity1, `TEST 301 FAILED: Balance quantity should reduce by ${c.loanQuantity} and loan out quantity should increase after loaning out loans`)

    console.log("\nTEST 301 SUCCESS: User is able to add loan and loan out loans approved by manager")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")
    
    return addLoan["id"]

}




module.exports={ testAddLoan }