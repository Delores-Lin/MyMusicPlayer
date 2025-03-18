import { async } from "regenerator-runtime";

const tokenData = JSON.parse(sessionStorage.getItem('tokenData'));

const access_token = tokenData.access_token;

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

const headers = {
    'Authorization': `Bearer ${access_token}`
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

// setTimeout(()=>{
    
// },2000);

export async function addAlbumClick(){
    const albums = document.querySelectorAll('#album');
    console.log(albums);
    albums.forEach(album => {
        album.addEventListener('dblclick', async() => {
            console.log('click');
            const albumImg = album.querySelector('img');
            if (albumImg && albumImg.id) {
                console.log(albumImg.id);
                const saved = await checkIfAlbumSaved(albumImg.id);
                console.log(saved);
                if(saved[0]){
                    const liked = document.querySelector('.like');
                    liked.style.backgroundColor = 'red';
                }else{
                    const liked = document.querySelector('.like');
                    liked.style.backgroundColor = 'rgb(180,180,180,0.5)';
                }
                const ids = await getAlbumTracks(headers, albumImg.id);
                console.log(ids.items.map(track => track.uri));
                playTrack(headers,ids.items.map(track => track.uri));
                showCurrentPlayingTrack(headers);
                clearSongs();
                ids.items.forEach(item =>{
                    createSongBlock(item.track_number,item.uri,item.name,item.artists[0].name,ids.name,`${parseInt(item.duration_ms/1000/60)}:${
                        parseInt(item.duration_ms/1000 - parseInt(item.duration_ms/1000/60)*60)}`,albumImg.src);
                })
                const listBlock = document.querySelector('#showlist');
                listBlock.style.display = 'flex';
                const mainViewBar = document.querySelector('#mainViewBar');
                mainViewBar.style.display = 'none';
                const listPhoto = document.querySelector('#listPhoto img');
                listPhoto.src = albumImg.src;
                listPhoto.id = albumImg.id;
    
                const listMaker = document.querySelector('.makerAndNumber p');
                listMaker.innerHTML = `${ids.items[0].artists[0].name}·${ids.total}首歌曲`;
    
                const listName = document.querySelector('.listName p');
                listName.innerHTML = album.querySelector('.name').innerHTML;
                addSongclick();
            } else {
                console.log("No image or ID found in album block.");
            }
        });
    });
}

// const newalbum = document.querySelectorAll('.album');

// newalbum.forEach(album => {
//     album.addEventListener('dblclick', async() => {
//         console.log('click');
//         const albumImg = album.querySelector('img'); 
//         if (albumImg && albumImg.id) {
//             console.log(albumImg.id);
//             const saved = await checkIfAlbumSaved(albumImg.id);
//             console.log(saved);
//             if(saved[0]){
//                 const liked = document.querySelector('.like');
//                 liked.style.backgroundColor = 'red';
//             }else{
//                 const liked = document.querySelector('.like');
//                 liked.style.backgroundColor = 'rgb(180,180,180,0.5)';
//             }
//             const ids = await getAlbumTracks(headers, albumImg.id);
//             console.log(ids.items.map(track => track.uri));
//             playTrack(headers,ids.items.map(track => track.uri));
//             showCurrentPlayingTrack(headers);
//             clearSongs();
//             ids.items.forEach(item =>{
//                 createSongBlock(item.track_number,item.uri,item.name,item.artists[0].name,ids.name,`${parseInt(item.duration_ms/1000/60)}:${
//                     parseInt(item.duration_ms/1000 - parseInt(item.duration_ms/1000/60)*60)}`,albumImg.src);
//             })
//             const listBlock = document.querySelector('#showlist');
//             listBlock.style.display = 'flex';

//             const listPhoto = document.querySelector('#listPhoto img');
//             listPhoto.src = albumImg.src;
//             listPhoto.id = albumImg.id;

//             const listMaker = document.querySelector('.makerAndNumber p');
//             listMaker.innerHTML = `${ids.items[0].artists[0].name}·${ids.total}首歌曲`;

//             const listName = document.querySelector('.listName p');
//             listName.innerHTML = album.querySelector('.name').innerHTML;
//         } else {
//             console.log("No image or ID found in album block.");
//         }
//     });
// })



function clearSongs() {
    const container = document.getElementById('body');
    container.innerHTML = ''; 
}

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

async function checkIfAlbumSaved(id){
    try{
        const response = await fetch(`https://api.spotify.com/v1/me/albums/contains?ids=${id}`,{
            method:'GET',
            headers:headers,
        })
        const saved = await response.json();
        return saved;
    }catch(error){
        console.log('checkalbumerror:',error);
    }
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
        if(error.name === '401 (Unauthorized)'){
            
        }
        console.log('Request Failed:',error.name);
    }
}
async function showCurrentPlayingTrack(headers){
    const track = await getCurrentPlayingTrack(headers);
    if(track && track.item){
        console.log(track.item);
        let albumPhoto = document.querySelector('#albumPhoto img');
        albumPhoto.src = track.item.album.images[0].url;
        albumPhoto.id = track.item.uri;

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

const home = document.querySelector('#Home');
const showList = document.querySelector('#showlist');
const mainViewBar = document.querySelector('#mainViewBar');
home.addEventListener('click',()=>{
    showList.style.display = 'none';
    mainViewBar.style.display = 'flex';
})

// 收藏和移除专辑
const saveAlbum = document.querySelector("#listPhoto img");
const saveAlbumId = saveAlbum.id;
const liked = document.querySelector('.like');
async function getAlbumSaved(id){
    const config = {
        ids:id,
    }
    const queryParams = new URLSearchParams(config);
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/me/albums?${queryParams}`,
            {
                method:'PUT',
                headers: headers,
                body:{
                    ids:[id],
                }
            }
        );
        const ids = await response.json();
        return ids;
    }catch(error){
        console.log('Request Failed:',error);
    }
}


async function checkAndSaveOrDelete(id){
    const status = await checkIfAlbumSaved(id);
    if(status[0]){
        await getAlbumDelete(id);
        liked.style.backgroundColor = 'rgb(180,180,180,0.5)';
    }else{
        const response = await getAlbumSaved(id);
        liked.style.backgroundColor = 'red';
    }
}

async function getAlbumDelete(id){
    const config = {
        ids:id,
    }
    const queryParams = new URLSearchParams(config);
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/me/albums?${queryParams}`,
            {
                method:'DELETE',
                headers: headers,
                body:{
                    ids:[id],
                }
            }
        );
        const ids = await response.json();
        return ids;
    }catch(error){
        console.log('Request Failed:',error);
    }
}

