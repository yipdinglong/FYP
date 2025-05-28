/**
 * Things required for Gmail API Token
 * @param clientID retrieve from credentials.json/Google Cloud
 * @param clientSecret retrieve from credentials.json/Google Cloud
 * @param Code the code that is given in the URL when redirected to the page
 * @param refreshToken retrieve from getRefreshToken(); Expires every 7 days. Will need to reconfig with new code, clientID and clientSecret
 * @param accessToken retrieve from getAccessToken(); Expires every 30 mins. Needs refresh token to update access token
 */

"use strict";
const credentials = require("./credentials.json");
const axios = require("axios");
const prompt = require("prompt-sync")();
const qs = require("qs");
const fs = require("fs");

async function firstTimeConfig() {
    const clientID = credentials["installed"]["client_id"];
    const clientSecret = credentials["installed"]["client_secret"];
    var code = getCode(clientID);
    var refreshToken = await getRefreshToken(code, clientID, clientSecret);
    var accessToken = await getAccessToken(clientID, clientSecret, refreshToken);
    let date = new Date();

    console.log("\nSuccessfully created Main User token json");
    console.log("\n= = = = = = = = = =");

    let token = JSON.stringify({
        _clientID: clientID,
        _clientSecret: clientSecret,
        _code: code,
        _refreshToken: refreshToken,
        _accessToken: accessToken,
        updateDateTime: date
    });

    fs.writeFileSync("../token.json", token);
};

async function updateAccessToken(){
    const clientID = tokenTxt["_clientID"];
    const clientSecret = tokenTxt["_clientSecret"];
    const code = tokenTxt["_code"];
    const refreshToken = tokenTxt["_refreshToken"];
    var accessToken = await getAccessToken(clientID, clientSecret, refreshToken);
    let date = new Date();

    console.log("\nSuccessful token update");
    console.log("\n= = = = = = = = = =");

    let token = JSON.stringify({
        _clientID: clientID,
        _clientSecret: clientSecret,
        _code: code,
        _refreshToken: refreshToken,
        _accessToken: accessToken,
        updateDateTime: date
    });

    fs.writeFileSync("../token.json", token);
}

function getCode(_clientID) {
    // new url link
    var url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.append("scope", "https://mail.google.com");
    url.searchParams.append("access_type", "offline");
    url.searchParams.append("redirect_uri", "http://localhost");
    url.searchParams.append("response_type", "code");
    url.searchParams.append("client_id", _clientID);

    console.log(url.href);

    var code = prompt("Enter code after verification: ");
    return code;
}

function getRefreshToken(_code, _clientID, _clientSecret) {
    var data = qs.stringify({
        code: _code,
        client_id: _clientID,
        client_secret: _clientSecret,
        redirect_uri: "http://localhost",
        grant_type: "authorization_code",
    });
    var config = {
        method: "post",
        url: "https://accounts.google.com/o/oauth2/token",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: "__Host-GAPS=1:EBkwcjvwGMWoK44a3vIkVZIs6HXUmw:rF_vWsIqsP5umqsS",
        },
        data: data,
    };

    var x = axios(config)
        .then(function (response) {
            // console.log(`refresh token -> ${response.data["refresh_token"]}`);
            return response.data["refresh_token"];
        })
        .catch(function (error) {
            console.log(error);
        });

    return x;
}

function getAccessToken(_clientID, _clientSecret, _refreshToken) {
    var data = qs.stringify({
        client_id: _clientID,
        client_secret: _clientSecret,
        refresh_token: _refreshToken,
        grant_type: "refresh_token",
    });
    var config = {
        method: "post",
        url: "https://accounts.google.com/o/oauth2/token",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: "__Host-GAPS=1:EBkwcjvwGMWoK44a3vIkVZIs6HXUmw:rF_vWsIqsP5umqsS",
        },
        data: data,
    };

    var x = axios(config)
        .then(function (response) {
            // console.log(`access token -> ${response.data["access_token"]}`);
            return response.data["access_token"];
        })
        .catch(function (error) {
            console.log(error);
        });
    return x;
}

module.exports = { firstTimeConfig, updateAccessToken, getCode, getRefreshToken, getAccessToken }