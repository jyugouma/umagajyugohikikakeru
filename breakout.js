// ブロック崩しゲーム

// ゲームの状態
let state = {
    gameOver: false, // A-1)  ゲームオーバーしたらtrue
    tick: 0 , //時間経過

    field: {
        w: 500,    // フィールドの幅
        h: 500     // フィールドの高さ
    },
    ball: {
        x: 200,    // ボールのX座標
        y: 250,    // ボールのY座標
        r: 5,      // ボールの半径
        xv: 2,     // ボールのX方向の速度
        yv: 5,     // ボールのY方向の速度
    },
    paddle: {
        x: 210,    // パドルのX座標
        y: 470,    // パドルのY座標
        w: 80,     // パドルの幅
        h: 10,     // パドルの高さ
        xv: 0      // パドルのX方向の速度
    },
    brick: {
        x: 220,    // ブロックのX座標
        y: 130,    // ブロックのY座標
        w: 80,     // ブロックの幅
        h: 50      // ブロックの高さ
    },
    play: false,     // プレイ中ならtrue
    complete: false, // 成功したらtrue
    ctx: null,       // 描画用のコンテキスト
}

function initialize() {
    // Canvasを取得して、状態を描画する
    let canvas = document.getElementById('canvas')
    state.ctx = canvas.getContext("2d")
    draw()

    // 操作用の関数数を登録
    addStartListener()
    addKeyListener()
}

window.onload = initialize

//  状態を描画
//    キャンバスをクリア
//    ボールを描画
//    ブロックを描画
//    パドルを描画
//    終了したらcompleteを表示して、プレイをやめる
function draw() {
    // キャンバスをクリア
    state.ctx.clearRect(0, 0, state.field.w, state.field.h)

    // ボールを描画
    draw_ball()

    // ブロックを描画
    draw_brick()

    // パドルを描画
    draw_paddle()

    // 終了したらcompleteと経過時間を表示して、プレイをやめる
    if (state.complete) {
        draw_complete()
        draw_Time()
        state.play = false
        window.addEventListener("keydown",(e)=>{
            window.location.reload();
    });
    }

    // ゲームオーバーしたら、Game Overを表示して、プレイをやめる
    if (state.gameOver) {
        draw_game_over()
        state.play = false

    }
}

//  ボールを描画
function draw_ball() {
    // パスを開始。ボールを丸(arc)で描画
    state.ctx.beginPath()
    state.ctx.arc(state.ball.x, state.ball.y, state.ball.r, 0, Math.PI * 2, false)
    state.ctx.fillStyle = 'red'
    state.ctx.fill()
}

//  ブロックを描画
function draw_brick() {
    if (state.brick != null) {
        // ブロックを四角(fillRect)で描画
        state.ctx.fillStyle = 'blue'
        state.ctx.fillRect(state.brick.x, state.brick.y, state.brick.w, state.brick.h)
    }
}

//  パドルを描画
function draw_paddle() {
    // パスを開始。パドルを四角(rect)で描画。
    state.ctx.beginPath()
    state.ctx.rect(state.paddle.x, state.paddle.y, state.paddle.w, state.paddle.h)
    state.ctx.fillStyle = 'white'
    state.ctx.fill()
}

//  コンプリートの表示
function draw_complete() {
    state.ctx.font = '48px monospace'
    state.ctx.fillStyle = "pink"
    state.ctx.fillText('Complete', 150, 250)
}

// クリアスコアを表示
function draw_Time(){
    var time = document.getElementById("time");
    time.innerHTML = "スコア：" + state.tick;
}

//  ゲームオーバーの表示
function draw_game_over() {
    state.ctx.font = '48px monospace'
    state.ctx.fillStyle = "white"
    state.ctx.fillText('Game Over', 150, 250)
}

//  スタートボタンを登録する
function addStartListener() {
    let button = window.document.getElementById('start')
    button.addEventListener('click', start)
}

//  スタートボタンが押された時の関数
function start() {
    console.log("スタート")
    
    // プレイ中ならば何もしない
    if (state.play) {
        
        return
    }


    // プレイ中の状態にする
    state.play = true
    
    // 状態をアップデートする
    update()
}

