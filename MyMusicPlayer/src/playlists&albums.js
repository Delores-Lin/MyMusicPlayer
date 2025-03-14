
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
