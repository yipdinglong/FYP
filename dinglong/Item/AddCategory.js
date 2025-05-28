const login=require("../../Login")
const category=require("../../saf/Category")
const c=require("../../Const/Const")
const assert = require("assert")    


//Add New Category

async function addnewcategory(ask){

    if(ask=="yes"){
    var idtoken=login.getToken(c.adminaccountco2)

    //__________________________________________________________________________//

    //Add New Cateogry

    var newcategory=await category.addCategory(idtoken,c.newcategoryname)

    assert.notEqual(newcategory,undefined,"Cannot Add Category")

    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")
    console.log(`Added new category ${newcategory["name"]} id ${newcategory["id"]}`)
    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - ")

    //__________________________________________________________________________//

    console.log(newcategory["id"])

    return newcategory["id"]
    }
    else{
        console.log("Did not add category")
        return 125
    }

}
module.exports={addnewcategory}