//    状態を更新する
//    ボールの移動
//    ボールの衝突判定
//    ボールと衝突したブロックの削除
//    パドルの移動
function update() {
    setInterval(timer, 1000) //1秒ごとにタイマー機能を呼ぶ
    move_ball() // ボールの移動
    ball()    // ボールの衝突判定
    bricks()  // ボールと衝突したブロックの削除
    paddle()  // パドルの移動

    draw() // 更新した情報を描画する

    // まだプレイ中ならもう一度updateを呼び出して次の処理を行う
    if (state.play) {
        window.requestAnimationFrame(update)
    }
}

// タイマー機能
function timer(){
    state.tick += 1
}

//    ボールの移動
//    ボールのX座標にX方向の速度を加算
//    ボールのY座標にY方向の速度を加算
function move_ball() {
    // ボールの移動
    state.ball.x += state.ball.xv
    state.ball.y += state.ball.yv
}

//    ボールの衝突判定
//    ボールと壁の衝突
//    ボールとパドルの衝突
//    ボールとブロックの衝突
function ball() {
    // ボールと壁の衝突
    hit_ball_on_wall()

    // ボールとパドルの衝突
    hit_ball_on_paddle()

    // ボールとブロックの衝突
    hit_ball_on_brick()
}

//    ボールと壁の衝突
//    左右の枠に衝突したら、左右の方向を反転する
//    上下の枠に衝突したら、上下の方向を反転する
function hit_ball_on_wall() {
    // 左右の枠に衝突したら、左右の方向を反転する
    if (state.ball.x < 0 || state.ball.x > state.field.w) {
        state.ball.xv *= -1
        state.tick *= 2
    }

    // 上下の枠に衝突したら、上下の方向を反転する
    //if (state.ball.y < 0 || state.ball.y > state.field.h) {
    //    state.ball.yv *= -1
    //}

    // 上の枠に衝突したら上下の方向を反転する。下の枠についたらゲームオーバー
    if (state.ball.y < 0) {
        state.ball.yv *= -1
    } else if (state.ball.y > state.field.h) {
        state.gameOver = true
    }
}

// ボールとパドルの衝突
//    パドルに衝突したら、上下の方向を反転
function hit_ball_on_paddle() {
    // パドルに衝突したら、上下の方向を反転
    if (hit(state.paddle)) {
        state.ball.yv *= -1
            // C-1)  パドルに当たる位置によって、x方向の速度を変化させる
            let position = state.ball.x - state.paddle.x - (state.paddle.w / 2)
            state.ball.xv += position/10
    }   
}

//     ボールと、指定された四角形の衝突判定。
//     衝突していれば、true
function hit(rect) {
    // ぶつかっていない状態の判定
    if (state.ball.y + state.ball.r < rect.y ||
        state.ball.y - state.ball.r > rect.y + rect.h ||
        state.ball.x + state.ball.r < rect.x ||
        state.ball.x - state.ball.r > rect.x + rect.w) {
        return false
    }
    return true
}

//     ボールとブロックの衝突
function hit_ball_on_brick() {
    // もしブロックがあれば、衝突判定をする
    if (state.brick != null) {
        if (hit(state.brick)) {
            state.ball.yv *= -1
        }
    }
}

//     衝突ブロックの削除
//     もし、ボールとブロックと衝突していれば、ブロックを消して完了にする
function bricks() {
    // もしブロックがあれば
    if (state.brick != null) {
        // もし、ボールとブロックと衝突していれば
        if (hit(state.brick)) {
            // ブロックを消す
            state.brick = null
            // コンプリートを表示する
            state.complete = true
        }
    }
}

//     パドルの移動
function paddle() {
    state.paddle.x += state.paddle.xv
}

//  キーイベントを登録する
function addKeyListener() {
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)
}

//  キーが押された時に呼び出される関数
function keyDown(e) {
    if (e.key == "ArrowRight") {
        state.paddle.xv = 5  // 右方向への速度を5にする
    } else if (e.key == "ArrowLeft") {
        state.paddle.xv = -5  // 左方向の速度を5にする (-5)
    }
}

//  キーが離された時の関数
function keyUp(e) {
    if (e.key == "ArrowRight" || e.key == "ArrowLeft") {
        state.paddle.xv = 0
    }
}

//　zが押されたらリセット,xが押されたらスタート
document.onkeydown =function reset(e){
    if(e.key == 'z'){
        window.location.reload();
    } else if(e.key =='x'){
        start();
    }

}




console.log("Breakout")

