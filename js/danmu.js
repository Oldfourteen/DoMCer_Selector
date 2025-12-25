const danmuTexts = [
    "蜀黍不要恰米了，多干点实事",
    "LOL，有本事来训练场单挑",
    "为什么不守家，为什么不守家，为什么不守家",
    "土豆服务器要快爆炸了，航蜀黍能不能花钱买点DDOS高防",
    "趣味生存不能凉啊，呜呜呜",
    "狂笑的蛇将写散文，杀戮光环！rua！反作弊就是dinner啦！reach参数拉满！",
    "666，国服dewier也来了，笑死人了",
    "666 dc 也能封我账号，能不能别神权",
    "为什么不会block in , 挖个床有这么难吗 bro"
];

function createDanmu(text) {
    const container = document.querySelector('.danmu-container');
    const danmu = document.createElement('div');
    danmu.className = 'danmu';
    danmu.textContent = text;

    const containerHeight = container.offsetHeight;
    const top = Math.random() * (containerHeight - 30);
    danmu.style.top = `${top}px`;

    const duration = Math.random() * 6 + 6;
    danmu.style.animationDuration = `${duration}s`;

    container.appendChild(danmu);

    danmu.addEventListener('animationend', () => {
        danmu.remove();
    });
}
setInterval(() => {
    const text = danmuTexts[Math.floor(Math.random() * danmuTexts.length)];
    createDanmu(text);
}, 1800);

setInterval(() => {
    const text = danmuTexts[Math.floor(Math.random() * danmuTexts.length)];
    createDanmu(text);
}, 1200);
