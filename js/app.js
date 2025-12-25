const btn = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#themeIcon");
const currentTheme = localStorage.getItem("theme");
const title = document.querySelector("title");

//只读的localStorage 
// 属性允许你访问一个Document 源（origin）的对象 Storage；
// 存储的数据将保存在浏览器会话中。localStorage 类似 sessionStorage，
// 但其区别在于：存储在 localStorage 的数据可以长期保留；
// 而当页面会话结束——也就是说，当页面被关闭时，存储在 sessionStorage 的数据会被清除

// ------------------------ 功能区：轮播图 ------------------------

document.addEventListener('DOMContentLoaded', function () {
    const carouselEl = document.querySelector('[data-carousel]');
    if (!carouselEl) return;

    const track = carouselEl.querySelector('.carousel-track');
    const dotsEl = carouselEl.querySelector('.carousel-dots');
    const prevBtn = carouselEl.querySelector('.carousel-btn.prev');
    const nextBtn = carouselEl.querySelector('.carousel-btn.next');
    const uploadInput = document.getElementById('carouselUpload');

    if (!track || !dotsEl) return;

    const createdUrls = [];

    const getSlides = () => Array.from(track.querySelectorAll('.carousel-slide'));
    const normalizeIndex = (index, total) => {
        if (total <= 0) return 0;
        return (index % total + total) % total;
    };

    let currentIndex = 0;
    let timerId = null;
    const intervalMs = 4500;

    const update = () => {
        const slides = getSlides();
        const total = slides.length;
        if (total <= 0) return;
        currentIndex = normalizeIndex(currentIndex, total);
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        const dots = Array.from(dotsEl.querySelectorAll('.carousel-dot'));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    };

    const renderDots = () => {
        const total = getSlides().length;
        dotsEl.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `跳转到第 ${i + 1} 张`);
            dot.addEventListener('click', function () {
                currentIndex = i;
                update();
                startAuto();
            });
            dotsEl.appendChild(dot);
        }
        update();
    };

    const stopAuto = () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    };

    const startAuto = () => {
        stopAuto();
        const total = getSlides().length;
        if (total <= 1) return;
        timerId = setInterval(function () {
            currentIndex = currentIndex + 1;
            update();
        }, intervalMs);
    };

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            currentIndex = currentIndex - 1;
            update();
            startAuto();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            currentIndex = currentIndex + 1;
            update();
            startAuto();
        });
    }

    carouselEl.addEventListener('pointerenter', stopAuto);
    carouselEl.addEventListener('pointerleave', startAuto);
    carouselEl.addEventListener('focusin', stopAuto);
    carouselEl.addEventListener('focusout', startAuto);

    if (uploadInput) {
        uploadInput.addEventListener('change', function () {
            const files = Array.from(uploadInput.files || []);
            if (files.length === 0) return;

            files.forEach(function (file) {
                if (!file.type || !file.type.startsWith('image/')) return;
                const url = URL.createObjectURL(file);
                createdUrls.push(url);

                const slide = document.createElement('div');
                slide.className = 'carousel-slide';

                const img = document.createElement('img');
                img.src = url;
                img.alt = `轮播图 ${getSlides().length + 1}`;

                slide.appendChild(img);
                track.appendChild(slide);
            });

            renderDots();
            update();
            startAuto();
        });
    }

    window.addEventListener('beforeunload', function () {
        createdUrls.forEach(function (url) {
            URL.revokeObjectURL(url);
        });
    });

    renderDots();
    update();
    startAuto();
});

// ------------------------ 功能区：搜索下拉键盘交互 ------------------------
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const searchDropdown = document.getElementById('searchDropdown');

    // 定义可搜索的页面数据
    const searchablePages = [
        { name: '首页', href: 'index.html' },
        { name: '玩家数据查询', href: 'players.html' },
        { name: '公会数据查询', href: 'guild.html' },
        { name: '玩家战绩查询', href: 'record.html' },
        { name: '排行榜', href: 'ranking.html' }
    ];

    // 监听输入事件
    searchInput.addEventListener('input', function () {
        const filter = searchInput.value.toLowerCase();
        searchDropdown.innerHTML = ''; // 清空旧结果

        if (!filter) {
            searchDropdown.style.display = 'none';
            return;
        }

        const filteredPages = searchablePages.filter(page => page.name.toLowerCase().includes(filter));

        if (filteredPages.length > 0) {
            filteredPages.forEach(page => {
                const item = document.createElement('a');
                item.className = 'dropdown-item';
                item.href = page.href;
                item.textContent = page.name;
                searchDropdown.appendChild(item);
            });
            searchDropdown.style.display = 'block';
        } else {
            searchDropdown.style.display = 'none';
        }
    });

    // 点击外部区域关闭下拉框
    document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target)) {
            searchDropdown.style.display = 'none';
        }
    });
});

// ------------------------ 功能区：玩家查询输入回车快捷键 ------------------------
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const searchDropdown = document.getElementById('searchDropdown');
    if (!searchInput || !searchDropdown) return;
    let activeIndex = -1;
    searchDropdown.addEventListener('mouseover', function (e) {
        const items = Array.from(searchDropdown.querySelectorAll('.dropdown-item'));
        const target = e.target.closest('.dropdown-item');
        const idx = items.indexOf(target);
        if (idx >= 0) {
            activeIndex = idx;
            items.forEach(i => i.classList.remove('active'));
            items[activeIndex].classList.add('active');
        }
    });
    searchInput.addEventListener('keydown', function (e) {
        const items = Array.from(searchDropdown.querySelectorAll('.dropdown-item'));
        const visible = searchDropdown.style.display === 'block';
        if (!visible || items.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, items.length - 1);
            items.forEach(i => i.classList.remove('active'));
            items[activeIndex].classList.add('active');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, 0);
            items.forEach(i => i.classList.remove('active'));
            items[activeIndex].classList.add('active');
        } else if (e.key === 'Enter') {
            if (activeIndex >= 0 && items[activeIndex]) {
                e.preventDefault();
                items[activeIndex].click();
            }
        } else if (e.key === 'Escape') {
            searchDropdown.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const nameInput = document.getElementById('playerName');
    const btn = document.getElementById('searchBtn');
    if (nameInput && btn) {
        nameInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') btn.click();
        });
    }
});

