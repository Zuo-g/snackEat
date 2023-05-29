/* 全局变量 */
var cells = [];
var body_len = 30;/* 界面宽度大小 */
var snackLocal = [[0, 2], [0, 1], [0, 0]];/* 位置 第一个为蛇头，最后一个为蛇尾 */
var direction = "right";/* 初始方向 */
var flag = true;/* 500ms内只能改变一次方向 */
var score;/* 分数 */
console.log(sessionStorage.speed);

/* 初始化界面 */
$(function () {
    for (var i = 0; i < body_len; i++) {
        var tr = $("<tr></tr>");
        $("#table_body").append(tr);
        var line = [];
        for (var j = 0; j < body_len; j++) {
            var td = $("<td></td>");
            tr.attr("x", i);
            td.attr("y", j);
            tr.append(td);
            line.push(td);
        }
        cells.push(line);
    }
    /* 设置初始速度 */
    if (sessionStorage.speed == undefined) {
        sessionStorage.speed = 150;
        $("#level").val("普通版");
    }
    /* 如果是刷新 则执行： */
    if (sessionStorage.flag != undefined) {
        console.log(sessionStorage.speed);
        /* 直接开始 */
        $("#start_game").css("display", "none");
        $("#game_body").css("display", "block");
        t = setInterval(move, sessionStorage.speed);
    }
    /* 难度 */
    switch (sessionStorage.speed) {
        case "200":
            $("#level").val("简易版");
            break;
        case "150":
            $("#level").val("普通版");
            break;
        case "100":
            $("#level").val("高手版");
            break;
        case "50":
            $("#level").val("地狱版");
            break;
    }
})

/* 初始化蛇 */
$(createSnack);

/* 初始化食物 */
$(createFood);

/* 开始移动 */
var t;
// var t = setInterval(move, 100);

/* 添加开始游戏事件 */
$(function () {
    $("#pic").click(function () {
        $("#start_game").css("display", "none");
        $("#game_body").css("display", "block");
        // console.log(sessionStorage.speed);
        t = setInterval(move, 150);
    });
});

/* 添加难度按钮事件 */
$(function () {
    $("#simple").click(function () {
        sessionStorage.speed = 200;
        $("#restart_button")[0].click();/* 刷新页面 */
    });
    $("#normal").click(function () {
        sessionStorage.speed = 150;
        $("#restart_button")[0].click();
    });
    $("#difficulty").click(function () {
        sessionStorage.speed = 100;
        $("#restart_button")[0].click();
    });
    $("#difficultyPlus").click(function () {
        sessionStorage.speed = 50;
        $("#restart_button")[0].click();
    });
});

/* 添加下一关事件 */
$(function () {
    $("#next_button").click(function () {
        switch (sessionStorage.speed) {
            case "200":
                sessionStorage.speed = 150;
                location.replace(location);
                break;
            case "150":
                sessionStorage.speed = 100;
                location.replace(location);
                break;
            case "100":
                sessionStorage.speed = 50;
                location.replace(location);
                break;
        }
    });
});

/* 添加重新开始事件 */
$(function () {
    $("#restart_button").click(function () {
        sessionStorage.flag = "refresh";
        // console.log(sessionStorage.speed);
        // console.log($("#level").val());
        location.replace(location);/* 刷新页面 */
    });
});

/* 键盘改变方向事件 */
$(function () {
    $("body").keydown(function () {
        var key = event.keyCode;
        // console.log(key);
        switch (key) {
            case 37:/* 左 */
                if (direction == "right" || !flag) {
                    return false;
                }
                direction = "left";
                flag = false;/* 改变一次后设置为false */
                break;
            case 38:/* 上 */
                if (direction == "down" || !flag) {
                    return false;
                }
                direction = "up";
                flag = false;
                break;
            case 39:/* 右 */
                if (direction == "left" || !flag) {
                    return false;
                }
                direction = "right";
                flag = false;
                break;
            case 40:/* 下 */
                if (direction == "up" || !flag) {
                    return false;
                }
                direction = "down";
                flag = false;
                break;
            case 80:/* p 暂停 */
                if (t != "") {
                    clearInterval(t);
                    t = "";
                } else {
                    t = setInterval(move, 100);
                }
                break;

        }
    });
});

/* 设置背景颜色方法 */
function setBgColor(local, bgColor) {
    /* 传入坐标与颜色 */
    cells[local[0]][local[1]].css("background-color", bgColor);
    // console.log(cells[local[0]][local[1]].css("background-color"));
}

