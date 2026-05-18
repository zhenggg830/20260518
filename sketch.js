let handpose;
let video;
let predictions = [];
let gameState = "PLAYING"; // 遊戲狀態

function setup() {
  // 建立與截圖比例相符的畫布
  createCanvas(640, 480);
  
  // 啟動攝影機
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide(); // 隱藏原生 HTML 影片，我們要在畫布上畫

  // 初始化 ml5 handpose
  handpose = ml5.handpose(video, modelReady);

  // 當偵測到手部時，把資料存進 predictions 變數
  handpose.on("predict", results => {
    predictions = results;
  });
}

function modelReady() {
  console.log("模型載入成功！");
}

function draw() {
  // 1. 畫出攝影機畫面 (鏡像處理)
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  // 2. 如果有偵測到手，就畫出骨架
  if (predictions.length > 0) {
    drawKeypoints();
  }

  // 3. 畫出 UI 介面
  drawUI();
}

// 畫出綠色手部骨架 (像截圖那樣)
function drawKeypoints() {
  let prediction = predictions[0];
  let landmarks = prediction.landmarks;

  stroke(0, 255, 150); // 綠色線條
  strokeWeight(3);
  
  // 畫出手指連線 (簡化版：連起指尖與指節)
  for (let i = 0; i < landmarks.length; i++) {
    let [x, y] = landmarks[i];
    fill(255, 0, 0); // 關節點用紅點標示
    noStroke();
    ellipse(width - x, y, 8, 8); // 記得寬度要用 width-x 鏡像回來
  }
}

// 畫出截圖中的提示文字與按鈕
function drawUI() {
  if (gameState === "PLAYING") {
    // 中央提示
    textAlign(CENTER);
    fill(255, 204, 0);
    textSize(32);
    text("請換個手勢：👍", width / 2, height * 0.65);

    // 下方警告標籤
    fill(0, 150);
    noStroke();
    rect(width / 2 - 150, height * 0.75, 300, 40, 20);
    fill(255);
    textSize(16);
    text("⚠️ 這是功能鍵，請比出拳手勢", width / 2, height * 0.75 + 25);
  }

  // 右上角計分板
  fill(0, 150);
  rect(width - 130, 20, 110, 45, 5);
  fill(255);
  textSize(18);
  text("✅ 1勝", width - 75, 50);
}