// ------------------------ 功能区：主题切换（亮/暗） ------------------------
if (currentTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeIcon.src = "images/moon.png";
} else {
    themeIcon.src = "images/sun.png";
}

btn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");

    let theme = "light";
    if (document.body.classList.contains("dark-theme")) {
        theme = "dark";
        themeIcon.src = "images/moon.png";
    } else {
        themeIcon.src = "images/sun.png";
    }

    localStorage.setItem("theme", theme);
});

// ------------------------ 功能区：导航交互与滚动效果 ------------------------


document.addEventListener('DOMContentLoaded', function () {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    document.body.classList.add('page-loaded');
    const navBar = document.querySelector('.navigationBar');
    const onScroll = () => {
        if (navBar) navBar.classList.toggle('scrolled', window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -10%' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const content = dropdown.querySelector('.dropdown-content');

        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            document.querySelectorAll('.dropdown-content').forEach(item => {
                if (item !== content) {
                    item.style.display = 'none';
                }
            });

            const isVisible = content.style.display === 'block';
            content.style.display = isVisible ? 'none' : 'block';

            const arrow = this.querySelector('.dropdown-arrow');
            arrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
        });

        document.addEventListener('click', function (e) {
            if (!dropdown.contains(e.target)) {
                content.style.display = 'none';
                const arrow = toggle.querySelector('.dropdown-arrow');
                arrow.style.transform = 'rotate(0deg)';
            }
        });

        content.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href.replace('#', ''))) {
            link.classList.add('active');
        }

        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// ------------------------ 功能区：导航当前页高亮 ------------------------


document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = location.pathname.split('/').pop();

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// ------------------------ 功能区：玩家/公会数据查询 ------------------------

const key = "8ea5c1ca-2fc5-4323-84bf-26fe232c20d7";

//获取玩家个人数据

const searchBtnEl = document.getElementById("searchBtn");
if (searchBtnEl) {
    searchBtnEl.addEventListener("click", function () {
        const infoEl = document.getElementById("playerInfo");
        if (!infoEl) return;
        infoEl.style.display = "none";
        const nameInput = document.getElementById("playerName");
        const name = (nameInput ? nameInput.value : "").trim();
        if (!name) {
            infoEl.innerHTML = "<span style='color:red;'>请输入玩家名称！</span>";
            infoEl.style.display = "block";
            return;
        }
        fetch(`https://api.domcer.com/player/getByName?key=${key}&name=${encodeURIComponent(name)}`)
            .then(response => response.json())
            .then(res => {
                if (res.status !== 200 || !res.data) {
                    infoEl.innerHTML = "<span style='color:red;'>未找到该玩家，请检查名称是否正确！</span>";
                    infoEl.style.display = "block";
                    return;
                }
                renderPlayerInfo(res.data);
            })
            .catch(error => {
                infoEl.innerHTML = "<span style='color:red;'>数据获取失败：" + error.message + "</span>";
                infoEl.style.display = "block";
            });
    });
}

function renderPlayerInfo(data) {
    let html = `<ul>
        <li>真实名称：${data.realName}</li>
        <li>大厅等级：${data.networkLevel}</li>
        <li>会员等级：${data.rank}</li>
        <li>玩家UUID：${data.uuid}</li>
        <li>街机硬币：${data.networkCoins}</li>
    </ul>`;
    const infoEl = document.getElementById("playerInfo");
    infoEl.innerHTML = html;
    infoEl.style.display = "block";
}

