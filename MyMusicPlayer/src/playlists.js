const tokenData = JSON.parse(sessionStorage.getItem('tokenData'));
const access_token = tokenData.access_token;
console.log(access_token);
let headers = {
    'Authorization': `Bearer ${access_token}`
}

const addToPlaylistIcon = document.querySelector('#addToList');

const addToPlaylistPage = document.querySelector('#addToPlaylist');

addToPlaylistIcon.addEventListener('click',()=>{
    addToPlaylistPage.style.transform = `translateY(100vh)`;
    addToPlaylistPage.style.display = 'flex';
    clearListBlock();
    buildListBlock();
    setTimeout(()=>{
        addToPlaylistPage.style.transform = `translateY(0)`;
        const createNewList = document.querySelector('#toCreateNewList');
        const createNewListPage = document.querySelector('#createNewList');
        createNewList.addEventListener('click',()=>{
            createNewListPage.style.display = 'flex';
        })
        const closePage = document.querySelector('#close');
        closePage.addEventListener('click',()=>{
            createNewListPage.style.display = 'none';
        })
    },300);
})
addToPlaylistPage.addEventListener('click',()=>{
    addToPlaylistPage.style.transform = `translateY(100vh)`;
    setTimeout(()=>{
        addToPlaylistPage.style.display = 'none';
    },500);
})

document.querySelector('#allList').addEventListener('click', function(event) {
    event.stopPropagation();
});

document.querySelector('#createNewList').addEventListener('click', function(event) {
    event.stopPropagation();
});
document.querySelector('#toCreateNewList').addEventListener('click', function(event) {
    event.stopPropagation();
});

function addListBlock(imgSrc, listId,listName,checkOrIn) {
    
    const allList = document.getElementById('allList');
    if (!allList) {
        console.error('找不到 #allList 元素');
        return;
    }
    
    // 创建 listBlock 元素并设置其 class 与 id
    const listBlock = document.createElement('div');
    listBlock.className = 'listBlock'; 

    // 创建 listPhoto 元素及其内部的 img 元素
    const listPhoto = document.createElement('div');
    listPhoto.className = 'listPhoto';
    const img = document.createElement('img');
    img.className = 'listImage';
    if (imgSrc) img.src = imgSrc;  // 设置传入的图片地址
    listPhoto.appendChild(img);

    // 创建 p 元素
    const p = document.createElement('p');
    p.innerHTML = listName;

    // 创建 addButton 元素及其内部已知的 img 元素
    const addButton = document.createElement('div');
    addButton.className = 'addButton';
    const addImg = document.createElement('img');
    addImg.id = listId;;
    addImg.src = checkOrIn;
    addButton.appendChild(addImg);

    // 将子元素按顺序添加到 listBlock 中
    listBlock.appendChild(listPhoto);
    listBlock.appendChild(p);
    listBlock.appendChild(addButton);

    // 将创建的 listBlock 添加到 allList 内
    allList.appendChild(listBlock);
}

const userId = sessionStorage.getItem('userId');

async function getUserPlaylists() {
    const config = {
        limit: 5,
        offset: 0,
    }
    const queryParams = new URLSearchParams(config);
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/me/playlists?${queryParams}`,
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

async function addToPlaylist(playlist_id){
    const currentTrack = document.querySelector('#albumPhoto img');
    const config = {
        playlist_id : playlist_id,
        uris:currentTrack.id,
    }
    const queryParams = new URLSearchParams(config);
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?${queryParams}`,
            {
                method:'POST',
                headers: headers,
                body:new URLSearchParams({
                    uris:[currentTrack.id],
                }),
            }
        );
        const playlists = await response.json();
        console.log(response);
        return playlists;
    }catch(error){
        console.log('Request Failed:',error);
    }
}

function clearListBlock() {
    const container = document.querySelector('#allList');
    container.innerHTML = ''; 
}

