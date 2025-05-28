# FYPJ 
###### -------------------------------------------------------------------------------------------------------------------------------------------------------

###### // Const File // <br />
Consist of constant variables used for the test scenarios.
- hierarchyInput.json is used in newBranchwInput.js, and hierarchyOutput.json is the output generated from the script
- hierarchy.json is the hierarchy produced from newBranch.js, where the hierarchy is set 

###### // SAF File // <br />
Consist of all functions that uses different api for the project

###### // Logger File // <br />
Consist the creation of two different text file. <br />
Log.txt - Stores All Api usage Information
Error.txt - Stores All errors information when error occurs

###### -------------------------------------------------------------------------------------------------------------------------------------------------------

###### // Ding Long //  <br />

###### // How To Run Scripts //  <br />
Run testscripts by using node dinglongtest on the terminal<br />

###### // OverView //  <br />
Currently there are two different functions to run two different test scripts one of which is Testscripts() and the other which is Testflowchart()<br />
Testscripts() Mainly consist of all the testscripts that was written for Item,Store,Report Item and Loan-Filter<br />
Uncomment whichever function you feel like using under the function named TestScripts<br />
Uncomment line 126 the calling of Testscripts() to run the testscripts<br />
TestFlowCharts() consist of 5 store stock scnenarios (Test 207-211). <br />
As a precaution stock.addstock() is implemented in the function so that stock will not be empty when running the scenarios.<br />
Currently the running function is Testflowchart() when you run node dinglongtest<br />
Names can be changed according to your liking. Our Actual names were used to identify who did what so please feel free to change it.

###### // Item File //  <br />
Consist of Adding Category and Adding new Item  <br />
If you want to add item with the same category without creating a new category put "no".  <br />
If not put "yes"

###### // Store File //  <br />
Consist of All store stock scenarios including a bit of creating stores.  <br />
In short everything related to stores is in here.

###### // Report File //  <br />
Consist of Reporting Item Scenarios

###### // Loan-Filter File //  <br />
Consist of Some Loan Filter-scenarios. There are still other filtering options.



###### -------------------------------------------------------------------------------------------------------------------------------------------------------

###### // Xin Hui // <br />

###### // How To Run Test Scripts // <br />
All test scenarios can be accessed through xinhui.js, consists of Test 101, 102, 103, 111. All test scenarios can be viewed from my Test Documentation document. To test an individual script, comment out everything that you don't intent on running. 

EG. Run test 101:
// To leave uncommented:
    x ++
    await updateCounter(x)
    await test101.test()
//

###### // How to set up a new Token // <br />
Refer to the Gmail API Documentation in my folder, follow step-by-step to set up the Google Cloud, to set up Gmail API. Scripts to set up the token is in ./custom/gmailAuth.js

Run firstTimeConfig(), token.json will be created in the directory that you ran in.
** NOTE:
- Refresh Token expires after 7 days, will have to run firstTimeConfig().
- Access Token expires after 30mins, and you will need to use the Refresh Token to update the Access Token.
- If requrired, can run ./xinhui/googleAPI/check.js to check if the tokens are still valid. will have to update the path and naming of each function.

If there is any error in retrieving any of the Gmail Messages, do re-run firstTimeConfig() again, just in case something has expired and check.js failed to check if the tokens are valid. 

###### // xinhui File //  <br />
Consist of User hierarchy permissions scenarios, can refer to the Test Documentation  <br />
also consists of newBranch.js, and newBranchwInput.js

// newBranch.js
Creates a new SET hierarchy, according to the flow chart in my documentation. Will have to manually set the initials in the code, "char" in line 17.

// newBranchwInput.js
Creates a new set of user hierarchy through hierarchyInput.json in ./Const.
To change the initials of the hierarchy, change "char". 
Indicate the number of the level using "numberOf" and the base names. 
** NOTE: user store access is NOT completed.

###### // Gerald //


