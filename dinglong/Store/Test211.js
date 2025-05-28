const store=require("../../saf/Store")
const login = require("../../Login")
const assert = require("assert")    
const c=require("../../Const/Const")

//Test manager add/remove stock

async function testadminmangeraddremovestock(){
    
    console.log('\n')

    //Variables
    var CurrentItem
    var CurrentItem2
    var CurrentQuantity1=0
    var CurrentQuantity2=0
    var CurrentQuantity3=0
 
    idtoken= login.getToken(c.manageraccount)

    //__________________________________________________________________________//

    // Get current quantity of an item in store
    
    var currentstoreitem =await store.GetStoreItemByID(idtoken,c.storeid)

    for(var i=0;i<currentstoreitem.length;i++){
       if(currentstoreitem[i]["item_nsn_number"]==c.itemid){
           CurrentQuantity1=currentstoreitem[i]["total_quantity"]
           CurrentItem=currentstoreitem[i]
       }
    }
    console.log("")
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("**Adding Stock Using Manger Account**")
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Before Adding Stock : ")
    console.log("")
    console.log(CurrentItem)
    console.log("")
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Current total stock quantity for item "+c.itemid+" in store "+c.storeid)
    console.log(CurrentQuantity1) // Display Queries
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Add stock and compare new quantity for changes in quantity

    var addedstock=await store.AddStock(idtoken,c.storeid,c.itemid,c.addingstockQuantity)

    console.log(`${c.manageraccount} Add ${c.addingstockQuantity} Stock to store ${c.storeid} for item ${c.itemid}`)

    for(var i=0;i<addedstock["items"].length;i++){
        if(addedstock["items"][i]["item_nsn_number"]==c.itemid){
            CurrentQuantity2=addedstock["items"][i]["total_quantity"]
            CurrentItem=addedstock["items"][i]
        }
     }

    assert.equal(CurrentQuantity2,CurrentQuantity1+c.addingstockQuantity,"TEST 211 FAILED : Item Quantity should increase if manager/admin add stocks")
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("After Adding Stock : ")
    console.log("")
    console.log(CurrentItem)
    console.log("")
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ") 
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("New total stock quantity for item "+c.itemid+" in store "+c.storeid)
    console.log(CurrentQuantity2) // Display Queries
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    console.log('\n')

    //__________________________________________________________________________//
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("**Remove Stock Using Manager Account**")
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    //__________________________________________________________________________//

    // Get current quantity of an item in store

    var currentstoreitem =await store.GetStoreItemByID(idtoken,c.storeid)

    for(var i=0;i<currentstoreitem.length;i++){
        if(currentstoreitem[i]["item_nsn_number"]==c.itemid){
            CurrentQuantity2=currentstoreitem[i]["total_quantity"]
            CurrentItem2=currentstoreitem[i]
        }
     }
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
     console.log("Before Removing Stock : ")
     console.log("")
     console.log(CurrentItem2)
     console.log("")
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
     console.log("Current total stock quantity for item "+c.itemid+" in store "+c.storeid)
     console.log(CurrentQuantity2) // Display Queries
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
     //__________________________________________________________________________//

    // Remove stock and compare new quantity for changes in quantity

     var removedstock=await store.RemoveStock(idtoken,c.storeid,c.itemid,c.removestockQuantity,c.reason)

     console.log(`${c.manageraccount} Remove ${c.removestockQuantity} Stock from store ${c.storeid} for item ${c.itemid}`)

     for(var i=0;i<removedstock["items"].length;i++){
        if(removedstock["items"][i]["item_nsn_number"]==c.itemid){
            CurrentQuantity3=removedstock["items"][i]["total_quantity"]
            CurrentItem2=removedstock["items"][i]
        }
    }

     assert.equal(CurrentQuantity3,CurrentQuantity2-c.removestockQuantity,"TEST 211 FAILED : Item Quantity should decrease if manager/admin removes stocks")
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
     console.log("After Removing Stock : ")
     console.log("")
     console.log(CurrentItem2)
     console.log("")
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
     console.log("New total stock quantity for item "+c.itemid+" in store "+c.storeid)
     console.log(CurrentQuantity3) // Display Queries
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    
     //__________________________________________________________________________//

     console.log("TEST 211 PASSED!")

    }

module.exports={testadminmangeraddremovestock}