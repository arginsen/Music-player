// 定位文档中标签元素 
// 将选中的元素节点赋给变量 
let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

// 指定全局变量 
let track_index = 0;
let isPlaying = false;
let updateTimer;

// 创建 audio 标签元素
let curr_track = document.createElement('audio');

// 传入一个数组，包含所有歌的所有信息 
let track_list = [
    {
        name: "intro",
        artist: "草東沒有派對",
        image: "image/chounuer.jpg",
        path: "music/1-intro.mp3",
    },
    {
        name: "丑",
        artist: "草東沒有派對",
        image: "image/chounuer.jpg",
        path: "music/2-chou.mp3",
    },
    {
        name: "爛泥",
        artist: "草東沒有派對",
        image: "image/chounuer.jpg",
        path: "music/3-lanni.mp3",
    },
    {
        name: "勇敢的人",
        artist: "草東沒有派對",
        image: "image/chounuer.jpg",
        path: "music/4-yongganderen.mp3",
    },
    {
        name: "大風吹",
        artist: "草東沒有派對",
        image: "image/chounuer.jpg",
        path: "music/5-dafengchui.mp3"
    },
    {
        name: "埃瑪",
        artist: "草東沒有派對",
        image: "image/chounuer.jpg",
        path: "music/6-aima.mp3",
    },
    {
        name: "等",
        artist: "草東沒有派對",
        image: "image/chounuer.jpg",
        path: "music/7-deng.mp3",
    },
    {
        name: "鬼",
        artist: "草東沒有派對",
        image: "image/chounuer.jpg",
        path: "music/8-gui.mp3",
    },
    {
        name: "在",
        artist: "草東沒有派對",
        image: "image/chounuer.jpg",
        path: "music/9-zai.mp3",
    },
    {
        name: "山海",
        artist: "草東沒有派對",
        image: "image/chounuer.jpg",
        path: "music/10-shanhai.mp3"
    },
    {
        name: "我們",
        artist: "草東沒有派對",
        image: "image/chounuer.jpg",
        path: "music/11-women.mp3",
    },
    {
        name: "情歌",
        artist: "草東沒有派對",
        image: "image/chounuer.jpg",
        path: "music/12-qingge.mp3",
    },
    {
        name: "頂樓",
        artist: "草東沒有派對",
        image: "image/chounuer.jpg",
        path: "music/13-dinglou.mp3",
    },
    {
        name: "如常",
        artist: "草東沒有派對",
        image: "image/ruchang.jpg",
        path: "music/1-ruchang.m4a",
    },
];

// 判断机型
let os = function () {
    let ua = navigator.userAgent;
    let isAndroid = /(?:Android)/.test(ua);
    let isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua));
    let isPhone = /(?:iPhone)/.test(ua) && !isTablet;
    let isPc = !isPhone && !isAndroid;
    return {
        isTablet,
        isPhone,
        isPc
    };
}()

let docStyle = document.body.parentElement.style
console.log(document)
// 适配页面
if (os.isTablet) {
    docStyle.fontSize = '12px'
} else if (os.isPc) {
    docStyle.fontSize = '7px'
} else {
    docStyle.fontSize = '15px'
}

// 定义歌曲加载函数
function loadTrack(track_index) {
    // 重置前一首
    clearInterval(updateTimer);
    resetValues();

    // 加载新的轨道，利用 track_index 定位歌曲，在通过 path 获取路径
    curr_track.src = track_list[track_index].path;
    curr_track.load();	// audio 自带的方法

    // 切换一首歌曲，更新其显示信息，封面/歌名/歌手
    track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
    track_name.textContent = track_list[track_index].name;
    track_artist.textContent = track_list[track_index].artist;
    now_playing.textContent = "PLAYING " + (track_index + 1) + " OF " + track_list.length;

    // 设定滑块跟着播放进度来移动，每隔 1000 毫秒更新
    updateTimer = setInterval(seekUpdate, 1000);

    // 添加一个事件侦听器，播放结束时，执行 nextTrack 函数
    curr_track.addEventListener("ended", nextTrack);

    // 切换同时更新背景 
    random_bg_color();
}

// 定义生成随机色背景函数
function random_bg_color() {
    // Get a random number between 64 to 256 
    // (for getting lighter colors) 
    let red = Math.floor(Math.random() * 256) + 64;
    let green = Math.floor(Math.random() * 256) + 64;
    let blue = Math.floor(Math.random() * 256) + 64;

    // Construct a color with the given values 
    let bgColor = "rgb(" + red + ", " + green + ", " + blue + ")"; 

    // Set the background to the new color 
    document.body.style.background = bgColor;
}


// 定义歌曲重置参数的函数
function resetValues() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}


// 定义播放暂停键函数
function playpauseTrack() {
	// 判断当前状态，默认 true 播放，false 暂停
    if (!isPlaying) playTrack();
    else pauseTrack();
}

// 定义播放函数
function playTrack() {
    // 生成的 audio 元素执行 play() 方法
    curr_track.play();
    isPlaying = true;

    // 此时为播放状态，改变按钮图标为暂停，表示当前正在播放
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

// 定义暂停函数
function pauseTrack() {
    // 生成的 audio 元素执行 pause() 方法
    curr_track.pause();
    isPlaying = false;

    // 此时为暂停状态，改变按钮图标为播放，表示点击后播放歌曲
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';;
}

// 定义播放下一首函数
function nextTrack() {
    // 判断当前播放为第几首，如果当前索引没超出总歌曲数，那么索引递增 1
	// 如果是最后一首，设定 track_index 为 0
    if (track_index < track_list.length - 1)
        track_index += 1;
    else track_index = 0;

    // Load and play the new track 
    loadTrack(track_index);
    playTrack();
}

// 定义播放上一首函数
function prevTrack() {
    // 判断当前播放为第几首，如果当前索引大于 0，也就是不为第一首时，递减 1
    // 如果是第一首（索引为 0，那么就跳转到最后一首，）
    if (track_index > 0)
        track_index -= 1;
    else track_index = track_list.length;

    // Load and play the new track 
    loadTrack(track_index);
    playTrack();
}


// 定义一个播放定位函数
function seekTo() {
    // 滑块的值的百分比乘总的持续时间表示当前当前播放进度
    seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}

// 定义一个音量设定函数
function setVolume() {
    // 根据音量滑块百分比来设定当前的音量 
    curr_track.volume = volume_slider.value / 100;
}

// 定义设定进度跳转的函数
function seekUpdate() {
    let seekPosition = 0;

    // 检查当前歌曲时间是不是一个有效数值
	// 如果是则按百分位置比时长计算当前位置
    if (!isNaN(curr_track.duration)) {
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        // 转化播放的时长和总时长，显示成 00:00 样式
        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        // 设定页面进度的显示样式，不够十位的补个 0
        if (currentSeconds < 10) {
            currentSeconds = "0" + currentSeconds;
        }
        if (durationSeconds < 10) {
            durationSeconds = "0" + durationSeconds;
        }
        if (currentMinutes < 10) {
            currentMinutes = "0" + currentMinutes;
        }
        if (durationMinutes < 10) {
            durationMinutes = "0" + durationMinutes;
        }

        // 展示当前的进度时长和总时长，00:00 形式
        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}



// 加载第一首曲子，函数变量会被提前，每次进入页面时曲子索引都为初始设定的 0
loadTrack(track_index);