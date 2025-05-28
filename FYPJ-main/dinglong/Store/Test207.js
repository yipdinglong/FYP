const store=require("../../saf/Store")
const login = require("../../Login")
const assert = require("assert") 
const inbox=require("../../saf/Inbox")
const c=require("../../Const/Const")

//Rejecting Remove Stock Complex Process

async function testcomplex(){

    console.log('\n')

    //Variables
    var CurrentQuantity1=0
    var CurrentQuantity2=0
    var message1
    var message2

    idtoken= login.getToken(c.useraccount)

    //__________________________________________________________________________//

    // Get current quantity of an item in store 

    var currentstoreitem =await store.GetStoreItemByID(idtoken,c.storeid)
    
    if(currentstoreitem["errorMessage"]!=undefined){
        assert.fail(currentstock["errorMessage"])
    }
    for(var i=0;i<currentstoreitem.length;i++){
       if(currentstoreitem[i]["item_nsn_number"]==c.itemid){
           CurrentQuantity1=currentstoreitem[i]["total_quantity"]
       }//Quantity BeFore rejecting
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Current total stock Quantity for item "+c.itemid + " in store "+c.storeid)
    console.log(CurrentQuantity1) // Display Queries
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Remove stock and compare new quantity for changes in quantity

    var currentstock=await store.RemoveStock(idtoken,c.storeid,c.itemid,c.removestockQuantity,c.reason)

    if(currentstock["errorMessage"]!=undefined){
        assert.fail(currentstock["errorMessage"])
    }

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`${c.useraccount} Remove ${c.removestockQuantity} Stock from store ${c.storeid} for item ${c.itemid}`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    for(var i=0;i<currentstock["items"].length;i++){
        if(currentstock["items"][i]["item_nsn_number"]==c.itemid){
            CurrentQuantity2=currentstock["items"][i]["total_quantity"]
        }
    }

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Current total stock Quantity for item after user try to remove stock "+c.itemid + " in store "+c.storeid)
    console.log(CurrentQuantity2) // Display Queries
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    
    assert.equal(CurrentQuantity2,CurrentQuantity1,"TEST 207 FAILED : Item Quantity should not change because user needs permission before removing stock and quantity to change")
    
    //__________________________________________________________________________//

    // Check Inbox for remove stock message and display stauts of message

    idtoken= login.getToken(c.manageraccount)

    var allinbox= await inbox.GetYourInboxes(idtoken)
    
    for(var i =0 ;i<allinbox.length;i++){
        if(allinbox[i]["store_id"]==c.storeid && allinbox[i]["type"]=='store_item_reduce' && allinbox[i]["item_nsn_number"]==c.checkitemid){
            message1=allinbox[i]
        }
    }
    assert.notEqual(message1,undefined,"No Message Found")
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Get remove stock message from the inbox with the id "+message1["id"])
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(message1) // Display Queries
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Inbox ID : "+message1["id"]) 
    console.log("Reason : "+message1["reason"])
    console.log("Current Status of remove stock approval request : "+message1["status"]) 
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Reject remove stock message

    await store.RejectRemoveStock(idtoken,c.storeid,message1["id"],c.rejectreason)

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Manger rejects the removal of stock with the inbox id "+message1["id"])
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Check Inbox for the same remove stock message and display stauts of message

    var allinbox= await inbox.GetYourInboxes(idtoken)
    for(var i =0 ;i<allinbox.length;i++){
        if(allinbox[i]["id"]==message1["id"] && allinbox[i]["status"]=="rejected"){
                message2=allinbox[i]
        }  //Query for the same message after being rejected and check status
    }
    assert.notEqual(message2,undefined,"No Message Found")
    
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Get remove stock message from the inbox with the id "+message2["id"])
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(message2) // Display Queries
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Inbox ID : "+message2["id"]) 
    console.log("Reason : "+message2["reason"])
    console.log("New Status of remove stock approval request : "+message2["status"]) 
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//
    
    // Get and compare new quantity for changes in quantity

    var currentstoreitem =await store.GetStoreItemByID(idtoken,c.storeid)

    for(var i=0;i<currentstoreitem.length;i++){
       if(currentstoreitem[i]["item_nsn_number"]==c.itemid){
           CurrentQuantity2=currentstoreitem[i]["total_quantity"]
       }
    }
    assert.notEqual(CurrentQuantity2,undefined,"No Such Item Exist In Stores")

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Total stock quantity after being rejected to remove stock for item "+c.itemid)
    console.log(CurrentQuantity2) // Display Queries
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    assert.notEqual(CurrentQuantity2,CurrentQuantity1-c.removestockQuantity,`TEST 207 FAILED : Stock should not reduce by ${c.removestockQuantity} after rejecting remove stock`)
    
    //__________________________________________________________________________//

    console.log("TEST 207 PASSED!")

}

module.exports={testcomplex}