const searchBtnEl3 = document.getElementById("searchBtn_3");
if (searchBtnEl3) {
    searchBtnEl3.addEventListener("click", function () {
        const infoEl = document.getElementById("playerInfo_3");
        if (!infoEl) return;
        infoEl.style.display = "none";
        const uuidInput = document.getElementById("playerUUID");
        const uuid = (uuidInput ? uuidInput.value : "").trim(); 
        if (!uuid) {
            infoEl.innerHTML = "<span style='color:red;'>请输入玩家UUID！</span>";
            infoEl.style.display = "block";
            return;
        }
        fetch(`https://api.domcer.com/player/getByUuid?key=${key}&uuid=${encodeURIComponent(uuid)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text().then(text => {
                    try {
                        return JSON.parse(text);
                    } catch (e) {
                        throw new Error("服务器返回了非JSON格式的数据");
                    }
                });
            })
            .then(res => {
                if (res.status !== 200 || !res.data) {
                    infoEl.innerHTML = "<span style='color:red;'>未找到该玩家，请检查UUID格式是否正确！</span>";
                    infoEl.style.display = "block";
                    return;
                }
                renderPlayerInfoUUID(res.data);
            })
            .catch(error => {
                console.error("Fetch error:", error);
                infoEl.innerHTML = `<span style='color:red;'>数据获取失败：${error.message}</span>`;
                infoEl.style.display = "block";
            });
    });
}

function renderPlayerInfoUUID(data) {
    let html = `<ul>
        <li>真实名称：${data.realName}</li>
        <li>大厅等级：${data.networkLevel}</li>
        <li>会员等级：${data.rank}</li>
        <li>玩家UUID：${data.uuid}</li>
        <li>街机硬币：${data.networkCoins}</li>
    </ul>`;
    const infoEl = document.getElementById("playerInfo_3");
    if(infoEl){
        infoEl.innerHTML = html;
        infoEl.style.display = "block";
    }
}


//获取玩家公会数据

const searchBtnEl1 = document.getElementById("searchBtn_1");
if (searchBtnEl1) {
    searchBtnEl1.addEventListener('click', function () {
        const infoEl_1 = document.getElementById("playerInfo_1");
        if (!infoEl_1) return;
        infoEl_1.style.display = "none";
        const nameInput = document.getElementById("playerName_1");
        const name = (nameInput ? nameInput.value : "").trim();
        if (!name) {
            infoEl_1.innerHTML = "<span style='color:red;'>请输入玩家名称！</span>";
            infoEl_1.style.display = "block";
            return;
        }
        fetch(`https://api.domcer.com/guild/findByName?key=${key}&name=${encodeURIComponent(name)}`)
            .then(response => response.json())
            .then(res => {
                if (res.status !== 200 || !res.data) {
                    infoEl_1.innerHTML = "<span style='color:red;'>未找到该玩家的公会信息！</span>";
                    infoEl_1.style.display = "block";
                    return;
                }
                renderPlayerGuildId(res.data);
            })
            .catch(error => {
                infoEl_1.innerHTML = "<span style='color:red;'>数据获取失败：" + error.message + "</span>";
                infoEl_1.style.display = "block";
            });
    });
}

function renderPlayerGuildId(data) {
    let html = `<ul>
        <li>公会ID：${data}</li>
    </ul>`;
    const infoEl_1 = document.getElementById("playerInfo_1");
    infoEl_1.innerHTML = html;
    infoEl_1.style.display = "block";
}

const searchBtnEl2 = document.getElementById("searchBtn_2");
if(searchBtnEl2) {
    searchBtnEl2.addEventListener('click', function () {
        const infoEl_1 = document.getElementById("guildInfo_1");
        if (!infoEl_1) return;
        infoEl_1.style.display = "none";
        const nameInput = document.getElementById("guildName_1");
        const name = (nameInput ? nameInput.value : "").trim();
        if (!name) {
            infoEl_1.innerHTML = "<span style='color:red;'>请输入公会UUID！</span>";
            infoEl_1.style.display = "block";
            return;
        }
        fetch(`https://api.domcer.com/guild/getById?key=${key}&id=${encodeURIComponent(name)}`)
        .then(response => response.json())
        .then(res => {
            if(res.status !== 200 || !res.data){
                infoEl_1.innerHTML = "<span style='color:red;'>未找到该公会，请检查UUID是否正确！</span>";
                infoEl_1.style.display = "block";
                return;
            }
            renderGuildInfo(res.data);
        }).catch(error => {
            infoEl_1.innerHTML = "<span style='color:red;'>数据获取失败：" + error.message + "</span>";
            infoEl_1.style.display = "block";
        })
    });
}

function renderGuildInfo(data) {
    // 格式化创建时间
    const createdDate = data.created ? new Date(data.created).toLocaleDateString() : '未知';

    // 处理游戏经验对象：遍历对象并生成列表项
    let gameExpHtml = '';
    if (data.gameExp) {
        gameExpHtml = Object.entries(data.gameExp).map(([game, exp]) => {
            return `<div class="sub-item"><span>${game}:</span> <strong>${exp}</strong></div>`;
        }).join('');
    }

    // 处理成员列表：只显示前5名成员作为示例，或者可以全部列出
    let membersHtml = '';
    if (data.members && data.members.length > 0) {
        membersHtml = data.members.slice(0, 5).map(m => {
            return `<div class="sub-item"><span>${m.rank}:</span> <strong>${m.uuid}</strong> (加入: ${new Date(m.joined).toLocaleDateString()})</div>`;
        }).join('');
        if (data.members.length > 5) {
            membersHtml += `<div class="sub-item">...等共 ${data.members.length} 人</div>`;
        }
    }

    let html = `
    <div class="guild-detail-card">
        <ul class="pf-list">
            <li>公会名称：</span><strong>${data.name || '无'}</strong></li>
            <li>公会ID：</span><strong style="font-size:12px">${data.id}</strong></li>
            <li>会长UUID：</span><strong style="font-size:12px">${data.master}</strong></li>
            <li>等级：</span><strong>Lv.${data.level}</strong></li>
            <li>总经验：</span><strong>${data.exp}</strong></li>
            <li>创建时间：</span><strong>${createdDate}</strong></li>
            <li>描述：</span><strong>${data.description || '暂无描述'}</strong></li>
        </ul>
        
        <div class="guild-sub-section">
            <h4><i class="fa-solid fa-gamepad"></i> 游戏经验分布</h4>
            <div class="sub-list-container">
                ${gameExpHtml || '<div class="no-data">暂无数据</div>'}
            </div>
        </div>

        <div class="guild-sub-section">
            <h4><i class="fa-solid fa-users"></i> 成员列表 (Top 5)</h4>
            <div class="sub-list-container">
                ${membersHtml || '<div class="no-data">暂无成员</div>'}
            </div>
        </div>
    </div>`;
    
    const infoEl_1 = document.getElementById("guildInfo_1");
    infoEl_1.innerHTML = html;
    infoEl_1.style.display = "block";
}

const searchBtn_4 = document.getElementById("SearchBtn_4");
if(searchBtn_4) {
    searchBtn_4.addEventListener('click', function () {
        const infoEl_1 = document.getElementById("recordInfo");
        if (!infoEl_1) return;
        infoEl_1.style.display = "none";
        const nameInput = document.getElementById("recordPlayerName");
        const name = (nameInput ? nameInput.value : "").trim();
        if (!name) {
            infoEl_1.innerHTML = "<span style='color:red;'>请输入玩家UUID！</span>";
            infoEl_1.style.display = "block";
            return;
        }
        fetch(`https://api.domcer.com/stats/getAllStats?key=${key}&uuid=${encodeURIComponent(name)}`)
        .then(response => response.json())
        .then(res => {
            if(res.status !== 200 || !res.data){
                infoEl_1.innerHTML = "<span style='color:red;'>未找到该玩家，请检查UUID是否正确！</span>";
                infoEl_1.style.display = "block";
                return;
            }
            renderPlayerInfoRecord(res.data);
        }).catch(error => {
            infoEl_1.innerHTML = "<span style='color:red;'>数据获取失败：" + error.message + "</span>";
            infoEl_1.style.display = "block";
        })
    });
}

function renderPlayerInfoRecord(data) {
    if (!data.BedWars) {
        renderNoBedWarsData(data);
        return;
    }

    const bw = data.BedWars;

    let html = `
    <div class="player-detail-card">
        <div class="record-header">
            <h3><i class="fa-solid fa-bed"></i> 起床战争数据 (BedWars)</h3>
            <span class="record-tag">等级: ${bw.level || 0}</span>
        </div>

        <div class="record-grid">
            <div class="record-group">
                <h4>综合数据</h4>
                <ul>
                    <li><span>总场次:</span> <strong>${bw.games || 0}</strong></li>
                    <li><span>总胜利:</span> <strong>${bw.wins || 0}</strong></li>
                    <li><span>总败北:</span> <strong>${bw.loses || 0}</strong></li>
                    <li><span>连胜场次:</span> <strong>${bw.winsStreak || 0}</strong></li>
                    <li><span>硬币:</span> <strong>${bw.coins || 0}</strong></li>
                    <li><span>奖励箱:</span> <strong>${bw.chest || 0}</strong></li>
                    <li><span>经验:</span> <strong>${bw.xp || 0}</strong></li>
                </ul>
            </div>

            <div class="record-group">
                <h4>击杀与死亡</h4>
                <ul>
                    <li><span>总击杀:</span> <strong>${bw.kills || 0}</strong></li>
                    <li><span>总死亡:</span> <strong>${bw.deaths || 0}</strong></li>
                    <li><span>K/D 比:</span> <strong>${((bw.kills || 0) / Math.max(1, bw.deaths || 1)).toFixed(2)}</strong></li>
                    <li><span>最终击杀:</span> <strong>${bw.finalKills || 0}</strong></li>
                    <li><span>最终死亡:</span> <strong>${bw.finalDeaths || 0}</strong></li>
                    <li><span>FK/FD 比:</span> <strong>${((bw.finalKills || 0) / Math.max(1, bw.finalDeaths || 1)).toFixed(2)}</strong></li>
                    <li><span>破坏床数:</span> <strong>${bw.bedDestroyed || 0}</strong></li>
                    <li><span>被破床数:</span> <strong>${bw.bedBeenDestroyed || 0}</strong></li>
                </ul>
            </div>

            <div class="record-group">
                <h4>模式细分 (击杀)</h4>
                <ul>
                    <li><span>单人模式:</span> <strong>${bw.kills1 || 0}</strong></li>
                    <li><span>双人模式:</span> <strong>${bw.kills2 || 0}</strong></li>
                    <li><span>四人模式:</span> <strong>${bw.kills4 || 0}</strong></li>
                    <li><span>疾速双人:</span> <strong>${bw.speedkills2 || 0}</strong></li>
                    <li><span>疾速四人:</span> <strong>${bw.speedkills4 || 0}</strong></li>
                </ul>
            </div>

            <div class="record-group">
                <h4>近期表现</h4>
                <ul>
                    <li><span>今日最终击杀:</span> <strong>${bw.finalKillsDaily || 0}</strong></li>
                    <li><span>本周最终击杀:</span> <strong>${bw.finalKillsWeekly || 0}</strong></li>
                    <li><span>今日胜利:</span> <strong>${bw.winsDaily || 0}</strong></li>
                    <li><span>本周胜利:</span> <strong>${bw.winsWeekly || 0}</strong></li>
                </ul>
            </div>
        </div>
    </div>`;

    const infoEl_1 = document.getElementById("recordInfo");
    if (infoEl_1) {
        infoEl_1.innerHTML = html;
        infoEl_1.style.display = "block";
    }
}
function renderNoBedWarsData(data) {
    let html = `
    <div class="player-detail-card">
        <h3>${data.name || data.uuid}</h3>
        <p class="no-data">该玩家暂无起床战争 (BedWars) 数据。</p>
    </div>`;
    const infoEl_1 = document.getElementById("recordInfo");
    if (infoEl_1) {
        infoEl_1.innerHTML = html;
        infoEl_1.style.display = "block";
    }
}

const searchBtn_5 = document.getElementById('searchBtn_5');
if(searchBtn_5){
    searchBtn_5.addEventListener('click', function () {
        const infoEl_2 = document.getElementById("recordInfo_1");
        if (!infoEl_2) return;
        infoEl_2.style.display = "none";
        const nameInput = document.getElementById("recordPlayerName_1");
        const name = (nameInput ? nameInput.value : "").trim();
        if (!name) {
            infoEl_2.innerHTML = "<span style='color:red;'>请输入玩家UUID！</span>";
            infoEl_2.style.display = "block";
            return;
        }
        fetch(`https://api.domcer.com/stats/getAllStats?key=${key}&uuid=${encodeURIComponent(name)}`)
        .then(response => response.json())
        .then(res => {
            if(res.status !== 200 || !res.data){
                infoEl_2.innerHTML = "<span style='color:red;'>未找到该玩家，请检查UUID是否正确！</span>";
                infoEl_2.style.display = "block";
                return;
            }
            renderPlayerInfoRecord_1(res.data);
        }).catch(error => {
            infoEl_2.innerHTML = "<span style='color:red;'>数据获取失败：" + error.message + "</span>";
            infoEl_2.style.display = "block";
        })
    });
}

function renderPlayerInfoRecord_1(data) {
    if (!data.UHC) {
        const infoEl = document.getElementById("recordInfo_1");
        if(infoEl) {
             infoEl.innerHTML = `
            <div class="player-detail-card">
                <h3>${data.name || data.uuid}</h3>
                <p class="no-data">该玩家暂无超级战墙 (UHC) 数据。</p>
            </div>`;
            infoEl.style.display = "block";
        }
        return;
    }

    const uhc = data.UHC;
    
    const kitMap = {
        "ArcherySet": "弓箭手",
        "Ecologist": "生态学家",
        "EnchantingSet": "附魔套装",
        "Farmer": "农夫",
        "Horseman": "骑手",
        "LeatherArmor": "皮革护甲",
        "Looter": "掠夺者",
        "LunchBox": "饭盒",
        "StoneGear": "石制工具",
        "TrapMaster": "陷阱师"
    };

    const kitName = kitMap[uhc.kit] || uhc.kit || "无";

    let html = `
    <div class="player-detail-card">
        <div class="record-header">
            <h3><i class="fa-solid fa-shield-halved"></i> 超级战墙数据 (UHC)</h3>
            <span class="record-tag">职业: ${kitName}</span>
        </div>

        <div class="record-grid">
            <div class="record-group">
                <h4>综合数据</h4>
                <ul>
                    <li><span>总场次:</span> <strong>${uhc.teamGames || 0}</strong></li>
                    <li><span>总胜利:</span> <strong>${uhc.teamWins || 0}</strong></li>
                    <li><span>总败北:</span> <strong>${uhc.teamLoses || 0}</strong></li>
                    <li><span>硬币:</span> <strong>${uhc.coins || 0}</strong></li>
                    <li><span>组队积分:</span> <strong>${uhc.teamXp || 0}</strong></li>
                </ul>
            </div>

            <div class="record-group">
                <h4>击杀与死亡</h4>
                <ul>
                    <li><span>总击杀:</span> <strong>${uhc.teamKills || 0}</strong></li>
                    <li><span>总死亡:</span> <strong>${uhc.teamDeath || 0}</strong></li>
                    <li><span>K/D 比:</span> <strong>${((uhc.teamKills || 0) / Math.max(1, uhc.teamDeath || 1)).toFixed(2)}</strong></li>
                </ul>
            </div>

            <div class="record-group">
                <h4>近期表现</h4>
                <ul>
                    <li><span>本周击杀:</span> <strong>${uhc.teamKillsWeekly || 0}</strong></li>
                    <li><span>本月击杀:</span> <strong>${uhc.teamKillsMonthly || 0}</strong></li>
                    <li><span>本周胜利:</span> <strong>${uhc.teamWinsWeekly || 0}</strong></li>
                    <li><span>本月胜利:</span> <strong>${uhc.teamWinsMonthly || 0}</strong></li>
                </ul>
            </div>
        </div>
    </div>`;

    const infoEl_2 = document.getElementById("recordInfo_1");
    if (infoEl_2) {
        infoEl_2.innerHTML = html;
        infoEl_2.style.display = "block";
    }
}

const searchBtn_6 = document.getElementById('searchBtn_6');
if(searchBtn_6){
    searchBtn_6.addEventListener('click', function () {
        const infoEl_3 = document.getElementById("recordInfo_2");
        if (!infoEl_3) return;
        infoEl_3.style.display = "none";
        const nameInput = document.getElementById("recordPlayerName_2");
        const name = (nameInput ? nameInput.value : "").trim();
        if (!name) {
            infoEl_3.innerHTML = "<span style='color:red;'>请输入玩家UUID！</span>";
            infoEl_3.style.display = "block";
            return;
        }
        fetch(`https://api.domcer.com/stats/getAllStats?key=${key}&uuid=${encodeURIComponent(name)}`)
        .then(response => response.json())
        .then(res => {
            if(res.status !== 200 || !res.data){
                infoEl_3.innerHTML = "<span style='color:red;'>未找到该玩家，请检查UUID是否正确！</span>";
                infoEl_3.style.display = "block";
                return;
            }
            renderPlayerInfoRecord_2(res.data);
        }).catch(error => {
            infoEl_3.innerHTML = "<span style='color:red;'>数据获取失败：" + error.message + "</span>";
            infoEl_3.style.display = "block";
        })
    });
}

function renderPlayerInfoRecord_2(data) {
    if (!data.Bridge) {
         const infoEl = document.getElementById("recordInfo_2");
        if(infoEl) {
             infoEl.innerHTML = `
            <div class="player-detail-card">
                <h3>${data.name || data.uuid}</h3>
                <p class="no-data">该玩家暂无战桥 (Bridge) 数据。</p>
            </div>`;
            infoEl.style.display = "block";
        }
        return;
    }

    const bridge = data.Bridge;

    let html = `
    <div class="player-detail-card">
        <div class="record-header">
            <h3><i class="fa-solid fa-road"></i> 战桥数据 (Bridge)</h3>
            <span class="record-tag">等级: ${bridge.level || 0}</span>
        </div>

        <div class="record-grid">
            <div class="record-group">
                <h4>综合数据</h4>
                <ul>
                    <li><span>等级:</span> <strong>${bridge.level || 0}</strong></li>
                    <li><span>经验:</span> <strong>${bridge.exp || 0}</strong></li>
                    <li><span>硬币:</span> <strong>${bridge.coins || 0}</strong></li>
                </ul>
            </div>
        </div>
    </div>`;

    const infoEl_3 = document.getElementById("recordInfo_2");
    if (infoEl_3) {
        infoEl_3.innerHTML = html;
        infoEl_3.style.display = "block";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const nameInput = document.getElementById('playerName_1');
    const btn = document.getElementById('searchBtn_1');
    if (nameInput && btn) {
        nameInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') btn.click();
        });
    }

    const recordInput = document.getElementById('recordPlayerName');
    const recordBtn = document.getElementById('SearchBtn_4');
    if (recordInput && recordBtn) {
        recordInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') recordBtn.click();
        });
    }
    const uhcInput = document.getElementById('recordPlayerName_1');
    const uhcBtn = document.getElementById('searchBtn_5');
    if (uhcInput && uhcBtn) {
        uhcInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') uhcBtn.click();
        });
    }

    // Bridge查询回车
    const bridgeInput = document.getElementById('recordPlayerName_2');
    const bridgeBtn = document.getElementById('searchBtn_6');
    if (bridgeInput && bridgeBtn) {
        bridgeInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') bridgeBtn.click();
        });
    }
});

