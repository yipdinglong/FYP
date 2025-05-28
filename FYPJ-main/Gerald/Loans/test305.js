const assert = require("assert")    
const login = require("../../Login")
const loan = require("../../saf/Loan")
const store = require("../../saf/Store")
const inbox = require("../../saf/Inbox")
const c = require("../../Const/Const")

// TEST SENARIO: Manager/admin able to add loans and query loan status to see if status is approved and able to loaned out items straight 

// testAddLoanAM()
async function testAddLoanAM() {
    
    // Login as Manager
    var idToken2 = login.getToken(c.manager)

    // Query if store got enough stocks to be loaned out
    var checkStocks = await store.GetStoreItemByID(idToken2,c.loanStoreId)
    assert.notEqual(typeof checkStocks, typeof false, `TEST 305 FAILED: Failed to get store item by ID `)
    for(var i=0;i<checkStocks.length;i++){
        if(checkStocks[i]["balance_quantity"] < c.loanQuantity){
            assert.fail("TEST 305 FAILED: Insufficient stocks to loan")
        }
    }

    // Query Store stocks- before add loans
    var storeStock3 = await store.GetStoreItemByID(idToken2, c.loanStoreId) 
    assert.notEqual(typeof storeStock3, typeof false, `TEST 305 FAILED: Failed to get store item by ID `)
    var stockLoan 
    var stockBalance
    var stockTotal
    for(var i=0; i<storeStock3.length;i++){
        if(storeStock3[i]["item_nsn_number"]==c.loanItemId){ 
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
    var addLoan = await loan.addNewLoan(idToken2, c.loanStoreId, c.loanStartDate, c.loanEndDate, c.loanActivityTypeUser, 
        c.loanActivityTypeAM, c.loanRequestorAM, c.loanItemId, c.loanQuantity); 
    assert.notEqual(typeof addLoan, typeof false, `TEST 305 FAILED: User cannot Add Loan`)

    console.log(addLoan)
    
    console.log("\nLoan ID: " + addLoan["id"])
    console.log("Current loan status: " + addLoan["status"])
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // store item quantity before approval and after adding loan 
    var currentCheckStore =await store.GetStoreItemByID(idToken2,c.loanStoreId)
    assert.notEqual(typeof currentCheckStore, typeof false, `TEST 305 FAILED: Cannot get store item by ID `)

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

    console.log("\n====== QUANTITY AFTER ADDING LOAN, BEFORE LOANING OUT OF LOAN ======")
    console.log("\nCurrent Item nsn number: " + c.loanItemId)
    console.log("Current loaned out quantity: "+ loanQuantity1)
    console.log("Current balance quantity: "+ balanceQuantity1)
    console.log("Current total quantity: "+ totalQuantity1)
    console.log("")

    // Get loan by id
    var getAllLoan = await loan.getAllLoan(idToken2)
    assert.notEqual(typeof getInbox, typeof false, `TEST 305 FAILED: Manager cannot retrieve all loan  `)

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
    console.log("Loan Out Date: " + Loans["loaned_out_date"])
    console.log("Status: NULL")
    console.log("Quantity of items to be loaned out: " + quantity) 
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    var loanOut = await loan.loiLoan(idToken2, addLoan["id"], c.loanOutDate)
    assert.notEqual(typeof loanOut, typeof false, `TEST 305 FAILED: Failed to loan out loan items`)

    // query loan out 
    console.log("\nAfter Loaning out: ")
    console.log("Loan ID: " + loanOut["id"])
    console.log("Loan Out Date: "+ loanOut["loaned_out_date"])
    console.log("Status: " + loanOut["status"])
    console.log("LOANED OUT SUCCESSFUL!!")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // check the store 561 balance quantity got go down by 20 
    var updatedCheckStore = await store.GetStoreItemByID(idToken2, c.loanStoreId)
    assert.notEqual(typeof updatedCheckStore, typeof false, `TEST 305 FAILED: Failed to get store item by ID `)
    var loanedQuantity
    var balanceQuantity
    var totalQuantity
    var selectedItem
    for(var i=0;i<updatedCheckStore.length;i++){
        if(updatedCheckStore[i]["item_nsn_number"]==c.loanItemId){
            loanedQuantity = updatedCheckStore[i]["loaned_quantity"]
            balanceQuantity = updatedCheckStore[i]["balance_quantity"]
            totalQuantity = updatedCheckStore[i]["total_quantity"]
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
    assert.notEqual(balanceQuantity, balanceQuantity1, `TEST 305 FAILED: balance quantity should reduce by ${c.loanQuantity} and loan out quantity should increase after loaning out loans`)
    
    console.log("\nTEST 305 SUCCESS: Loan got approved instantly after manager add loan and balance quantity got decrease after loaning out item")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    return addLoan["id"]

}
module.exports={ testAddLoanAM }