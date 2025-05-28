const login=require("../../Login")
const store=require("../../saf/Store")
const c=require("../../Const/Const")
const assert = require("assert")    

//Add New Store

async function addnewstore(){

    var idtoken=login.getToken(c.adminaccount)

    //__________________________________________________________________________//

    //Add New Store

    var newstore=await store.AddStore(idtoken,c.newstorename,c.newid,1,1,1)

    assert.notEqual(newstore,undefined,"Cannot Add Store")

    var allstore=await store.GetAllActiveStores(idtoken)
    for(var i=0;i<allstore.length;i++){
        if(allstore[i]["name"]==c.newstorename){
            var newstore=allstore[i]
        }
    }

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`Added new store ${newstore["name"]} id ${newstore["id"]}`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    //__________________________________________________________________________//

    console.log(newstore["id"])
}
module.exports={addnewstore}