// ------------------------ 功能区：公会查询输入回车快捷键 ------------------------

class NavigationManager {
            constructor() {
                this.init();
            }

            init() {
                const currentPage = location.pathname.split('/').pop() || 'index.html';
                $$('.nav-link').forEach(link => {
                    const href = link.getAttribute('href');
                    link.classList.toggle('active', href === currentPage);
                });
            }
        }

// ------------------------ 功能区：导航管理类 ------------------------

(function () {
    const STORAGE_KEY = 'musicPlayerState_v1';
    const POS_KEY = 'musicPlayerPos_v1';
    const DEFAULT_SRC = 'audio/M800000PtlZI2CdSrD.mp3';

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const readState = () => {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    };

    const readPos = () => {
        try {
            const raw = sessionStorage.getItem(POS_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    };

// ----------------------- 功能区：音乐播放器 -------------------------

    const writeState = (audio) => {
        if (!audio) return;
        const src = audio.currentSrc || audio.src || DEFAULT_SRC;
        const payload = {
            src,
            currentTime: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
            volume: Number.isFinite(audio.volume) ? audio.volume : 1,
            playbackRate: Number.isFinite(audio.playbackRate) ? audio.playbackRate : 1,
            loop: !!audio.loop,
            wasPlaying: !audio.paused && !audio.ended
        };
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch {
        }
    };

    const writePos = (container) => {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const payload = { left: rect.left, top: rect.top };
        try {
            sessionStorage.setItem(POS_KEY, JSON.stringify(payload));
        } catch {
        }
    };

    const ensurePlayer = () => {
        let container = document.querySelector('.music-player-float');
        if (!container) {
            container = document.createElement('div');
            container.className = 'music-player-float';
            container.setAttribute('role', 'region');
            container.setAttribute('aria-label', '音乐播放器');

            const header = document.createElement('div');
            header.className = 'music-player-header';
            header.textContent = '音乐播放器';

            const audio = document.createElement('audio');
            audio.controls = true;
            audio.preload = 'auto';
            audio.src = DEFAULT_SRC;

            container.appendChild(header);
            container.appendChild(audio);
            document.body.appendChild(container);
        }

        const audio = container.querySelector('audio');
        if (audio) audio.preload = 'auto';
        if (audio && !audio.src) {
            const source = audio.querySelector('source');
            if (source && source.getAttribute('src')) {
                audio.src = source.getAttribute('src');
            }
        }

        return { container, audio };
    };

    const restore = (audio, state) => {
        if (!audio || !state) return;
        if (state.src && audio.src !== state.src) {
            audio.src = state.src;
        }
        if (Number.isFinite(state.volume)) audio.volume = clamp(state.volume, 0, 1);
        if (Number.isFinite(state.playbackRate)) audio.playbackRate = clamp(state.playbackRate, 0.25, 4);
        if (state.loop != null) audio.loop = !!state.loop;

        const applyTime = () => {
            if (!Number.isFinite(state.currentTime) || state.currentTime <= 0) return;
            try {
                const safeTime = clamp(state.currentTime, 0, Math.max(0, (audio.duration || Infinity) - 0.15));
                audio.currentTime = safeTime;
            } catch {
            }
        };

        if (audio.readyState >= 1) {
            applyTime();
        } else {
            audio.addEventListener('loadedmetadata', applyTime, { once: true });
        }

        if (state.wasPlaying) {
            Promise.resolve()
                .then(() => audio.play())
                .catch(() => {
                });
        }
    };

    const applyPos = (container, pos) => {
        if (!container || !pos) return;
        const rect = container.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const margin = 12;
        const maxX = Math.max(margin, vw - rect.width - margin);
        const maxY = Math.max(80, vh - rect.height - margin);
        const left = clamp(Number(pos.left) || 0, margin, maxX);
        const top = clamp(Number(pos.top) || 0, 80, maxY);

        container.style.right = 'auto';
        container.style.bottom = 'auto';
        container.style.left = `${left}px`;
        container.style.top = `${top}px`;
    };

    const initDraggable = (container) => {
        if (!container) return;

        const savedPos = readPos();
        if (savedPos) applyPos(container, savedPos);

        const handle = container.querySelector('.music-player-header') || container;
        handle.style.touchAction = 'none';

        let dragging = false;
        let pointerId = null;
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;

        const getLeftTopFromRect = () => {
            const rect = container.getBoundingClientRect();
            return { left: rect.left, top: rect.top };
        };

        const clampToViewport = (left, top) => {
            const rect = container.getBoundingClientRect();
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const margin = 12;
            const maxX = Math.max(margin, vw - rect.width - margin);
            const maxY = Math.max(80, vh - rect.height - margin);
            return {
                left: clamp(left, margin, maxX),
                top: clamp(top, 80, maxY)
            };
        };

        const onPointerDown = (e) => {
            if (e.button != null && e.button !== 0) return;
            dragging = true;
            pointerId = e.pointerId;

            const current = getLeftTopFromRect();
            startLeft = parseFloat(container.style.left);
            startTop = parseFloat(container.style.top);
            if (!Number.isFinite(startLeft)) startLeft = current.left;
            if (!Number.isFinite(startTop)) startTop = current.top;

            startX = e.clientX;
            startY = e.clientY;

            container.style.right = 'auto';
            container.style.bottom = 'auto';
            container.style.left = `${startLeft}px`;
            container.style.top = `${startTop}px`;

            if (handle.setPointerCapture) handle.setPointerCapture(pointerId);
            e.preventDefault();
        };

        const onPointerMove = (e) => {
            if (!dragging || (pointerId != null && e.pointerId !== pointerId)) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const next = clampToViewport(startLeft + dx, startTop + dy);
            container.style.left = `${next.left}px`;
            container.style.top = `${next.top}px`;
        };

        const onPointerUpOrCancel = (e) => {
            if (!dragging || (pointerId != null && e.pointerId !== pointerId)) return;
            dragging = false;
            pointerId = null;
            writePos(container);
        };

        handle.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUpOrCancel);
        window.addEventListener('pointercancel', onPointerUpOrCancel);

        window.addEventListener('resize', () => {
            const rect = container.getBoundingClientRect();
            const currentLeft = parseFloat(container.style.left);
            const currentTop = parseFloat(container.style.top);
            const fallback = { left: rect.left, top: rect.top };
            const next = clampToViewport(Number.isFinite(currentLeft) ? currentLeft : fallback.left, Number.isFinite(currentTop) ? currentTop : fallback.top);
            container.style.right = 'auto';
            container.style.bottom = 'auto';
            container.style.left = `${next.left}px`;
            container.style.top = `${next.top}px`;
            writePos(container);
        });
    };

    document.addEventListener('DOMContentLoaded', function () {
        const { container, audio } = ensurePlayer();
        if (!audio) return;

        const formatTime = (sec) => {
            if (!Number.isFinite(sec) || sec < 0) return '0:00';
            const m = Math.floor(sec / 60);
            const s = Math.floor(sec % 60);
            return `${m}:${String(s).padStart(2, '0')}`;
        };

        const buildUI = () => {
            if (container.querySelector('.music-player-controls')) return;
            audio.controls = false;
            const controls = document.createElement('div');
            controls.className = 'music-player-controls';

            const topRow = document.createElement('div');
            topRow.className = 'mp-row';

            const playBtn = document.createElement('button');
            playBtn.type = 'button';
            playBtn.className = 'mp-btn';
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';

            const loopBtn = document.createElement('button');
            loopBtn.type = 'button';
            loopBtn.className = 'mp-btn';
            loopBtn.innerHTML = '<i class="fa-solid fa-repeat"></i>';
            loopBtn.setAttribute('title', '循环播放');
            loopBtn.setAttribute('aria-label', '循环播放');
            loopBtn.setAttribute('aria-pressed', audio.loop ? 'true' : 'false');

            const timeLabel = document.createElement('span');
            timeLabel.className = 'mp-time';
            timeLabel.textContent = '0:00 / 0:00';

            const updateLoopUI = () => {
                loopBtn.classList.toggle('active', !!audio.loop);
                loopBtn.setAttribute('aria-pressed', audio.loop ? 'true' : 'false');
            };

            const leftGroup = document.createElement('div');
            leftGroup.className = 'mp-left';
            loopBtn.style.marginLeft = '15px';
            leftGroup.appendChild(playBtn);
            leftGroup.appendChild(loopBtn);
            topRow.appendChild(leftGroup);
            topRow.appendChild(timeLabel);

            const progressWrap = document.createElement('div');
            progressWrap.className = 'mp-progress';
            const progressBar = document.createElement('div');
            progressBar.className = 'mp-progress-bar';
            const progressFill = document.createElement('div');
            progressFill.className = 'mp-progress-fill';
            progressBar.appendChild(progressFill);
            progressWrap.appendChild(progressBar);

            const volumeWrap = document.createElement('div');
            volumeWrap.className = 'mp-volume';
            const volumeSlider = document.createElement('input');
            volumeSlider.type = 'range';
            volumeSlider.min = '0';
            volumeSlider.max = '1';
            volumeSlider.step = '0.01';
            volumeWrap.appendChild(volumeSlider);

            controls.appendChild(topRow);
            controls.appendChild(progressWrap);
            controls.appendChild(volumeWrap);

            container.appendChild(controls);

            const updatePlayIcon = () => {
                playBtn.innerHTML = audio.paused ? '<i class="fa-solid fa-play"></i>' : '<i class="fa-solid fa-pause"></i>';
            };

            const updateTime = () => {
                const cur = formatTime(audio.currentTime || 0);
                const dur = formatTime(audio.duration || 0);
                timeLabel.textContent = `${cur} / ${dur}`;
                const pct = audio.duration ? Math.min(100, Math.max(0, (audio.currentTime / audio.duration) * 100)) : 0;
                progressFill.style.width = `${pct}%`;
            };

            playBtn.addEventListener('click', () => {
                if (audio.paused) {
                    audio.play().catch(() => {});
                } else {
                    audio.pause();
                }
            });
            loopBtn.addEventListener('click', () => {
                audio.loop = !audio.loop;
                updateLoopUI();
                writeState(audio);
            });
            audio.addEventListener('play', updatePlayIcon);
            audio.addEventListener('pause', updatePlayIcon);
            audio.addEventListener('loadedmetadata', updateTime);
            audio.addEventListener('timeupdate', updateTime);

            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const ratio = Math.min(1, Math.max(0, x / rect.width));
                if (Number.isFinite(audio.duration) && audio.duration > 0) {
                    audio.currentTime = ratio * audio.duration;
                }
            });

            volumeSlider.value = String(Number.isFinite(audio.volume) ? audio.volume : 1);
            volumeSlider.addEventListener('input', () => {
                const v = parseFloat(volumeSlider.value);
                audio.volume = clamp(Number.isFinite(v) ? v : 1, 0, 1);
            });

            updatePlayIcon();
            updateTime();
            updateLoopUI();
        };

        const state = readState();
        restore(audio, state);

        const save = () => writeState(audio);
        ['timeupdate', 'pause', 'play', 'volumechange', 'ratechange', 'ended'].forEach(evt => {
            audio.addEventListener(evt, save);
        });
        window.addEventListener('pagehide', save);
        window.addEventListener('beforeunload', save);

        initDraggable(container);
        buildUI();
    });
})();

