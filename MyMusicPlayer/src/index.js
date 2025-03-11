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

    if(sessionStorage.getItem('code')) {
        console.log('has code already');
        return;
    }
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email';
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

getAuthorization();

function handleCallback() {
    const url = new URLSearchParams(window.location.search);
    const code = url.get('code');
    if(code){
        sessionStorage.setItem('code',code);
    }
}

async function getToken(){
    if(sessionStorage.getItem('access_token')){
        console.log('got token');
        return;
    }
    const authparams = new URLSearchParams(window.location.search);
    console.log(authparams);
    const code = sessionStorage.getItem('code');
    const state = authparams.get('state');
    console.log(state,'\n',code);
    const body = new URLSearchParams({
        code : code,
        redirect_uri : redirect_uri,
        grant_type: 'authorization_code',
    });
    try{
        fetch('https://accounts.spotify.com/api/token',{
            method: 'POST',
            body : body,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
            },
            json: true,
        })
        const tokenData = await response.json();
        return tokenData.access_token;
    }catch(error){
        return error;
    }
    

}
// getToken();
// sessionStorage.removeItem('code');
// console.log(sessionStorage.getItem('code'));
const access_token = getToken();
sessionStorage.setItem('access_token',access_token);
