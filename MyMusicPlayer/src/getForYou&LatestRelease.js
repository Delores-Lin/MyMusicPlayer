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

// 按钮逻辑
const newRelease = document.querySelector('#newReleases');
const featuredPlaylists = document.querySelector('#featuredPlaylists');
newRelease.addEventListener('click',()=>{
    newRelease.className = "styleBlockActive";
    pushAlbums(headers);
    featuredPlaylists.className = "styleBlock";
});
featuredPlaylists.addEventListener('click',()=>{
    featuredPlaylists.className = "styleBlockActive";
    pushplaylists(headers);
    newRelease.className = "styleBlock";
})


async function getFeaturedPlaylists(headers) {
    const config = {
        locale: "zh_TW",
        limit: 8,
        offset: 0,
    }
    const queryParams = new URLSearchParams(config);
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/browse/categories?${queryParams}`,
            {
                method:'GET',
                headers: headers,
            }
        );
        const playlists = await response.json();
        addPlaylistClick();
        return playlists;
    }catch(error){
        console.log('Request Failed:',error);
    }
}

async function getLatestRelease(headers) {
    const config = {
        limit: 8,
        offset: 0,
    }
    const queryParams = new URLSearchParams(config);
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/browse/new-releases?${queryParams}`,
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

async function pushplaylists(headers){
    const playlists = await getFeaturedPlaylists(headers);
    const items = playlists.categories.items;
    const albums = document.querySelectorAll('.album');
    const albumsImg = document.querySelectorAll('.album img');
    const albumsp = document.querySelectorAll('.album p');
    for(let i = 0 ;i<8 ; i++){
        albums[i].id = 'playlist';
        albumsImg[i].src = items[i].icons[0].url;
        albumsImg[i].id = items[i].id;
        albums[i].style.setProperty('--album-background',`url(${items[i].icons[0].url})`);
        albumsp[i].innerHTML = items[i].name;
    }
}

async function pushAlbums(headers){
    const playlists = await getLatestRelease(headers);
    const items = playlists.albums.items;
    const albumsImg = document.querySelectorAll('.album img');
    const albums = document.querySelectorAll('.album');
    const albumsp = document.querySelectorAll('.album p');
    for(let i = 0 ;i<8 ; i++){
        albums[i].id = 'album';
        albumsImg[i].src = items[i].images[0].url;
        albums[i].style.setProperty('--album-background',`url(${items[i].images[0].url})`);
        albumsImg[i].id = items[i].id;
        albumsp[i].innerHTML = items[i].name;
    }
    addAlbumClick();
}

pushplaylists(headers);

