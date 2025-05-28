const login = require("../../Login")
const assert = require("assert")    
const c=require("../../Const/Const")
const loan=require("../../saf/Loan")
const report=require("../../saf/Report")
const store=require("../../saf/Store")

//Test report item with loan id store id = null

async function testreportwithloanid(){

    var CurrentItem
    var CurrentItem2

    var idToken = login.getToken(c.manageraccount)

    //__________________________________________________________________________//

    // Add New Loan

     var addedloan=await loan.addNewLoan(idToken, c.storeid, c.loanStartDate, c.loanEndDate, c.loanActivityTypeUser,
        c.loanActivityTypeAM, c.manageraccount, c.reportitemid, c.reportquantity)
    
    assert.notEqual(addedloan["id"],undefined,"User cannot add loans")

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`${c.manageraccount} added loans to store ${c.storeid} for item ${c.reportitemid} with a quantity of ${c.reportquantity}`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Loan Out Loan and display status of loan
    
    var loanedoutloan=await loan.loiLoan(idToken, addedloan["id"], c.loanOutDate)

    assert.notEqual(loanedoutloan["id"],undefined,"User cannot loan out loans")

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`${c.manageraccount} loaned out loan with the id of ${loanedoutloan["id"]} `)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`Current status of ${loanedoutloan["id"]} loan`)
    console.log(loanedoutloan["status"])
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Get quantity of an item in the store after loaning out item

    var currentstoreitem =await store.GetStoreItemByID(idToken,c.storeid)

    for(var i=0;i<currentstoreitem.length;i++){
        if(currentstoreitem[i]["item_nsn_number"]==c.reportitemid){
            CurrentItem=currentstoreitem[i]
        }
     }
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
     console.log(`Current balance quantity of item ${c.reportitemid} in store ${c.storeid}`)
     console.log(CurrentItem["balance_quantity"])
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Report item with loan id (damaged)

    var reporteditem=await report.AddReport(idToken,c.reporttype2,c.reportStartDate,loanedoutloan["id"],"",c.reportitemid,c.reportquantity,c.reportstatementname,c.reportstatementalias,c.reportstatementnric,c.reportstatementage,c.reportstatementsex,c.unitid,c.rerportstatementservicerank,c.reportstatementvocation,c.reportstatementservicetype,c.reportstatementdoe,c.reportstatementord,c.reportstatement)
    
    assert.notEqual(reporteditem["id"],undefined,"User cannot add loans")

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`${c.manageraccount} Reported ${c.reportquantity} Item ${c.reportitemid} with loan id of ${reporteditem["loan_id"]} was lost/damaged`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Get loan with the same loan id and display status

    var getallreport=await report.GetAllReports(idToken)
    for(var i=0;i<getallreport.length;i++){
        if(getallreport[i]["loan_id"]==reporteditem["loan_id"] && getallreport[i]["type"]==reporteditem["type"]){
            var getsinglereport=getallreport[i]
        }
    }
    assert.notEqual(getsinglereport,undefined,"Item reported was not found in get all reports")

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`New status of ${getsinglereport["loan_id"]} loan`)
    console.log(getsinglereport["type"])
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    assert.equal(getsinglereport["type"],reporteditem["type"],"TEST 603 FAILED : Status of loan should change when a user reports an item with a loan id given")

    //__________________________________________________________________________//

    // Get quantity of an item in the store after reporting item with loan id 

    var currentstoreitem =await store.GetStoreItemByID(idToken,c.storeid)

    for(var i=0;i<currentstoreitem.length;i++){
        if(currentstoreitem[i]["item_nsn_number"]==c.reportitemid){
            CurrentItem2=currentstoreitem[i]
        }
     }
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
     console.log(`New balance quantity of item ${c.reportitemid} in store ${c.storeid}`)
     console.log(CurrentItem2["balance_quantity"])
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    
    //__________________________________________________________________________//

    console.log("TEST 603 PASSED!")
}
module.exports={testreportwithloanid}