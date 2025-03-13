tokenData = JSON.parse(sessionStorage.getItem('tokenData'));

access_token = tokenData.access_token;
console.log(access_token);
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
        albumsImg[i].src = items[i].images[0].url;
        albums[i].style.setProperty('--album-background',`url(${items[i].images[0].url})`);
        albumsImg[i].id = items[i].id;
        albumsp[i].innerHTML = items[i].name;
    }
}

pushplaylists(headers);

