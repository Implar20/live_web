$(function () {
    // websocket connection
    let rdm = Math.floor((Math.random() + 1) * 100)
    let ws = new WebSocket('ws://95gtd5loan.51http.tech/fengwocaijing/livesocket/1/' + rdm)

    // 阿里云 video
    var player = new Aliplayer({
        "id": "player-con",
        "source": "rtmp://play.icanfly.xyz/fengwocaijing/0001?auth_key=1566097024-0-0-8094d1b5de5dca9670a94fa1da5ac662",
        "width": "100%",
        "height": "100%",
        "autoplay": false,
        "isLive": true,
        "cover": "https://dummyimage.com/600x400/c419c4/fff&text=+",
        "rePlay": false,
        "playsinline": true,
        "preload": false,
        "autoPlayDelay": "0",
        "autoPlayDelayDisplayText": "0",
        "loadDataTimeout": "10",
        "language": "zh-cn",
        "controlBarVisibility": "click",
        "showBarTime": 5000,
        "useH5Prism": true
    }, function (player) {
        player._switchLevel = 0;
        console.log("播放器创建了。");
    })

    // 初始化事件
    initEvent()
    
    function initEvent() {
        let inV = $('.in_video')
        let mask = $('.video_mask')
        inV.on('mouseenter', () => {
            mask.show()
        })
        inV.on('mouseleave', () => {
            mask.hide()
        })

        $('.mask_play').click(function () {
            $(this).toggleClass('mask_pause')
        })

        $('.chat_down a').click(function () {
            sendMessage()
        })

        $(document).keydown(function (e) {
            if (e.keyCode == 13) {
                sendMessage()
            }
        })
        $('.chat_upper').delegate('.pic_item', 'click', function() {
            $(this).parent().parent().find('.entry').toggleClass('hide')
            $('.chat_upper').delegate('.entry button', 'click', function() {
                $('.banned').show()
                $('.submit').click(function(e) {
                    $.ajax({
                        url: 'http://95gtd5loan.51http.tech/bilive/live/forbidden/user',
                        type: 'post',
                        dataType: 'json',
                        data: {
                            id:2,
                            time: $('#time option').val()
                        },
                        success() {
                            alert('用户已禁言！')
                            $('.banned').hide()
                        }
                    })
                    $('.entry').addClass('hide')
                })
            })
        })
        
        $('.cancel').click(function() {
            $('.banned').hide()
            $('.entry').addClass('hide')
        })
        $('.icon').click(function() {
            $('.banned').hide()
        })
    }

    // 发送信息
    function sendMessage() {
        let path = 'http://img.fwcaijing.com:9999/adavtar/aratar_99.jpg'
        let value = $('input').val()
        let name = 'niko'
        let id = 1
        if (value == '' || /^\s/i.test(value)) {
            return false    
        }
        let str = `
            <div class="chat_user" id="${ id }">
                <div class="user_pic">
                    <img src="${ path }" class="pic_item">
                </div>
                <div class="entry hide">
                    <div class="entry-trangle"></div>
                    <button>禁言</button>
                </div>
                <div class="user_text">
                    <div class="user_name">${ name }</div>
                    <div class="user_msg_ws">${ value }</div>
                </div>
            </div>
        `
        $('.chat_upper').append(str)
        // 如果 value 存在，就发送信息
        if (value) {
            ws.send([value, path, name, id])
        }
        $('input').val('')
        deleteEle()
        scrollDown()
    }
    // 接受 websocket
    ws.onmessage = (e) => {
        let msg = e.data
        let arr = msg.split(',')
        let str = `
            <div class="chat_user" id="{{ arr[3] }}">
                <div class="user_pic">
                    <img src="${ arr[1]}" alt="">
                </div>
                <div class="user_text">
                    <div class="user_name">${ arr[2]}</div>
                    <div class="user_msg">${ arr[0]}</div>
                </div>
            </div>
        `
        if (msg) {
            $('.chat_upper').append(str)
        }
        deleteEle()
        scrollDown()
    }
    // 超出 删除元素
    function deleteEle() {
        let ele = $('.chat_upper').children()
        if (ele.length > 30) {
            ele.first().remove()
        }
    }
    // 滚动条固定
    function scrollDown() {
        $('.chat_upper').scrollTop($('.chat_upper')[0].scrollHeight)
    }

    window.onunload = function() {
       ws.close()
    }
})