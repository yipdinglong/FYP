const assert = require("assert")    
const login = require("../../Login")
const loan2 = require("../../saf/Loan")
const store = require("../../saf/Store")
const inbox = require("../../saf/Inbox")
const c = require("../../Const/Const")

// Manager add loans with 2 items but did not loan out

// testAMadd2itemsNoLoi()

async function testAMadd2itemsNoLoi() {

    // Login as Manager
    var idToken2 = login.getToken(c.manager)

    // Query if store got enough stocks to be loaned out
    var checkStocks = await store.GetStoreItemByID(idToken2,c.loanStoreId)
    assert.notEqual(typeof checkStocks, typeof false, `TEST 314 FAILED: Cannot to get store item by ID `)
    for(var i=0;i<checkStocks.length;i++){
        if(checkStocks[i]["balance_quantity"] < c.loanQuantity){
            assert.fail("TEST 314 FAILED: Insufficient stocks to loan")
        }
    } 

    // Query Store stocks before add loans
    var storeStock = await store.GetStoreItemByID(idToken2, c.loanStoreId) 
    assert.notEqual(typeof storeStock, typeof false, `TEST 314 FAILED: Cannot get store item by ID `)
    var stockLoan
    var stockLoan1
    var stockBalance
    var stockBalance1
    var stockTotal
    var stockTotal1
    for(var i=0; i<storeStock.length;i++){
        if(storeStock[i]["item_nsn_number"]==c.loanItemId){
            stockLoan = storeStock[i]["loaned_quantity"]
            stockBalance = storeStock[i]["balance_quantity"]
            stockTotal = storeStock[i]["total_quantity"]
        }
        if(storeStock[i]["item_nsn_number"]==c.loanItemId2){
            stockLoan1 = storeStock[i]["loaned_quantity"]
            stockBalance1 = storeStock[i]["balance_quantity"]
            stockTotal1 = storeStock[i]["total_quantity"]
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
     var addLoan  = await loan2.addNewLoan2(idToken2, c.loanStoreId, c.loanStartDate, c.loanEndDate, c.loanActivityTypeAM,
        c.loanActivity, c.loanRequestorAM, c.loanItemId, c.loanQuantity, c.loanItemId2, c.loanQuantity2)
    assert.notEqual(typeof addLoan, typeof false, `TEST 314 FAILED: User cannot Add Loan`)

    console.log(addLoan)

    console.log("\nID: " + addLoan["id"])
    console.log("Current Status: " + addLoan["status"])
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // store item quantity before approval and after adding loan 
    var currentCheckStore =await store.GetStoreItemByID(idToken2,c.loanStoreId)
    assert.notEqual(typeof currentCheckStore, typeof false, `TEST 314 FAILED: Cannot get store item by ID `)

    var loanQuantity3
    var loanQuantity4
    var balanceQuantity3
    var balanceQuantity4
    var totalQuantity3
    var totalQuantity4
    for(var i=0;i<currentCheckStore.length;i++){
       if(currentCheckStore[i]["item_nsn_number"]==c.loanItemId){
            loanQuantity3 = currentCheckStore[i]["loaned_quantity"]
            balanceQuantity3 = currentCheckStore[i]["balance_quantity"]
            totalQuantity3 = currentCheckStore[i]["total_quantity"]
       }
       if(currentCheckStore[i]["item_nsn_number"]==c.loanItemId2){
            loanQuantity4 = currentCheckStore[i]["loaned_quantity"]
            balanceQuantity4 = currentCheckStore[i]["balance_quantity"]
            totalQuantity4 = currentCheckStore[i]["total_quantity"]
   }
    }

    console.log("\n====== QUANTITY AFTER ADDING LOAN, BEFORE APPROVAL OF LOAN ======")
    console.log("\nItem nsn number: " + c.loanItemId)
    console.log("Current loaned out quantity: "+ loanQuantity3)
    console.log("Current balance quantity: "+ balanceQuantity3)
    console.log("Current total quantity: "+ totalQuantity3)
    console.log("\nItem nsn number: " + c.loanItemId2)
    console.log("Current loaned out quantity: "+ loanQuantity4)
    console.log("Current balance quantity: "+ balanceQuantity4)
    console.log("Current total quantity: "+ totalQuantity4)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // Query stocks to see if stocks got decrease after approval, but never LOI
    var currentCheckStore =await store.GetStoreItemByID(idToken2,c.loanStoreId)
    assert.notEqual(typeof currentCheckStore, typeof false, `TEST 314 FAILED: Failed to get store item by ID `)
    var loanedQuantity1
    var loanedQuantity2
    var balanceQuantity1
    var balanceQuantity2
    var totalQuantity1
    var totalQuantity2
    var selectedItem
    var selectedItem1
    for(var i=0;i<currentCheckStore.length;i++){
       if(currentCheckStore[i]["item_nsn_number"]==c.loanItemId){
            loanedQuantity1 =currentCheckStore[i]["loaned_quantity"]
            balanceQuantity1 = currentCheckStore[i]["balance_quantity"]
            totalQuantity1 = currentCheckStore[i]["total_quantity"]
            selectedItem = currentCheckStore[i]
       }
       if(currentCheckStore[i]["item_nsn_number"] == c.loanItemId2){
            loanedQuantity2 =currentCheckStore[i]["loaned_quantity"]
            balanceQuantity2 = currentCheckStore[i]["balance_quantity"]
            totalQuantity2 = currentCheckStore[i]["total_quantity"]
            selectedItem1 = currentCheckStore[i]
       }
    }
    
    console.log("\nUpdated Store: ")
    console.log(selectedItem)
    console.log(selectedItem1)
    console.log("\n====== QUANTITY AFTER APPROVAL ======")
    console.log("\nItem nsn number: "+ c.loanItemId)
    console.log("Loaned Out Quantity: " + loanedQuantity1)
    console.log("Balance Quantity: "+ balanceQuantity1)
    console.log("Total Quantity: " + totalQuantity1)
    console.log("\nItem nsn number: "+ c.loanItemId2)
    console.log("Loaned Out Quantity: " + loanedQuantity2)
    console.log("Balance Quantity: "+ balanceQuantity2)
    console.log("Total Quantity: " + totalQuantity2)
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

    // assert compare balance quantity for item 55
    assert.equal(balanceQuantity1, balanceQuantity3, `TEST 314 FAILED: Balance quantity should not reduce by ${c.loanQuantity} and loan out quantity should not increase after loaning out loans`)

    // assert compare balance quantity for item 
    assert.equal(balanceQuantity2, balanceQuantity4, `TEST 314 FAILED: Balance quantity should not reduce by ${c.loanQuantity2} and loan out quantity should not increase after loaning out loans`)

    console.log("\nTEST 314 SUCCESS: Both item's quanitites did not decrease or increase after loan approval")
    console.log("\n= = = = = = = = = = = = = = = = = = = = = ")

}

module.exports={ testAMadd2itemsNoLoi }
