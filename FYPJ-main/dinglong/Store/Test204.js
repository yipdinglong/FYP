const store=require("../../saf/Store")
const login = require("../../Login")
const assert = require("assert") 
const c=require("../../Const/Const")   

 //ADDING STORE WITHOUT THE NAME

async function testingaddingemptynamestore(){

    idtoken=login.getToken(c.adminaccountco2) // Log in as admin under comapny 2 
    
    //__________________________________________________________________________//

    // Add Store with an empty string name

    var newstore=await store.AddStore(idtoken,"") // Add store without giving a name to the store
    
    assert.notEqual(newstore["name"],undefined,"TEST 204 Failed : CANNOT ADD STORE WITHOUT A NAME") 

    //__________________________________________________________________________//


    console.log("TEST 204 PASSED!")

}
module.exports={testingaddingemptynamestore}