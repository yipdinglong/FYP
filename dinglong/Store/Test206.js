const store=require("../../saf/Store")
const login = require("../../Login")
const assert = require("assert")    
const c=require("../../Const/Const")

//TEST ERROR MESSAGES

async function testingstockinvalidnumber(){
    
    idtoken=login.getToken(c.adminaccountco2) // Log in as admin under company 2
    
    //__________________________________________________________________________//

    // Add stock with an invalid nsn number
    
    var adderror=await store.AddStock(idtoken,c.storeid,"194123",c.addingstockQuantity) // Give Invalid Nsn Number to get error messages

    //__________________________________________________________________________//

    // Remove Stock with an invalid nsn number

    var removerror=await store.RemoveStock(idtoken,c.storeid,"194123",c.removestockQuantity,c.reason) // Give Invalid Nsn number to get error messages
    
    //__________________________________________________________________________//

    // Compare if errors are the same for the same type

    assert.equal(adderror.errorMessage,removerror.errorMessage,"TEST 206 Failed : Error Message should be the same as they are of same type")
    //Check whether error messages are similar if not will give an error
    
    //__________________________________________________________________________//

    console.log("TEST 206 PASSED!")

}
module.exports={testingstockinvalidnumber}