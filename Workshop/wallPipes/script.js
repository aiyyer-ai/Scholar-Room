//CUSTOMIZABLE VARIABLES//

var debugState = false;
var inputString = `{"base":{"0,0":{"1,0":1,"0,1":1},"1,0":{"2,0":7000,"1,1":1,"0,0":1,"cyan":1},"2,0":{"3,0":14000,"2,1":3000,"1,0":7000,"magenta":1},"3,0":{"4,0":1,"2,0":14000},"4,0":{"5,0":5000,"4,1":1,"3,0":1},"5,0":{"5,1":7000,"4,0":5000,"yellow":1},"0,1":{"0,0":1,"0,2":1},"1,1":{"1,0":1,"2,1":4000},"2,1":{"2,0":3000,"2,2":1,"1,1":4000},"3,1":{"4,1":1,"3,2":1},"4,1":{"4,0":1,"3,1":1},"5,1":{"5,0":7000,"5,2":1},"6,1":{"6,2":1},"0,2":{"0,1":1,"1,2":1,"0,3":1},"1,2":{"2,2":1000,"0,2":1},"2,2":{"2,1":1,"3,2":2000,"2,3":1,"1,2":1000},"3,2":{"3,1":1,"3,3":1,"2,2":2000},"4,2":{"5,2":1,"4,3":1},"5,2":{"5,1":1,"6,2":1,"5,3":6000,"4,2":1},"6,2":{"6,1":1,"5,2":1},"0,3":{"0,2":1,"1,3":1},"1,3":{"1,4":1,"0,3":1},"2,3":{"2,2":1,"2,4":1},"3,3":{"3,2":1,"4,3":1,"3,4":1},"4,3":{"4,2":1,"5,3":5000,"3,3":1},"5,3":{"5,2":6000,"5,4":1,"4,3":5000},"1,4":{"1,3":1},"2,4":{"2,3":1,"3,4":7000},"3,4":{"3,3":1,"2,4":7000},"5,4":{"5,3":1,"white":1},"cyan":{"1,0":1},"magenta":{"2,0":1},"yellow":{"5,0":1},"white":{"5,4":1}},"filters":{"cyan":[],"magenta":[],"yellow":[],"blue":[],"red":[],"green":[],"black":[]}}`;
// var inputString = `{"base":{"0,0":{"1,0":1,"cyan":1},"1,0":{"1,1":1,"0,0":1},"2,0":{"3,0":1,"magenta":1},"3,0":{"4,0":1,"3,1":42000,"2,0":1},"4,0":{"5,0":7000,"3,0":1},"5,0":{"6,0":1,"4,0":7000},"6,0":{"6,1":1,"5,0":1,"yellow":1},"0,1":{"1,1":1,"0,2":1},"1,1":{"1,0":1,"2,1":7000,"0,1":1},"2,1":{"3,1":1,"1,1":7000},"3,1":{"3,0":42000,"4,1":1,"3,2":1000,"2,1":1},"4,1":{"4,2":1000,"3,1":1},"5,1":{"6,1":1,"5,2":1000},"6,1":{"6,0":1,"5,1":1},"0,2":{"0,1":1,"1,2":7000,"0,3":1},"1,2":{"2,2":1,"1,3":1,"0,2":7000},"2,2":{"2,3":1,"1,2":1},"3,2":{"3,1":1000,"4,2":7000,"3,3":1},"4,2":{"4,1":1000,"5,2":1,"3,2":7000},"5,2":{"5,1":1000,"5,3":1,"4,2":1},"0,3":{"0,2":1,"1,3":1000,"0,4":1},"1,3":{"1,2":1,"0,3":1000},"2,3":{"2,2":1,"3,3":1},"3,3":{"3,2":1,"4,3":7000,"2,3":1},"4,3":{"5,3":1000,"3,3":7000,"white":1},"5,3":{"5,2":1,"4,3":1000},"0,4":{"0,3":1},"cyan":{"0,0":1},"magenta":{"2,0":1},"yellow":{"6,0":1},"white":{"4,3":1}},"filters":{"cyan":[],"magenta":[],"yellow":[],"blue":["5,2/5,3"],"red":[],"green":["4,1/4,2"],"black":[]}}`;

var totalRows = 5;
var totalColumns = 7;

var tickSpeed = 700;
var liquidLength = 3;

var endGoal = [`magenta`, `red`, `red`, `green`, `cyan`, `cyan`];
var endColors = [];

//GLOBAL VARIABLES//

var gameArea = document.getElementById(`gameArea`);
var buttonHolder;
var pipesContainer = document.createElement(`div`);
var gridGap = 0;
var squareSize = window.innerWidth / (totalColumns + 2) < window.innerHeight / (totalRows + 2) ? window.innerWidth / (totalColumns + 2) : window.innerHeight / (totalRows + 2);
var directions = {
      0: [0, -1],
      90: [1, 0],
      180: [0, 1],
      270: [-1, 0],
}
var colorNames = {
      cyan: [0, 255, 255],
      magenta: [255, 0, 255],
      yellow: [255, 255, 0],
      blue: [0, 0, 255],
      red: [255, 0, 0],
      green: [0, 255, 0],
      black: [0, 0, 0],
      white: [255, 255, 255],
}
var colorCombos = {
      cyan: [`cyan`],
      magenta: [`magenta`],
      yellow: [`yellow`],
      blue: [`cyan`, `magenta`],
      red: [`magenta`, `yellow`],
      green: [`cyan`, `yellow`],
      black: [`cyan`, `magenta`, `yellow`],
      white: [],
}
var pastPaths = {
      cyan: [],
      magenta: [],
      yellow: [],
};
var futurePaths = {
      cyan: [],
      magenta: [],
      yellow: [],
};
var activePaths = {
      cyan: [],
      magenta: [],
      yellow: [],
};
var timeoutID = undefined;

//FUNCTIONAL CODE//

generatePipes(false);
var timeStart;
window.onload = (event) => {
      //time recording code
      timeStart = Date.now();
      //end time recording code
      //in case I want to make something run at launch
      document.onclick = movementCheck;
      let inventory = window.sessionStorage.getItem(`inventory`);
      if (!inventory) {
            inventory = {
                  scholarDiary: false,
                  faxPaper: false,
                  faxSlip: false,
            };
            window.sessionStorage.setItem(`inventory`, JSON.stringify(inventory));
      } else {
            inventory = JSON.parse(inventory);
      }
      for (item in inventory) {
            enterInventoryEntry(item, inventory[item]);
      }
      const queryString = window.location.search;
      if (queryString.replace("?", "") == 2) {
            inputString = `{"base":{"0,0":{"1,0":1,"cyan":1},"1,0":{"1,1":1,"0,0":1},"2,0":{"3,0":1,"magenta":1},"3,0":{"4,0":1,"3,1":42000,"2,0":1},"4,0":{"5,0":7000,"3,0":1},"5,0":{"6,0":1,"4,0":7000},"6,0":{"6,1":1,"5,0":1,"yellow":1},"0,1":{"1,1":1,"0,2":1},"1,1":{"1,0":1,"2,1":7000,"0,1":1},"2,1":{"3,1":1,"1,1":7000},"3,1":{"3,0":42000,"4,1":1,"3,2":1000,"2,1":1},"4,1":{"4,2":1000,"3,1":1},"5,1":{"6,1":1,"5,2":1000},"6,1":{"6,0":1,"5,1":1},"0,2":{"0,1":1,"1,2":7000,"0,3":1},"1,2":{"2,2":1,"1,3":1,"0,2":7000},"2,2":{"2,3":1,"1,2":1},"3,2":{"3,1":1000,"4,2":7000,"3,3":1},"4,2":{"4,1":1000,"5,2":1,"3,2":7000},"5,2":{"5,1":1000,"5,3":1,"4,2":1},"0,3":{"0,2":1,"1,3":1000,"0,4":1},"1,3":{"1,2":1,"0,3":1000},"2,3":{"2,2":1,"3,3":1},"3,3":{"3,2":1,"4,3":7000,"2,3":1},"4,3":{"5,3":1000,"3,3":7000,"white":1},"5,3":{"5,2":1,"4,3":1000},"0,4":{"0,3":1},"cyan":{"0,0":1},"magenta":{"2,0":1},"yellow":{"6,0":1},"white":{"4,3":1}},"filters":{"cyan":[],"magenta":[],"yellow":[],"blue":["5,2/5,3"],"red":[],"green":["4,1/4,2"],"black":[]}}`;
      }
      document.addEventListener("mousedown", mouseClick);
      typeof window.addEventListener === `undefined` && (window.addEventListener = (e, cb) => window.attachEvent(`on${e}`, cb));
      window.addEventListener(`contextmenu`, (e) => {
            e.preventDefault();
      });

      //changePipeParent();
      makeButtonHolder();

      if (!debugState) {
            loadFromGraphs(inputString);
      }
      else {
            generateDebugPipes();
            generateDebugIntersections();
            generateDebugColorFilters();
            generateDebugEntrances();
            debugButton();
            legendButton();
            tickButtons();
            resetButton();
      }
}

var pauseTimeStart;

function pause() {
      setTimeSpent();
      pauseTimeStart = Date.now();
      let pauseOverlay = document.getElementById(`pauseOverlay`);
      pauseOverlay.style.display = `block`;
}

function unpause() {
      timeStart = Date.now();
      let pauseOverlay = document.getElementById(`pauseOverlay`);
      pauseOverlay.style.display = `none`;
      let pauseTimeEnd = Date.now();
      let pauseTimeSpent = (pauseTimeEnd - pauseTimeStart) / 1000;
      let timing_dict = JSON.parse(window.sessionStorage.getItem(`timeData`));
      if(!timing_dict) {
            timing_dict = {};
      }

      let url_parts = window.location.pathname.split("/");
      url_parts.shift();
      url_parts.pop();

      let timing_dict_level = timing_dict;
      for (url_part of url_parts) {
            if (!(url_part in timing_dict_level)) {
                  timing_dict_level[url_part] = {};
            }
            timing_dict_level = timing_dict_level[url_part];
      }
      if(!timing_dict_level["time_spent_paused"]) {
            timing_dict_level["time_spent_paused"] = 0;
      }
      timing_dict_level["time_spent_paused"] += Math.round(pauseTimeSpent);

      window.sessionStorage.setItem(`timeData`, JSON.stringify(timing_dict));
}

function setTimeSpent() {
      let timeEnd = Date.now();
      let timeSpent = (timeEnd - timeStart) / 1000;
      let timing_dict = JSON.parse(window.sessionStorage.getItem(`timeData`));
      if(!timing_dict) {
            timing_dict = {};
      }

      let url_parts = window.location.pathname.split("/");
      url_parts.shift();
      url_parts.pop();

      let timing_dict_level = timing_dict;
      for (url_part of url_parts) {
            if (!(url_part in timing_dict_level)) {
                  timing_dict_level[url_part] = {};
            }
            timing_dict_level = timing_dict_level[url_part];
      }
      if(!timing_dict_level["time_spent"]) {
            timing_dict_level["time_spent"] = 0;
      }
      timing_dict_level["time_spent"] += Math.round(timeSpent);

      window.sessionStorage.setItem(`timeData`, JSON.stringify(timing_dict));
}

