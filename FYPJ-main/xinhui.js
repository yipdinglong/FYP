const test101 = require("./xinhui/test101")
const test102 = require("./xinhui/test102")
const test103 = require("./xinhui/test103")
const test111 = require("./xinhui/test111")
const counter = require("./xinhui/counter.json")
const fs = require("fs");

const main = async () => {
    counter = 0

    let json = JSON.stringify({
        "fypj2xhdlg": 39,
        "202879bnyp": 21, 
        "2ndBatch": 101
    })
    
    fs.writeFileSync("./xinhui/counter.json", json);
}
// main()

async function updateCounter(x){
    let fyp = counter["fypj2xhdlg"]
    let alt = counter["202879bnyp"]

    let json = JSON.stringify({
        "fypj2xhdlg": fyp,
        "202879bnyp": alt,
        "2ndBatch": x
    })

    fs.writeFileSync("./xinhui/counter.json", json);
}

async function testScripts(){
    let x = counter["2ndBatch"]
    x ++
    await updateCounter(x)
    await test101.test(`fyp2_test${x}`, `fypj2xhdlg+${x}@gmail.com`) // Manager create an account, Admin approve account creation
    x ++
    await updateCounter(x)
    await test102.test(`fyp2_test${x}`, `fypj2xhdlg+${x}@gmail.com`) // Manager create an account, Admin reject account creation: FAIL
    x ++
    updateCounter(x)
    await test103.test(`fyp2_test${x}`, `fypj2xhdlg+${x}@gmail.com`) // Admin create an account
    x ++
    await updateCounter(x)
    await test111.test() // Create users using admin account above created user level: FAIL
}

testScripts()