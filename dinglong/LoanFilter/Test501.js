const login = require("../../Login")
const assert = require("assert")    
const c=require("../../Const/Const")
const loanfilter=require("../../saf/Loan-Filter")
const loan=require("../../saf/Loan")

//Test filter loan by status pending , approved , rejected , loaned out , returned , lost , damaged

async function testloanstatus(){
    
    var message

    idtoken=login.getToken(c.useraccount)

    //__________________________________________________________________________//

    // Filter loan by their pending status

    var filteredloan=await loanfilter.getLoanByStatus(idtoken,"pending")

    var allloans=await loan.getAllLoan(idtoken)

    var filteredallloans=allloans.filter(loan=> loan["status"]=="pending")

    assert.equal(filteredloan.length,filteredallloans.length,`Filtered loans count should be the same as all loans filtered by their pending status`)
    
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`There are ${filteredloan.length} Loans all together after filtering`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    for(var i =0 ;i<filteredloan.length;i++){
        assert.equal(filteredloan[i]["id"],filteredallloans[i]["id"],`Filtered loans should contain the same loan as all loans being filtered by pending status`)
        assert.equal(filteredloan[i]["status"],"pending",`Filtered loans should contain status with pending`)
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        console.log(`Loan ID : ${filteredloan[i]["id"]}`)
        console.log(`STATUS: ${filteredloan[i]["status"]}`)           
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        message="Retrieve Pending Loans Successful"
        }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(message)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Filter loan by their approved status

    var filteredloan3=await loanfilter.getLoanByStatus(idtoken,"approved")

    var filteredallloans=allloans.filter(loan=> loan["status"]=="approved")

    assert.equal(filteredloan3.length,filteredallloans.length,`Filtered loans count should be the same as all loans filtered by their approved status`)
    
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`There are ${filteredloan3.length} Loans all together after filtering`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    for(var i =0 ;i<filteredloan3.length;i++){
        assert.equal(filteredloan3[i]["id"],filteredallloans[i]["id"],`Filtered loans should contain the same loan as all loans being filtered by approved status`)
        assert.equal(filteredloan3[i]["status"],"approved",`Filtered loans should contain status with approved`)
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        console.log(`Loan ID : ${filteredloan3[i]["id"]}`)
        console.log(`STATUS: ${filteredloan3[i]["status"]}`)           
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        message="Retrieve Approved Loans Successful"
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(message)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//
    
    // Filter loan by their rejected status

    var filteredloan5=await loanfilter.getLoanByStatus(idtoken,"rejected")
    
    var filteredallloans=allloans.filter(loan=> loan["status"]=="rejected")

    assert.equal(filteredloan5.length,filteredallloans.length,`Filtered loans count should be the same as all loans filtered by their pending status`)
    
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`There are ${filteredloan5.length} Loans all together after filtering`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    
    for(var i =0 ;i<filteredloan5.length;i++){
        assert.equal(filteredloan5[i]["id"],filteredallloans[i]["id"],`Filtered loans should contain the same loan as all loans being filtered by rejected status`)
        assert.equal(filteredloan5[i]["status"],"rejected",`Filtered loans should contain status with rejected`)
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        console.log(`Loan ID : ${filteredloan5[i]["id"]}`)
        console.log(`STATUS: ${filteredloan5[i]["status"]}`)           
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        message="Retrieve Rejected Loans Successful"
        }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(message)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//
    
    // Filter loan by their loaned out status

    var filteredloan7=await loanfilter.getLoanByStatus(idtoken,"loaned out")

    var filteredallloans=allloans.filter(loan=> loan["status"]=="loaned out")

    assert.equal(filteredloan7.length,filteredallloans.length,`Filtered loans count should be the same as all loans filtered by their loaned out status`)

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`There are ${filteredloan7.length} Loans all together after filtering`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    for(var i =0 ;i<filteredloan7.length;i++){
        assert.equal(filteredloan7[i]["id"],filteredallloans[i]["id"],`Filtered loans should contain the same loan as all loans being filtered by loaned out status`)
        assert.equal(filteredloan7[i]["status"],"loaned out",`Filtered loans should contain status with loaned out`)
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        console.log(`Loan ID : ${filteredloan7[i]["id"]}`)
        console.log(`STATUS: ${filteredloan7[i]["status"]}`)           
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        message="Retrieve Loaned Out Loans Successful"
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(message)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Filter loan by their returned status

    var filteredloan9=await loanfilter.getLoanByStatus(idtoken,"returned")

    var filteredallloans=allloans.filter(loan=> loan["status"]=="returned")

    assert.equal(filteredloan9.length,filteredallloans.length,`Filtered loans count should be the same as all loans filtered by their returned status`)

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`There are ${filteredloan9.length} Loans all together after filtering`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    for(var i =0 ;i<filteredloan9.length;i++){
        assert.equal(filteredloan9[i]["id"],filteredallloans[i]["id"],`Filtered loans should contain the same loan as all loans being filtered by returned status`)
        assert.equal(filteredloan9[i]["status"],"returned",`Filtered loans should contain status with returned`)
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        console.log(`Loan ID : ${filteredloan9[i]["id"]}`)
        console.log(`STATUS: ${filteredloan9[i]["status"]}`)           
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        message="Retrieve Returned Loans Successful"
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(message)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    //Filter loan by their lost status

    var filteredloan11=await loanfilter.getLoanByStatus(idtoken,"lost")

    var filteredallloans=allloans.filter(loan=> loan["status"]=="lost")

    assert.equal(filteredloan11.length,filteredallloans.length,`Filtered loans count should be the same as all loans filtered by their lost status`)

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`There are ${filteredloan11.length} Loans all together after filtering`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    for(var i =0 ;i<filteredloan11.length;i++){
        assert.equal(filteredloan11[i]["id"],filteredallloans[i]["id"],`Filtered loans should contain the same loan as all loans being filtered by lost status`)
        assert.equal(filteredloan11[i]["status"],"lost",`Filtered loans should contain status with lost`)
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        console.log(`Loan ID : ${filteredloan11[i]["id"]}`)
        console.log(`STATUS: ${filteredloan11[i]["status"]}`)           
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        message="Retrieve Lost Loans Successful"
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(message)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Filter loan by their damaged status

    var filteredloan13=await loanfilter.getLoanByStatus(idtoken,"damaged")

    var filteredallloans=allloans.filter(loan=> loan["status"]=="damaged")

    assert.equal(filteredloan13.length,filteredallloans.length,`Filtered loans count should be the same as all loans filtered by their damaged status`)

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`There are ${filteredloan13.length} Loans all together after filtering`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    for(var i =0 ;i<filteredloan13.length;i++){
        assert.equal(filteredloan13[i]["id"],filteredallloans[i]["id"],`Filtered loans should contain the same loan as all loans being filtered by damaged status`)
        assert.equal(filteredloan13[i]["status"],"lost",`Filtered loans should contain status with damaged`)
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        console.log(`Loan ID : ${filteredloan13[i]["id"]}`)
        console.log(`STATUS: ${filteredloan113[i]["status"]}`)           
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
        message="Retrieve Damaged Loans Successful"
    }
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(message)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    console.log("TEST 501 PASSED!")
}
module.exports={testloanstatus}