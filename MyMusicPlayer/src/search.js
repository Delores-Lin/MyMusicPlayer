import { addAlbumClick } from "./webPlaybackSDK";
import { addPlaylistClick } from "./webPlaybackSDK";
import { addSongclick } from "./webPlaybackSDK";
const tokenData = JSON.parse(sessionStorage.getItem('tokenData'));

const access_token = tokenData.access_token;
console.log(access_token);

const searchBar = document.querySelector('#searchBar');
const searchInput = document.querySelector('#searchBar input');

let searchBarClickStatus = 0
searchBar.addEventListener('click',()=>{
    if(!searchBarClickStatus){
        searchBarClickStatus = 1;
        searchBar.style.width = '100%';
        searchInput.style.display = 'block';
        searchInput.focus();
    }
})

document.addEventListener('click',(event)=>{
    if(!searchBar.contains(event.target) && searchBarClickStatus && searchInput.value.trim() == ''){
        searchBarClickStatus = 0;
        searchInput.value = '';
        searchBar.style.width = '50px';
        searchInput.style.display = 'none';
    }
})

async function search(q,typeArray){
    const config = {
        q:q,
        type:typeArray,
        limit:5,
    }
    const queryParams = new URLSearchParams(config);
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/search?${queryParams}`,
            {
                method:'GET',
                headers: headers,
            }
        );
        const results = await response.json();
        return results;
    }catch(error){
        console.log('Request Failed:',error);
    }
}

async function searchForItems(){
    searchInput.addEventListener('keypress',async(send)=>{
        if(send.key == 'Enter'){
            console.log('enter!!');
            if(searchInput.value.trim() !=''){
                const showList = document.querySelector('#showlist');
                showList.style.display = 'none';
                searchPage.display = 'flex';
                const mainView = document.querySelector('#mainView');
                mainView.style.display = 'none';
                const searchResult = await search(searchInput.value,["album", "artist", "track"]);
                addResultBlock(searchResult);
            }
        }
    })
}
searchForItems();

function msToTime(ms){
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function addResultBlock(searchResult){
    const searchPage = document.querySelector('#searchPage');
    searchPage.innerHTML = '';
    console.log(searchResult);
    if(searchResult.tracks){
        console.log(searchResult.tracks);
        searchResult.tracks.items.forEach(item=>{
            createSearchTrackBlock(item.uri,item.name,item.artists[0].name,item.album.name,msToTime(item.duration_ms),item.album.images[0].url);
        });
    };
    if(searchResult.artists){
        searchResult.artists.items.forEach(item=>{
            createSearchArtistBlock(item.id,item.name,item.images[0].url);
        });
    };
    if(searchResult.albums){
        searchResult.albums.items.forEach(item=>{
            createSearchAlbumBlock(item.id,item.name,item.artists[0].name,item.images[0].url);
        });
    }
    addAlbumClick();
    addPlaylistClick();
    addSongclick();
}

function createSearchArtistBlock(songUri, songName,imageUrl) {
    // 创建一个新的 singleSongBlock 容器
    const songBlock = document.createElement('div');
    songBlock.classList.add('singleSongBlock');
    songBlock.id = 'artist';

    // 创建和填充 num 元素
    const numElement = document.createElement('p');
    numElement.classList.add('num');
    numElement.textContent = 'artist';

    // 创建并填充 songPhoto 元素
    const songPhoto = document.createElement('div');
    songPhoto.classList.add('songPhoto');
    const img = document.createElement('img');
    img.src = imageUrl;
    img.id = songUri;
    songPhoto.appendChild(img);

    // 创建并填充 singleSongInfo 元素
    const singleSongInfo = document.createElement('div');
    singleSongInfo.classList.add('singleSongInfo');
    const songNameElement = document.createElement('p');
    songNameElement.classList.add('singleSongName');
    songNameElement.textContent = songName;
    singleSongInfo.appendChild(songNameElement);

    // 将所有创建的元素添加到 songBlock 中
    songBlock.appendChild(numElement);
    songBlock.appendChild(songPhoto);
    songBlock.appendChild(singleSongInfo);

    // 将 songBlock 添加到页面中的 container
    const container = document.getElementById('searchPage');
    container.appendChild(songBlock);
}

function createSearchAlbumBlock(songUri, songName, maker,imageUrl) {
    // 创建一个新的 singleSongBlock 容器
    const songBlock = document.createElement('div');
    songBlock.classList.add('singleSongBlock');
    songBlock.id = 'album';

    // 创建和填充 num 元素
    const numElement = document.createElement('p');
    numElement.classList.add('num');
    numElement.textContent = 'album';

    // 创建并填充 songPhoto 元素
    const songPhoto = document.createElement('div');
    songPhoto.classList.add('songPhoto');
    const img = document.createElement('img');
    img.src = imageUrl;
    img.id = songUri;
    songPhoto.appendChild(img);

    // 创建并填充 singleSongInfo 元素
    const singleSongInfo = document.createElement('div');
    singleSongInfo.classList.add('singleSongInfo');
    const songNameElement = document.createElement('p');
    songNameElement.classList.add('name');
    songNameElement.textContent = songName;
    const makerElement = document.createElement('p');
    makerElement.classList.add('maker');
    makerElement.textContent = maker;
    singleSongInfo.appendChild(songNameElement);
    singleSongInfo.appendChild(makerElement);

    // 将所有创建的元素添加到 songBlock 中
    songBlock.appendChild(numElement);
    songBlock.appendChild(songPhoto);
    songBlock.appendChild(singleSongInfo);

    // 将 songBlock 添加到页面中的 container
    const container = document.getElementById('searchPage');
    container.appendChild(songBlock);
}

function createSearchTrackBlock(songUri, songName, maker, album, time, imageUrl) {
    // 创建一个新的 singleSongBlock 容器
    const songBlock = document.createElement('div');
    songBlock.classList.add('singleSongBlock');
    songBlock.id = 'track';

    // 创建和填充 num 元素
    const numElement = document.createElement('p');
    numElement.classList.add('num');
    numElement.textContent = 'track';

    // 创建并填充 songPhoto 元素
    const songPhoto = document.createElement('div');
    songPhoto.classList.add('songPhoto');
    const img = document.createElement('img');
    img.src = imageUrl;
    img.id = songUri;
    songPhoto.appendChild(img);

    // 创建并填充 singleSongInfo 元素
    const singleSongInfo = document.createElement('div');
    singleSongInfo.classList.add('singleSongInfo');
    const songNameElement = document.createElement('p');
    songNameElement.classList.add('singleSongName');
    songNameElement.textContent = songName;
    const makerElement = document.createElement('p');
    makerElement.classList.add('maker');
    makerElement.textContent = maker;
    singleSongInfo.appendChild(songNameElement);
    singleSongInfo.appendChild(makerElement);

    // 创建并填充 belongAlbum 元素
    const belongAlbum = document.createElement('div');
    belongAlbum.classList.add('belongAlbum');
    const albumElement = document.createElement('p');
    albumElement.textContent = album;
    belongAlbum.appendChild(albumElement);

    // 创建并填充 time 元素
    const timeElement = document.createElement('div');
    timeElement.classList.add('time');
    const timeParagraph = document.createElement('p');
    timeParagraph.textContent = time;
    timeElement.appendChild(timeParagraph);

    // 将所有创建的元素添加到 songBlock 中
    songBlock.appendChild(numElement);
    songBlock.appendChild(songPhoto);
    songBlock.appendChild(singleSongInfo);
    songBlock.appendChild(belongAlbum);
    songBlock.appendChild(timeElement);

    // 将 songBlock 添加到页面中的 container
    const container = document.getElementById('searchPage');
    container.appendChild(songBlock);
}