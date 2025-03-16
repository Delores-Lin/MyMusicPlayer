tokenData = JSON.parse(sessionStorage.getItem('tokenData'));

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

access_token = tokenData.access_token;
console.log(access_token);
headers = {
    'Authorization': `Bearer ${access_token}`
}

const lrcText = `[00:00.0]One Call Away - Charlie Puth
[00:00.18]   
[00:00.18]Written by：Breyan Isaac/Justin Franks/Blake Carter/Maureen McDonald/Charlie Puth/Matthew Prime
[00:00.36]   
[00:00.36]I'm only one call away
[00:05.05]你一通电话我便及时出现
[00:05.05]I'll be there to save the day
[00:10.5]我会即刻出现在你身边
[00:10.5]Superman got nothing on me
[00:16.11]就算是超人也很难像我这样及时出现
[00:16.11]I'm only one call away
[00:23.04]你一通电话我便及时出现
[00:23.04]Call me baby if you need a friend
[00:28.29]如果你需要有人相伴 请给我电话
[00:28.29]I just wanna give you love
[00:31.33]我只想给你我所有的爱
[00:31.33]C'mon c'mon c'mon
[00:33.6]打给我吧
[00:33.6]Reaching out to you so take a chance
[00:38.11]我已向你伸出双臂 就请让我爱你
[00:38.11]No matter where you go
[00:40.79]无论你身在何处
[00:40.79]Know you're not alone
[00:42.49]要知道你并不是孤身一人
[00:42.49]I'm only one call away
[00:47.46]你一通电话我便及时出现
[00:47.46]I'll be there to save the day
[00:52.66]我会即刻出现在你身边
[00:52.66]Superman got nothing on me
[00:58.21]就算是超人也很难像我这样及时出现
[00:58.21]I'm only one call away
[01:05.17]你一通电话我便及时出现
[01:05.17]Come along with me and don't be scared
[01:10.49]跟我一起 不要害怕
[01:10.49]I just wanna set you free
[01:13.46]我只想让你自由随心
[01:13.46]C'mon c'mon c'mon
[01:15.67]打给我吧 打给我吧
[01:15.67]You and me can make it anywhere
[01:20.13]你和我 我们能抵达任何地方
[01:20.13]For now we can stay here for a while
[01:25.26]或者就像现在这样 在此时此地自由徜徉
[01:25.26]Cause you know I just wanna see your smile
[01:30.86]因为你知道我只想看见你的笑容
[01:30.86]No matter where you go
[01:33.47]无论你身在何处
[01:33.47]You know you're not alone
[01:35.229996]你要知道你并不是孤身一人
[01:35.229996]I'm only one call away
[01:40.240005]你一通电话我便及时出现
[01:40.240005]I'll be there to save the day
[01:45.4]我会即刻出现在你身边
[01:45.4]Superman got nothing on me
[01:51.04]就算是超人也很难像我这样及时出现
[01:51.04]I'm only one call away
[01:56.32]你一通电话我便及时出现
[01:56.32]And when you're weak I'll be strong
[02:01.55]你脆弱无助时 我会坚强的守护你
[02:01.55]I'm gonna keep holding on
[02:06.85]我会一直坚持
[02:06.85]Now don't you worry it won't be long
[02:11.52]不用担心 悲伤不会漫长
[02:11.52]Darling and when you feel like hope is gone
[02:15.42]亲爱的如果你感觉毫无希望
[02:15.42]Just run into my arms
[02:17.33]请投入我的怀抱
[02:17.33]I'm only one call away
[02:22.15]你一通电话我便及时出现
[02:22.15]I'll be there to save the day
[02:27.66]我会即刻出现在你身边
[02:27.66]Superman got nothing on me
[02:33.37]就算是超人也很难像我这样及时出现
[02:33.37]I'm only one I'm only one call away
[02:43.45999]我会是唯一一个你一通电话我便及时出现
[02:43.45999]I'll be there to save the day
[02:48.76]我会即刻出现在你身边
[02:48.76]Superman got nothing on me
[02:54.44]就算是超人也很难像我这样及时出现
[02:54.44]I'm only one call away
[02:59.65]你一通电话我便及时出现
[02:59.65]I'm only one call away
[03:04.065]你一通电话我便及时出现`;

function parseLRC(lrc) {
    return lrc.split("\n").map(line => {
        const match = line.match(/\[(\d+):(\d+\.\d+)](.*)/);
        if (!match) return null;
        return {
            time: parseInt(match[1]) * 60 + parseFloat(match[2]),
            text: match[3].trim()
        };
    }).filter(line => line !== null);
}

const lyricsData = parseLRC(lrcText);
const lyricsContainer = document.getElementById("songlyrics");

lyricsData.forEach(line => {
    const p = document.createElement("p");
    p.textContent = line.text;
    lyricsContainer.appendChild(p);
});

const lyricElements = document.querySelectorAll(".songlyrics p");

async function getSpotifyPlaybackState() {
    try {
        const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: headers,
        });
        if (response.status === 200) {
            const data = await response.json();
            console.log(data.progress_ms / 1000);
            const photo = document.querySelector('#lyricsPhoto img');
            const lyricsPhoto = document.querySelector('#lyricsPhoto');
            const destphoto = data.item.album.images[0].url;
            if(photo.src != destphoto){
                photo.src = destphoto;
                lyricsPhoto.style.setProperty('--album-background',`url(${destphoto})`);
            }
            return data.progress_ms / 1000;
        }
    } catch (error) {
        console.error("获取 Spotify 播放状态失败:", error);
    }
    return 0;
}

async function syncLyrics() {
    const currentTime = await getSpotifyPlaybackState();

    let activeIndex = 0;
    for (let i = 0; i < lyricsData.length; i++) {
        if (currentTime >= lyricsData[i].time) {
            activeIndex = i;
        }
    }

    lyricElements.forEach((p, index) => {
        p.classList.toggle("highlight", index === activeIndex);
    });
    const lineHeight = lyricElements[0]?.offsetHeight + 10 || 60;
    const initialOffset = lyricsContainer.offsetHeight / 2 - lineHeight / 2;
    const offset = activeIndex * lineHeight - initialOffset ;
    console.log('offset',offset);
    lyricsContainer.style.transform = `translateY(${-offset}px)`;


}

const lineHeight = lyricElements[0]?.offsetHeight  || 60;
const initialOffset = lyricsContainer.offsetHeight  / 2 - lineHeight / 2;
lyricsContainer.style.transform = `translateY(${initialOffset}px)`;

setInterval(syncLyrics, 1000);

// 控制歌词页面
const lyricsPage = document.querySelector('#lyrics');
const albumButton = document.querySelector('#albumPhoto');
albumButton.addEventListener('click',()=>{
    const currentDisplay = window.getComputedStyle(lyricsPage).display;
    if(currentDisplay === 'grid'){
        lyricsPage.style.transform = `translateY(100vh)`;
        setTimeout(()=>{
            lyricsPage.style.display = 'none';
        },300);
    }else{
        lyricsPage.style.transform = `translateY(100vh)`;
        lyricsPage.style.display = 'grid';
        setTimeout(()=>{
            lyricsPage.style.transform = `translateY(0)`;
        },50)
    }
})