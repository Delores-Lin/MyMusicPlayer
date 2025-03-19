
console.log('je');
console.log("Hello");
const client_id = '59eee7863e184c0fb31ba10e24d2b480';
const client_secret = 'ec9bd930d9064e6fba7a762b9e67d7e6'
const redirect_uri = 'http://localhost:3000/'

function generateRandomString(length) {
    return Array(length).fill(0).map(() => 
        Math.random().toString(36).charAt(2)
    ).join('').slice(0,length)
}
// console.log(state,'\n',state.length);

async function getAuthorization() {

    handleCallback();

    if(sessionStorage.getItem('code') != undefined ) {
        console.log('has code already');
        return;
    }
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email user-top-read user-library-modify user-library-read user-read-currently-playing playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-modify-playback-state streaming';
    sessionStorage.setItem('spotifyState',state);
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
    });
    window.location.href = `${authUrl}?${params}`
}


function handleCallback() {
    const url = new URLSearchParams(window.location.search);
    const code = url.get('code');
    if(code){
        console.log(code);
        sessionStorage.setItem('code',code);
    }
}

async function makeSureCode(){
    await getAuthorization();
}
makeSureCode();
// while(!sessionStorage.getItem('code')){
//     makeSureCode();
// }

async function getToken(){
    const authparams = new URLSearchParams(window.location.search);
    const code = authparams.get('code');
    // console.log(code);
    const state = authparams.get('state');
    // console.log(state,'\n',code);
    const body = new URLSearchParams({
        grant_type:'authorization_code',
        code : code,
        redirect_uri : redirect_uri,
    });
    try{
        const response = await fetch('https://accounts.spotify.com/api/token',{
            method: 'POST',
            body : body,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
            },
        })
        const tokenData = await response.json();
        if(tokenData && tokenData.refresh_token){
            console.log(tokenData);
            sessionStorage.setItem('tokenData',JSON.stringify(tokenData));
            sessionStorage.setItem('refresh_token',tokenData.refresh_token);
        }else{
            console.log(false,tokenData);
        }
    }catch(error){
        sessionStorage.removeItem('tokenData');
        sessionStorage.removeItem('refresh_token');
        return error;
    }
}

// async function waitForToken() {
//     while (!sessionStorage.getItem('tokenData')) {
//         await getToken();
//     // 等待1秒再检查一次
//         await new Promise(resolve => setTimeout(resolve, 1000));
//     }
//     console.log("Token已获取");
// }

// waitForToken();

async function checkToken(){
    if(sessionStorage.getItem('tokenData') && sessionStorage.getItem('refresh_token')){
        console.log('tokenData',tokenData);
        return;
    }
    if(sessionStorage.getItem('code')){
        getToken();
    }else{
        console.log('noCode');
    }
}
checkToken();



tokenData = JSON.parse(sessionStorage.getItem('tokenData'));
console.log(tokenData);

async function refreshAccessToken(){
    let tokenData = JSON.parse(sessionStorage.getItem('tokenData'));
    let refresh_token = sessionStorage.getItem('refresh_token');
    try{    
        const response = await fetch(`https://accounts.spotify.com/api/token`,{
            method:'POST',
            headers:{
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
            },
            body:new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refresh_token,
                client_id: client_id,
            }),
        });
        const responses = await response.json();
        console.log(responses.access_token);
        if(responses.access_token){
            console.log('get new access_token')
            tokenData.access_token = responses.access_token;
            console.log('tokenData.access_token',tokenData.access_token);
            sessionStorage.setItem('tokenData',JSON.stringify(tokenData));
            sessionStorage.setItem('refresh_token',refresh_token);
        }
    }catch(error){
        console.log('error:',error);}
}
async function waitrefresh(){
    await refreshAccessToken();
    console.log(JSON.parse(sessionStorage.getItem('tokenData')).access_token);
}
setInterval(waitrefresh(),50*60*1000);
// refreshAccessToken();