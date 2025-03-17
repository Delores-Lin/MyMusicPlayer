import { addAlbumClick } from "./webPlaybackSDK";
import { addPlaylistClick } from "./webPlaybackSDK";
const tokenData = JSON.parse(sessionStorage.getItem('tokenData'));

const access_token = tokenData.access_token;
console.log(access_token);
let headers = {
    'Authorization': `Bearer ${access_token}`
}
async function waitForToken() {
    while (!sessionStorage.getItem('tokenData')) {
        tokenData = JSON.parse(sessionStorage.getItem('tokenData'));
        access_token = tokenData.access_token;
console.log(access_token);
    // 等待1秒再检查一次
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log("Token已获取");
}

if(access_token === null){
    access_token = tokenData.access_token;
    waitForToken();
}
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
    let collectionBlock = document.querySelectorAll('.collections')
    let collections = document.querySelectorAll('.collections img');
    let i = 0;
    let collectionName = document.querySelectorAll('.collectionInfo .name');
    let collectionArtist = document.querySelectorAll('.collectionArtist');
    for(i;i<playlistsItems.length && i<9 ;i++){
        collectionBlock[i].id = 'playlist';
        collections[i].src = playlistsItems[i].images[0].url;
        collections[i].id = playlistsItems[i].id;
        collectionName[i].innerHTML = playlistsItems[i].name;
        collectionArtist[i].innerHTML = playlistsItems[i].owner.display_name;
        collectionName[i].id = playlistsItems[i].uri;
    }
    addPlaylistClick();
    const tracks = await getUserSavedTracks(headers);
    const tracksItems = tracks.items;
    for(let j=0 ;i<tracksItems.length && i<9 ;i++){
        collectionBlock[i].id = 'album';
        collections[i].id = tracksItems[j].track.album.id;
        collections[i].src = tracksItems[j].track.album.images[0].url;
        collectionName[i].innerHTML = tracksItems[j].track.album.name;
        collectionArtist[i].innerHTML = tracksItems[j].track.album.artists[0].name;
        collectionName[i].id = tracksItems[j].uri;
        j++;
    }
    const recentPlayBlock = document.querySelectorAll('.recentPlayBlock')
    const recentPlayImgs = document.querySelectorAll('.recentPlayBlock img');
    const recentPlayName = document.querySelectorAll('.recentPlayBlock p');
    for(let i = 0;i<recentPlayImgs.length;i++){
        recentPlayBlock[i].id = 'album';
        recentPlayImgs[i].src = tracksItems[i].track.album.images[0].url;
        recentPlayImgs[i].id = tracksItems[i].track.album.id;
        recentPlayName[i].innerHTML = tracksItems[i].track.album.name;
    }
    addAlbumClick();
    return;
}
// let tracks = getUserTopItems(headers);
fetchUserPlaylists(headers,userId);
// console.log(tracks);

const listsButton = document.querySelector('.repository');

const Main = document.querySelector('#main');

listsButton.addEventListener('click',()=>{
    const mainWidth = window.getComputedStyle(Main).gridTemplateColumns;
    if(mainWidth.includes('97px')){
        Main.style.gridTemplateColumns = '300px 1fr 1fr';
        const collectionInfos = document.querySelectorAll('.collectionInfo');
        const repository = document.querySelector('.repository h2');
        repository.style.display = 'block';
        collectionInfos.forEach(collectionInfo => {
            collectionInfo.style.display = 'flex';
        });
    }
    if(mainWidth.includes('300px')){
        Main.style.gridTemplateColumns = '97px 1fr 1fr';
        const collectionInfos = document.querySelectorAll('.collectionInfo');
        const repository = document.querySelector('.repository h2');
        repository.style.display = 'none';
        collectionInfos.forEach(collectionInfo => {
            collectionInfo.style.display = 'none';
        });
    }
})