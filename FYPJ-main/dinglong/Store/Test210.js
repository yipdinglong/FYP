const store=require("../../saf/Store")
const login = require("../../Login")
const assert = require("assert")    
const c=require("../../Const/Const")

//Test User add remove stock no store access

async function testnostoreaccessaddremovestock(){

    console.log('\n')

    idtoken= login.getToken(c.useraccountwithnoaccess) //Account with no Store Access

    //__________________________________________________________________________//

    // Add stock and check for any errors adding stock 

    var stock=await store.AddStock(idtoken,c.storeid,c.itemid,c.addingstockQuantity)


    if(stock.errorMessage!=undefined){
    assert.equal(typeof stock.errorMessage, typeof "", "TEST 210 FAILED : User should receive an error when adding stock without store access")
    assert.equal(stock.errorMessage,"[Unauthorized] User is not authorized to manage this store","TEST 210 FAILED : User should not be able to add stock without store Access")
}

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    console.log('\n')

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//


    // Remove stock and check for any errors removing stock
    
    var stock2=await store.RemoveStock(idtoken,c.storeid,c.itemid,c.removestockQuantity,c.reason)

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    if(stock2.errorMessage!=undefined){
    assert.equal(typeof stock2.errorMessage, typeof "", "TEST 210 FAILED : User should receive an error when adding stock without store access")
    assert.equal(stock2.errorMessage,"[Unauthorized] User is not authorized to manage this store","TEST 210 FAILED : User should not be able to remove stock without store Access")
}

    //__________________________________________________________________________//

    console.log("TEST 210 PASSED!")

}

module.exports={testnostoreaccessaddremovestock}