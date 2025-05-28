const assert = require("assert")    
const login = require("../../Login")
const loan = require("../../saf/Loan")
const store = require("../../saf/Store")
const inbox = require("../../saf/Inbox")
const c = require("../../Const/Const")

// TEST SENARIO: Manager/admin able to add loans and see if status is approved. Check the store if the stocks got decrease when manager/admin
//               didnt loan out the items

// testAMNoLoi()
async function testAMNoLoi(){
    // Login as Manager
    var idToken2 = login.getToken(c.manager)

    // Query if store got enough stocks to be loaned out
    var checkStocks = await store.GetStoreItemByID(idToken2,c.loanStoreId)
    assert.notEqual(typeof checkStocks, typeof false, `TEST 306 FAILED: Failed to get store item by ID `)

    for(var i=0;i<checkStocks.length;i++){
        if(checkStocks[i]["balance_quantity"] < c.loanQuantity){
            assert.fail("TEST 306 FAILED: Insufficient stocks to loan")
        }
    }

    // Query Store stocks before add loans
    var storeStock3 = await store.GetStoreItemByID(idToken2, c.loanStoreId) 
    assert.notEqual(typeof storeStock3, typeof false, `TEST 306 FAILED: Cannot get store item by ID `)

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
        c.loanActivity, c.loanRequestorUser, c.loanItemId, c.loanQuantity); 
    assert.notEqual(typeof addLoan, typeof false, `TEST 306 FAILED: User cannot Add Loan`)

    console.log(addLoan)

    console.log("\nLoan ID: " + addLoan["id"])
    console.log("\nCurrent loan status: " + addLoan["status"])
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")


    // store item quantity before approval and after adding loan 
    var currentCheckStore =await store.GetStoreItemByID(idToken2,c.loanStoreId)
    assert.notEqual(typeof currentCheckStore, typeof false, `TEST 305 FAILED: Cannot get store item by ID `)

    var loanQuantity1
    var balanceQuantity1
    var totalQuantity1
    var selectedItem
    for(var i=0;i<currentCheckStore.length;i++){
       if(currentCheckStore[i]["item_nsn_number"]==c.loanItemId){
           loanQuantity1 = currentCheckStore[i]["loaned_quantity"]
           balanceQuantity1 = currentCheckStore[i]["balance_quantity"]
           totalQuantity1 = currentCheckStore[i]["total_quantity"]
           selectedItem = currentCheckStore[i]
       }
    }
    
    console.log("\nUpdated Store: ")
    console.log(selectedItem)
    console.log("\n====== QUANTITY AFTER ADDING LOAN, BEFORE APPROVAL OF LOAN ======")
    console.log("\nCurrent Item nsn number: " + c.loanItemId)
    console.log("Current loaned out quantity: "+ loanQuantity1)
    console.log("Current balance quantity: "+ balanceQuantity1)
    console.log("Current total quantity: "+ totalQuantity1)
    console.log("")

    // assert balance quantity 
    assert.equal(balanceQuantity1, stockBalance, `TEST 306 FAILED: balance quantity should not reduce by ${c.loanQuantity} and loan out quantity should not increase after loaning out loans`)

    console.log("\nTEST 306 SUCCESS: Stock did not decrease after loan approval")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

}
module.exports={ testAMNoLoi }