function movementCheck(event) {
      let clickLocation = Object.create(locationObject);
      clickLocation.x = event.clientX;
      clickLocation.y = event.clientY;
      if (Array.from(event.target.classList).includes(`leave`)) {
            setTimeSpent();
            window.location.href = `../index.html`;
      }
}

function pullDownInv(inventoryDiv) {
      if (inventoryDiv.target) {
            inventoryDiv = document.getElementsByClassName(`inventory`)[0];
      }
      inventoryDiv.style.opacity = `100%`;
      inventoryDiv.style.top = 0 + "px";
}

function pullUpInv(inventoryDiv) {
      if (inventoryDiv.target) {
            inventoryDiv = document.getElementsByClassName(`inventory`)[0];
      }
      inventoryDiv.style.opacity = ``;
      inventoryDiv.style.top = ``;
}

function toggleInv(inventoryDiv, event) {
      let clickLocation = Object.create(locationObject);
      clickLocation.x = event.clientX;
      clickLocation.y = event.clientY;
      let clickedItem = overlayCheck(clickLocation, `inventoryItem`)[0];
      if (clickedItem) {
            inventoryDiv.toggled = false;
      }
      if (!inventoryDiv.toggled) {
            inventoryDiv.style.top = 0 + "px";
            inventoryDiv.onmouseover = null;
            inventoryDiv.onmouseout = null;
            inventoryDiv.toggled = true;
      } else {
            inventoryDiv.onmouseover = pullDownInv;
            inventoryDiv.onmouseout = pullUpInv;
            inventoryDiv.toggled = false;
      }
}

function takeItem(div) {
      let item = Array.from(div.classList).filter((classes) => { return classes.includes(`Item`) })[0].replace(`Item`, ``);
      div.style.visibility = `hidden`;
      let inventory = JSON.parse(window.sessionStorage.getItem(`inventory`));
      inventory[item] = true;
      window.sessionStorage.setItem(`inventory`, JSON.stringify(inventory));
      let inventoryDiv = document.getElementsByClassName(`inventory`)[0];
      if (!inventoryDiv.toggled) {
            pullDownInv(inventoryDiv);
            setTimeout(pullUpInv, 800, inventoryDiv);
      }
      enterInventoryEntry(item, inventory[item]);

}

function enterInventoryEntry(item, itemValue) {
      let inventoryDiv = document.getElementsByClassName(`inventory`)[0];
      let inventoryElement = Array.from(inventoryDiv.children).filter((inventoryItem) => { return inventoryItem.id == item })[0];
      if (!inventoryElement) {
            addInv(`${item}`, inventoryDiv, (imgDiv) => {
                  if (imgDiv) {
                        imgDiv.id = item;
                        imgDiv.classList.add(`inventoryItem`);
                        addInv(`${item}Alt`, imgDiv, (altImgDiv) => {
                              if (altImgDiv) {
                                    imgDiv.appendChild(altImgDiv.children[0]);
                                    altImgDiv.remove();
                                    imgDiv.children[0].style.display = `none`;
                                    imgDiv.style.width = imgDiv.children[1].clientHeight * imgDiv.children[1].naturalWidth / imgDiv.children[1].naturalHeight + "px";
                              } else {
                                    imgDiv.style.width = imgDiv.children[0].clientHeight * imgDiv.children[0].naturalWidth / imgDiv.children[0].naturalHeight + "px";
                              }
                              dragElement(imgDiv);
                              changeItemVisibility(item, itemValue);
                        });
                  }
            });
      } else {
            changeItemVisibility(item, itemValue);
      }
      function changeItemVisibility(item, itemValue) {
            inventoryElement = Array.from(inventoryDiv.children).filter((inventoryItem) => { return inventoryItem.id == item })[0];
            if (!itemValue) {
                  inventoryElement.style.display = `none`;
            } else {
                  inventoryElement.style.display = ``;
            }
      }
}

function addInv(src, parentElement, imgCallback) {
      let newImg = new Image();
      newImg.src = `../inventoryItems/${src}.webp`;
      newImg.onerror = () => {
            imgCallback(false);
      };
      newImg.onload = addToPage;
      function addToPage(event) {
            let newDiv = document.createElement(`div`);
            if (parentElement) {
                  parentElement.appendChild(newDiv);
            }
            newDiv.classList.add(`imgcontainer`);
            newDiv.appendChild(this);
            if (imgCallback) {
                  imgCallback(newDiv);
            }
      }
}

function makeButtonHolder() {
      buttonHolder = document.createElement(`div`);
      gameArea.appendChild(buttonHolder);
      buttonHolder.classList.add(`buttonHolder`);
      buttonHolder.id = `buttonHolder`;
      // buttonHolder.style.top = pipesContainer.offsetTop + pipesContainer.clientHeight + (squareSize / 2) - (buttonHolder.clientHeight / 2) + `px`;
      buttonHolder.style.top = 0 + "px";
      buttonHolder.style.left = pipesContainer.offsetLeft - (squareSize * 1.5) + `px`;
}

function changeButtonHolderPosition() {
      buttonHolder.style.left = (pipesContainer.offsetLeft - buttonHolder.clientWidth) / 2 + `px`;
      buttonHolder.style.width = buttonHolder.clientWidth + "px";
      buttonHolder.style.height = buttonHolder.children[0].clientHeight + 20 + "px";
      buttonHolder.style.top = (window.innerHeight - buttonHolder.clientHeight) / 2 + "px";
      let buttonNames = {
            tickButtonBack: `←`,
            tickButtonFront: `→`,
            resetButton: `RESET`,
            mainButton: `START`
      }
      for (let button of Array.from(buttonHolder.children)) {
            let underText = document.createElement(`div`);
            underText.classList.add(`underText`);
            underText.style.width = button.clientWidth + "px";
            underText.innerHTML = buttonNames[button.id];
            underText.style.fontSize = 20 + "px";
            buttonHolder.appendChild(underText);
      }
}

function startButton(graph) {
      let startButton = document.createElement(`button`);
      startButton.classList.add(`startButton`);
      buttonHolder.appendChild(startButton);
      //startButton.style.left = pipesContainer.offsetLeft + pipesContainer.clientWidth + (squareSize / 2) - (startButton.clientWidth / 2) + `px`;
      //startButton.style.top = (window.innerHeight / 2) - (startButton.clientHeight / 2) + `px`;
      //startButton.style.left = window.innerWidth / 2 - startButton.clientWidth / 2 + "px";
      startButton.style.left = window.innerWidth / 2 - startButton.clientWidth / 2 + (startButton.clientWidth * 1.25) + "px";
      startButton.style.top = pipesContainer.offsetTop + pipesContainer.clientHeight + (squareSize / 2) - (startButton.clientHeight / 2) + `px`;
      // startButton.innerHTML = `START`;
      startButton.style.fontSize = 20 + "px";
      startButton.id = `mainButton`;
      startButton.storedGraph = graph;
      startButton.onclick = runLiquids;
}

function uploadButton() {
      let uploadButton = document.createElement(`button`);
      uploadButton.classList.add(`startButton`);
      let uploadHolder = document.createElement(`div`);
      uploadHolder.classList.add(`uploadHolder`);
      gameArea.appendChild(uploadHolder);
      let boxHolder = document.getElementById(`boxHolder`);
      uploadHolder.style.left = (window.innerWidth - boxHolder.offsetLeft) / 2 + boxHolder.offsetLeft + "px";
      uploadHolder.appendChild(uploadButton);
      uploadButton.id = `uploadButton`;
      uploadButton.onclick = uploadLiquids;
      let underText = document.createElement(`div`);
      underText.classList.add(`underText`);
      underText.style.width = uploadButton.clientWidth + "px";
      underText.innerHTML = `UPLOAD`;
      underText.style.fontSize = 20 + "px";
      uploadHolder.appendChild(underText);
}

function uploadLiquids() {
      let workshopData =  window.sessionStorage.getItem(`workshopData`);
      if(!workshopData) {
            workshopData = {
                  voltage: [false, false, false],
                  temperature: false,
                  pipes: false,
            }
            window.sessionStorage.setItem(`workshopData`, JSON.stringify(workshopData));
      } else {
            workshopData = JSON.parse(workshopData);
      }
      if(arraysEqual(endColors, endGoal)) {
            workshopData[`pipes`] = true;
            window.sessionStorage.setItem(`workshopData`, JSON.stringify(workshopData));
      } else {
            workshopData[`pipes`] = false;
            window.sessionStorage.setItem(`workshopData`, JSON.stringify(workshopData));
      }
}

function resetButton() {
      let resetButton = document.createElement(`button`);
      resetButton.classList.add(`startButton`);
      buttonHolder.insertBefore(resetButton, document.getElementById('mainButton'));
      resetButton.style.left = window.innerWidth / 2 - resetButton.clientWidth / 2 + (resetButton.clientWidth * -1.25) + "px";
      resetButton.style.top = pipesContainer.offsetTop + pipesContainer.clientHeight + (squareSize / 2) - (resetButton.clientHeight / 2) + `px`;
      // resetButton.innerHTML = `RESET`;
      resetButton.style.fontSize = 20 + "px";
      resetButton.id = `resetButton`;
      resetButton.onclick = resetLiquids;
}


function debugButton() {
      let debugButton = document.createElement(`button`);
      debugButton.classList.add(`startButton`);
      buttonHolder.appendChild(debugButton);
      debugButton.innerHTML = `DEBUG`;
      debugButton.style.fontSize = debugButton.clientHeight * 0.7 + "px";
      debugButton.id = `mainButton`;
      debugButton.onclick = runLiquids;
}

function legendButton() {
      let legendButton = document.createElement(`button`);
      legendButton.classList.add(`startButton`);
      buttonHolder.appendChild(legendButton);
      legendButton.innerHTML = `PATH`;
      legendButton.style.fontSize = legendButton.clientHeight * 0.7 + "px";
      legendButton.id = `legendButton`;
      legendButton.onclick = showDebugPath;
}


function tickButtons(allGraphs) {
      for (i = -1; i < 2; i += 2) {
            let tickButton = document.createElement(`button`);
            tickButton.classList.add(`startButton`);
            if (i == 1) {
                  buttonHolder.insertBefore(tickButton, document.getElementById('mainButton'));
                  tickButton.id = `tickButtonBack`;
                  tickButton.onclick = backwardTick;
                  // tickButton.innerHTML = `←`;
            } else {
                  buttonHolder.appendChild(tickButton);
                  tickButton.id = `tickButtonFront`;
                  tickButton.onclick = forwardTick;
                  if (allGraphs) {
                        tickButton.storedGraph = allGraphs;
                  }
                  // tickButton.innerHTML = `→`;
            }
            tickButton.style.fontSize = 20 + "px";
      }
}

function backwardTick() {
      liquidStep(`back`);
}

function forwardTick() {
      let emptyPath = true;
      for ([key, value] of Object.entries(activePaths)) {
            if (activePaths[key].filter((value) => { return value != undefined })[0] || futurePaths[key].filter((value) => { return value != undefined })[0] || pastPaths[key].filter((value) => { return value != undefined })[0]) {
                  emptyPath = false;
            }
      }
      if (emptyPath) {
            if (this.storedGraph) {
                  initializeLiquids(this.storedGraph);
            } else {
                  initializeLiquids();
            }
      }
      liquidStep(`next`);
}