// ------------------------ 功能区：起床战争排行榜查询 ------------------------
document.addEventListener('DOMContentLoaded', function() {
    const fetchBtn = document.getElementById('fetch-bedwars-btn');
    const typeSelect = document.getElementById('bedwars-type-select');
    const listContainer = document.getElementById('bedwars-ranking-list');
    
    // 复用已有的 key 变量，如果作用域访问不到则重新定义
    const apiKey = "8ea5c1ca-2fc5-4323-84bf-26fe232c20d7";

    if (fetchBtn && typeSelect && listContainer) {
        // 绑定点击复制事件 (事件委托)
        listContainer.addEventListener('click', function(e) {
            const target = e.target.closest('.clickable-name');
            if (target) {
                const text = target.getAttribute('data-copy');
                if (text) {
                    // 尝试写入剪贴板
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(text).then(() => {
                            showToast(`已复制: ${text}`);
                        }).catch(err => {
                            fallbackCopy(text);
                        });
                    } else {
                        fallbackCopy(text);
                    }
                }
            }
        });

        // 备用复制方案
        function fallbackCopy(text) {
            try {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast(`已复制: ${text}`);
            } catch (err) {
                console.error('复制失败', err);
                showToast('复制失败，请手动复制');
            }
        }

        // 显示 Toast 提示
        function showToast(message) {
            // 移除旧的 toast
            const oldToast = document.querySelector('.toast');
            if (oldToast) oldToast.remove();

            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> <span>${message}</span>`;
            document.body.appendChild(toast);

            // 动画结束后自动移除 (CSS动画是2s)
            setTimeout(() => {
                toast.remove();
            }, 2000);
        }

        fetchBtn.addEventListener('click', function() {
            const type = typeSelect.value;
            if (!type) return;

            listContainer.innerHTML = '<div style="text-align:center; padding: 20px;">正在加载数据...</div>';

            fetch(`https://api.domcer.com/leaderboard/bedwars?key=${apiKey}`)
                .then(response => response.json())
                .then(res => {
                    if (res.status !== 200 || !res.data) {
                        listContainer.innerHTML = `<div style="text-align:center; color:red; padding: 20px;">获取数据失败: ${res.msg || '未知错误'}</div>`;
                        return;
                    }
                    const list = res.data[type];
                    renderRankingTable(list, type);
                })
                .catch(error => {
                    console.error("Fetch error:", error);
                    listContainer.innerHTML = `<div style="text-align:center; color:red; padding: 20px;">网络请求错误: ${error.message}</div>`;
                });
        });
    }

    function renderRankingTable(data, type) {
        if (!Array.isArray(data) || data.length === 0) {
            listContainer.innerHTML = '<div style="text-align:center; padding: 20px;">暂无该榜单数据</div>';
            return;
        }

        let html = `
            <table class="ranking-table">
                <thead>
                    <tr>
                        <th style="width: 60px;">排名</th>
                        <th>玩家</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach((item, index) => {
            // API 返回的数据中包含 rank 字段，或者我们可以直接用 index + 1
            const rank = item.rank || index + 1;
            let rankClass = '';
            if (rank == 1) rankClass = 'rank-1';
            else if (rank == 2) rankClass = 'rank-2';
            else if (rank == 3) rankClass = 'rank-3';

            // API 返回的数值字段通常是 'objective'
            let displayValue = item.objective || item.value || 0;
            const playerName = item.name || item.uuid || '未知玩家';

            html += `
                <tr>
                    <td><span class="rank-num ${rankClass}">${rank}</span></td>
                    <td><span class="clickable-name" data-copy="${playerName}" title="点击复制">${playerName}</span></td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        listContainer.innerHTML = html;
    }
});

