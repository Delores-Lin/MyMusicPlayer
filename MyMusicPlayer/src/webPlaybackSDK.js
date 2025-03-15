import { async } from "regenerator-runtime";

tokenData = JSON.parse(sessionStorage.getItem('tokenData'));

access_token = tokenData.access_token;
console.log(access_token);
headers = {
    'Authorization': `Bearer ${access_token}`
}

window.onSpotifyWebPlaybackSDKReady = async () => {
    const token = JSON.parse(sessionStorage.getItem('tokenData')).access_token;

    const player = new Spotify.Player({
        name: "My Web Player",
        getOAuthToken: cb => { cb(token);},
        volume: 0.3
    });

    player.addListener('ready', ({ device_id }) => {
        console.log("Spotify Player Ready, Device ID:", device_id);
        sessionStorage.setItem("spotify_device_id", device_id);
    });

    player.addListener('not_ready', ({ device_id }) => {
        console.log("Spotify Player Not Ready, Device ID:", device_id);
    });

    player.addListener('initialization_error', ({ message }) => {
        console.error("Initialization Error:", message);
    });

    player.addListener('authentication_error', ({ message }) => {
        console.error("Authentication Error:", message);
    });

    player.addListener('account_error', ({ message }) => {
        console.error("Account Error:", message);
    });
    await player.connect();
}

async function playTrack(headers,trackUri) {
    const deviceId = sessionStorage.getItem("spotify_device_id");

    if (!deviceId) {
        console.error("No access token or device ID found!");
        return;
    }

    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({ uris: trackUri })
    });

    console.log("Playing track:", trackUri);
}

async function getAlbumTracks(headers,id) {
    console.log(headers);
    const config = {
        limit: 50,
        offset: 0,
    }
    const queryParams = new URLSearchParams(config);
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/albums/${id}/tracks?${queryParams}`,
            {
                method:'GET',
                headers: headers,
            }
        );
        const ids = await response.json();
        return ids;
    }catch(error){
        console.log('Request Failed:',error);
    }
}

const albums = document.querySelectorAll('#recentPlayBlock');

albums.forEach(album => {
    album.addEventListener('dblclick', async() => {
        console.log('click');
        const albumImg = album.querySelector('img'); 
        if (albumImg && albumImg.id) {
            console.log(albumImg.id);
            const ids = await getAlbumTracks(headers, albumImg.id);
            console.log(ids.items.map(track => track.uri));
            playTrack(headers,ids.items.map(track => track.uri));
            showCurrentPlayingTrack(headers);

            ids.items.forEach(item =>{
                createSongBlock(item.track_number,item.uri,item.name,item.artists[0].name,ids.name,`${parseInt(item.duration_ms/1000/60)}:${
                    parseInt(item.duration_ms/1000 - parseInt(item.duration_ms/1000/60)*60)}`,albumImg.src);
            })
            const listBlock = document.querySelector('#showlist');
            listBlock.style.display = 'flex';

            const listPhoto = document.querySelector('#listPhoto img');
            listPhoto.src = albumImg.src;

            const listMaker = document.querySelector('.makerAndNumber p');
            listMaker.innerHTML = `${ids.items[0].artists[0].name}·${ids.total}首歌曲`;

            const listName = document.querySelector('.listName p');
            listName.innerHTML = album.querySelector('.name').innerHTML;
        } else {
            console.log("No image or ID found in album block.");
        }
    });
});

function createSongBlock(num,songUri, songName, maker, album, time, imageUrl) {
    // 创建一个新的 singleSongBlock 容器
    const songBlock = document.createElement('div');
    songBlock.classList.add('singleSongBlock');

    // 创建和填充 num 元素
    const numElement = document.createElement('p');
    numElement.classList.add('num');
    numElement.textContent = num;

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
    const container = document.getElementById('body');
    container.appendChild(songBlock);
}


async function getCurrentPlayingTrack(headers) {
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/me/player/currently-playing`,
            {
                method:'GET',
                headers: headers,
            }
        );
        const ids = await response.json();
        return ids;
    }catch(error){
        console.log('Request Failed:',error);
    }
}
async function showCurrentPlayingTrack(headers){
    const track = await getCurrentPlayingTrack(headers);
    if(track && track.item){
        console.log(track.item);
        let albumPhoto = document.querySelector('#albumPhoto img');
        albumPhoto.src = track.item.album.images[0].url;

        let trackName = document.querySelector('#songName p');
        trackName.innerHTML = track.item.name;

        let singer = document.querySelector('#singer p');
        singer.innerHTML = track.item.artists[0].name;


        if(track.is_playing === false){
            console.log('isPlaying');
            resumeButton();
        }else{
            console.log('notPlaying');
            pauseButton();
        }
    }
}