function exportGraph(event) {
      let graph = makeGraph();
      Array.from(document.querySelectorAll(`.pipe`)).forEach((pipe) => {
            graph = convertFromPipes(pipe, graph);
      });
      Array.from(document.querySelectorAll(`.intersection`)).forEach((intersection) => {
            graph = setGraphNode(graph, intersection);
      });
      let allColorGraphs = {};
      allColorGraphs[`base`] = JSON.parse(JSON.stringify(graph));
      allColorGraphs[`filters`] = {
            cyan: [],
            magenta: [],
            yellow: [],
            blue: [],
            red: [],
            green: [],
            black: [],
      };
      Array.from(document.querySelectorAll(`.colorFilter`)).forEach((colorFilter) => {
            allColorGraphs[`filters`][colorFilter.color[0]].push(colorFilter.id.replace(`Filter`, ``));
      });

      console.log(`${JSON.stringify(allColorGraphs)}`);

      return allColorGraphs;

}

function applyFilters(graph) {
      let allColorGraphs = {};
      allColorGraphs[`base`] = JSON.parse(JSON.stringify(graph.base));
      for (const [key, value] of Object.entries(colorNames)) {
            allColorGraphs[key] = JSON.parse(JSON.stringify(graph.base));
      }
      for (const [key, value] of Object.entries(graph.filters)) {
            for (let filter of value) {
                  Array.from(Object.keys(allColorGraphs)).forEach((color) => {
                        if (!colorCombos[key].includes(color)) {
                              allColorGraphs[color] = removeGraphConnection(allColorGraphs[color], filter);
                        }
                  });
                  let nodeIDs = filter.split(`/`);
                  let nodeDiv = document.getElementById(nodeIDs[0]);
                  let neighborDiv = document.getElementById(nodeIDs[1]);
                  createColorFilter(nodeDiv, neighborDiv, [key, colorNames[key]]);
            }
      }

      return allColorGraphs;
}

function loadFromGraphs(graphString) {
      let allGraphs = JSON.parse(graphString);
      generatePipes(allGraphs);
}

function finishLoading(allGraphs) {
      let baseGraph = allGraphs[`base`];
      let pipeCounter = 0;
      let finishedIntersections = [];
      for ([key, value] of Object.entries(baseGraph)) {
            let allDirections = [];
            for (let position of Object.keys(value)) {
                  if (value[position] != 1) {
                        let number = Number(value[position]);
                        if (number > 6000) {
                              number = number / 7;
                        }
                        let nodeDiv = document.getElementById(key);
                        let neighborDiv = document.getElementById(position);
                        let intersectionID = `${nodeDiv.id}/${neighborDiv.id}`;
                        let altID = `${neighborDiv.id}/${nodeDiv.id}`;
                        if (!finishedIntersections.includes(altID)) {
                              finishedIntersections.push(intersectionID);
                              createIntersection(nodeDiv, neighborDiv, number / 1000);
                        }
                  }
                  if (colorNames[position]) {
                        if (position != `white`) {
                              allDirections.push(0);
                        } else {
                              allDirections.push(90);
                        }
                        continue;
                  }
                  let neighborDirection = position.split(`,`).map(function (num, idx) {
                        return Number(num) - Number(key.split(`,`)[idx]);
                  });
                  let correctDirection = getKeyByArray(directions, neighborDirection);
                  allDirections.push(Number(correctDirection));
            }
            if (colorNames[key]) {
                  let newEntrance = document.createElement(`div`);
                  newEntrance.classList.add(`liquidBox`);
                  newEntrance.id = `${Object.keys(value)[0]}/${key}`;
                  //newEntrance.style.backgroundColor = `rgb(${colorNames[key][0]}, ${colorNames[key][1]}, ${colorNames[key][2]})`;
                  newEntrance.style.width = squareSize + "px";
                  newEntrance.style.height = squareSize + "px";
                  gameArea.appendChild(newEntrance);
                  if (key != `white`) {
                        let startPipe = document.getElementById(`${Object.keys(value)[0]}`);
                        startPipe.classList.add(`start`);
                        newEntrance.classList.add(`liquidStart`);
                        let imgKey = key;
                        addImg(`insideTank`, newEntrance, (pipeDiv) => {
                              pipeDiv.classList.add(`position`, `insidePipe`);
                              let color = new Color(colorNames[imgKey][0], colorNames[imgKey][1], colorNames[imgKey][2]);
                              let solver = new Solver(color);
                              let result = solver.solve();
                              while(result.loss != 0) {
                                    result = solver.solve();
                              }
                              let filterCSS = result.filter;
                              pipeDiv.lastChild.style.filter = `opacity(100%) brightness(0%) ` + filterCSS.replace(`filter: `, ``).replace(`;`, ``);
                        });
                        startPipe.liquidBox = newEntrance;
                        newEntrance.style.left = startPipe.offsetLeft + startPipe.parentElement.offsetLeft + "px";
                        newEntrance.style.top = startPipe.offsetTop + startPipe.parentElement.offsetTop - newEntrance.clientHeight + "px";
                  } else {
                        let endPipe = document.getElementById(`${Object.keys(value)[0]}`);
                        endPipe.classList.add(`end`);
                        newEntrance.style.height = squareSize + "px";
                        newEntrance.style.width = squareSize * 2.5 + "px";
                        newEntrance.classList.add(`liquidEndPath`);
                        newEntrance.style.left = endPipe.offsetLeft + endPipe.parentElement.offsetLeft + endPipe.clientWidth + "px";
                        newEntrance.style.top = endPipe.offsetTop + endPipe.parentElement.offsetTop + "px";
                  }
                  continue;
            }
            let nextPosition = document.getElementById(`${key}`);
            let pipeType = 'error';
            let rotation = 0;
            let degreesOfRotation = [0, 90, 180, 270];
            allDirections.sort(function (a, b) {
                  return a - b;
            });
            switch (allDirections.length) {
                  case 1:
                        pipeType = `pipe5`;
                        rotation = allDirections[0];
                        break;
                  case 2:
                        if (Math.abs(Number(allDirections[0]) - Number(allDirections[1])) == 180) {
                              pipeType = `pipe1`;
                              rotation = allDirections[0] - 90 < 0 ? allDirections[0] - 90 + 360 : allDirections[0] - 90;
                        } else {
                              pipeType = `pipe2`;
                              if (allDirections[1] - allDirections[0] == 270) {
                                    rotation = 0;
                              } else {
                                    rotation = allDirections[0] + 90 > 360 ? allDirections[0] + 90 - 360 : allDirections[0] + 90;
                              }
                        }
                        break;
                  case 3:
                        pipeType = `pipe3`;
                        let notConnection = degreesOfRotation.filter((value) => {
                              return !allDirections.includes(value);
                        });
                        rotation = notConnection + 180 >= 360 ? notConnection - 180 : notConnection + 180;
                        break;
                  case 4:
                        pipeType = `pipe4`;
                        break;
                  default:
                        console.log(`ERROR - Length is ${allDirections.length}`)
            }
            duplicateChildNodes(nextPosition.id);
            nextPosition.children[0].src = `./images/${pipeType}.webp`;
            nextPosition.children[1].src = `./images/${pipeType}Inside.webp`;
            nextPosition.style.transform = `rotate(${rotation}deg)`;
            nextPosition.rotation = rotation;
      }
      Array.from(document.querySelectorAll(`.pipe`)).forEach((pipe) => {
            if (pipe.children[0].src.includes(`default`)) {
                  pipe.style.visibility = "hidden";
                  pipe.classList.remove(`pipe`);
                  pipe.isPipe = false;
            }
      });
      let filterGraph = applyFilters(allGraphs);
      //showAnswerKey(filterGraph);
      let baseStateGraph = {};
      for (const color of Object.keys(filterGraph)) {
            baseStateGraph[color] = setGraphTo(filterGraph[color], 1);
            Array.from(document.querySelectorAll(`.intersection`)).forEach((intersection) => {
                  baseStateGraph[color] = setGraphNode(baseStateGraph[color], intersection);
            });
      }
      startButton(baseStateGraph);
      tickButtons(baseStateGraph);
      resetButton();
      changeBoxHolderPosition();
      changeButtonHolderPosition();
      uploadButton();
}

function removeGraphConnection(graph, connectionID) {
      let intersections = connectionID.split(`/`);
      delete graph[intersections[0]][intersections[1]];
      delete graph[intersections[1]][intersections[0]];
      return graph;
}

function convertFromPipes(pipePosition, graph) {
      let pipe = document.getElementById(`${pipePosition.id}, placed`);
      //pipePosition.style.visibility = "hidden";
      if (!pipe) {
            delete graph[pipePosition.id];
            for (let node in graph) {
                  for (let connection in graph[node]) {
                        if (connection == pipePosition.id) {
                              delete graph[node][connection];
                        }
                  }
            }
            //pipePosition.classList.remove(`pipe`);
            //pipePosition.isPipe = false;
            return graph;
      }
      pipe.classList.add(`pipe`);
      let currentID = pipePosition.id.split(`,`);
      let connections = { 0: false, 90: false, 180: false, 270: false };
      let entrance = Array.from(document.getElementsByClassName(`liquidBox`)).filter((element) => {
            return element.id.includes(`${pipePosition.id}`);
      })[0];
      let entranceAllowance = null;
      if (entrance) {
            if (entrance.color[0] != `white`) {
                  connections[0] = true;
                  entranceAllowance = 0;
            } else {
                  connections[180] = true;
                  entranceAllowance = 180;
            }
      }
      let connectionDirections = Object.entries(pipe.defaultConnections).map((connection) => {
            if (connection[1]) {
                  return Number(connection[0]) + Number(pipe.rotation) < 360 ? Number(connection[0]) + Number(pipe.rotation) : Number(connection[0]) + Number(pipe.rotation) - 360;
            }
      }).filter((value) => { return value != undefined });
      for (let direction of connectionDirections) {
            var neighborID = currentID.map(function (num, idx) {
                  return Number(num) + Number(directions[direction][idx]);
            });
            let neighborPipePosition = document.getElementById(neighborID);
            if (entrance && direction == entranceAllowance) {
                  graph[pipePosition.id][entrance.color[0]] = 1;
                  graph[entrance.color[0]] = {};
                  graph[entrance.color[0]][pipePosition.id] = 1;
                  continue;
            }
            if (!neighborPipePosition) {
                  console.log(`ERROR: NO PIPE - LIQUID LEAK AT NODE ${currentID}`);
                  continue;
            }
            let neighborPipe = document.getElementById(`${neighborID}, placed`);
            if (!neighborPipe) {
                  console.log(`ERROR: NO CONNECTION - LIQUID LEAK AT NODE ${currentID}`);
                  continue;
            }
            let adjustedRotations = [0, 90, 180, 270];
            while (adjustedRotations[0] != direction) {
                  adjustedRotations.push(adjustedRotations.shift());
            }
            switch (neighborPipe.pipeType) {
                  case `pipe1`:
                        if (adjustedRotations[1] == neighborPipe.rotation || adjustedRotations[3] == neighborPipe.rotation) {
                              connections[direction] = true;
                        }
                        break;
                  case `pipe2`:
                        if (adjustedRotations[2] == neighborPipe.rotation || adjustedRotations[3] == neighborPipe.rotation) {
                              connections[direction] = true;
                        }
                        break;
                  case `pipe3`:
                        if (adjustedRotations[1] == neighborPipe.rotation || adjustedRotations[2] == neighborPipe.rotation || adjustedRotations[3] == neighborPipe.rotation) {
                              connections[direction] = true;
                        }
                        break;
                  case `pipe4`:
                        connections[direction] = true;
                        break;
                  case `pipe5`:
                        if (adjustedRotations[2] == neighborPipe.rotation) {
                              connections[direction] = true;
                        }
                        break;
                  default:
                        console.log(`ERROR: Pipe Type is ${neighborPipe.pipeType}`);
            }
      }
      for (let [direction, link] of Object.entries(connections)) {
            if (!link) {
                  var neighborID = pipePosition.id.split(`,`).map(function (num, idx) {
                        return Number(num) + Number(directions[direction][idx]);
                  }).toString();
                  let neighborPipePosition = document.getElementById(neighborID);
                  if (!neighborPipePosition && !entrance) {
                        continue;
                  }
                  let neighborPipe = document.getElementById(`${neighborID}, placed`);
                  if (!neighborPipe) {
                        continue;
                  }
                  delete graph[pipePosition.id][neighborID];
                  delete graph[neighborID][pipePosition.id];
            }
      }
      return graph;
}