//----------------------------------------------------------------------------------

//网络拓扑背景板

(function () {
    const toRGB = (str) => {
        const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
        if (m) return { r: parseInt(m[1], 10), g: parseInt(m[2], 10), b: parseInt(m[3], 10) };
        return { r: 255, g: 255, b: 255 };
    };
    const rgba = (c, a) => `rgba(${c.r},${c.g},${c.b},${a})`;
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
    document.addEventListener('DOMContentLoaded', function () {
        const page = (location.pathname.split('/').pop() || '').toLowerCase();
        if (!['players.html', 'guild.html', 'record.html','ranking.html'].includes(page)) return;
        const containers = Array.from(document.querySelectorAll('main'));
        containers.forEach((container) => {
            const canvas = document.createElement('canvas');
            canvas.className = 'bg-net-canvas';
            container.insertBefore(canvas, container.firstChild);
            const ctx = canvas.getContext('2d');
            let w = 0, h = 0;
            let color = toRGB(getComputedStyle(document.body).color || 'rgb(255,255,255)');
            const refreshColor = () => {
                color = toRGB(getComputedStyle(document.body).color || 'rgb(255,255,255)');
            };
            let nodes = [];
            let hover = false;
            let mx = 0, my = 0;
            let linkDist = 110;
            const baseLink = 110;
            const random = (min, max) => min + Math.random() * (max - min);
            const countByArea = () => {
                const c = Math.floor(Math.min(90, Math.max(28, (w * h) / 18000)));
                return c;
            };
            const resize = () => {
                const rect = container.getBoundingClientRect();
                w = Math.floor(rect.width);
                h = Math.floor(rect.height);
                canvas.width = w;
                canvas.height = h;
            };
            const createNodes = () => {
                const n = countByArea();
                nodes = [];
                for (let i = 0; i < n; i++) {
                    nodes.push({
                        x: random(0, w),
                        y: random(0, h),
                        vx: random(-0.4, 0.4),
                        vy: random(-0.4, 0.4),
                        r: random(1.8, 2.6)
                    });
                }
            };
            const step = () => {
                for (let i = 0; i < nodes.length; i++) {
                    const p = nodes[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < 0 || p.x > w) p.vx *= -1;
                    if (p.y < 0 || p.y > h) p.vy *= -1;
                    p.x = clamp(p.x, 0, w);
                    p.y = clamp(p.y, 0, h);
                    if (!hover && Math.random() < 0.005) {
                        p.vx += random(-0.08, 0.08);
                        p.vy += random(-0.08, 0.08);
                        p.vx = clamp(p.vx, -0.8, 0.8);
                        p.vy = clamp(p.vy, -0.8, 0.8);
                    }
                }
            };
            const draw = () => {
                ctx.clearRect(0, 0, w, h);
                for (let i = 0; i < nodes.length; i++) {
                    for (let j = i + 1; j < nodes.length; j++) {
                        const a = nodes[i], b = nodes[j];
                        const dx = a.x - b.x;
                        const dy = a.y - b.y;
                        const d2 = dx * dx + dy * dy;
                        const d = Math.sqrt(d2);
                        if (d < linkDist) {
                            const alpha = clamp(1 - d / linkDist, 0.08, 0.85) * 0.45;
                            ctx.strokeStyle = rgba(color, alpha);
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(a.x, a.y);
                            ctx.lineTo(b.x, b.y);
                            ctx.stroke();
                        }
                    }
                }
                if (hover) {
                    for (let i = 0; i < nodes.length; i++) {
                        const p = nodes[i];
                        const dx = p.x - mx;
                        const dy = p.y - my;
                        const d = Math.sqrt(dx * dx + dy * dy);
                        if (d < linkDist * 1.1) {
                            const alpha = clamp(1 - d / (linkDist * 1.1), 0.08, 0.85) * 0.6;
                            ctx.strokeStyle = rgba(color, alpha);
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(mx, my);
                            ctx.stroke();
                            p.vx += dx > 0 ? -0.005 : 0.005;
                            p.vy += dy > 0 ? -0.005 : 0.005;
                        }
                    }
                }
                for (let i = 0; i < nodes.length; i++) {
                    const p = nodes[i];
                    ctx.fillStyle = rgba(color, 0.8);
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                }
            };
            const loop = () => {
                step();
                draw();
                rafId = requestAnimationFrame(loop);
            };
            const onEnter = () => {
                hover = true;
                linkDist = 180;
                nodes.forEach((p) => {
                    p.vx *= 0.8;
                    p.vy *= 0.8;
                });
            };
            const onLeave = () => {
                hover = false;
                linkDist = baseLink;
                nodes.forEach((p) => {
                    p.vx = random(-1.2, 1.2);
                    p.vy = random(-1.2, 1.2);
                });
            };
            let rafId = 0;
            resize();
            createNodes();
            loop();
            const bodyEl = document.body;
            const themeBtn = document.getElementById('theme-toggle');
            if (themeBtn) {
                themeBtn.addEventListener('click', () => {
                    setTimeout(refreshColor, 0);
                });
            }
            const observer = new MutationObserver(() => refreshColor());
            observer.observe(bodyEl, { attributes: true, attributeFilter: ['class'] });
            container.addEventListener('mouseenter', onEnter);
            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                mx = e.clientX - rect.left;
                my = e.clientY - rect.top;
            });
            container.addEventListener('mouseleave', onLeave);
            window.addEventListener('resize', () => {
                resize();
                createNodes();
                refreshColor();
            });
            window.addEventListener('pagehide', () => {
                if (rafId) cancelAnimationFrame(rafId);
                observer.disconnect();
            });
        });
    });
})();