/* 生成蛇方法 */
function createSnack() {
    /* 身体为黑色 */
    var increment = parseInt(200 / snackLocal.length);
    for (var i = 1; i < snackLocal.length; i++) {
        setBgColor(snackLocal[i], "rgb(0, 0, 0)");
        // setBgColor(snackLocal[i], "rgb("+(i-1)*increment+", "+(i-1)*increment+", "+(i-1)*increment+")");
    }
    /* 头部为红色 */
    setBgColor(snackLocal[0], "rgb(255, 0, 255)");
}

/* 清除蛇方法 */
function clearSnack() {
    for (var i = 0; i < snackLocal.length; i++) {
        setBgColor(snackLocal[i], "");
    }
}

/* 随机生成一个食物方法 */
function createFood() {
    var op = 0;
    for (var i = 0; i < 1; i++) {
        var foodX = parseInt(Math.random() * body_len);
        var foodY = parseInt(Math.random() * body_len);
        if (cells[foodX][foodY].css("background-color") == "rgb(0, 0, 0)") {
            i--;/* 黑色蛇身 */
        } else if (cells[foodX][foodY].css("background-color") == "rgb(255, 0, 255)") {
            i--;/* 紫色蛇头 */
        } else {
            setBgColor([foodX, foodY], "rgb(0, 128, 0)");
            // console.log("foodX:" + foodX + "  foodY:" + foodY);
        }
    }
}

/* 蛇移动方法 */
function move() {
    /* 每次执行设置flag为true表示可以改变方向 */
    flag = true;
    if (isOK()) {/* 如果可以移动则>清除>移动>创建 */
        clearSnack();
        var o = moveAdd();
        if (o == true) {/* 吃到食物先创建蛇再生成新食物 */
            createSnack();
            createFood();
        } else {
            createSnack();
        }
        createSnack();
    } else {
        // alert("游戏结束！");
        $("#game_over").css("z-index", 99);
        $("#game_over").css("opacity", "100%");
        clearInterval(t);
    }
}

/* 判断是否可以移动方法 */
function isOK() {
    /* 根据移动前的蛇头位置取得移动后的位置 */
    var snackX = snackLocal[0][0];
    var snackY = snackLocal[0][1];
    switch (direction) {
        case "right":
            snackY++;/* 横坐标加一  右移 */
            break;
        case "left":
            snackY--;/* 横坐标减一  左移 */
            break;
        case "up":
            snackX--;/* 纵坐标减一  上移 */
            break;
        case "down":
            snackX++;/* 纵坐标加一  下移 */
            break;
    }
    if (snackX < 0 || snackX > body_len - 1) {
        return false;
    }
    if (snackY < 0 || snackY > body_len - 1) {
        return false;
    }
    if (cells[snackX][snackY].css("background-color") == "rgb(0, 0, 0)") {
        return false;
    }
    return true;
}

/* 根据方向改变蛇位置方法 */
function moveAdd() {
    /* 除了蛇头，每一个位置等于前一个位置 */
    for (var i = snackLocal.length - 1; i > 0; i--) {
        snackLocal[i][0] = snackLocal[i - 1][0];
        snackLocal[i][1] = snackLocal[i - 1][1];
    }
    /* 修改蛇头位置 */
    switch (direction) {
        case "right":
            snackLocal[0][1]++;/* 横坐标加一  右移 */
            break;
        case "left":
            snackLocal[0][1]--;/* 横坐标减一  左移 */
            break;
        case "up":
            snackLocal[0][0]--;/* 纵坐标减一  上移 */
            break;
        case "down":
            snackLocal[0][0]++;/* 纵坐标加一  下移 */
            break;
    }
    /* 吃到食物长度加一并返回true */
    var snackX = snackLocal[0][0];
    var snackY = snackLocal[0][1];
    if (cells[snackX][snackY].css("background-color") == "rgb(0, 128, 0)") {
        $("#audio_eat")[0].play();/* 执行音效 */
        snackLocal.push([snackX, snackY]);
        addScore();
        return true;
    }

    return false;
}

/* 得分方法 */
function addScore() {
    score = parseInt($("#score").val());
    score++;
    // var n = parseInt(score / 5);
    speed = 120 - score;/* 每多一分速度加一 */
    clearInterval(t);
    t = setInterval(move, sessionStorage.speed);
    var score_str = "" + score;
    var score_str_len = score_str.length;
    for (var i = 4; i > score_str_len; i--) {
        score_str = '0' + score_str;
    }
    $("#score").val(score_str);
    if (score == 1) {
        if (sessionStorage.speed == "50") {
            $("#win").css("z-index", 99);
            $("#win").css("opacity", "100%");
            $("#next_button").css("height","80");
            $("#next_button").text("恭喜你完成所有关卡");
            // $("#next_button").css("display","none");
            clearInterval(t);
            return;
        }
        $("#win").css("z-index", 99);
        $("#win").css("opacity", "100%");
        clearInterval(t);
        return;
    }
}