function generateDebugPipes() {
      let debugPipeHolder = document.createElement(`div`);
      debugPipeHolder.classList.add(`debugPipeHolder`, `holder`);
      debugPipeHolder.id = `debugPipeHolder`;
      gameArea.appendChild(debugPipeHolder);
      debugPipeHolder.style.height = pipesContainer.clientHeight + "px";
      debugPipeHolder.style.width = squareSize + "px";
      debugPipeHolder.style.left = pipesContainer.offsetLeft - (squareSize * 2) + "px";
      debugPipeHolder.style.top = pipesContainer.offsetTop + "px";
      let connectionLocations = [
            { 0: false, 90: true, 180: false, 270: true },
            { 0: true, 90: false, 180: false, 270: true },
            { 0: true, 90: true, 180: false, 270: true },
            { 0: true, 90: true, 180: true, 270: true },
            { 0: true, 90: false, 180: false, 270: false }
      ];
      for (i = 1; i <= 5; i++) {
            let num = i;
            addImg(`pipe${i}`, debugPipeHolder, (newDiv) => {
                  newDiv.classList.add(`debugPipe`);
                  newDiv.style.height = `${debugPipeHolder.clientHeight / 6}px`;
                  newDiv.style.width = `${debugPipeHolder.clientHeight / 6}px`;
                  newDiv.pipeType = `pipe${num}`;
                  newDiv.id = `pipe${num}debug`;
                  newDiv.defaultConnections = connectionLocations[Number(num) - 1];
                  newDiv.children[0].onload = false;
                  duplicateChildNodes(newDiv.id);
                  dragElement(newDiv);
            });
      }
}

function generateDebugIntersections() {
      let debugIntersectionsHolder = document.createElement(`div`);
      let debugPipeHolder = document.getElementById(`debugPipeHolder`);
      debugIntersectionsHolder.classList.add(`debugIntersectionsHolder`, `holder`);
      gameArea.appendChild(debugIntersectionsHolder);
      debugIntersectionsHolder.style.height = debugPipeHolder.clientHeight + "px";
      debugIntersectionsHolder.style.width = squareSize + "px";
      debugIntersectionsHolder.style.left = debugPipeHolder.offsetLeft - (squareSize) + "px";
      debugIntersectionsHolder.style.top = debugPipeHolder.offsetTop + "px";
      for (i = 1; i <= 6; i++) {
            let number = i;
            addImg(`${i}`, debugIntersectionsHolder, (newDiv) => {
                  newDiv.classList.add(`debugIntersection`);
                  newDiv.style.height = `${debugIntersectionsHolder.clientHeight / 12}px`;
                  newDiv.style.width = `${debugIntersectionsHolder.clientHeight / 12}px`;
                  newDiv.children[0].onload = false;
                  newDiv.numberID = number;
                  dragElement(newDiv);
            });
      }
}

function generateDebugColorFilters() {
      let debugColorFilterHolder = document.createElement(`div`);
      debugColorFilterHolder.classList.add(`debugColorFilterHolder`, `holder`);
      gameArea.appendChild(debugColorFilterHolder);
      debugColorFilterHolder.style.height = pipesContainer.clientHeight + "px";
      debugColorFilterHolder.style.width = squareSize + "px";
      debugColorFilterHolder.style.left = pipesContainer.offsetLeft + pipesContainer.clientWidth + (squareSize) + "px";
      debugColorFilterHolder.style.top = pipesContainer.offsetTop + "px";
      for (const [key, value] of Object.entries(colorNames)) {
            let newDiv = document.createElement(`div`);
            newDiv.classList.add(`debugColorFilter`);
            debugColorFilterHolder.appendChild(newDiv);
            newDiv.style.height = `${squareSize * .25}px`;
            newDiv.style.width = `${(squareSize / 3) * 2}px`;
            newDiv.style.backgroundColor = `rgb(${value[0]}, ${value[1]}, ${value[2]})`;
            newDiv.color = [key, value];
            dragElement(newDiv);
      }
}

function generateDebugEntrances() {
      let debugEntranceHolder = document.createElement(`div`);
      debugEntranceHolder.classList.add(`debugEntranceHolder`, `holder`);
      gameArea.appendChild(debugEntranceHolder);
      debugEntranceHolder.style.height = pipesContainer.clientHeight + "px";
      debugEntranceHolder.style.width = squareSize + "px";
      debugEntranceHolder.style.left = pipesContainer.offsetLeft + pipesContainer.clientWidth + (squareSize * 2) + "px";
      debugEntranceHolder.style.top = pipesContainer.offsetTop + "px";
      for (i = 0; i < 4; i++) {
            let newDiv = document.createElement(`div`);
            newDiv.classList.add(`debugEntrance`);
            debugEntranceHolder.appendChild(newDiv);
            newDiv.style.height = `${debugEntranceHolder.clientHeight / 12}px`;
            newDiv.style.width = `${debugEntranceHolder.clientHeight / 6}px`;
            newDiv.style.backgroundColor = `rgb(${Object.values(colorNames)[i][0]}, ${Object.values(colorNames)[i][1]}, ${Object.values(colorNames)[i][2]})`;
            newDiv.color = [Object.keys(colorNames)[i], Object.values(colorNames)[i]];
            if (i == 3) {
                  newDiv.style.backgroundColor = `rgb(${255}, ${255}, ${255})`;
                  newDiv.color = [`white`, [255, 255, 255]];
            }
            dragElement(newDiv);
      }
}

function showAnswerKey(graph) {
      let answerHolder = document.createElement(`div`);
      answerHolder.classList.add(`answerHolder`);
      answerHolder.id = `answerHolder`;
      gameArea.appendChild(answerHolder);
      answerHolder.style.left = pipesContainer.offsetLeft - (squareSize * 1.5) + `px`;
      let liquidBox = document.createElement(`div`);
      liquidBox.classList.add(`liquidBoxEnd`);
      liquidBox.id = `answerContainer`;
      liquidBox.style.visibility = `hidden`;
      liquidBox.style.backgroundColor = `white`;
      answerHolder.appendChild(liquidBox);
      liquidBox.style.height = squareSize / 2 + "px";
      liquidBox.style.width = squareSize + "px";
      let allLiquidPaths = {};
      let finalColors = {};
      let answerOrder = [];

      Array.from(document.querySelectorAll(`.start`)).forEach((pipe) => {
            let liquidColor = pipe.liquidBox.id.split(`/`)[1];
            let endPipe = document.getElementsByClassName(`end`)[0];
            let liquidPath = findShortestPath(graph[liquidColor], pipe.id, endPipe.id);
            allLiquidPaths[liquidColor] = liquidPath.path;
      });
      for (let color of Object.keys(allLiquidPaths)) {
            for (i = 0; i < liquidLength; i++) {
                  let lastLocation = allLiquidPaths[color].pop();
                  if (finalColors[`${lastLocation}-${allLiquidPaths[color].length}`]) {
                        finalColors[`${lastLocation}-${allLiquidPaths[color].length}`] = finalColors[`${lastLocation}-${allLiquidPaths[color].length}`].map((colorNum, idx) => {
                              return colorNum == colorNames[color][idx] ? colorNum : 0;
                        });
                  } else {
                        finalColors[`${lastLocation}-${allLiquidPaths[color].length}`] = colorNames[color];
                  }
            }
      }
      for (let [key, value] of Object.entries(finalColors)) {
            let timeSpot = key.split(`-`)[1];
            if (answerOrder[timeSpot]) {
                  answerOrder[timeSpot] = answerOrder[timeSpot].map((colorNum, idx) => {
                        return colorNum == value[idx] ? colorNum : 0;
                  });
            } else {
                  answerOrder[timeSpot] = value;
            }
      }
      answerOrder = answerOrder.filter((value) => value);
      for (let colorBox of answerOrder) {
            let oldLiquidBox = document.getElementById('answerContainer');
            let newContainer = oldLiquidBox.cloneNode(true);
            answerHolder.appendChild(newContainer);
            let containerColor = colorBox;
            oldLiquidBox.style.visibility = `visible`;
            oldLiquidBox.style.backgroundColor = `rgb(${containerColor[0]}, ${containerColor[1]}, ${containerColor[2]})`;
            oldLiquidBox.classList.add(`answerFilledContainer`);
            oldLiquidBox.id = containerColor;
            newContainer.id = `answerContainer`;
      }
      let oldLiquidBox = document.getElementById('answerContainer');
      oldLiquidBox.remove();
}

function showDebugPath() {
      Array.from(document.querySelectorAll(`.debugPathColor`)).forEach((pipe) => {
            pipe.debugPathColor = null;
            pipe.classList.remove(`debugPathColor`);
      });
      Array.from(document.querySelectorAll(`.pipe`)).forEach((pipe) => {
            pipe.lastChild.style.filter = ``;
            pipe.lastChild.currentColor = ``;
      });
      let storedGraphs = exportGraph();
      storedGraphs = applyFilters(storedGraphs);
      let allLiquidPaths = {};
      Array.from(document.querySelectorAll(`.start`)).forEach((pipe) => {
            let liquidColor = pipe.liquidBox.id.split(`/`)[1];
            let endPipe = document.getElementsByClassName(`end`)[0];
            let liquidPath = findShortestPath(storedGraphs[liquidColor], pipe.id, endPipe.id);
            allLiquidPaths[liquidColor] = liquidPath.path;
      });
      for (let color of Object.keys(allLiquidPaths)) {
            for (let position of allLiquidPaths[color]) {
                  let pathPipe = document.getElementById(position);
                  pathPipe.classList.add("debugPathColor");
                  if (pathPipe.debugPathColor) {
                        pathPipe.debugPathColor = pathPipe.debugPathColor.map((colorNum, idx) => {
                              return colorNum == colorNames[color][idx] ? colorNum : 0;
                        });
                  } else {
                        pathPipe.debugPathColor = colorNames[color];
                  }
            }
      }
      Array.from(document.querySelectorAll(`.debugPathColor`)).forEach((pipe) => {
            let actualPipe = document.getElementById(`${pipe.id}, placed`);
            let color = new Color(pipe.debugPathColor[0], pipe.debugPathColor[1], pipe.debugPathColor[2]);
            let solver = new Solver(color);
            let result = solver.solve();
            while(result.loss != 0) {
                  result = solver.solve();
            }
            let filterCSS = result.filter;
            actualPipe.lastChild.style.filter = `opacity(50%) brightness(0%) ` + filterCSS.replace(`filter: `, ``).replace(`;`, ``);
      });
}

