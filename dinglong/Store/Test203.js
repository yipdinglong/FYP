const store=require("../../saf/Store")
const login = require("../../Login")
const assert = require("assert") 
const inbox=require("../../saf/Inbox")
const c=require("../../Const/Const")

//Approving Remove Stock with another account 

async function testapprovefromanotheraccount(){

    //Variables
    var CurrentQuantity1=0
    var CurrentQuantity2=0
    var message1
    var message2
    var NewQuantity=0
     

    idtoken= login.getToken(c.useraccount)

    //__________________________________________________________________________//

    // Get quantity of an item in store
   
    var currentstoreitem =await store.GetStoreItemByID(idtoken,c.storeid)

    for(var i=0;i<currentstoreitem.length;i++){
       if(currentstoreitem[i]["item_nsn_number"]==c.itemid){
           CurrentQuantity1=currentstoreitem[i]["total_quantity"]
       }//Quantity BeFore approving
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Current total stock quantity for item "+c.itemid+ " in store " + c.storeid)
    console.log(CurrentQuantity1) // Display Queries
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Remove stock and get quantity of item in the store after removing stock 
    
    var currentstock=await store.RemoveStock(idtoken,c.storeid,c.itemid,c.removestockQuantity,c.reason)

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`${c.useraccount} Remove ${c.removestockQuantity} Stock from store ${c.storeid} for item ${c.itemid}`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    
    for(var i=0;i<currentstock["items"].length;i++){
        if(currentstock["items"][i]["item_nsn_number"]==c.itemid){
            CurrentQuantity2=currentstock["items"][i]["total_quantity"]
        }
    }
    
    assert.equal(CurrentQuantity2,CurrentQuantity1,"TEST 203 Failed : Item Quantity should not change because user needs permission before removing stock and quantity to change")
   
    //__________________________________________________________________________//

    idtoken= login.getToken(c.manageraccount)

    //__________________________________________________________________________//

    // Check Inbox of manager account to get remove stock message 

    var allinbox= await inbox.GetYourInboxes(idtoken)
    
    for(var i =0 ;i<allinbox.length;i++){
        if(allinbox[i]["store_id"]==c.storeid && allinbox[i]["type"]=='store_item_reduce' && allinbox[i]["item_nsn_number"]=="0000000046"){
            message1=allinbox[i]
        }//Message after adding stock with users
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Get remove stock message from the inbox with the id "+message1["id"])
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(message1) // Display Queries
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Current Status of remove stock approval request : "+message1["status"]) 
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Log in as another region account and approve remove stock 

    idtoken= login.getToken(c.manageraccountco1)

    await store.ApproveRemoveStock(idtoken,c.storeid,message1["id"])

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Admin from company 1 approves the removal of stock with the inbox id "+message1["id"])
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Check same manager account inbox to get remove stock message 

    idtoken= login.getToken(c.manageraccount)

    var allinbox= await inbox.GetYourInboxes(idtoken)
    
    for(var i =0 ;i<allinbox.length;i++){
        if(allinbox[i]["id"]==message1["id"] && allinbox[i]["status"]=="approved"&&allinbox[i]["type"]=='store_item_reduce'){
                message2=allinbox[i]
        }  //Query for the same message after being rejected and check status
    }
    
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("Get remove stock message from the inbox with the id "+message2["id"])
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(message2) // Display Queries
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("New Status of remove stock approval request : "+message2["status"])
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Get quantity of an item in store and compare if quantity changed

    var currentstoreitem =await store.GetStoreItemByID(idtoken,c.storeid)

    for(var i=0;i<currentstoreitem.length;i++){
       if(currentstoreitem[i]["item_nsn_number"]==c.itemid){
           NewQuantity=currentstoreitem[i]["total_quantity"]
       }
    }
    console.log("= = = = = = = = = = = = = = = = = = = = = ")
    console.log("New total stock quantity after being approved to remove stock for item "+c.itemid)
    console.log(NewQuantity) // Display Queries
    console.log("= = = = = = = = = = = = = = = = = = = = = ")
    
    assert.notEqual(NewQuantity,CurrentQuantity1-c.removestockQuantity,`TEST 203 Failed : Stock should not reduce by ${c.removestockQuantity} after approving remove stock from account that did not receive the approval request`)

    //__________________________________________________________________________//

    console.log("TEST 203 PASSED!")


}

module.exports={testapprovefromanotheraccount}