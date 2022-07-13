let options = {
  enableLog: true,
  posFixed: true,
  posAbsolute: true,
  percentEnable: true,
  vhEnable: false,
  lvhEnable: false,
  svhEnable: false,
  dvhEnable: true,
};

const spinner = ["/", "-", "\\", "|"];
let spinnerIx = 0;
let bars = [];

function $(name) {
  return document.querySelector(name);
}

function elem(id) {
  return document.getElementById(id);
}

// boxes
function regenerateBars() {
  let template = elem("templateBar");
  for (let bar of bars) {
    bar.remove();
  }

  let units = [];
  options.vhEnable ? units.push("vh") : null;
  options.lvhEnable ? units.push("lvh") : null;
  options.svhEnable ? units.push("svh") : null;
  options.dvhEnable ? units.push("dvh") : null;
  options.percentEnable ? units.push("%") : null;

  let positions = [];
  options.posFixed ? positions.push("fixed") : null;
  options.posAbsolute ? positions.push("absolute") : null;

//   console.log("units: ", units);
//   console.log("positions: ", positions);

  let h = 28;
  let right = 5;

  bars = [];
  for (let position of positions) {
    let s = 100;
    let l = 80;

    for (let unit of units) {
    //   console.log("unit: ", unit + " | position: ", position);
      s -= 15;
      l -= 8;
      let newBar = template.cloneNode(true);
      newBar.classList.remove("template");
      newBar.style.right = `${right}px`;
      newBar.style.position = position;
      newBar.style.height = `100${unit}`;
      newBar.style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;

      newBar.querySelector(
        ".text"
      ).innerHTML = `100${unit} ${position} <span class="height"></span>`;
      bars.push(newBar);

      elem("barContainer").appendChild(newBar);

      right += 25;
    }
    h = 205;
  }
}

// navBar green height
function updateText() {
  for (let e of bars) {
    e.querySelector(".text .height").innerText = `(${e.clientHeight}px)`;
  }
  //$('.fixedpercent .textfixed').innerText = 'percentage-based position:fixed (' + $('.bar.fixedpercent').clientHeight + 'px)';
  //$('.fixedvh .textfixed').innerText = 'viewport-unit position:fixed (' + $('.bar.fixedvh').clientHeight + 'px)';
  //$('.abspercent .textabs').innerText = 'percentage-based position:absolute (' + $('.bar.abspercent').clientHeight + 'px)';
  //$('.absvh .textabs').innerText = 'viewport-unit position:absolute (' + $('.bar.absvh').clientHeight + 'px)';
  $(".innerHeightLog").innerText =
    "innerHeight: " + window.innerHeight + "px " +
    "innerWidth: " + window.innerWidth + "px "  + spinner[spinnerIx];

  spinnerIx = (spinnerIx + 1) % spinner.length;
//   console.log(spinner.length);
}

function resized() {
  if (options.enableLog) {
    var console = document.getElementById("console");
    console.innerHTML +=
      "*Resize! window.innerHeight: " +
      window.innerHeight +
      ",  documentElement.clientHeight: " +
      document.documentElement.clientHeight +
      "<br>";
  }
  updateText();
}

function openOptions() {
  elem("optPosAbs").checked = options.posAbsolute;
  elem("optPosFixed").checked = options.posFixed;
  elem("optPercent").checked = options.percentEnable;
  elem("optVh").checked = options.vhEnable;
  elem("optLvh").checked = options.lvhEnable;
  elem("optSvh").checked = options.svhEnable;
  elem("optDvh").checked = options.dvhEnable;
  elem("optLogging").checked = options.enableLog;

  const elemOptions = document.getElementById("optionsbox");
  elemOptions.classList.remove("hidden");
}

function closeOptions() {
  const elemOptions = document.getElementById("optionsbox");
  elemOptions.classList.add("hidden");

  readOptions();
  regenerateBars();
}

function readOptions() {
  options.posAbsolute = elem("optPosAbs").checked;
  options.posFixed = elem("optPosFixed").checked;
  options.percentEnable = elem("optPercent").checked;
  options.vhEnable = elem("optVh").checked;
  options.lvhEnable = elem("optLvh").checked;
  options.svhEnable = elem("optSvh").checked;
  options.dvhEnable = elem("optDvh").checked;
  options.enableLog = elem("optLogging").checked;

  window.localStorage.setItem("urlbarsize_options", JSON.stringify(options));
}

var fullscreen = false;

window.addEventListener("load", () => {
  const stored_options_str = window.localStorage.getItem("urlbarsize_options");
  if (stored_options_str) {
    options = JSON.parse(stored_options_str);
  }

  let consoleContainer = elem("consoleContainer");
  let btnClose = elem("btnClose");

  btnClose.addEventListener("click", closeOptions);
  btnOptions.addEventListener("click", openOptions);

  consoleContainer.addEventListener("click", function () {
    fullscreen
      ? document.webkitExitFullscreen()
      : document.documentElement.webkitRequestFullscreen();
    fullscreen = !fullscreen;
  });

  window.visualViewport.addEventListener("resize", () => {
    // if (options.enableLog) {
    //   var console = elem("console");
    //   console.innerHTML += "*VV Resize: " + visualViewport.height + " <br>";
    // }
    updateText();
  });

  regenerateBars();

  updateText();
  setInterval(updateText, 500);
});
