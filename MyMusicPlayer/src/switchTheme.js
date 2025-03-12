
// 字体颜色
let allP = document.querySelectorAll('p');
let h2 = document.querySelector('h2');

// 主背景颜色
let main = document.querySelector('#main');
let mainView = document.querySelector('#mainView');

// icon等背景颜色
let searchBar = document.querySelector('#searchBar');
let home = document.querySelector('#Home');
let leftMain = document.querySelector('#leftMain');
let repository = document.querySelector('.repository');
let icons = document.querySelectorAll('.icon');
let iconsB = document.querySelectorAll('.iconB');

// 开关改变状态
let slider = document.querySelector('#switchMod');

slider.addEventListener('change',()=>{
    if(slider.checked == false){
        
        allP.forEach(p => p.style.color = 'black');
        h2.style.color = 'black';
        main.style.backgroundColor = 'white';
        mainView.style.backgroundColor = 'rgb(200, 200, 200)';
        
        searchBar.style.backgroundColor = 'rgb(200, 200, 200)';
        home.style.backgroundColor = 'rgb(200, 200, 200)';
        leftMain.style.backgroundColor = 'rgb(200, 200, 200)';
        repository.style.background = 'linear-gradient(rgb(200, 200, 200),rgb(200, 200, 200)80%,rgb(0, 0, 0,0)100%)';

        iconsB.forEach(icon => icon.style.display = 'flex');
        icons.forEach(icon => icon.style.display = 'none');


        slider.checked = false;
    }else{
        allP.forEach(p => p.style.color = 'white');
        h2.style.color = 'white';
        main.style.backgroundColor = '#121212';
        mainView.style.backgroundColor = 'rgb(45, 45, 45,0.5)';

        searchBar.style.backgroundColor = 'rgb(67, 67, 67)';
        home.style.backgroundColor = 'rgb(67, 67, 67)';
        leftMain.style.backgroundColor = 'rgb(67, 67, 67)';
        repository.style.background = 'linear-gradient(rgb(67, 67, 67),rgb(67, 67, 67)80%,rgb(0, 0, 0,0)100%)';
        iconsB.forEach(icon => icon.style.display = 'none');
        icons.forEach(icon => icon.style.display = 'flex');

        slider.checked = true;
    }
})