function resetLiquids() {
      clearTimeout(timeoutID);
      endColors = [];
      Array.from(document.querySelectorAll(`.pipe`)).forEach((pipe) => {
            pipe.lastChild.style.filter = ``;
            pipe.lastChild.currentColor = ``;
      });
      Array.from(document.querySelectorAll(`.debugPathColor`)).forEach((pipe) => {
            pipe.debugPathColor = null;
            pipe.classList.remove(`debugPathColor`);
      });
      let boxHolder = document.getElementById(`boxHolder`);
      Array.from(boxHolder.children).filter((child) => {
            return child.children[0].style.filter;
      }).forEach((pipe) => {
            pipe.lastChild.style.filter = ``;
      });
      pastPaths = {
            cyan: [],
            magenta: [],
            yellow: [],
      };
      futurePaths = {
            cyan: [],
            magenta: [],
            yellow: [],
      };
      activePaths = {
            cyan: [],
            magenta: [],
            yellow: [],
      };
      timeoutID = undefined;
}

function changeBoxHolderPosition() {
      let boxHolder = document.getElementById(`boxHolder`);
      if (!boxHolder) {
            let newHolder = document.createElement(`div`);
            newHolder.classList.add(`boxHolder`);
            newHolder.id = `boxHolder`;
            gameArea.appendChild(newHolder);
            boxHolder = newHolder;
            for (i = 0; i < 9; i++) {
                  let newEndPipe = document.createElement(`div`);
                  newEndPipe.classList.add(`liquidEnd`);
                  boxHolder.appendChild(newEndPipe);
                  newEndPipe.style.width = squareSize + "px";
                  newEndPipe.style.height = squareSize / 2 + "px";
                  addImg(`insidePipeThick`, newEndPipe, (pipeDiv) => {
                        pipeDiv.classList.add(`position`, `insidePipe`);
                        pipeDiv.classList.remove(`imgcontainer`);
                        pipeDiv.style.width = pipeDiv.parentElement.clientWidth + "px";
                        pipeDiv.style.height = pipeDiv.parentElement.clientHeight + "px";
                        let color = new Color(colorNames[`white`][0], colorNames[`white`][1], colorNames[`white`][2]);
                        let solver = new Solver(color);
                        let result = solver.solve();
                        while(result.loss != 0) {
                              result = solver.solve();
                        }
                        let filterCSS = result.filter;
                        pipeDiv.lastChild.style.filter = `opacity(100%) brightness(0%) ` + filterCSS.replace(`filter: `, ``).replace(`;`, ``);
                  });
            }
      }
      //boxHolder.style.height = pipesContainer.offsetHeight + "px";
      boxHolder.style.height = squareSize / 2 * 9 + "px";
      boxHolder.style.top = pipesContainer.offsetTop - squareSize / 2 + "px";
      boxHolder.style.left = pipesContainer.offsetLeft + pipesContainer.clientWidth + (squareSize * 0.5) + `px`;

      let wireHolder = document.createElement(`div`);
      wireHolder.classList.add(`wireHolder`);
      gameArea.appendChild(wireHolder);
      wireHolder.style.left = pipesContainer.offsetLeft + pipesContainer.clientWidth + (squareSize * 0.5) + `px`;
      wireHolder.style.top = pipesContainer.offsetTop - squareSize + "px";
      wireHolder.style.height = squareSize / 2 * 13 + "px";
      wireHolder.style.width = squareSize * 2 + "px";
      wireHolder.style.zIndex = -1;
      
}

function runLiquids() {
      if (timeoutID) {
            resetLiquids();
      }
      let emptyPath = true;
      for ([key, value] of Object.entries(activePaths)) {
            if (activePaths[key].filter((value) => { return value != undefined })[0] || futurePaths[key].filter((value) => { return value != undefined })[0] || pastPaths[key].filter((value) => { return value != undefined })[0]) {
                  emptyPath = false;
            }
      }
      if (emptyPath) {
            if (this.storedGraph) {
                  initializeLiquids(this.storedGraph);
            } else {
                  initializeLiquids();
            }

      } else {
            let gridEmpty = true;
            let onlyFinalPaths = true;
            for (let path of Object.keys(futurePaths)) {
                  if (activePaths[path].filter((value) => { return value != undefined })[0]) {
                        gridEmpty = false;
                        onlyFinalPaths = false;
                  }
                  if (futurePaths[path].filter((value) => { return value != undefined })[0]) {
                        onlyFinalPaths = false;
                  }
            }
            if (gridEmpty && onlyFinalPaths) {
                  futurePaths = JSON.parse(JSON.stringify(pastPaths));
                  for (let path of Object.keys(futurePaths)) {
                        futurePaths[path] = futurePaths[path].filter((value) => { return value != undefined });
                  }
                  pastPaths = {
                        cyan: [],
                        magenta: [],
                        yellow: [],
                  };
            }
      }
      timeoutID = setTimeout(liquidStep, tickSpeed / 2);
}

function initializeLiquids(storedGraphs) {
      if (!storedGraphs) {
            storedGraphs = exportGraph();
            storedGraphs = applyFilters(storedGraphs);
      }
      pastPaths = {
            cyan: [],
            magenta: [],
            yellow: [],
      };
      futurePaths = {
            cyan: [],
            magenta: [],
            yellow: [],
      };
      activePaths = {
            cyan: [],
            magenta: [],
            yellow: [],
      };
      Array.from(document.querySelectorAll(`.start`)).forEach((pipe) => {
            let liquidColor = pipe.liquidBox.id.split(`/`)[1];
            let endPipe = document.getElementsByClassName(`end`)[0];
            let liquidPath = findShortestPath(storedGraphs[liquidColor], pipe.id, endPipe.id);
            futurePaths[liquidColor] = liquidPath.path;
      });
      if (!document.getElementById(`boxHolder`)) {
            let newHolder = document.createElement(`div`);
            newHolder.classList.add(`boxHolderDebug`);
            newHolder.id = `boxHolder`;
            gameArea.appendChild(newHolder);
      }
      Array.from(document.querySelectorAll(`.end`)).forEach((pipe) => {
            if (debugState) {
                  let boxHolder = document.getElementById(`boxHolder`);
                  boxHolder.style.top = pipe.liquidBox.offsetTop + "px";
                  boxHolder.style.height = pipe.liquidBox.clientHeight + "px";
            }
            let container = document.getElementById(`${pipe.id.replace(`, placed`, ``)}/white`);
            // container.style.visibility = `hidden`;
      });
}

function liquidStep(direction) {
      if (direction) {
            clearTimeout(timeoutID);
      }
      let continueTimeout = false;
      let gridEmpty = true;
      for (let path of Object.keys(futurePaths)) {
            if (activePaths[path].filter((value) => { return value != undefined })[0]) {
                  gridEmpty = false;
            }
      }
      let endPipe = document.getElementById(`${document.getElementsByClassName(`end`)[0].id}, placed`) || document.getElementsByClassName(`end`)[0];
      let endPipeLastColor = endPipe.lastChild.currentColor;
      if (direction == `back`) {
            for (let path of Object.keys(futurePaths)) {
                  if (!gridEmpty || !futurePaths[path].filter((value) => { return value != undefined })[0]) {
                        let pipeID = pastPaths[path].pop();
                        activePaths[path].unshift(pipeID);
                        let lastPipeID = activePaths[path].pop();
                        futurePaths[path].unshift(lastPipeID);
                  } else {
                        resetLiquids();
                  }
            }
            let boxHolder = document.getElementById(`boxHolder`);
            let usedEndPipes = Array.from(boxHolder.children).filter((child) => {
                  return child.children[0].style.filter;
            });
            if (usedEndPipes.length) {
                  usedEndPipes[usedEndPipes.length - 1].lastChild.style.filter = ``;
                  endColors.pop();
            }
      } else {
            for (let path of Object.keys(futurePaths)) {
                  if (!gridEmpty || !pastPaths[path].filter((value) => { return value != undefined })[0]) {
                        let pipeID = futurePaths[path].shift();
                        activePaths[path].push(pipeID);
                        if (activePaths[path].length > liquidLength) {
                              let lastPipeID = activePaths[path].shift();
                              pastPaths[path].push(lastPipeID);
                        }
                        let emptyPath = true;
                        if (getAllIndexes(activePaths[path], undefined).length != liquidLength && !direction) {
                              continueTimeout = true;
                        }
                  }
            }
            if (endPipeLastColor) {
                  let boxHolder = document.getElementById(`boxHolder`);
                  let unusedEndPipes = Array.from(boxHolder.children).filter((child) => {
                        return !child.children[0].style.filter;
                  });
                  let color = new Color(endPipeLastColor[0], endPipeLastColor[1], endPipeLastColor[2]);
                  let solver = new Solver(color);
                  let result = solver.solve();
                  while(result.loss != 0) {
                        result = solver.solve();
                  }
                  let filterCSS = result.filter;
                  unusedEndPipes[0].lastChild.style.filter = `opacity(100%) brightness(0%) ` + filterCSS.replace(`filter: `, ``).replace(`;`, ``);
                  let colorName = Object.entries(colorNames).filter((entry) => {
                        let colorKey = entry[0];
                        let colorArray = entry[1];
                        if(arraysEqual(endPipeLastColor, colorArray)) {
                              return true;
                        } else {
                              return false;
                        }
                  })[0];
                  endColors.push(colorName[0]);
            }
      }
      Array.from(document.querySelectorAll(`.pipe`)).forEach((pipe) => {
            pipe.lastChild.style.filter = ``;
            pipe.lastChild.currentColor = ``;
      });
      for (let path of Object.keys(futurePaths)) {
            for (let pipeID of activePaths[path]) {
                  let pipe = document.getElementById(`${pipeID}, placed`) || document.getElementById(`${pipeID}`);
                  if (pipe) {
                        if (!pipe.lastChild.currentColor) {
                              pipe.lastChild.currentColor = colorNames[path];
                        } else {
                              pipe.lastChild.currentColor = pipe.lastChild.currentColor.map((colorNum, idx) => {
                                    return colorNum == colorNames[path][idx] ? colorNum : 0;
                              });
                        }
                        let color = new Color(pipe.lastChild.currentColor[0], pipe.lastChild.currentColor[1], pipe.lastChild.currentColor[2]);
                        let solver = new Solver(color);
                        let result = solver.solve();
                        while(result.loss != 0) {
                              result = solver.solve();
                        }
                        let filterCSS = result.filter;
                        pipe.lastChild.style.filter = `opacity(100%) brightness(0%) ` + filterCSS.replace(`filter: `, ``).replace(`;`, ``);
                  }
            }
      }
      if (continueTimeout) {
            timeoutID = setTimeout(liquidStep, tickSpeed, direction);
      }
}

