const login = require("../../Login")
const assert = require("assert")    
const c=require("../../Const/Const")
const loanfilter=require("../../saf/Loan-Filter")
const loan=require("../../saf/Loan")

//Test filter loan by due date

async function testloanbyloanduedate(){
    var message
    
    idtoken=login.getToken(c.useraccount)

    //__________________________________________________________________________//

    // Filter loan by due date

    var filteredloan=await loanfilter.getLoanByLoanDueDate(idtoken,c.loanfilterdd)
    
    var allloans=await loan.getAllLoan(idtoken)

    var filteredallloans=allloans.filter(loan=> loan["loan_due_date"]==c.loanfilterdd)

    assert.equal(filteredloan.length,filteredallloans.length,"Filtered loans count should be the same as all loans filtered by due date")

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`There are ${filteredloan.length} Loans all together after filtering`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    for(var i =0 ;i<filteredloan.length;i++){
        assert.equal(filteredloan[i]["id"],filteredallloans[i]["id"],"Filtered loans should contain the same loan as all loans being filtered by due date ")
        assert.equal(filteredloan[i]["loan_due_date"],c.loanfilterdd,`Filtered loans should contain start date with ${c.loanfilterdd}`)
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        console.log(`Loan ID : ${filteredloan[i]["id"]}`)
        console.log(`Loan Due Date : ${filteredloan[i]["loan_due_date"]}`)
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        message=`Retrieve Loans With Due Date ${c.loanfilterdd} Successful`
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(message)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ") 

    //__________________________________________________________________________//

    console.log("TEST 505 PASSED!")

}
module.exports={testloanbyloanduedate}