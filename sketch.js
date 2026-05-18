let handpose;
let video;
let predictions = [];
let gameState = "PLAYING"; // PLAYING, RESULT, REPLAY
let userChoice = "";
let computerChoice = "";
let resultText = "";
let score = { win: 0, loss: 0, draw: 0 };
let feedbackMessage = "請出拳...";

const choices = ["✊", "✋", "✌️"];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // 初始化 Handpose 模型
  handpose = ml5.handpose(video, () => console.log("Model Ready!"));

  // 持續追蹤手勢結果
  handpose.on("predict", results => {
    predictions = results;
  });

  video.hide();
  textAlign(CENTER, CENTER);
}

function draw() {
  // 1. 繪製視訊背景 (鏡像處理更直觀)
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  // 2. 繪製手部關鍵點與骨架 (如截圖中的綠線)
  drawHandKeypoints();

  // 3. UI 頂部計分板
  drawScoreBoard();

  // 4. 根據遊戲狀態顯示畫面
  if (gameState === "PLAYING") {
    handleGameLogic();
  } else if (gameState === "REPLAY") {
    drawReplayScreen();
  }
}

function drawHandKeypoints() {
  if (predictions.length > 0) {
    let hand = predictions[0].landmarks;
    stroke(0, 255, 150); // 綠色線條
    strokeWeight(2);
    noFill();
    
    // 這裡可以寫點與點之間的連線邏輯，或單純畫點
    for (let i = 0; i < hand.length; i++) {
      let [x, y] = hand[i];
      ellipse(width - x, y, 8, 8); // 鏡像修正
    }
    
    // 偵測當前手勢並更新提示
    detectGesture(predictions[0]);
  }
}

function detectGesture(prediction) {
  const landmarks = prediction.landmarks;
  // 簡單邏輯判定範例 (需根據指尖與指根高度比較)
  // 這裡建議引用自定義的手勢判斷函式
  let gesture = checkRockPaperScissors(landmarks);
  
  if (gesture === "LIKE") {
    feedbackMessage = "請換個手勢：👍";
  } else {
    feedbackMessage = "✊ 石頭  ✋ 布  ✌️ 剪刀";
  }
}

function drawScoreBoard() {
  fill(0, 150);
  noStroke();
  rect(width - 120, 10, 110, 40, 5);
  fill(255);
  textSize(16);
  text(`✅ ${score.win} 勝  ❌ ${score.loss}`, width - 65, 30);
}

function handleGameLogic() {
  // 顯示中間的提示文字
  fill(255, 204, 0);
  textSize(24);
  text(feedbackMessage, width / 2, height * 0.7);
  
  // 警告提示標籤
  fill(0, 180);
  rect(width/2 - 120, height * 0.8, 240, 30, 15);
  fill(255);
  textSize(14);
  text("⚠️ 這是功能鍵，請比出拳手勢", width/2, height * 0.8 + 15);
}

function drawReplayScreen() {
  // 黑色半透明遮罩
  fill(0, 150);
  rect(0, 0, width, height);

  fill(255);
  textSize(48);
  text("再玩一局？", width / 2, height / 2 - 50);

  // 繪製按鈕 (結束 / 繼續)
  drawButton(width / 2 - 100, height / 2 + 50, "🏠 結束", "#E74C3C");
  drawButton(width / 2 + 100, height / 2 + 50, "🎮 繼續", "#2ECC71");
  
  // 下方小字提示
  textSize(14);
  text("💡 右手比 👍 繼續 · 左手比 👍 結束", width/2, height / 2 + 120);
}

function drawButton(x, y, label, col) {
  fill(col);
  rectMode(CENTER);
  rect(x, y, 120, 50, 25);
  fill(255);
  textSize(18);
  text(label, x, y);
  rectMode(CORNER);
}

// 輔助函式：判斷手勢 (需更精密的座標計算)
function checkRockPaperScissors(landmarks) {
  // 這裡需要撰寫各手指尖端(8, 12, 16, 20)與指根位置的比較
  // 回傳 "ROCK", "PAPER", "SCISSORS", "LIKE"
  return "UNKNOWN";
}
