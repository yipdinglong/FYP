const login = require("../../Login")
const assert = require("assert")    
const c=require("../../Const/Const")
const loan=require("../../saf/Loan")
const report=require("../../saf/Report")
const store=require("../../saf/Store")

//Test report item with store id loan id = null

async function testreportwithstoreid(){
   
    var CurrentItem
    var CurrentItem2

    var idtoken = login.getToken(c.useraccount)

    //__________________________________________________________________________//

    // Get current quantity of an item in the store 

    var currentstoreitem =await store.GetStoreItemByID(idtoken,c.storeid)

    for(var i=0;i<currentstoreitem.length;i++){
        if(currentstoreitem[i]["item_nsn_number"]==c.reportitemid){
            CurrentItem=currentstoreitem[i]
        }
     }
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
     console.log("Before Reporting Item : ")
     console.log("")
     console.log(CurrentItem)
     console.log("")
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
     console.log("Current balance quantity for item "+c.reportitemid + " in store " + c.storeid)
     console.log(CurrentItem["balance_quantity"]) 
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
     console.log("Current total quantity for item "+c.reportitemid + " in store " + c.storeid)
     console.log(CurrentItem["total_quantity"]) 
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Report Item with store id 

    await report.AddReport(idtoken,c.reporttype1,c.reportStartDate,"",c.storeid,c.reportitemid,c.reportquantity,c.reportstatementname,c.reportstatementalias,c.reportstatementnric,c.reportstatementage,c.reportstatementsex,c.unitid,c.rerportstatementservicerank,c.reportstatementvocation,c.reportstatementservicetype,c.reportstatementdoe,c.reportstatementord,c.reportstatement)
    
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`${c.loanRequestorAM} Reported ${c.reportquantity} Item ${c.reportitemid} from store ${c.storeid} was lost/damaged `)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    // Get quantity of an item in the store after reporting item with store id

    var currentstoreitem =await store.GetStoreItemByID(idtoken,c.storeid)

    for(var i=0;i<currentstoreitem.length;i++){
        if(currentstoreitem[i]["item_nsn_number"]==c.reportitemid){
            CurrentItem2=currentstoreitem[i]
        }
     }
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
     console.log("After reporting Item : ")
     console.log("")
     console.log(CurrentItem2)
     console.log("")
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
     console.log("New balance quantity for item "+c.reportitemid + " in store " + c.storeid)
     console.log(CurrentItem2["balance_quantity"]) 
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
     console.log("New total quantity for item "+c.reportitemid + " in store " + c.storeid)
     console.log(CurrentItem2["total_quantity"]) 
     console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

     assert.equal(CurrentItem2["balance_quantity"],CurrentItem["balance_quantity"]-c.reportquantity,"TEST 601 Failed : Balance quantity should decrease when any user reports with a store id given")
     assert.equal(CurrentItem2["total_quantity"],CurrentItem["total_quantity"]-c.reportquantity,"TEST 601 Failed : Total quantity should decrease as balance quantity decreases")

    //__________________________________________________________________________//

     console.log("TEST 601 PASSED!")

}
module.exports={testreportwithstoreid}