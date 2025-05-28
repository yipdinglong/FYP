const login = require("../../Login")
const assert = require("assert")    
const c=require("../../Const/Const")
const loanfilter=require("../../saf/Loan-Filter")
const loan=require("../../saf/Loan")

//Test filter loan by requestor

async function testloanbyrequestor(){
   
    var message

    idtoken=login.getToken(c.useraccount)

    //__________________________________________________________________________//

    // Filter loan by requestor

    var filteredloan=await loanfilter.getLoanByRequestor(idtoken,c.useraccount)
    
    var allloans=await loan.getAllLoan(idtoken)

    var filteredallloans=allloans.filter(loan=> loan["requestor"]==c.useraccount)

    assert.equal(filteredloan.length,filteredallloans.length,"Filtered loans count should be the same as all loans filtered by requestor")

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`There are ${filteredloan.length} Loans out of ${allloans.length} all together after filtering`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    for(var i=0 ;i<filteredloan.length;i++){

        assert.equal(filteredloan[i]["id"],filteredallloans[i]["id"],"Filtered loans should contain the same loan as all loans being filtered by requestor ")
        assert.equal(filteredloan[i]["requestor"],c.useraccount,`Filtered loans should contain requestor with the name ${c.useraccount}`)
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        console.log(`Loan ID : ${filteredloan[i]["id"]}`)
        console.log(`Requestor : ${filteredloan[i]["requestor"]}`)
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        message=`Retrieve Loans with requestor named ${c.useraccount} Successful`

        }
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        console.log(message)
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//
        
        console.log("TEST 503 PASSED!")

}
module.exports={testloanbyrequestor}