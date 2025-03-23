// 加载外部脚本的函数
function loadScript(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

// 初始化地图的函数
function initMap(isChina) {
    if (isChina) {
        document.getElementById('map').style.display = 'none';
    } else {
        document.getElementById('map').style.display = 'block';
        document.getElementById('map').style.border = '1px solid grey'; // 添加边框

        loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyA7gi-FHFUmJ-mmeuCE1Qj4MmQGUiZanfI&language=en", function() {
            var nanjingMedical = {lat: 31.939162484703655, lng: 118.89109699663713};
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: nanjingMedical,
                disableDefaultUI: true, // 禁用所有默认UI控件
                zoomControl: false, // 禁用缩放控件
                mapTypeControl: true, // 启用地图类型控件（地图/卫星）
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                    position: google.maps.ControlPosition.TOP_LEFT
                },
                fullscreenControl: true, // 启用全屏控件
                fullscreenControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                streetViewControl: false, // 禁用街景视图控件
                scaleControl: false // 禁用比例尺控件
            });
            var marker = new google.maps.Marker({
                position: nanjingMedical,
                map: map,
                title: 'Nanjing Medical University'
            });

            // 移除Google的商标和条款链接
            var style = document.createElement('style');
            style.textContent = `
                .gmnoprint a, .gmnoprint span, .gm-style-cc {
                    display: none;
                }
                .gmnoprint div {
                    background: none !important;
                }
            `;
            document.head.appendChild(style);
        });
    }
}

// 获取IP并初始化地图
$.ajax({
    url: 'https://api.ipify.org?format=json',
    dataType: 'json',
    timeout: 5000, // 5秒超时
    success: function(data) {
        console.log("User's IP address is: " + data.ip);
        // 使用IP获取地理位置信息
        $.ajax({
            url: 'https://ipapi.co/' + data.ip + '/json/',
            dataType: 'json',
            timeout: 5000, // 5秒超时
            success: function(locationData) {
                var isChina = locationData.country_code === 'CN';
                var ipInfoElement = document.getElementById('ip-info');
                if (isChina) {
                    ipInfoElement.textContent = `Your current IP is ${data.ip}, located in Chinese Mainland, and Google Maps is not displayed.`;
                } else {
                    ipInfoElement.textContent = `Your current IP is ${data.ip}, located in ${locationData.country_name}, and Google Maps is displayed.`;
                }
                console.log("User is " + (isChina ? "" : "not ") + "from China");
                initMap(isChina);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Failed to get location data");
                document.getElementById('ip-info').textContent = "Unable to retrieve your IP, the map will not be displayed by default";
                initMap(true); // 默认隐藏地图
                document.getElementById('map').style.border = 'none'; // 移除边框
            }
        });
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.error("Failed to get IP address");
        document.getElementById('ip-info').textContent = "Unable to retrieve your IP, the map will not be displayed by default";
        initMap(true); // 默认隐藏地图
    }
});

// 页面内容加载完成后初始化滑动和交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化研究经验图片滑动功能
    const researchCards = document.querySelectorAll('.research-card .image-card');
    
    researchCards.forEach(card => {
        const dots = card.querySelectorAll('.slider-dot');
        const images = card.querySelectorAll('.image');
        const imageWrapper = card.querySelector('.image-wrapper');
        let currentIndex = 0;

        function setActiveImage(index) {
            dots.forEach(d => d.classList.remove('active'));
            images.forEach(img => img.classList.remove('active'));
            dots[index].classList.add('active');
            images[index].classList.add('active');
            currentIndex = index;
        }

        function nextImage() {
            let nextIndex = (currentIndex + 1) % images.length;
            setActiveImage(nextIndex);
        }

        function prevImage() {
            let prevIndex = (currentIndex - 1 + images.length) % images.length;
            setActiveImage(prevIndex);
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => setActiveImage(index));
        });

        card.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            }
        });

        let startX;
        imageWrapper.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });

        imageWrapper.addEventListener('touchend', function(e) {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextImage();
                } else {
                    prevImage();
                }
            }
        });

        imageWrapper.addEventListener('mousedown', function(e) {
            startX = e.clientX;
        });

        imageWrapper.addEventListener('mouseup', function(e) {
            const endX = e.clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextImage();
                } else {
                    prevImage();
                }
            }
        });
    });

    // Skills 部分不需要滑动，使用CSS Grid展示所有技能
    // 确保所有技能都能显示

    // 如果未来需要添加滑动功能，可以考虑重新集成
});
