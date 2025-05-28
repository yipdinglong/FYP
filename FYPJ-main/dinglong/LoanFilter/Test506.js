const login = require("../../Login")
const assert = require("assert")    
const c=require("../../Const/Const")
const loanfilter=require("../../saf/Loan-Filter")
const loan=require("../../saf/Loan")

//Test filter loan by level and its id , requestor and status all in one

async function testloanbylevelrequestorstatus(){
    
    var message

    idtoken=login.getToken(c.useraccount)

    //__________________________________________________________________________//

    // Filter loan by store level and its id , requestor , status 

    var filteredloan=await loanfilter.getLoanByLoanlevelrequestorstatus(idtoken,c.storelevel,c.storeid,c.useraccount,"approved")   

    var allloans=await loan.getAllLoan(idtoken)

    var filteredallloans=allloans.filter(loan=> loan["store_id"]==c.storeid &&loan["requestor"]==c.useraccount&& loan["status"]=="approved")

    assert.equal(filteredloan.length,filteredallloans.length,"Filtered loans count should be the same as all loans filtered by level , requestor and status")

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`There are ${filteredloan.length} Loans all together after filtering`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    for(var i =0 ;i<filteredloan.length;i++){
        assert.equal(filteredloan[i]["id"],filteredallloans[i]["id"],"Filtered loans should contain the same loan as all loans being filtered by level , requestor and status ")
        assert.equal(filteredloan[i]["store_id"],c.storeid,`Filtered loans should contain ${c.storelevel} id ${c.storeid}`)
        assert.equal(filteredloan[i]["requestor"],c.useraccount,`Filtered loans should contain requestor with the name ${c.useraccount}`)
        assert.equal(filteredloan[i]["status"],"approved",`Filtered loans should contain requestor with the name ${c.useraccount}`)

        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        console.log(`Loan ID : ${filteredloan[i]["id"]}`)
        console.log(`${c.storelevel} ID : ${filteredloan[i]["store_id"]}`)
        console.log(`Requestor : ${filteredloan[i]["requestor"]}`)
        console.log(`Loan Status : ${filteredloan[i]["status"]}`)
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        message=`Retrieve Loans With storeid ${c.storeid} requestor ${c.useraccount} status approved Successful`
        }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(message)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ") 

    //__________________________________________________________________________//

    console.log("TEST 506 PASSED!")

}
module.exports={testloanbylevelrequestorstatus}