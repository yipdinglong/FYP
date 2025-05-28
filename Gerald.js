
// READ MEE >>>>

// These are all the test scenarios scripts for loans and bonus issue
// Note that when you run this file, you might get a run time error (dk why also, probably server error)
// DO NOT RUN * test308 * this test script is not applicable to the process flow and it will cause the total quantity and balance 
// quanttity to be negative 
// Refer to the error documentation to see if the errors that i have listed has been fixed
// Also feel free to change the js file name to ur liking 

// Atb and enjoy ur fypj :))


// LOAN
const test301 = require("./Gerald/Loans/test301");
const test302 = require("./Gerald/Loans/test302");
const test303 = require("./Gerald/Loans/test303");
const test304 = require("./Gerald/Loans/test304");
const test305 = require("./Gerald/Loans/test305");
const test306 = require("./Gerald/Loans/test306");
const test307 = require("./Gerald/Loans/test307");
// const test308 = require("./Gerald/Loans/test308");
const test309 = require("./Gerald/Loans/test309");
const test310 = require("./Gerald/Loans/test310");
const test311 = require("./Gerald/Loans/test311");
const test312 = require("./Gerald/Loans/test312");
const test313 = require("./Gerald/Loans/test313");
const test314 = require("./Gerald/Loans/test314");
const test315 = require("./Gerald/Loans/test315");

// BONUS ISSUE
const test401 = require("./Gerald/BonusIssue/test401")
const test402 = require("./Gerald/BonusIssue/test402")
const test403 = require("./Gerald/BonusIssue/test403")
const test404 = require("./Gerald/BonusIssue/test404")
const test405 = require("./Gerald/BonusIssue/test405")
const test406 = require("./Gerald/BonusIssue/test406")
const test407 = require("./Gerald/BonusIssue/test407")
const test408 = require("./Gerald/BonusIssue/test408")

testScripts()

async function testScripts(){
    // LOANS

    // await test301.testAddLoan() // User Add, loan approved by manager and loi scenario
    // await test302.testReturnLoan() // User Add, loan approved by manager, loi and return loan scenario
    // await test303.testNoLoi() // User Add, approve, no Loi loan scenario
    // await test304.testRejectLoans() // User add, manager reject loans scenario
    // await test305.testAddLoanAM() // Manager add loan and loi of loan scenario
    // await test306.testAMNoLoi() // Manager add loan but no loi of loan scenario
    // await test307.testReturnLoanAM() // Manager add loans and return of loans scenario
    // await test308.testReturnRejectedLoans() // Not applicable in user flow. 
    // await test309.testAddNewLoan2Items() // User add new loan with 2 items, loan approved by manager and proceed to loan out scenario
    // await test310.testReturnLoan2Items() // User add new loan with 2 items, loan approved by manager and proceed to loan out then return the loan scenario
    // await test311.testRejectLoan2Items() // User add loans with 2 items and loan got rejected by manager 
    // await test312.testAddLoan2itemsNoLoi() // User add new loan with 2 items, loan approved by manager but did not loan out items
    // await test313.testAddLoan2ItemsAM() // Manager add new loan with 2 items and loan out items
    // await test314.testAMadd2itemsNoLoi() // Manager add new loan, but did not loan out items
    // await test315.testAMadd2itemReturn() // Manager add new loan with 2 items, loan out items and return the loans

    // BONUS ISSUE

    // await test401.testAddBonusIssue() // User add bonus issue, got approved by the manager and loan it out scenario 
    // await test402.testAddBonusIssueAM() // Manager add bonus Issue and loan out scenario
    // await test403.testNoLoiUser() // User add bonus issue but did not loan it out scenario
    // await test404.testNoLoiAM() // Manager add bonus issue but did not loan it out scenario
    // await test405.testRejectBonusIssue() // User add bonus issue but manager rejects it scenario
    // await test406.testAddBonusIssue2Items() // User add bonus issue with 2 items, issue approved and loan it out scenario
    // await test407.testAddBonusIssue2ItemsAM() // Manager is able to add bonus issue with 2 items and loan it out scenario
    // await test408.testAddBonusIssue2ItemReject() // User is able to add bonus issue with 2 items but issue was rejected by manager scenario
}

