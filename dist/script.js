/**
 * 탭 전환 함수
 *
 */
var tabLinks = document.getElementsByClassName("tab-links");
var tabContents = document.getElementsByClassName("tab-contents");

function openTab(event, tabName) {
  // 모든 탭 링크에서 active-link 클래스 제거
  for (let tabLink of tabLinks) {
    tabLink.classList.remove("active-link");
  }
  // 모든 탭 내용에서 active-tab 클래스 제거
  for (let tabContent of tabContents) {
    tabContent.classList.remove("active-tab");
  }
  // 현재 클릭된 탭 링크에 active-link 클래스 추가
  event.currentTarget.classList.add("active-link");
  // 클릭된 탭의 내용을 표시하기 위해 active-tab 클래스 추가
  document.getElementById(tabName).classList.add("active-tab");
}

/**
 * 사이드 메뉴 열기/닫기 함수
 *
 */
var sideMenu = document.getElementById("side-menu");

function openMenu() {
  // 사이드 메뉴에 open 클래스 추가
  sideMenu.classList.add("open");
}

function closeMenu() {
  // 사이드 메뉴에서 open 클래스 제거
  sideMenu.classList.remove("open");
}

/**
 * Google Sheets와 연동된 폼 제출 처리
 *
 */
const scriptURL = "<add your own link here>"; // Google App Script의 URL을 추가
const form = document.forms["submit-to-google-sheet"];
const msg = document.getElementById("msg");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  // 폼 데이터를 Google Sheets로 전송
  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) => {
      // 성공 메시지 표시
      msg.innerHTML = "Message sent successfully";
      // 5초 후 메시지 제거
      setTimeout(function () {
        msg.innerHTML = "";
      }, 5000);
      // 폼 리셋
      form.reset();
    })
    .catch((error) => console.error("Error!", error.message));
});

/**
 * p5.js 코드 영역 : 별 효과 추가
 *
 */
let cnv; // 전역 변수 cnv 선언, p5.js의 createCanvas 함수를 통해 생성된 캔버스 객체를 저장하기 위해 사용
let stars = []; // 별들을 저장할 배열

/**
 * 웹페이지가 로딩될 때 한 번 실행
 */
function setup() {
  cnv = createCanvas(windowWidth, windowHeight); // 전체 브라우저의 너비와 높이를 사용해 캔버스 생성 후 cnv 변수에 저장
  cnv.parent("p5Container"); // 생성한 캔버스를 'p5Container'라는 ID를 가진 HTML 요소에 부모로 설정

  noCursor(); // 마우스 커서 숨기기
  // 별 객체를 생성하여 배열에 추가
  for (let i = 0; i < 200; i++) {
    stars.push(new Star());
  }
}

/**
 * 프로그램이 실행되는 동안 지속적으로 실행
 */
function draw() {
  background(0); // 검은색 배경 설정

  // 별들을 그리기
  for (let i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].show();
  }

  // 마우스 위치에 따라 색상이 변하는 원 그리기
  let col = color(mouseX % 255, mouseY % 255, 200);
  fill(col);
  noStroke();
  ellipse(mouseX, mouseY, 80, 80); // 마우스의 위치에 80*80 크기의 원 그리기
}

// 브라우저의 크기가 변경될 때 실행됩니다.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 브라우저의 크기에 맞게 캔버스의 크기 조정
}

/**
 * Star 클래스 정의
 */
class Star {
  constructor() {
    this.x = random(-windowWidth, windowWidth);
    this.y = random(-windowHeight, windowHeight);
    this.z = random(windowWidth);
    this.pz = this.z;
    this.size = random(3, 12); // 별의 크기를 랜덤하게 설정
  }

  // 별의 위치 업데이트
  update() {
    // speed 변수를 사용하여 마우스와 중심 사이의 거리 비례하여 속도를 계산
    let speed = map(
      dist(mouseX, mouseY, width / 2, height / 2),
      0,
      max(width, height),
      2,
      10
    );
    this.z -= speed;

    // 마우스 위치에 따라 별들이 움직이도록 추가
    // angle 변수를 사용하여 마우스 위치와 중심점 사이의 각도를 계산
    let angle = atan2(mouseY - height / 2, mouseX - width / 2);
    this.x += cos(angle) * 2;
    this.y += sin(angle) * 2;

    if (this.z < 1) {
      this.z = windowWidth;
      this.x = random(-windowWidth, windowWidth);
      this.y = random(-windowHeight, windowHeight);
      this.pz = this.z;
    }
  }

  // 별을 화면에 그리기
  show() {
    fill(255);
    noStroke();

    // 현재 별의 위치 계산
    let sx = map(this.x / this.z, 0, 1, 0, windowWidth);
    let sy = map(this.y / this.z, 0, 1, 0, windowHeight);

    // 별의 크기 계산
    let r = map(this.z, 0, windowWidth, this.size, 0);
    ellipse(sx, sy, r, r);

    // 이전 프레임의 별 위치 계산
    let px = map(this.x / this.pz, 0, 1, 0, windowWidth);
    let py = map(this.y / this.pz, 0, 1, 0, windowHeight);

    this.pz = this.z;

    // 별의 이동 경로를 선으로 그리기
    stroke(255);
    line(px, py, sx, sy);
  }
}