liked.addEventListener('click',()=>{
    const saveAlbum = document.querySelector("#listPhoto img");
    const saveAlbumId = saveAlbum.id;
    checkAndSaveOrDelete(saveAlbumId);
})

async function fetchPlaylist(id){
    const config = {
        playlist_id:id,
    }
    const queryParams = new URLSearchParams(config);
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/playlists/${id}`,
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

export async function addPlaylistClick(){
    const albums = document.querySelectorAll('#playlist');
    console.log(albums);
    albums.forEach(album => {
        album.addEventListener('dblclick', async() => {
            console.log('click');
            const albumImg = album.querySelector('img');
            if (albumImg && albumImg.id) {
                console.log(albumImg.id);
                const saved = await checkIfAlbumSaved(albumImg.id);
                console.log(saved);
                if(saved[0]){
                    const liked = document.querySelector('.like');
                    liked.style.backgroundColor = 'red';
                }else{
                    const liked = document.querySelector('.like');
                    liked.style.backgroundColor = 'rgb(180,180,180,0.5)';
                }
                const ids = await fetchPlaylist(albumImg.id);
                // console.log(ids.items.map(track => track.uri));
                playTrack(headers,ids.tracks.items.map(track => track.uri));
                showCurrentPlayingTrack(headers);
                clearSongs();
                let i = 1;
                ids.tracks.items.forEach(item =>{
                    createSongBlock(i++,item.track.uri,item.track.name,item.track.artists[0].name,item.track.album.name,`${String(parseInt(item.track.duration_ms/1000/60))}:${
                        String(parseInt(item.track.duration_ms/1000 - parseInt(item.track.duration_ms/1000/60)*60)).padStart(2,'0')}`,item.track.album.images[0].url);
                })
                const listBlock = document.querySelector('#showlist');
                listBlock.style.display = 'flex';
                const mainViewBar = document.querySelector('#mainViewBar');
                mainViewBar.style.display = 'none';
                const listPhoto = document.querySelector('#listPhoto img');
                listPhoto.src = albumImg.src;
                listPhoto.id = albumImg.id;
    
                const listMaker = document.querySelector('.makerAndNumber p');
                listMaker.innerHTML = `${ids.owner.display_name}·${ids.tracks.total}首歌曲`;
    
                const listName = document.querySelector('.listName p');
                listName.innerHTML = ids.name;
                setTimeout(addSongclick,1000);
            } else {
                console.log("No image or ID found in album block.");
            }
        });
    });
}

function addSongclick(){
    const songBlocks = document.querySelectorAll('.singleSongBlock');
    console.log(songBlocks);
    songBlocks.forEach(songBlock =>{
        songBlock.addEventListener('dblclick',()=>{
            const img = songBlock.querySelector('.songPhoto img');
            playTrack(headers,[img.id]);
        })
    })
}
