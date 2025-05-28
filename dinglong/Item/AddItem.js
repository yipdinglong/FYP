const item = require("../../saf/Item")
const login=require("../../Login")
const c=require("../../Const/Const")
const category=require("../Item/AddCategory")
const assert = require("assert")    
const fs = require("fs");

//Add New Item

async function addnewitem(){
    
    //__________________________________________________________________________//
    
    //Add New Category

    var categoryid=await category.addnewcategory("no")
    
    //__________________________________________________________________________//

    //Add New Item

    var idtoken=login.getToken(c.adminaccountco2)

    var newitem=await item.AddItem(idtoken,c.newnsnnumber,c.newitemdesc,`${categoryid}`,c.newitemunit,c.newitemremarks)

    assert.equal(newitem.errorMessage,undefined,"Cannot Add New Item")

    console.log(newitem)
    
    for(var i=0;i<newitem.length;i++){
        newitem=newitem[i]
     }
    
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`Added new item with nsn number of ${newitem["nsn_number"]} `)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    mystring="item"+parseInt(newitem["nsn_number"],10)
    var data = fs.readFileSync('./Const/item.json')
    try {
        var myObject= JSON.parse(data)
      } catch (err) {
        console.log('error', err);
      }
   
    var json={
        "categoryid":categoryid,
        "nsn_number":newitem["nsn_number"]
    }
    myObject[`${mystring}`]=json 
    var newData = JSON.stringify(myObject)

    fs.writeFile("./Const/item.json",newData,function(err){
        if(err){
            console.log(err)
        }
        console.log("Item saved")
    });


    //__________________________________________________________________________//

}

module.exports={addnewitem}
