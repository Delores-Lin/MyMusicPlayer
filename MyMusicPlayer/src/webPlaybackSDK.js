
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
        volume: 0.5
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
    album.addEventListener('click', async() => {
        console.log('click');
        const albumImg = album.querySelector('img'); 
        if (albumImg && albumImg.id) {
            console.log(albumImg.id);
            const ids = await getAlbumTracks(headers, albumImg.id);
            console.log(ids.items.map(track => track.uri));
            playTrack(headers,ids.items.map(track => track.uri));
        } else {
            console.log("No image or ID found in album block.");
        }
    });
});



