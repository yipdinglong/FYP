const login = require("../../Login")
const store=require("../../saf/Store")
const assert = require("assert")
const inbox=require("../../saf/Inbox")  
const test208=require("./Test208")  
const c=require("../../Const/Const")

//Test who receives messages 

async function testingreceiverofstockmessage(){
    
    //__________________________________________________________________________//

    //Approve remove stock process to get approved messages

    await test208.testcomplex()

    //__________________________________________________________________________//

    // Variables
    var message3
    var message4
    var message5
    var message6
    var message7

    //__________________________________________________________________________//
 
    //Manger 1 under Company 2 Inboxes
    idtoken= login.getToken(c.manageraccount)

    //Check Inbox for approved messages 

    var allinbox= await inbox.GetYourInboxes(idtoken)
    
    for(var i =0 ;i<allinbox.length;i++){
        if(allinbox[i]["store_id"]==c.storeid && allinbox[i]["type"]=='store_item_reduce' && allinbox[i]["item_nsn_number"]==c.checkitemid && allinbox[i]["status"]=="approved"){
            message3=allinbox[i]
        }
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`Remove Stock Message from ${c.manageraccount}`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    
    assert.notEqual(message3,undefined,"Manager under companty 2 did not receive the approval request")
    
    if(message3==undefined){
        console.log("Manager under company 2 did not receive the approval request")
    }
    else{
        console.log(message3)
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//
    
    //Manger 1 under Company 1  Inboxes
    idtoken= login.getToken(c.manageraccountco1)

    //Check Inbox for approved messages 

    var allinbox= await inbox.GetYourInboxes(idtoken)
    
    for(var i =0 ;i<allinbox.length;i++){
        if(allinbox[i]["store_id"]==c.storeid && allinbox[i]["type"]=='store_item_reduce' && allinbox[i]["item_nsn_number"]==c.checkitemid && allinbox[i]["status"]=="approved"){
            message4=allinbox[i]
        }
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`Remove Stock Message from ${c.manageraccountco1}`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    
    assert.equal(message4,undefined,"Manager under company 1 did not receive the approval request")
    
    if(message4==undefined){
        console.log("Manager under company 1 did not receive the approval request")
    }
    else{
        console.log(message4)
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    
    //__________________________________________________________________________//
   
    //Admin under Company 2  Inboxes
    idtoken= login.getToken(c.adminaccountco2)

    //Check Inbox for approved messages 

    var allinbox= await inbox.GetYourInboxes(idtoken)
    
    for(var i =0 ;i<allinbox.length;i++){
        if(allinbox[i]["store_id"]==c.storeid && allinbox[i]["type"]=='store_item_reduce' && allinbox[i]["item_nsn_number"]==c.checkitemid && allinbox[i]["status"]=="approved"){
            message5=allinbox[i]
        }
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`Remove Stock Message from ${c.adminaccountco2}`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    
    assert.notEqual(message5,undefined,"Admin under companty 2 did not receive the approval request")
    
    if(message5==undefined){
        console.log("Admin under company 2 did not receive the approval request")
    }
    else{
        console.log(message5)
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    //Admin under Company 1  Inboxes
    idtoken= login.getToken(c.adminaccountco1)

    //Check Inbox for approved messages 

    var allinbox= await inbox.GetYourInboxes(idtoken)
    
    for(var i =0 ;i<allinbox.length;i++){
        if(allinbox[i]["store_id"]==c.storeid && allinbox[i]["type"]=='store_item_reduce' && allinbox[i]["item_nsn_number"]==c.checkitemid && allinbox[i]["status"]=="approved"){
            message6=allinbox[i]
        }
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`Remove Stock Message from ${c.adminaccountco1}`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    
    assert.equal(message6,undefined,"Admin under companty 1 did not receive the approval request")
    
    if(message6==undefined){
        console.log("Admin under companty 1 did not receive the approval request")
    }
    else{
        console.log(message6)
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    //Manager Account under unit 1 and above company 2
    idtoken= login.getToken(c.manageraccountu1)

    //Check Inbox for approved messages 

    var allinbox= await inbox.GetYourInboxes(idtoken)
    
    for(var i =0 ;i<allinbox.length;i++){
        if(allinbox[i]["store_id"]==c.storeid && allinbox[i]["type"]=='store_item_reduce' && allinbox[i]["item_nsn_number"]==c.checkitemid && allinbox[i]["status"]=="approved"){
            message7=allinbox[i]
        }
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`Remove Stock Message from ${c.manageraccountu1}`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    
    assert.equal(message7,undefined," Manger above company 2 did not receive the approval request")

    if(message7==undefined){
        console.log("Manger above company 2 did not receive the approval request")
    }
    else{
        console.log(message7)
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    
    //__________________________________________________________________________//



}

module.exports={testingreceiverofstockmessage}