async function buildListBlock(){
    const playlists = await getUserPlaylists();
    const currentTrack = document.querySelector('#albumPhoto img');
    playlists.items.forEach( async (item)=>{
        const status = await checkIfTrackInPlaylist(currentTrack.id,item.id);
        if (status) {
            await addListBlock(item.images?item.images[0].url:"https://misc.scdn.co/liked-songs/liked-songs-64.png",item.id,item.name,'svg/ok-circle.svg');
        }else{
            await addListBlock(item.images?item.images[0].url:"https://misc.scdn.co/liked-songs/liked-songs-64.png",item.id,item.name,'svg/add.svg');
        }
        const addToListButtons = document.querySelectorAll('.addButton');
        addToListButtons.forEach(addToListButton=>{
            addToListButton.addEventListener('click',async ()=>{
                const add = addToListButton.querySelector('img');
                // console.log('click');
                console.log(add.src);
                if(add.src.includes('svg/add.svg')){
                    await addToPlaylist([add.id]);
                    add.src = 'svg/ok-circle.svg';
                }else{
                    console.log(currentTrack.id);
                    await removeTrackFromPlaylist(currentTrack.id,add.id);
                    add.src = 'svg/add.svg';
                }
            })
        })
    })
}

async function getPlaylistTrackUris(playlist_id){
    const config = {
        playlist_id : playlist_id,
        fields : 'tracks.items(track.uri)',
    }
    const queryParams = new URLSearchParams(config);
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/playlists/${playlist_id}?${queryParams}`,
            {
                method:'GET',
                headers: headers,
            }
        );
        const playlists = await response.json();
        const trackuris = playlists.tracks.items.map(item=>item.track.uri);
        console.log(trackuris);
        return trackuris;
    }catch(error){
        console.log('Request Failed:',error);
    }
}

async function checkIfTrackInPlaylist(track_uri,playlist_id){
    const PlaylistTrackUris = await getPlaylistTrackUris(playlist_id);
    if(PlaylistTrackUris.includes(track_uri)) return true;    
    else return false;
}

async function removeTrackFromPlaylist(track_uri,playlist_id){
    const config = {
        playlist_id : playlist_id,
    }
    const queryParams = new URLSearchParams(config);
    try {
        console.log(track_uri);
        const response = await fetch(
            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            {
                method:'DELETE',
                headers: headers,
                body:JSON.stringify({
                    tracks:[{
                        uri:track_uri,
                    }],
                }),
            }
        );
        const playlists = await response.json();
        console.log(response);
        return playlists;
    }catch(error){
        console.log('Request Failed:',error);
    }
}

async function createPlaylist(playlistName){
    const user_id = sessionStorage.getItem('userId');
    const config = {
        user_id:user_id,
    }
    const queryParams = new URLSearchParams(config);
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/users/${user_id}/playlists/?${queryParams}`,
            {
                method:'POST',
                headers: headers,
                body:JSON.stringify({
                    name:playlistName,
                })
            }
        );
        const result = await response.json();
        if(result.status === 200 ){
            addListBlock("https://misc.scdn.co/liked-songs/liked-songs-64.png",result.id,result.name,'svg/add.svg');
            const add =document.querySelector(`#${result.id}`);
            const currentTrack = document.querySelector('#albumPhoto img');
            addButton.addEventListener('click',async()=>{
                if(add.src === 'svg/add.svg'){
                    await addToPlaylist([add.id]);
                    add.src = 'svg/ok-circle.svg';
                }else{
                    console.log(currentTrack.id);
                    await removeTrackFromPlaylist(currentTrack.id,add.id);
                    add.src = 'svg/add.svg';
                }
            });
        }
        return result;
    }catch(error){
        console.log('Request Failed:',error);
    }
}

// 检测newListName文本
const input = document.querySelector('#newListName');
const confirmButton = document.querySelector('#confirm');
input.addEventListener('input',()=>{
    if(input.value.trim()!==''){
        confirmButton.disabled = false;
        confirmButton.classList.add('enabled');
    }else{
        confirmButton.disabled = true;
    }
})

confirmButton.addEventListener('click',async()=>{
    const result = await createPlaylist(input.value);
    if (result.status === 200){
        alert('创建成功！');
    }
})
input.addEventListener('keypress',async(send)=>{
    if(send.key == 'Enter'){
        const result = await createPlaylist(input.value);
        if (result.status === 200){
            alert('创建成功！');
        }
    }
})