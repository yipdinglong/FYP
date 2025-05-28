const store=require("../../saf/Store")
const login = require("../../Login")
const assert = require("assert")    
const c=require("../../Const/Const")

//Add Stock

async function addstock(){

    console.log('\n')

    //Variables
    var CurrentQuantity1=0
    var CurrentQuantity2=0

    idtoken= login.getToken(c.adminaccount)

    //__________________________________________________________________________//

    // Get current quantity of an item in store

    var currentstoreitem =await store.GetStoreItemByID(idtoken,c.storeid)

    // console.log("Get current store item quantity of "+c.itemid)

    for(var i=0;i<currentstoreitem.length;i++){
       if(currentstoreitem[i]["item_nsn_number"]==c.itemid){
           CurrentQuantity1=currentstoreitem[i]["total_quantity"]
       }//Quantity before adding stock with user
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Current total stock quantity for item "+c.itemid+" in store "+c.storeid)
    console.log(CurrentQuantity1) // Display Queries
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Add stock and compare new quantity for changes
    
    var addedstock=await store.AddStock(idtoken,c.storeid,c.itemid,c.addingstockQuantity)

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`${c.useraccount} Add ${c.addingstockQuantity} Stock to store ${c.storeid} for item ${c.itemid}`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    
    for(var i=0;i<addedstock["items"].length;i++){
        if(addedstock["items"][i]["item_nsn_number"]==c.itemid){
            CurrentQuantity2=addedstock["items"][i]["total_quantity"]
        }
    }

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("New total stock quantity for item "+c.itemid+ " in store "+c.storeid)
    console.log(CurrentQuantity2) // Display Queries
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    assert.equal(CurrentQuantity2,CurrentQuantity1+c.addingstockQuantity,"Add Stock Failed: Item Quantity should increase when user add stocks to store")
    
    //__________________________________________________________________________//
    
}

module.exports={addstock}