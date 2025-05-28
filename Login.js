const baseUrl =
    "https://i1j7n6vy8l.execute-api.ap-southeast-1.amazonaws.com/ps-dev";
const axios = require("axios");

function getToken(username, pw = "NypSaf21!") {
    var data = JSON.stringify({
        username: username,
        password: pw,
        bypassOTP: true,
    });
    var config = {
        method: "post",
        url: `${baseUrl}/login`,
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    };

    var promise = axios(config)
        .then(function (response) {
            console.log("= = = = = = = = = = = = = = = = = = = = = ")
            console.log(`\nSigned in as: ${response.data.username}, Group: ${response.data.userGroup}`)
            console.log("\n= = = = = = = = = = = = = = = = = = = = = ")
          
            return JSON.stringify(response.data.idToken);
        })
        .catch(function (error) {
            console.log(error);
        });
    return promise;
}

function getSession(username, pw) {
    console.log(`getting session for username ${username}`)
    var data = JSON.stringify({
        "username": username,
        "password": pw,
        "bypassOTP": true,
    });
    var config = {
        method: "post",
        url: `${baseUrl}/login`,
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    };

    var promise = axios(config)
        .then(function (response) {
            // console.log(`retrieving response.data: ${JSON.stringify(response.data.Session)}`)
            return JSON.stringify(response.data.Session);
        })
        .catch(function (error) {
            console.log(error);
        });
    return promise;
}

module.exports = { getToken, getSession, baseUrl };