setInterval(()=>showCurrentPlayingTrack(headers),5*1000);

function pauseButton(){
    const pause = document.querySelectorAll('#pause');
    const resume = document.querySelectorAll('#resume');
    const status = document.querySelector('#switchMod');
    if(status.checked === true){
        console.log('checked');
        pause[0].style.display = 'block';
        pause[1].style.display = 'none';
        resume[0].style.display = 'none';
        resume[1].style.display = 'none';
    }else{
        console.log('unchecked');
        pause[0].style.display = 'none';
        pause[1].style.display = 'block';
        resume[0].style.display = 'none';
        resume[1].style.display = 'none';
    }
    console.log('pause');
}

function resumeButton(){
    const pause = document.querySelectorAll('#pause');
    const resume = document.querySelectorAll('#resume');
    const status = document.querySelector('#switchMod');
    if(status.checked === true){
        pause[0].style.display = 'none';
        resume[0].style.display = 'block';
    }else{
        pause[1].style.display = 'none';
        resume[1].style.display = 'block';
    }
    console.log('resume');
}

async function stopOrResumePlaying(status){
    const deviceId = sessionStorage.getItem("spotify_device_id");
    console.log('stopPlaying');
    try{
    const response = await fetch(`https://api.spotify.com/v1/me/player/${status}?device_id=${deviceId}`, {
        method: "PUT",
        headers: headers,
    });
    const data = response.json();
    if(!response.ok){
        console.log('getdatastatus',data.status);
    }
    }catch(error){
        console.log('stopPlayingError',error);
    }
}

const pause = document.querySelectorAll('#pause');

pause.forEach(button =>{button.addEventListener('click',async ()=>{
    await stopOrResumePlaying('pause');
    pauseButton();
    console.log('click');
})});

const resume = document.querySelectorAll('#resume');
resume.forEach(button =>{button.addEventListener('click',async ()=>{
    await stopOrResumePlaying('play');
    resumeButton();
    console.log('click');
})});

async function previousOrNextPlaying(status){
    const deviceId = sessionStorage.getItem("spotify_device_id");
    console.log('stopPlaying');
    try{
    const response = await fetch(`https://api.spotify.com/v1/me/player/${status}?device_id=${deviceId}`, {
        method: "POST",
        headers: headers,
    });
    const data = response.json();
    if(!response.ok){
        console.log('getdatastatus',data.status);
    }
    }catch(error){
        console.log('stopPlayingError',error);
    }
}

const next = document.querySelectorAll('#next');
next.forEach(button =>{button.addEventListener('click',async ()=>{
    await previousOrNextPlaying('next');
    resumeButton();
    console.log('click');
})});

const previous = document.querySelectorAll('#previous');
previous.forEach(button =>{button.addEventListener('click',async ()=>{
    await previousOrNextPlaying('previous');
    resumeButton();
    console.log('click');
})});

const geunius_client_id = 'STZe5j86xqdVNdNLJ0Zgc0YIquUheeFRku2PkkA_h3_ezLOmvi0Npe8Q-9oY0omR';
const genius_client_secret = 'ZdHijQER7nT-kpVKQSfNd0o8C6NIhV_iWB6sJ3_dW4xrzPFbgPI6pRD8QsnQmC1roBe6czarNUU1Q-qr4zAPLw'
const genius_access_token = 'T041Qisugq0wXcbcmxvmanoHeGvrmXYuBcnJyevvawyw10XylmADCAfHQMNEbgn6'


async function searchGeniusLyrics(songTitle, artist) {
    const config = {
        access_token: genius_access_token,
        q: `${songTitle} ${artist}`,
    }
    const queryParams = new URLSearchParams(config);
    const url = `https://api.genius.com/search?${queryParams}`;
    const response = await fetch(url, {
        method:'GET',
    });

    const data = await response.json();
    if (!data.response.hits.length) {
        console.log("No lyrics found on Genius");
        return null;
    }

    return data.response.hits[0].result.url;
}

searchGeniusLyrics("Shape of You", "Ed Sheeran").then(url => console.log(url));