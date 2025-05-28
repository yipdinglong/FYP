const store=require("../../saf/Store")
const login = require("../../Login")
const assert = require("assert") 
const inbox=require("../../saf/Inbox")
const c=require("../../Const/Const")

//Approving Remove Stock Complex Process

async function testcomplex(){

    console.log('\n')

    //Variables
    var CurrentQuantity1=0
    var CurrentQuantity2=0
    var NewQuantity=0
    var message1
    var message2

    idtoken= login.getToken(c.useraccount)

    //__________________________________________________________________________//

    // Get current quantity of an item in store 

    var currentstoreitem =await store.GetStoreItemByID(idtoken,c.storeid)

    // console.log("Get current store item quantity of "+c.itemid)

    for(var i=0;i<currentstoreitem.length;i++){
       if(currentstoreitem[i]["item_nsn_number"]==c.itemid){
           CurrentQuantity1=currentstoreitem[i]["total_quantity"]
       }//Quantity BeFore Approving
    }
    assert.notEqual(CurrentQuantity2,undefined,"No Such Item Exist In Stores")
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Current total stock quantity for item "+c.itemid + " in store " + c.storeid)
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
    console.log("Current total stock Quantity for item after user tries to remove stock "+c.itemid + " in store "+c.storeid)
    console.log(CurrentQuantity2) // Display Queries
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    assert.equal(CurrentQuantity2,CurrentQuantity1,"TEST 208 Failed : Item Quantity should not change because user needs permission before removing stock and quantity to change")


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
    console.log("Current Status of remove stock approval request : "+message1["status"]) 
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Approve remove stock message

    await store.ApproveRemoveStock(idtoken,c.storeid,message1["id"])

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Manger approves the removal of stock with the inbox id "+message1["id"])
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Check Inbox for the same remove stock message and display stauts of message

    var allinbox= await inbox.GetYourInboxes(idtoken) 
    
    for(var i =0 ;i<allinbox.length;i++){
        if(allinbox[i]["id"]==message1["id"] && allinbox[i]["status"]=="approved"){
                message2=allinbox[i]
        }  
    }
    assert.notEqual(message2,undefined,"No Message Found")

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Get remove stock message from the inbox with the id "+message2["id"])
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(message2) // Display Queries
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Inbox ID : "+message2["id"]) 
    console.log("New Status of remove stock approval request : "+message2["status"])
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Get and compare new quantity for changes in quantity

    var currentstoreitem =await store.GetStoreItemByID(idtoken,c.storeid)

    for(var i=0;i<currentstoreitem.length;i++){
       if(currentstoreitem[i]["item_nsn_number"]==c.itemid){
           NewQuantity=currentstoreitem[i]["total_quantity"]
       }
    }
    assert.notEqual(NewQuantity,undefined,"No Such Item Exist In Stores")

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("New total stock quantity for item "+c.itemid + " in store "+c.storeid)
    console.log(NewQuantity) // Display Queries
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    assert.equal(NewQuantity,CurrentQuantity1-c.removestockQuantity,`TEST 208 FAILED : Stock should reduce by ${c.removestockQuantity} after approving remove stock`)

    //__________________________________________________________________________//

    console.log("TEST 208 PASSED!")
}

module.exports={testcomplex}