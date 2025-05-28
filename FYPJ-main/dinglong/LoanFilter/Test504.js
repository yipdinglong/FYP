const login = require("../../Login")
const assert = require("assert")    
const c=require("../../Const/Const")
const loanfilter=require("../../saf/Loan-Filter")
const loan=require("../../saf/Loan")

async function testloanbyloanstartdate(){
    
    var message

    idtoken=login.getToken(c.useraccount)

    //__________________________________________________________________________//

    // Filter loan by start date

    var filteredloan=await loanfilter.getLoanByLoanStartDate(idtoken,c.loanfiltersd)

    var allloans=await loan.getAllLoan(idtoken)

    var filteredallloans=allloans.filter(loan=> loan["loan_start_date"]==c.loanfiltersd)

    assert.equal(filteredloan.length,filteredallloans.length,"Filtered loans count should be the same as all loans filtered by start date")

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`There are ${filteredloan.length} Loans all together after filtering`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    for(var i =0 ;i<filteredloan.length;i++){
            assert.equal(filteredloan[i]["id"],filteredallloans[i]["id"],"Filtered loans should contain the same loan as all loans being filtered by start date ")
            assert.equal(filteredloan[i]["loan_start_date"],c.loanfiltersd,`Filtered loans should contain start date with ${c.loanfiltersd}`)
            console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
            console.log(`Loan ID : ${filteredloan[i]["id"]}`)
            console.log(`Loan Start Date : ${filteredloan[i]["loan_start_date"]}`)
            console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
            message=`Retrieve Loans With Starting Date ${c.loanfiltersd} Successful`
        }
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        console.log(message)
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ") 

    //__________________________________________________________________________//

        console.log("TEST 504 PASSED!")

    }

module.exports={testloanbyloanstartdate}