function conveyorToHolder(div) {
      let placeHolder = div.cloneNode(true);
      div.classList.remove(`filledContainer`);
      placeHolder.style.visibility = `hidden`;
      boxHolder.appendChild(placeHolder);
      div.id = `movingDiv${placeHolder.id}`;
      div.classList.add(`liquidBox`);
      gameArea.appendChild(div);
      div.style.transition = `all 1s ease-out`;
      div.style.transform = `translate(${placeHolder.parentElement.offsetLeft - div.offsetLeft + div.clientWidth / (4 / 3)}px, ${0}px)`;
      return placeHolder;
}

function replaceBoxDiv(movingDiv, placeHolder) {
      placeHolder.style.visibility = `visible`;
      movingDiv.remove();
}

function setGraphNode(graph, intersection) {
      let nodeIDs = intersection.id.split("/");
      if (intersection.rotation == 90) {
            if (graph[nodeIDs[0]][nodeIDs[1]]) {
                  graph[nodeIDs[0]][nodeIDs[1]] = Number(intersection.number) * 7000;
                  graph[nodeIDs[1]][nodeIDs[0]] = Number(intersection.number) * 7000;
            }
      } else {
            if (graph[nodeIDs[0]][nodeIDs[1]]) {
                  graph[nodeIDs[0]][nodeIDs[1]] = Number(intersection.number) * 1000;
                  graph[nodeIDs[1]][nodeIDs[0]] = Number(intersection.number) * 1000;
            }
      }
      return graph;
}

function setGraphTo(graph, number) {
      for (let node in graph) {
            for (let id in graph[node]) {
                  graph[node][id] = number;
            }
      }
      return graph;
}

function addIntersections(graph) {
      let finishedIntersections = [];
      for (let node in graph) {
            for (let neighborNode in graph[node]) {
                  let intersectionID = `${node}/${neighborNode}`;
                  let altID = `${neighborNode}/${node}`;
                  if (finishedIntersections.includes(altID)) {
                        continue;
                  }
                  let nodeDiv = document.getElementById(node);
                  let neighborDiv = document.getElementById(neighborNode);
                  let missingLinkGraph = JSON.parse(JSON.stringify(graph));
                  delete missingLinkGraph[node][neighborNode];
                  if (nodeDiv.connections[true][0] == 2 || neighborDiv.connections[true][0] == 2 || findShortestPath(missingLinkGraph, node, neighborNode).distance == `Infinity`) {
                        nodeDiv.pipeNeighbors.push(neighborDiv);
                        continue;
                  }
                  nodeDiv.intersections.push(intersectionID);
                  neighborDiv.intersections.push(intersectionID);
                  finishedIntersections.push(intersectionID);
                  createIntersection(nodeDiv, neighborDiv);
            }
      }
}

function createIntersection(nodeDiv, neighborDiv, number) {
      let newIntersection = document.createElement(`div`);
      newIntersection.classList.add(`intersection`);
      let intersectionID = `${nodeDiv.id}/${neighborDiv.id}`;
      newIntersection.id = intersectionID;
      gameArea.appendChild(newIntersection);
      newIntersection.style.top = squareSize / 2 - newIntersection.clientHeight + nodeDiv.parentElement.offsetTop + nodeDiv.offsetTop + "px";
      newIntersection.style.left = nodeDiv.parentElement.offsetLeft + nodeDiv.offsetLeft + "px";
      newIntersection.style.width = squareSize / 2 + "px";
      newIntersection.style.height = squareSize / 2 + "px";
      let relationID = nodeDiv.id.split(`,`).map((num, idx) => {
            return neighborDiv.id.split(`,`)[idx] - num;
      });
      let degrees = getKeyByArray(directions, relationID);
      switch (Number(degrees)) {
            case 0:
                  newIntersection.style.top = nodeDiv.parentElement.offsetTop + nodeDiv.offsetTop - newIntersection.clientHeight / 2 + "px";
                  newIntersection.style.left = nodeDiv.parentElement.offsetLeft + nodeDiv.offsetLeft + nodeDiv.clientWidth / 2 - newIntersection.clientWidth / 2 + "px";
                  break;
            case 90:
                  newIntersection.style.top = nodeDiv.parentElement.offsetTop + nodeDiv.offsetTop + nodeDiv.clientHeight / 2 - newIntersection.clientHeight / 2 + "px";
                  newIntersection.style.left = nodeDiv.parentElement.offsetLeft + nodeDiv.offsetLeft + nodeDiv.clientWidth - newIntersection.clientWidth / 2 + "px";
                  break;
            case 180:
                  newIntersection.style.top = nodeDiv.parentElement.offsetTop + nodeDiv.offsetTop + nodeDiv.clientHeight - newIntersection.clientHeight / 2 + "px";
                  newIntersection.style.left = nodeDiv.parentElement.offsetLeft + nodeDiv.offsetLeft + nodeDiv.clientWidth / 2 - newIntersection.clientWidth / 2 + "px";
                  break;
            case 270:
                  newIntersection.style.top = nodeDiv.parentElement.offsetTop + nodeDiv.offsetTop + nodeDiv.clientHeight / 2 - newIntersection.clientHeight / 2 + "px";
                  newIntersection.style.left = nodeDiv.parentElement.offsetLeft + nodeDiv.offsetLeft - newIntersection.clientWidth / 2 + "px";
                  break;
            default:
                  console.log(`ERROR: Rotation attempted to be ${degrees}`);
      }
      let imageNumber = number;
      addImg(imageNumber, newIntersection, (newDiv) => {
            //newDiv.style.filter = `invert(73%) sepia(10%) saturate(0%) hue-rotate(334deg) brightness(98%) contrast(100%)`;
            newDiv.style.height = `${newIntersection.clientHeight * 2/3}px`;
            newDiv.style.width = `${newIntersection.clientWidth * 2/3}px`;
      });
      newIntersection.number = imageNumber;
      newIntersection.rotation = 0;
      newIntersection.onclick = operateValve;
      return intersectionID;
}

function createColorFilter(nodeDiv, neighborDiv, color) {
      let newColorFilter = document.createElement(`div`);
      newColorFilter.classList.add(`colorFilter`);
      let colorFilterID = `${nodeDiv.id}/${neighborDiv.id}Filter`;
      newColorFilter.id = colorFilterID;
      gameArea.appendChild(newColorFilter);
      newColorFilter.style.top = squareSize / 2 - newColorFilter.clientHeight + nodeDiv.parentElement.offsetTop + nodeDiv.offsetTop + "px";
      newColorFilter.style.left = nodeDiv.parentElement.offsetLeft + nodeDiv.offsetLeft + "px";
      newColorFilter.style.width = (squareSize / 3) * 2 + "px";
      newColorFilter.style.height = squareSize / 5 + "px";
      let relationID = nodeDiv.id.split(`,`).map((num, idx) => {
            return neighborDiv.id.split(`,`)[idx] - num;
      });
      let degrees = getKeyByArray(directions, relationID);
      switch (Number(degrees)) {
            case 0:
                  newColorFilter.style.top = nodeDiv.parentElement.offsetTop + nodeDiv.offsetTop - newColorFilter.clientHeight / 2 + "px";
                  newColorFilter.style.left = nodeDiv.parentElement.offsetLeft + nodeDiv.offsetLeft + nodeDiv.clientWidth / 2 - newColorFilter.clientWidth / 2 + "px";
                  break;
            case 90:
                  newColorFilter.style.top = nodeDiv.parentElement.offsetTop + nodeDiv.offsetTop + nodeDiv.clientHeight / 2 - newColorFilter.clientHeight / 2 + "px";
                  newColorFilter.style.left = nodeDiv.parentElement.offsetLeft + nodeDiv.offsetLeft + nodeDiv.clientWidth - newColorFilter.clientWidth / 2 + "px";
                  newColorFilter.style.transform = `rotate(${degrees}deg)`
                  break;
            case 180:
                  newColorFilter.style.top = nodeDiv.parentElement.offsetTop + nodeDiv.offsetTop + nodeDiv.clientHeight - newColorFilter.clientHeight / 2 + "px";
                  newColorFilter.style.left = nodeDiv.parentElement.offsetLeft + nodeDiv.offsetLeft + nodeDiv.clientWidth / 2 - newColorFilter.clientWidth / 2 + "px";
                  break;
            case 270:
                  newColorFilter.style.top = nodeDiv.parentElement.offsetTop + nodeDiv.offsetTop + nodeDiv.clientHeight / 2 - newColorFilter.clientHeight / 2 + "px";
                  newColorFilter.style.left = nodeDiv.parentElement.offsetLeft + nodeDiv.offsetLeft - newColorFilter.clientWidth / 2 + "px";
                  newColorFilter.style.transform = `rotate(${degrees}deg)`
                  break;
            default:
                  console.log(`ERROR: Rotation attempted to be ${degrees}`);
      }
      let filteredColor = color;
      newColorFilter.color = filteredColor;
      newColorFilter.style.backgroundColor = `rgb(${color[1][0]}, ${color[1][1]}, ${color[1][2]})`;
      newColorFilter.rotation = 0;
      return colorFilterID;
}

function createEntrance(pipe, color) {
      let newEntrance = document.createElement(`div`);
      newEntrance.classList.add(`liquidBox`);
      let entranceID = `${pipe.id}/${color[0]}`;
      newEntrance.id = entranceID;
      gameArea.appendChild(newEntrance);
      newEntrance.style.left = pipe.parentElement.offsetLeft + pipe.offsetLeft + "px";
      newEntrance.style.width = squareSize + "px";
      newEntrance.style.height = squareSize / 2 + "px";
      if (color[0] != `white`) {
            pipe.classList.add(`start`);
            newEntrance.style.top = - newEntrance.clientHeight + pipe.parentElement.offsetTop + pipe.offsetTop + "px";
      } else {
            pipe.classList.add(`end`);
            newEntrance.style.top = newEntrance.clientHeight * 3 + pipe.parentElement.offsetTop + pipe.offsetTop + "px";
      }
      pipe.liquidBox = newEntrance;
      newEntrance.color = color;
      newEntrance.style.backgroundColor = `rgb(${color[1][0]}, ${color[1][1]}, ${color[1][2]})`;
      return entranceID;
}

function operateValve(event) {
      let possibleRotations = [0, 90];
      let rotationIndex = possibleRotations.indexOf(this.rotation) + 1 == possibleRotations.length ? 0 : possibleRotations.indexOf(this.rotation) + 1;
      let rotation = possibleRotations[rotationIndex];
      this.style.transform = `rotate(${rotation}deg)`;
      this.rotation = rotation;
      let startButton = document.getElementById(`mainButton`);
      let tickButtonFront = document.getElementById(`tickButtonFront`);
      if (startButton) {
            for (const color of Object.keys(startButton.storedGraph)) {
                  startButton.storedGraph[color] = setGraphNode(startButton.storedGraph[color], this);
                  tickButtonFront.storedGraph[color] = setGraphNode(tickButtonFront.storedGraph[color], this);
            }
      }

}

