let table; // 用於存放 CSV 資料
let currentQuestionIndex = 0; // 當前題目索引
let question = ""; // 題目
let options = []; // 選項
let correctAnswer = ""; // 正確答案
let radio; // 選項 (選擇題)
let inputBox; // 文字框 (填空題)
let submitButton; // 按鈕
let result = ""; // 結果訊息
let correctCount = 0; // 答對題數
let incorrectCount = 0; // 答錯題數
let isFillInTheBlank = false; // 是否為填空題

function preload() {
  // 載入 CSV 檔案
  table = loadTable("questions.csv", "csv", "header");
}

function setup() {
  // 產生畫布
  createCanvas(windowWidth, windowHeight);
  background("#b7b7a4");

  // 建立選項 (radio 按鈕)
  radio = createRadio();
  radio.style("width", "auto"); // 自動調整寬度
  radio.style("font-size", "24px"); // 放大選項文字
  radio.style("display", "inline-block"); // 選項排列在同一排
  radio.style("color", "#ddbea9");
  radio.position(windowWidth / 2 - 200, windowHeight / 2);

  // 建立文字框 (填空題)
  inputBox = createInput();
  inputBox.style("font-size", "20px");
  inputBox.position(windowWidth / 2 - 100, windowHeight / 2);
  inputBox.hide(); // 預設隱藏

  // 建立按鈕
  submitButton = createButton("下一題");
  submitButton.style("color", "#ff8500"); // 設定按鈕文字顏色
  submitButton.style("font-size", "20px");
  submitButton.style("border-radius", "50%"); // 設定按鈕為橢圓形
  submitButton.style("padding", "10px 20px"); // 增加內邊距，讓按鈕看起來更像橢圓
  submitButton.style("border", "2px solid #ff8500"); // 設定按鈕外框顏色
  submitButton.position(windowWidth / 2 - 50, windowHeight / 2 + 100);
  submitButton.mousePressed(nextQuestion);

  // 顯示第一題
  loadQuestion();
}

function draw() {
  background("#f7b267");

  // 繪製貓咪形狀
  fill("#ffe8d6");
  noStroke();
  let rectWidth = windowWidth / 2; // 貓咪身體寬度
  let rectHeight = windowHeight / 2; // 貓咪身體高度
  let rectX = (windowWidth - rectWidth) / 2; // 貓咪 X 座標
  let rectY = (windowHeight - rectHeight) / 2; // 貓咪 Y 座標

  // 貓耳朵
  triangle(
    rectX + rectWidth * 0.2, rectY, // 左耳頂點
    rectX + rectWidth * 0.1, rectY + rectHeight * 0.2, // 左耳左下角
    rectX + rectWidth * 0.3, rectY + rectHeight * 0.2 // 左耳右下角
  );
  triangle(
    rectX + rectWidth * 0.8, rectY, // 右耳頂點
    rectX + rectWidth * 0.7, rectY + rectHeight * 0.2, // 右耳左下角
    rectX + rectWidth * 0.9, rectY + rectHeight * 0.2 // 右耳右下角
  );

  // 貓身體 (圓角矩形)
  rect(rectX, rectY + rectHeight * 0.2, rectWidth, rectHeight * 0.8, 20);

  // 動態計算文字大小
  let baseFontSize = min(windowWidth, windowHeight) / 30; // 根據畫布大小調整基準字體大小

  // 顯示題目
  textSize(baseFontSize * 1.5); // 題目字體大小
  fill("#cb997e");
  textAlign(CENTER, CENTER);
  text(question, windowWidth / 2, windowHeight / 2 - 50); // 顯示在貓咪身體內的上方

  // 顯示結果訊息 (縮小文字)
  textSize(baseFontSize); // 答案文字大小縮小回原本的樣子
  fill("#6b705c");
  text(result, windowWidth / 2, windowHeight / 2 + 50); // 顯示在貓咪身體內的下方
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  radio.position(windowWidth / 2 - 200, windowHeight / 2);
  inputBox.position(windowWidth / 2 - 100, windowHeight / 2);
  submitButton.position(windowWidth / 2 - 50, windowHeight / 2 + 100);
}

function loadQuestion() {
  if (currentQuestionIndex < table.getRowCount()) {
    // 確認當前行是否存在
    if (table.getRow(currentQuestionIndex)) {
      question = table.getString(currentQuestionIndex, "question");
      correctAnswer = table.getString(currentQuestionIndex, "answer");

      // 判斷是否為填空題
      isFillInTheBlank = table.getString(currentQuestionIndex, "type") === "fill";

      if (isFillInTheBlank) {
        inputBox.show();
        radio.hide();
      } else {
        inputBox.hide();
        radio.show();

        options = [
          table.getString(currentQuestionIndex, "option1"),
          table.getString(currentQuestionIndex, "option2"),
          table.getString(currentQuestionIndex, "option3"),
          table.getString(currentQuestionIndex, "option4"),
        ];

        radio.html(""); // 清空 radio
        for (let i = 0; i < options.length; i++) {
          radio.option(options[i], options[i]);
        }
      }

      result = "";
    } else {
      console.error("無法取得當前行的資料");
    }
  } else {
    question = `測驗結束！`;
    result = `答對題數：${correctCount}，答錯題數：${incorrectCount}`;
    radio.hide();
    inputBox.hide();
    submitButton.html("再試一次");
    submitButton.mousePressed(restartQuiz);
  }
}

function nextQuestion() {
  if (currentQuestionIndex < table.getRowCount()) {
    // 檢查答案
    let selected;
    if (isFillInTheBlank) {
      selected = inputBox.value(); // 取得文字框的值
      inputBox.value(""); // 清空文字框
    } else {
      selected = radio.value(); // 取得選中的選項
    }

    if (selected === correctAnswer) {
      correctCount++;
      result = "答對了";
    } else {
      incorrectCount++;
      result = "答錯了";
    }

    // 前往下一題
    currentQuestionIndex++;
    setTimeout(loadQuestion, 1000); // 延遲 1 秒顯示下一題
  }
}

function restartQuiz() {
  // 重置測驗
  currentQuestionIndex = 0;
  correctCount = 0;
  incorrectCount = 0;
  radio.show(); // 顯示選項
  inputBox.hide(); // 隱藏文字框
  submitButton.html("下一題");
  submitButton.mousePressed(nextQuestion);
  loadQuestion();
}

