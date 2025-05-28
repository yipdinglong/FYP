const login = require("../../Login")
const assert = require("assert")    
const c=require("../../Const/Const")
const loanfilter=require("../../saf/Loan-Filter")
const loan=require("../../saf/Loan")

//Test filter loan by level and its id 

async function testloanbylevel(){
    
    var message

    idtoken=login.getToken(c.useraccount)

    //__________________________________________________________________________//

    // Filter Loan By store level and its id

    var filteredloan=await loanfilter.getLoanByLevel(idtoken,c.storelevel,c.storeid)

    var allloans=await loan.getAllLoan(idtoken)

    var filteredallloans=allloans.filter(loan=> loan["store_id"]==c.storeid)

    assert.equal(filteredloan.length,filteredallloans.length,`Filtered loans count should be the same as all loans filtered by their ${c.storelevel} level and ${c.storelevel} id`)

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`There are ${filteredloan.length} Loans all together after filtering`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    
    for(var i =0 ;i<filteredloan.length;i++){

            assert.equal(filteredloan[i]["id"],filteredallloans[i]["id"],`Filtered loans should contain the same loan as all loans being filtered by ${c.storelevel} level and ${c.storelevel} id`)
            assert.equal(filteredloan[i]["store_id"],c.storeid,`Filtered loans should contain ${c.storelevel} id ${c.storeid}`)
            console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
            console.log(`Loan ID : ${filteredloan[i]["id"]}`)
            console.log(`STORE ID : ${filteredloan[i]["store_id"]}`)           
            console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
            message=`Retrieve store Loans with store id ${c.storeid} Successful`

        }
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        console.log(message)
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Filter loan by company level and its id
        
    var filteredloan2=await loanfilter.getLoanByLevel(idtoken,c.companylevel,c.company2id)

    filteredallloans=allloans.filter(loan=>loan["company_id"]==c.company2id)

    assert.equal(filteredloan2.length,filteredallloans.length,`Filtered loans count should be the same as all loans filtered by their ${c.companylevel} level and ${c.companylevel} id`)

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`There are ${filteredloan2.length} Loans all together after filtering`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    for(var i =0 ;i<filteredloan2.length;i++){
            assert.equal(filteredloan2[i]["id"],filteredallloans[i]["id"],`Filtered loans should contain the same loan as all loans being filtered by ${c.companylevel} level and ${c.companylevel} id`)
            assert.equal(filteredloan2[i]["company_id"],c.company2id,`Filtered loans should contain ${c.companylevel} id ${c.company2id}`)
            console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
            console.log(`Loan ID : ${filteredloan2[i]["id"]}`)
            console.log(`Company ID : ${filteredloan2[i]["company_id"]}`)           
            console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
            message=`Retrieve store Loans with store id ${c.company2id} Successful`
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(message)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    console.log("TEST 502 PASSED!")
}

module.exports={testloanbylevel}