function makeGraph() {
      let graph = {};
      for (row = 0; row < totalRows; row++) {
            for (column = 0; column < totalColumns; column++) {
                  let loopData = [column, row];
                  let loopConnections = {};
                  for (let direction in directions) {
                        let neighborCell = loopData.map((num, idx) => {
                              return num + directions[direction][idx];
                        });
                        if (!(neighborCell.includes(-1) || neighborCell[0] == totalColumns || neighborCell[1] == totalRows)) {
                              loopConnections[neighborCell] = 1;
                        }
                  }
                  graph[loopData.toString()] = loopConnections;
            }
      }
      return graph;
}

function generatePipes(fromGraph) {
      if (!pipesContainer) {
            pipesContainer = document.createElement(`div`);
      }
      gameArea.appendChild(pipesContainer);
      pipesContainer.classList.add(`pipesContainer`);
      pipesContainer.style.gridTemplateColumns = `repeat(${totalColumns}, auto)`;
      pipesContainer.style.gridGap = `${gridGap}px`;
      pipesContainer.style.height = (totalRows * (squareSize + gridGap)) + `px`;
      pipesContainer.style.width = (totalColumns * (squareSize + gridGap)) + `px`;
      pipesContainer.style.top = (window.innerHeight - pipesContainer.clientHeight) * 6 / 8 + "px";
      pipesContainer.style.left = (window.innerWidth / 2) - (pipesContainer.clientWidth / 2) + "px";
      let totalIterations = 0;
      for (row = 0; row < totalRows; row++) {
            for (column = 0; column < totalColumns; column++) {
                  let gridDiv = document.createElement(`div`);
                  gridDiv.classList.add(`temporary`);
                  pipesContainer.appendChild(gridDiv);
                  let loopData = [column, row];
                  addImg(`default`, gridDiv, (newDiv) => {
                        newDiv.classList.add(`pipe`);
                        newDiv.id = loopData;
                        newDiv.style.height = `${squareSize}px`;
                        newDiv.children[0].id = `${loopData}image`;
                        newDiv.children[0].classList.add(`position`);
                        newDiv.children[0].onload = false;
                        totalIterations++;
                        if (totalIterations == totalRows * totalColumns) {
                              changePipeParent();
                              if (fromGraph) {
                                    finishLoading(fromGraph);
                              }
                        }
                  });
            }
      }
}

function rotatePiece(pipe) {
      let possibleRotations = [0, 90, 180, 270];
      let rotationIndex = possibleRotations.indexOf(pipe.rotation) + 1 == possibleRotations.length ? 0 : possibleRotations.indexOf(pipe.rotation) + 1;
      let rotation = possibleRotations[rotationIndex];
      pipe.style.transform = `rotate(${rotation}deg)`;
      pipe.rotation = rotation;
}

function changePipeParent() {
      Array.from(document.querySelectorAll(`.temporary`)).forEach((div) => {
            while (div.childNodes.length > 0) {
                  div.parentElement.appendChild(div.childNodes[0]);
            }
            div.remove();
      });
}

function addImg(src, parentElement, imgCallback) {
      let newImg = new Image();
      newImg.src = `./images/${src}.webp`;
      newImg.onload = addToPage;
      function addToPage(event) {
            let newDiv = document.createElement(`div`);
            if (parentElement) {
                  parentElement.appendChild(newDiv);
            }
            newDiv.classList.add(`imgcontainer`);
            newDiv.appendChild(this);
            if (imgCallback) {
                  imgCallback(newDiv);
            }
      }
}

function dragElement(elmnt) {
      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      if (document.getElementById(elmnt.id + "header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
      } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            let inventoryItem = Array.from(elmnt.classList).find((value) => {
                  return value.includes(`inventoryItem`);
            });
            if (inventoryItem) {
                  elmnt.onmousedown = copyAndDrag;
            } else {
                  elmnt.onmousedown = dragMouseDown;
            }
      }

      function copyAndDrag(event) {
            if (this.onPage) {
                  return;
            }
            let placedItem;
            placedItem = this.cloneNode(true);
            if (this.children.length > 1) {
                  placedItem.children[0].style.display = ``;
                  placedItem.children[1].style.display = `none`;
            }
            placedItem.style.height = Math.min(1000 * this.children[0].naturalHeight / this.children[0].naturalWidth, this.children[0].naturalHeight) + "px";
            placedItem.style.width = placedItem.style.height.replace("px", "") * this.children[0].naturalWidth / this.children[0].naturalHeight + "px";
            this.style.opacity = `50%`;
            this.onPage = true;
            placedItem.originalItem = this;
            document.body.children[0].appendChild(placedItem);
            placedItem.classList.remove(`inventoryItem`);
            placedItem.classList.add(`dragItem`);
            placedItem.style.left = event.clientX - placedItem.clientWidth / 2 + "px";
            placedItem.style.top = event.clientY - placedItem.clientHeight / 2 + "px";
            dragElement(placedItem);
            elmnt = placedItem;
            dragMouseDown(event);
      }

      function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            var rightclick;
            if (e.which) {
                  rightclick = (e.which == 3);
            }
            else if (e.button) {
                  rightclick = (e.button == 2);
            }
            if (rightclick) {
                  return;
            }
            if (elmnt.id.includes(`placed`)) {
                  elmnt.id = null;
            }
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
            let inventoryItem = Array.from(elmnt.classList).find((value) => {
                  return value.includes(`dragItem`);
            });
            if (!inventoryItem) {
                  //PLACE CODE HERE FOR SPECIAL MOVEMENT OF ITEMS IN ROOM
            }
      }

      function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            let inventoryItem = Array.from(elmnt.classList).find((value) => {
                  return value.includes(`dragItem`);
            });
            if (!inventoryItem) {
                  //PLACE CODE HERE FOR SPECIAL MOVEMENT OF ITEMS IN ROOM
            }
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }

      function closeDragElement(event) {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
            let clickLocation = Object.create(locationObject);
            clickLocation.x = event.clientX;
            clickLocation.y = event.clientY;
            let overInventory = overlayCheck(clickLocation, `inventory`)[0];
            let inventoryItem = Array.from(elmnt.classList).find((value) => {
                  return value.includes(`dragItem`);
            });
            if (!inventoryItem) {
                  //PLACE CODE HERE FOR SPECIAL MOVEMENT OF ITEMS IN ROOM
                  let backToSpawn = overlayCheck(clickLocation, "holder");
                  if (backToSpawn[0]) {
                        elmnt.remove();
                  }
                  let onPipeLocation = overlayCheck(clickLocation, "pipe");
                  if (onPipeLocation[0] && Array.from(elmnt.classList).includes("draggablePipe") && !document.getElementById(`${onPipeLocation[0].id}, placed`)) {
                        elmnt.style.top = onPipeLocation[0].parentElement.offsetTop + onPipeLocation[0].offsetTop + onPipeLocation[0].offsetHeight / 2 - elmnt.offsetHeight / 2 + "px";
                        elmnt.style.left = onPipeLocation[0].parentElement.offsetLeft + onPipeLocation[0].offsetLeft + onPipeLocation[0].offsetWidth / 2 - elmnt.offsetWidth / 2 + "px";
                        if (onPipeLocation[0].debugPathColor) {
                              let color = new Color(onPipeLocation[0].debugPathColor[0], onPipeLocation[0].debugPathColor[1], onPipeLocation[0].debugPathColor[2]);
                              let solver = new Solver(color);
                              let result = solver.solve();
                              while(result.loss != 0) {
                                    result = solver.solve();
                              }
                              let filterCSS = result.filter;
                              elmnt.lastChild.style.filter = `opacity(50%) brightness(0%) ` + filterCSS.replace(`filter: `, ``).replace(`;`, ``);
                        }
                        elmnt.id = `${onPipeLocation[0].id}, placed`;
                  }
                  let onIntersection = overlayCheck(elmnt, "pipe");
                  if (onIntersection[0] && onIntersection[1] && Array.from(elmnt.classList).includes("draggableIntersection")) {
                        createIntersection(onIntersection[0], onIntersection[1], elmnt.numberID);
                        elmnt.remove();
                  }
                  if (onIntersection[0] && onIntersection[1] && Array.from(elmnt.classList).includes("draggableColorFilter")) {
                        createColorFilter(onIntersection[0], onIntersection[1], elmnt.color);
                        elmnt.remove();
                  }
                  if (onPipeLocation[0] && Array.from(elmnt.classList).includes("draggableEntrance")) {
                        createEntrance(onPipeLocation[0], elmnt.color);
                        elmnt.remove();
                  }
            }
            if (overInventory && inventoryItem) {
                  elmnt.remove();
                  elmnt.originalItem.style.opacity = `100%`;
                  elmnt.originalItem.onPage = false;
            }
            
      }
}

function mouseClick(event) {
      var rightclick;
      if (!event) {
            var event = window.event;
      }
      if (event.which) {
            rightclick = (event.which == 3);
      }
      else if (event.button) {
            rightclick = (event.button == 2);
      }
      if (rightclick) {// true or false
            if (debugState) {
                  if (event.target.tagName && event.target.tagName == `DIV`) {
                        if (Array.from(event.target.classList).includes("draggablePipe")) {
                              if (!event.target.rotation) {
                                    event.target.rotation = 0;
                              }
                              rotatePiece(event.target);
                        } else if (event.target.parentElement && Array.from(event.target.parentElement.classList).includes("draggablePipe")) {
                              if (!event.target.parentElement.rotation) {
                                    event.target.parentElement.rotation = 0;
                              }
                              rotatePiece(event.target.parentElement);
                        }
                        else if (Array.from(event.target.parentElement.classList).includes("intersection")) {
                              event.target.parentElement.remove();
                        }
                        else if (Array.from(event.target.classList).includes("colorFilter")) {
                              event.target.remove();
                        } else if (Array.from(event.target.classList).includes("liquidBox")) {
                              let connectedPipe = document.getElementById(`${event.target.id.split('/')[0]}`);
                              connectedPipe.classList.remove(`start`);
                              connectedPipe.classList.remove(`end`);
                              event.target.remove();
                        }
                  }
            }
      }
}

function overlayCheck(div, tagToCheck) {
      let points = Array.from(document.querySelectorAll(`.${tagToCheck}`));
      points.sort((a, b) => {
            let topfirst = a.style.top.replace("px", "") - b.style.top.replace("px", "");
            let leftfirst = a.style.left.replace("px", "") - b.style.left.replace("px", "");
            return leftfirst;
      });

      let allOverlaps = [];

      let rightPos = (elem) => elem.getBoundingClientRect().right;
      let leftPos = (elem) => elem.getBoundingClientRect().left;
      let topPos = (elem) => elem.getBoundingClientRect().top;
      let btmPos = (elem) => elem.getBoundingClientRect().bottom;

      for (let i = 0; i < points.length; i++) {
            let isOverlapping = !(
                  rightPos(div) < leftPos(points[i]) ||
                  leftPos(div) > rightPos(points[i]) ||
                  btmPos(div) < topPos(points[i]) ||
                  topPos(div) > btmPos(points[i])
            );

            if (isOverlapping) {
                  allOverlaps.push(points[i]);
            }
      }
      return allOverlaps;
}

