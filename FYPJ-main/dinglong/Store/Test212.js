const store=require("../../saf/Store")
const login = require("../../Login")
const assert = require("assert")    
const c=require("../../Const/Const")

//Test Adding stock with new item that does not exist in store user 

async function testaddstockuser(){

    console.log('\n')

    //Variables
    var CurrentQuantity1=0
    var CurrentQuantity2=0

    idtoken= login.getToken(c.useraccount)

    //__________________________________________________________________________//

    // Get current quantity of an item in store

    var currentstoreitem =await store.GetStoreItemByID(idtoken,c.storeid)

    // console.log("Get current store item quantity of "+c.notinstoreitemid)

    for(var i=0;i<currentstoreitem.length;i++){
       if(currentstoreitem[i]["item_nsn_number"]==c.notinstoreitemid){
           CurrentQuantity1=currentstoreitem[i]["total_quantity"]
       }//Quantity before adding stock with user
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Current total stock quantity for item "+c.notinstoreitemid+" in store "+c.storeid)
    console.log(CurrentQuantity1) // Display Queries
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Add stock and compare new quantity for changes
    
    var addedstock=await store.AddStock(idtoken,c.storeid,c.notinstoreitemid,c.addingstockQuantity)

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`${c.useraccount} Add ${c.addingstockQuantity} Stock to store ${c.storeid} for item ${c.notinstoreitemid}`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    
    for(var i=0;i<addedstock["items"].length;i++){
        if(addedstock["items"][i]["item_nsn_number"]==c.notinstoreitemid){
            CurrentQuantity2=addedstock["items"][i]["total_quantity"]
        }
    }

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("New total stock quantity for item "+c.notinstoreitemid+ " in store "+c.storeid)
    console.log(CurrentQuantity2) // Display Queries
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    assert.equal(CurrentQuantity2,CurrentQuantity1+c.addingstockQuantity,"TEST 209 FAILED : Item Quantity should increase when user add stocks to store")
    
    //__________________________________________________________________________//

    console.log("TEST 212 PASSED!")

}

module.exports={testaddstockuser}