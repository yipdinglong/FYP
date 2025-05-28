//Item
const item=require("./dinglong/Item/AddItem")

//Store
const store=require("./dinglong/Store/AddStore")
const stock=require("./dinglong/Store/AddStock")
const test201=require("./dinglong/Store/Test201")
const test202=require("./dinglong/Store/Test202")
const test203=require("./dinglong/Store/Test203")
const test204=require("./dinglong/Store/Test204")
const test205=require("./dinglong/Store/Test205")
const test206=require("./dinglong/Store/Test206")
const test207=require("./dinglong/Store/Test207")
const test208=require("./dinglong/Store/Test208")
const test209=require("./dinglong/Store/Test209")
const test210=require("./dinglong/Store/Test210")
const Test211=require("./dinglong/Store/Test211")
const Test212=require("./dinglong/Store/Test212")

// Loan - Filter
const test501=require("./dinglong/LoanFilter/Test501")
const test502=require("./dinglong/LoanFilter/Test502")
const test503=require("./dinglong/LoanFilter/Test503")
const test504=require("./dinglong/LoanFilter/Test504")
const test505=require("./dinglong/LoanFilter/Test505")
const test506=require("./dinglong/LoanFilter/Test506")

//Report Item in store / loan
const test601=require("./dinglong/Report/Test601")
const test602=require("./dinglong/Report/Test602")
const test603=require("./dinglong/Report/Test603")

// Every Scripts Down Here // 

async function TestScripts(){

    //_________________________________________________//

    //Item

    //Add New Item
    // await item.addnewitem()
   
    //_________________________________________________//

    //Store

    //Add New Store manually
    // await store.addnewstore()

    //Add Stock manually
    // await stock.addstock()

    //Check if User can remove stock immediately
    // await test201.testingRemoveStock()

    //Check Who are the Recievers of message when user remove stock
    // await test202.testingreceiverofstockmessage()

    //Approve from a manger account who did not reveive approval message
    // await test203.testapprovefromanotheraccount()

    //Add Store using empty name
    // await test204.testingaddingemptynamestore()

    //Test Add stock negative nsn number
    // await test205.testingaddstocknegativevalue()

    //Test Add Stock using invalid nsn number
    // await test206.testingstockinvalidnumber()

    //Reject Remove Stock Process
    // await test207.testcomplex()

    //Approve Remove stock Process
    // await test208.testcomplex()
    
    //Adding Stock User with stock already existing in the store
    // await test209.testaddstockuser()
    
    //Add/remove Stock with no store Access
    // await test210.testnostoreaccessaddremovestock()

    //Admin/Manager add/remove stock
    // await Test211.testadminmangeraddremovestock()

    //Adding Stock User with stock does not exist in the store
    // await Test212.testaddstockuser()

    //_________________________________________________//

    //Loan-Filter

    //Filter loan by loan status pending,approved,rejected,loaned out,lost,damaged
    // test501.testloanstatus()

    //Filter loan by level and its id
    // test502.testloanbylevel()

    //Filter loan by requestor name
    // test503.testloanbyrequestor()

    //Filter loan by start date
    // test504.testloanbyloanstartdate()

    //Filter loan by due date
    // test505.testloanbyloanduedate()

    //Filter loan by level and its id , requestor name and status
    // test506.testloanbylevelrequestorstatus()

    //_________________________________________________//

    //Report

    //Report Item with store id
    // test601.testreportwithstoreid()

    //Report Item with loan id (Lost)
    // test602.testreportwithloanid()

    //Report Item with loan id (Damaged)
    // test603.testreportwithloanid()
    
    //_________________________________________________//

}

//Run
// TestScripts()


// Flow Chart Scripts Down Here // 

async function testflowchart(){
    
    await stock.addstock()

    await test207.testcomplex()

    await test208.testcomplex()

    await test209.testaddstockuser()

    await test210.testnostoreaccessaddremovestock()

    await Test211.testadminmangeraddremovestock()
}

//Run
testflowchart()