const locationObject = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      getBoundingClientRect() {
            return { right: (this.x + this.width), left: (this.x), top: (this.y), bottom: (this.y + this.height) };
      }
}

function arraysEqual(a, b) {
      if (a === b) return true;
      if (a == null || b == null) return false;
      if (a.length !== b.length) return false;

      // If you don't care about the order of the elements inside
      // the array, you should sort both arrays here.
      // Please note that calling sort on an array will modify that array.
      // you might want to clone your array first.

      for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
      }
      return true;
}

function getAllIndexes(arr, val) {
      var indexes = [], i = -1;
      while ((i = arr.indexOf(val, i + 1)) != -1) {
            indexes.push(i);
      }
      return indexes;
}

function getKeyByArray(object, value) {
      return Object.keys(object).find(key => arraysEqual(object[key], value));
}

function shortestDistanceNode(distances, visited) {
      // create a default value for shortest
      let shortest = null;

      // for each node in the distances object
      for (let node in distances) {
            // if no node has been assigned to shortest yet
            // or if the current node's distance is smaller than the current shortest
            let currentIsShortest =
                  shortest === null || distances[node] < distances[shortest];

            // and if the current node is in the unvisited set
            if (currentIsShortest && !visited.includes(node)) {
                  // update shortest to be the current node
                  shortest = node;
            }
      }
      return shortest;
};

function findShortestPath(graph, startNode, endNode) {

      // track distances from the start node using a hash object
      let distances = {};
      distances[endNode] = "Infinity";
      distances = Object.assign(distances, graph[startNode]);// track paths using a hash object
      let parents = { endNode: null };
      for (let child in graph[startNode]) {
            parents[child] = startNode;
      }

      // collect visited nodes
      let visited = [];// find the nearest node
      let node = shortestDistanceNode(distances, visited);

      // for that node:
      while (node) {
            // find its distance from the start node & its child nodes
            let distance = distances[node];
            let children = graph[node];

            // for each of those child nodes:
            for (let child in children) {

                  // make sure each child node is not the start node
                  if (String(child) === String(startNode)) {
                        continue;
                  } else {
                        // save the distance from the start node to the child node
                        let newdistance = distance + children[child];// if there's no recorded distance from the start node to the child node in the distances object
                        // or if the recorded distance is shorter than the previously stored distance from the start node to the child node
                        if (!distances[child] || distances[child] > newdistance) {
                              // save the distance to the object
                              distances[child] = newdistance;
                              // record the path
                              parents[child] = node;
                        }
                  }
            }
            // move the current node to the visited set
            visited.push(node);// move to the nearest neighbor node
            node = shortestDistanceNode(distances, visited);
      }

      // using the stored paths from start node to end node
      // record the shortest path
      let shortestPath = [endNode];
      let parent = parents[endNode];
      while (parent) {
            shortestPath.push(parent);
            parent = parents[parent];
      }
      shortestPath.reverse();

      //this is the shortest path
      let results = {
            distance: distances[endNode],
            path: shortestPath,
      };
      // return the shortest path & the end node's distance from the start node
      return results;
};

function duplicateChildNodes(parentId) {
      var parent = document.getElementById(parentId);
      NodeList.prototype.forEach = Array.prototype.forEach;
      var children = parent.childNodes;
      children.forEach(function (item) {
            var cln = item.cloneNode(true);
            parent.appendChild(cln);
      });
};

class Color {
      constructor(r, g, b) { this.set(r, g, b); }
      toString() { return `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)})`; }

      set(r, g, b) {
            this.r = this.clamp(r);
            this.g = this.clamp(g);
            this.b = this.clamp(b);
      }

      hueRotate(angle = 0) {
            angle = angle / 180 * Math.PI;
            let sin = Math.sin(angle);
            let cos = Math.cos(angle);

            this.multiply([
                  0.213 + cos * 0.787 - sin * 0.213, 0.715 - cos * 0.715 - sin * 0.715, 0.072 - cos * 0.072 + sin * 0.928,
                  0.213 - cos * 0.213 + sin * 0.143, 0.715 + cos * 0.285 + sin * 0.140, 0.072 - cos * 0.072 - sin * 0.283,
                  0.213 - cos * 0.213 - sin * 0.787, 0.715 - cos * 0.715 + sin * 0.715, 0.072 + cos * 0.928 + sin * 0.072
            ]);
      }

      grayscale(value = 1) {
            this.multiply([
                  0.2126 + 0.7874 * (1 - value), 0.7152 - 0.7152 * (1 - value), 0.0722 - 0.0722 * (1 - value),
                  0.2126 - 0.2126 * (1 - value), 0.7152 + 0.2848 * (1 - value), 0.0722 - 0.0722 * (1 - value),
                  0.2126 - 0.2126 * (1 - value), 0.7152 - 0.7152 * (1 - value), 0.0722 + 0.9278 * (1 - value)
            ]);
      }

      sepia(value = 1) {
            this.multiply([
                  0.393 + 0.607 * (1 - value), 0.769 - 0.769 * (1 - value), 0.189 - 0.189 * (1 - value),
                  0.349 - 0.349 * (1 - value), 0.686 + 0.314 * (1 - value), 0.168 - 0.168 * (1 - value),
                  0.272 - 0.272 * (1 - value), 0.534 - 0.534 * (1 - value), 0.131 + 0.869 * (1 - value)
            ]);
      }

      saturate(value = 1) {
            this.multiply([
                  0.213 + 0.787 * value, 0.715 - 0.715 * value, 0.072 - 0.072 * value,
                  0.213 - 0.213 * value, 0.715 + 0.285 * value, 0.072 - 0.072 * value,
                  0.213 - 0.213 * value, 0.715 - 0.715 * value, 0.072 + 0.928 * value
            ]);
      }

      multiply(matrix) {
            let newR = this.clamp(this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2]);
            let newG = this.clamp(this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5]);
            let newB = this.clamp(this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8]);
            this.r = newR; this.g = newG; this.b = newB;
      }

      brightness(value = 1) { this.linear(value); }
      contrast(value = 1) { this.linear(value, -(0.5 * value) + 0.5); }

      linear(slope = 1, intercept = 0) {
            this.r = this.clamp(this.r * slope + intercept * 255);
            this.g = this.clamp(this.g * slope + intercept * 255);
            this.b = this.clamp(this.b * slope + intercept * 255);
      }

      invert(value = 1) {
            this.r = this.clamp((value + (this.r / 255) * (1 - 2 * value)) * 255);
            this.g = this.clamp((value + (this.g / 255) * (1 - 2 * value)) * 255);
            this.b = this.clamp((value + (this.b / 255) * (1 - 2 * value)) * 255);
      }

      hsl() { // Code taken from https://stackoverflow.com/a/9493060/2688027, licensed under CC BY-SA.
            let r = this.r / 255;
            let g = this.g / 255;
            let b = this.b / 255;
            let max = Math.max(r, g, b);
            let min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                  h = s = 0;
            } else {
                  let d = max - min;
                  s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                  switch (max) {
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                  } h /= 6;
            }

            return {
                  h: h * 100,
                  s: s * 100,
                  l: l * 100
            };
      }

      clamp(value) {
            if (value > 255) { value = 255; }
            else if (value < 0) { value = 0; }
            return value;
      }
}

class Solver {
      constructor(target) {
            this.target = target;
            this.targetHSL = target.hsl();
            this.reusedColor = new Color(0, 0, 0); // Object pool
      }

      solve() {
            let result = this.solveNarrow(this.solveWide());
            return {
                  values: result.values,
                  loss: result.loss,
                  filter: this.css(result.values)
            };
      }

      solveWide() {
            const A = 5;
            const c = 15;
            const a = [60, 180, 18000, 600, 1.2, 1.2];

            let best = { loss: Infinity };
            for (let i = 0; best.loss > 25 && i < 3; i++) {
                  let initial = [50, 20, 3750, 50, 100, 100];
                  let result = this.spsa(A, a, c, initial, 1000);
                  if (result.loss < best.loss) { best = result; }
            } return best;
      }

      solveNarrow(wide) {
            const A = wide.loss;
            const c = 2;
            const A1 = A + 1;
            const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
            return this.spsa(A, a, c, wide.values, 500);
      }

      spsa(A, a, c, values, iters) {
            const alpha = 1;
            const gamma = 0.16666666666666666;

            let best = null;
            let bestLoss = Infinity;
            let deltas = new Array(6);
            let highArgs = new Array(6);
            let lowArgs = new Array(6);

            for (let k = 0; k < iters; k++) {
                  let ck = c / Math.pow(k + 1, gamma);
                  for (let i = 0; i < 6; i++) {
                        deltas[i] = Math.random() > 0.5 ? 1 : -1;
                        highArgs[i] = values[i] + ck * deltas[i];
                        lowArgs[i] = values[i] - ck * deltas[i];
                  }

                  let lossDiff = this.loss(highArgs) - this.loss(lowArgs);
                  for (let i = 0; i < 6; i++) {
                        let g = lossDiff / (2 * ck) * deltas[i];
                        let ak = a[i] / Math.pow(A + k + 1, alpha);
                        values[i] = fix(values[i] - ak * g, i);
                  }

                  let loss = this.loss(values);
                  if (loss < bestLoss) { best = values.slice(0); bestLoss = loss; }
            } return { values: best, loss: bestLoss };

            function fix(value, idx) {
                  let max = 100;
                  if (idx === 2 /* saturate */) { max = 7500; }
                  else if (idx === 4 /* brightness */ || idx === 5 /* contrast */) { max = 200; }

                  if (idx === 3 /* hue-rotate */) {
                        if (value > max) { value = value % max; }
                        else if (value < 0) { value = max + value % max; }
                  } else if (value < 0) { value = 0; }
                  else if (value > max) { value = max; }
                  return value;
            }
      }

      loss(filters) { // Argument is array of percentages.
            let color = this.reusedColor;
            color.set(0, 0, 0);

            color.invert(filters[0] / 100);
            color.sepia(filters[1] / 100);
            color.saturate(filters[2] / 100);
            color.hueRotate(filters[3] * 3.6);
            color.brightness(filters[4] / 100);
            color.contrast(filters[5] / 100);

            let colorHSL = color.hsl();
            return Math.abs(color.r - this.target.r)
                  + Math.abs(color.g - this.target.g)
                  + Math.abs(color.b - this.target.b)
                  + Math.abs(colorHSL.h - this.targetHSL.h)
                  + Math.abs(colorHSL.s - this.targetHSL.s)
                  + Math.abs(colorHSL.l - this.targetHSL.l);
      }

      css(filters) {
            function fmt(idx, multiplier = 1) { return Math.round(filters[idx] * multiplier); }
            return `filter: invert(${fmt(0)}%) sepia(${fmt(1)}%) saturate(${fmt(2)}%) hue-rotate(${fmt(3, 3.6)}deg) brightness(${fmt(4)}%) contrast(${fmt(5)}%);`;
      }
}