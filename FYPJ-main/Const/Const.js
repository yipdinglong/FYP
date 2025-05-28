let jsonData = require('./hierarchy.json');
let item=require("./item.json")
//_________________________________________________//

//Ding Long

//Accounts
const useraccount=jsonData["company2"]["users"]["user2"]["username"]
const adminaccount=jsonData["company2"]["users"]["admin"]["username"] 
const adminaccountco1=jsonData["company1"]["users"]["admin"]["username"] 
const adminaccountco2=jsonData["company2"]["users"]["admin"]["username"] 
const manageraccount=jsonData["company2"]["users"]["manager1"]["username"] 
const manageraccountco1=jsonData["company1"]["users"]["manager1"]["username"] 
const manageraccountu1=jsonData["unit1"]["users"]["manager"]["username"] 
const useraccountwithnoaccess=jsonData["company2"]["users"]["user1"]["username"]  //Account with no store access

//Category
const newcategoryname="Bathroom57" // need to change constantly if want to add category

//Item
const newnsnnumber="000000104" // need to change constantly if want to add item
const newitemdesc="Utensils" 
const newitemunit="U1"
const newitemremarks="fyp2_testitem"

//Store
const newstorename="fyp2_s31" // need to change constantly if want to add store
const newid=`${jsonData["company2"]["id"]}`  //Create store under this id could be company/unit/base/camp

const notinstoreitemid=`${item["item201"]["nsn_number"]}`
const itemid=`${item["item103"]["nsn_number"]}`
const checkitemid=itemid.padStart(10, '0')

const storeid=jsonData["company2"]["stores"]["store1"]["id"]
const addingstockQuantity=100
const removestockQuantity=100
const reason="Lost"
const rejectreason="Cannot remove stock as this is a repeated request"

//Shared between loan filter and item
const unitid=`${jsonData["unit1"]["id"]}`

//Loan-Filter 
const storelevel="store"
const companylevel="company"
const company2id=`${jsonData["company2"]["id"]}`

loanfiltersd="2022-03-25"
loanfilterdd="2022-03-27"

//Report Item 
var reportstartdate=new Date()
const reportStartDate = reportstartdate.getFullYear()+"-"+("0" + (reportstartdate.getMonth() + 1)).slice(-2)+"-"+("0" + reportstartdate.getDate()).slice(-2)
const reportitemid=`${item["item101"]["nsn_number"]}`
// const reportitemid="000000050"
const reportquantity=5
const reporttype1="lost"
const reporttype2="damaged"
const reportstatementname="Testing1234"
const reportstatementalias="yip"
const reportstatementnric="T1234c"
const reportstatementage=20
const reportstatementsex="M"
const rerportstatementservicerank="REC"
const reportstatementvocation="Infantry"
const reportstatementservicetype="NSF"
const reportstatementdoe=reportStartDate
const reportstatementord=reportStartDate
const reportstatement="Test Test"

//_________________________________________________//


// Gerald

// Accounts

// const user = "fyp2_u2_co2"
// const manager = "fyp2_m2_co2"

const user = jsonData["company2"]["users"]["user2"]["username"]
const manager = jsonData["company2"]["users"]["manager2"]["username"]

// Store & Item
// const loanStoreId = 561
const loanStoreId = jsonData["company2"]["stores"]["store2"]["id"]
// const loanItemId = "000000055"
const loanItemId = `${item["item201"]["nsn_number"]}`
// const loanItemId2 = "000000056"
const loanItemId2 = `${item["item202"]["nsn_number"]}`
// const bonusIssueItemId = "000000054"
const bonusIssueItemId = `${item["item203"]["nsn_number"]}`
// const bonusIssueItemId2 = "000000070"
const bonusIssueItemId2 = `${item["item204"]["nsn_number"]}`

const loanQuantity = 20
const loanQuantity2 = 20
const bonusIssueQuantity = 20
const bonusIssueQuantity2 = 20

// Loan & Bonus Issue
var loanstartdate = new Date()
const loanStartDate = loanstartdate.getFullYear()+"-"+(loanstartdate.getMonth()+1)+"-"+loanstartdate.getDate()
loanstartdate.setDate(loanstartdate.getDate()+5)
const loanEndDate = loanstartdate.getFullYear()+"-"+(loanstartdate.getMonth()+1)+"-"+loanstartdate.getDate()
const loanActivityTypeUser = "Training"
const loanActivityTypeAM = "Admin"
const loanActivity = "fyp2 Testing"
// const loanRequestorUser = "fyp2_u2_co2"
const loanRequestorUser = jsonData["company2"]["users"]["user2"]["username"]
// const manager = "fyp2_m2_co2"
const loanRequestorAM = jsonData["company2"]["users"]["manager2"]["username"]
const rejectLoanReason = "Loan was rejected due to FYP2"
const rejectIssueReason = "Bonus Issue was rejected due to FYP2"
var loanoutdate = new Date()
const loanOutDate = loanoutdate.getFullYear()+"-"+(loanoutdate.getMonth()+1)+"-"+loanoutdate.getDate()
loanoutdate.setDate(loanoutdate.getDate()+5)
var loanreturndate = new Date()
const loanReturnDate = loanreturndate.getFullYear()+"-"+(loanreturndate.getMonth()+1)+"-"+loanreturndate.getDate()
loanreturndate.setDate(loanreturndate.getDate()+5)



module.exports={newcategoryname,newnsnnumber,newitemdesc,newitemunit,newitemremarks,newstorename,newid,useraccount,adminaccount,adminaccountco1,adminaccountco2,manageraccount,manageraccountco1,
                manageraccountu1,useraccountwithnoaccess,storelevel,companylevel,notinstoreitemid,itemid,checkitemid,
                storeid, addingstockQuantity,removestockQuantity,reportStartDate,reportitemid,reportquantity,reporttype1,reporttype2,reportstatementname,reportstatementalias,reportstatementnric,reportstatementage,
                reportstatementsex,rerportstatementservicerank,reportstatementvocation,reportstatementservicetype,reportstatementdoe,reportstatementord,reportstatement,
                reason,rejectreason ,loanItemId,loanQuantity, loanQuantity2,rejectLoanReason, rejectIssueReason, loanItemId2,loanStoreId, loanStartDate, loanEndDate, loanActivityTypeUser,
                loanActivityTypeAM, loanActivity, loanRequestorUser, loanRequestorAM, loanOutDate, loanReturnDate, user, manager, bonusIssueQuantity2,
                company2id,unitid,loanfiltersd,loanfilterdd, bonusIssueItemId, bonusIssueItemId2, bonusIssueQuantity}