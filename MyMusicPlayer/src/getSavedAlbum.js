tokenData = JSON.parse(sessionStorage.getItem('tokenData'));

access_token = tokenData.access_token;
console.log(access_token);
headers = {
    'Authorization': `Bearer ${access_token}`
}

// 获取用户信息
async function getMe(headers) {
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/me`,
            {
                method:'GET',
                headers: headers,
            }
        );
        const meInfo = await response.json();
        return meInfo;
    }catch(error){
        console.log('Request Failed:',error);
    }
}

async function fetchmeInfo(){
    const meInfo =await getMe(headers);
    const userId = meInfo.id;
    sessionStorage.setItem('userId',userId);
    console.log(meInfo.id);
    const userImgUrl = meInfo.images[0].url;
    // 添加用户头像
    const addUserImg = document.querySelector('#userImg img');
    addUserImg.src = userImgUrl;
    return;
}
fetchmeInfo();

const userId = sessionStorage.getItem('userId');

async function getUserPlaylists(headers,userId) {
    const config = {
        user_id:userId,
        limit: 3,
        offset: 0,
    }
    const queryParams = new URLSearchParams(config);
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/users/${userId}/playlists?${queryParams}`,
            {
                method:'GET',
                headers: headers,
            }
        );
        const playlists = await response.json();
        return playlists;
    }catch(error){
        console.log('Request Failed:',error);
    }
}

async function getUserSavedTracks(headers) {
    const config = {
        limit: 10,
        offset: 0,
    }
    const queryParams = new URLSearchParams(config);
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/me/tracks?${queryParams}`,
            {
                method:'GET',
                headers: headers,
            }
        );
        const tracks = await response.json();
        return tracks;
    }catch(error){
        console.log('Request Failed:',error);
        
    }
}

async function fetchUserPlaylists(headers,userId){
    const playlists =await getUserPlaylists(headers,userId);
    const playlistsItems = playlists.items;
    let collections = document.querySelectorAll('.collections img');
    let i = 0;
    for(i;i<playlistsItems.length && i<9 ;i++){
        collections[i].src = playlistsItems[i].images[0].url;
        collections[i].id = playlistsItems[i].id;
    }
    const tracks = await getUserSavedTracks(headers);
    const tracksItems = tracks.items;
    for(let j=0 ;i<tracksItems.length && i<9 ;i++){
        collections[i].id = tracksItems[j].track.id;
        collections[i].src = tracksItems[j].track.album.images[0].url;
        j++;
    }
    const recentPlayImgs = document.querySelectorAll('#recentPlayBlock img');
    const recentPlayName = document.querySelectorAll('#recentPlayBlock p');
    for(let i = 0;i<recentPlayImgs.length;i++){
        recentPlayImgs[i].src = tracksItems[i].track.album.images[0].url;
        recentPlayImgs[i].id = tracksItems[i].track.id;
        recentPlayName[i].innerHTML = tracksItems[i].track.album.name;
    }
    return;
}
// let tracks = getUserTopItems(headers);
fetchUserPlaylists(headers,userId);
// console.log(tracks);