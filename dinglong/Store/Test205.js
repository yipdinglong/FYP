const store=require("../../saf/Store")
const login = require("../../Login")
const assert = require("assert")    
const c=require("../../Const/Const")

//TEST ERROR MESSAGES

async function testingaddstocknegativevalue(){
    
    idtoken=login.getToken(c.adminaccountco2) // Log in as admin under company 2

    //__________________________________________________________________________//

    // Add Stock with invalid nsn number
    
    var addedstock=await store.AddStock(idtoken,c.storeid,"-46",c.addingstockQuantity) // Give Negative Nsn Number to get error messages
    
    assert.notEqual(addedstock.errorMessage,"ER_DUP_ENTRY: Duplicate entry '560-000000000' for key 'store_item.PRIMARY'","ER_DUP_ENTRY: Duplicate entry '560-000000000' for key 'store_item.PRIMARY' should not be shown to anyone because it contains sensitive information of the database")

    //__________________________________________________________________________//

    console.log("TEST 205 PASSED!")

}
module.exports={testingaddstocknegativevalue}