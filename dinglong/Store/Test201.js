    
const store=require("../../saf/Store")
const login = require("../../Login")
const assert = require("assert")    
const c=require("../../Const/Const")

//TEST TO CHECK IF THERE IS PERMISSIONS FOR Removing STOCK (USER)

async function testingRemoveStock(){

    idtoken=login.getToken(c.useraccount)
    
    //__________________________________________________________________________//

    // Get current quantity of an item in store

    var currentQuantity= await store.GetStoreItemByID(idtoken,c.storeid) 
    
    for(var i=0;i<currentQuantity.length;i++){
        if(currentQuantity[i]["item_nsn_number"]==c.itemid){
            var CurrentQuantity2=currentQuantity[i]["total_quantity"]
        }
     }

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`Current Quantity for item ${c.itemid} in store ${c.storeid} : ${CurrentQuantity2}`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Remove stock and display quantity of item in the store after removing stock 

     var newQuantity=await store.RemoveStock(idtoken,c.storeid,c.itemid,c.removestockQuantity,c.reason)  

     assert.notEqual(newQuantity["id"],undefined,"User Cannot Remove Stock")

     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
     console.log(`${c.useraccount} removing ${c.removestockQuantity} item ${c.itemid} from store ${c.storeid}`)
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

     for(var i=0;i<newQuantity["items"].length;i++){
        if(newQuantity["items"][i]["item_nsn_number"]==c.itemid){
            var newQuantity2=newQuantity["items"][i]["total_quantity"]
        }
    }

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`New Quantity for item ${c.itemid} in store ${c.storeid} : ${newQuantity2}`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Check for permissions when user remove stock by comparing quantity changes

    assert.equal(newQuantity2,CurrentQuantity2,"TEST 201 FAILED : There is no permissions for user before User can successfuly remove stock")
    // Since user needs approval to remove stock , Quantity should not change. 
    // Therefore, current Quantity and New Quantity should be the same.If it is not the same ,it will cause an error
    
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`${c.useraccount} needs permissions from manger/admin before removing stock can be considered accomplished`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//


    console.log("TEST 201 PASSED!")

}
module.exports={testingRemoveStock}