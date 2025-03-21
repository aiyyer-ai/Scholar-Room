var board = document.getElementById('gameArea');
var dotHolder = document.getElementById(`dotHolder`);
var triangleLength = 190;
var yIterator = 0;
var xIterator = 0;
var nodeSnapPoints = [];
var depth = 0;
var nodeID = 0;
var nodeGraph = {};
var fullNodeGraph = {};
var rand;
var lineColor = `#FAE01F`;

var firstOffset;
var randomize = [false];
var dotsAtDepth;
var totalDepth;
var longestChain;
var batteryLocation;
var goalStrength;
var loadedStrength = 0;

var pathStyle = 0;
var storageToChange;
var batteryStorageToChange;
//example state
// var dotsAtDepth = {
// 	"0":[1,0],
// 	"1":[1,0,0],
// 	"2":[0,1,0],
// 	"3":[0,2,0],
// 	"4":[],
// 	"5":[0,2,0],
// 	"6":[0,1,0],
// 	"7":[1,0,0],
// 	"8":[1,0]
// };

//First State

// var firstOffset = false;
// var dotsAtDepth = {
// 	"0":[1,0],
// 	"1":[1,0,0],
// 	"2":[0,1,0],
// 	"3":['0',2,0],
// 	"4":[0,1,'0'],
// 	"5":[1,0,0],
// 	"6":[1,0]
// };

//End First State

//Second State

// var firstOffset = false;
// var dotsAtDepth = {
// 	"0":[1,0],
// 	"1":[1,0,0],
// 	"2":[0,1,0],
// 	"3":['0',2,0],
// 	"4":[0,1,0],
// 	"5":[1,0,'0'],
// 	"6":[1,0]
// };

//End Second State

//Third State
// var firstOffset = true;
// var randomize = false;
// var dotsAtDepth = {
// 	"0":[1,0,'0'],
// 	"1":['0','0',0],
// 	"2":[0,0,0,'0'],
// 	"3":[0,0,0],
// 	"4":[0,0,'0',0],
// 	"5":[0,0,'0'],
// 	"6":[1,0,0],
// };

// dotsAtDepth = {
//       "0": [0, '0'],
//       "1": [0, 0],
//       "2": [],
//       "3": [1, '0'],
//       "4": [1, '0'],
// };

// if (queryString.replace("?", "") == 2) {
//       firstOffset = false;
//       dotsAtDepth = {
//             "0": [0],
//             "1": [0, '0'],
//             "2": [0],
//             "3": ['0', '0'],
//             "4": [0],
//       };
// } else if (queryString.replace("?", "") == 3) {
//       firstOffset = true;
//       randomize = [false, 6];
//       dotsAtDepth = {
//             "0": [1, 0, '0'],
//             "1": ['0', '0', 0],
//             "2": [0, 0, 0, 0],
//             "3": [0, 0, 0],
//             "4": [0, '0', '0', 0],
//             "5": ['0', 0, 0],
//             "6": [1, 0, 0],
//             "7": [1, 0],
//       };
// } else if (queryString.replace("?", "") == `nobacktrack`) {
//       firstOffset = true;
//       randomize = [true, 5];
//       dotsAtDepth = {
//             "0": [0, 0, 0],
//             "1": [0, 0],
//             "2": [0, 0, 0],
//             "3": [0, 0],
//             "4": [0, 0, 0],
//             "5": [0, 0],
//             "6": [1, 0],
//       };
// } else if (queryString.replace("?", "") == `random`) {
//       firstOffset = true;
//       randomize = [true, 6];
//       dotsAtDepth = {
//             "0": [1, 0, 0],
//             "1": [0, 0, 0],
//             "2": [0, 0, 0, 0],
//             "3": [0, 0, 0],
//             "4": [0, 0, 0, 0],
//             "5": [0, 0, 0],
//             "6": [1, 0, 0],
//       };
// } else {
//       firstOffset = false;
//       dotsAtDepth = {
//             "0": [0, '0'],
//             "1": [0, 0, 0],
//             "2": [],
//             "3": [0, 1, '0'],
//             "4": [0, '0'],
//       };
// }

// var totalDepth = 6;
// var dotsAtDepth = {"0":2,"1":3,"2":4,"3":3,"4":4,"5":3,"6":2,"7":0};

//End Third State

var timeStart;
window.onload = (event) => {
      //time recording code
      timeStart = Date.now();
      //end time recording code
      //in case I want to make something run at launch
      document.onclick = movementCheck;
      let inventory = window.sessionStorage.getItem(`inventory`);
      if (!inventory || Object.keys(JSON.parse(inventory)).includes(`pegs`)) {
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
      let prevDiv = document.getElementById('previousPuzzle');
      let nextDiv = document.getElementById('nextPuzzle');
      switch (queryString.replace("?", "")) {
            case `3`:
                  firstOffset = true;
                  randomize = [false, 6];
                  dotsAtDepth = {
                        "0": [1, 0, '0'],
                        "1": ['0', '0', 0],
                        "2": [0, 0, 0, 0],
                        "3": [0, 0, 0],
                        "4": [0, '0', '0', 0],
                        "5": ['0', 0, 0],
                        "6": [1, 0, 0],
                        "7": [1, 0],
                  };
                  storageToChange = `voltage3`;
                  batteryStorageToChange = `voltage3BatteryLocation`;
                  nextDiv.style.visibility = 'hidden';
                  document.firstElementChild.style.backgroundImage = "url(./images/voltageBackground3.webp)";
                  break;
            case `2`:
                  firstOffset = false;
                  dotsAtDepth = {
                        "0": [0],
                        "1": [0, '0'],
                        "2": [0],
                        "3": ['0', '0'],
                        "4": [0],
                  };
                  storageToChange = `voltage2`;
                  batteryStorageToChange = `voltage2BatteryLocation`;
                  document.firstElementChild.style.backgroundImage = "url(./images/voltageBackground2.webp)";
                  break;
            case `1`:
            default:
                  firstOffset = false;
                  dotsAtDepth = {
                        "0": [0, '0'],
                        "1": [0, 0, 0],
                        "2": [],
                        "3": [0, 1, '0'],
                        "4": [0, '0'],
                  };
                  storageToChange = `voltage1`;
                  batteryStorageToChange = `voltage1BatteryLocation`;
                  document.firstElementChild.style.backgroundImage = "url(./images/voltageBackground1.webp)";
                  prevDiv.style.visibility = 'hidden';
      }
      totalDepth = Object.keys(dotsAtDepth).length - 1;
      let allArrays = Object.values(dotsAtDepth);
      longestChain = allArrays.sort((a, b) => {
            return a.reduce((accumulator, c) => {
                  if (c == 0) {
                        c++;
                  }
                  return accumulator + c;
            }, 0) - b.reduce((accumulator, d) => {
                  if (d == 0) {
                        d++;
                  }
                  return accumulator + d;
            }, 0);
      })[allArrays.length - 1].reduce((accumulator, e) => {
            if (e == 0) {
                  e++;
            }
            return accumulator + e;
      }, 0);
      setSeed();
}

function setSeed() {
      let seedString;
      //let seedString = document.getElementById('gameSeed').value;
      if (!seedString) {
            seedString = randomColor();
      }
      var seedHash = cyrb128(seedString);
      rand = sfc32(seedHash[0], seedHash[1], seedHash[2], seedHash[3]);

      //starting code
      Array.from(document.querySelectorAll(`.gridFill`)).forEach((element) => {
            element.delete();
      });

      goalStrength = Object.values(dotsAtDepth).flat().filter((value) => {
            return typeof value == `string`;
      }).length;
      generateDots(firstOffset);
      generateLines();
      if (randomize[0]) {
            generateGoalNodes(randomize[1]);
      }
      let strength = Array.from(document.querySelectorAll(`.goal`)).length;
      generateBattery(strength);
      Array.from(document.querySelectorAll(`.node`)).forEach((element) => {
            let connectedLines = overlayCheck(element, `line`);
            element.connectedLines = connectedLines;
      });

      document.addEventListener("mousedown", mouseClick);
}

function loadCode() {
      let potentialGraph = window.sessionStorage.getItem(storageToChange);
      if(potentialGraph) {
            let loadGraph = JSON.parse(potentialGraph);
            let pastConnections = [];
            for (let node of Object.entries(loadGraph)) {
                  for (let connection of Object.entries(node[1])) {
                        if(!pastConnections.includes(`${connection[0]},${node[0]}`) && connection[1] == 1) {
                              let lineIDArrayNew = [connection[0], node[0]];
                              lineIDArrayNew = lineIDArrayNew.sort(function (a, b) { return a - b; });
                              let fakeEvent = {
                                    target: document.getElementById(`${lineIDArrayNew[0]},${lineIDArrayNew[1]}`)
                              };
                              pastConnections.push(`${node[0]},${connection[0]}`);
                              toggleLine(fakeEvent);
                        }
                  }
            }
      }
      let potentialBattery = JSON.parse(window.sessionStorage.getItem(batteryStorageToChange));
      if(potentialBattery) {
            let overlayedNode = document.getElementById(potentialBattery);
            let battery = document.getElementsByClassName(`battery`)[0];
            battery.style.top = overlayedNode.offsetTop + "px";
            battery.style.left = overlayedNode.offsetLeft + "px";
            batteryLocation = { target: overlayedNode };
            if (batteryLocation) {
                  sendSignal(batteryLocation);
            }
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
      if (!timing_dict) {
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
      if (!timing_dict_level["time_spent"]) {
            timing_dict_level["time_spent"] = 0;
      }
      timing_dict_level["time_spent"] += Math.round(timeSpent);

      window.sessionStorage.setItem(`timeData`, JSON.stringify(timing_dict));
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
      pullDownInv(inventoryDiv);
      setTimeout(pullUpInv, 800, inventoryDiv);
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
                        // if(imgDiv.clientWidth > 200) {
                        addInv(`${item}Alt`, imgDiv, (altImgDiv) => {
                              if (altImgDiv) {
                                    imgDiv.appendChild(altImgDiv.children[0]);
                                    altImgDiv.remove();
                                    imgDiv.children[0].style.display = `none`;
                                    imgDiv.style.width = imgDiv.children[1].clientHeight * imgDiv.children[1].naturalWidth / imgDiv.children[1].naturalHeight + "px";
                              } else {
                                    imgDiv.style.width = imgDiv.children[0].clientHeight * imgDiv.children[0].naturalWidth / imgDiv.children[0].naturalHeight + "px";
                              }
                        });
                        // }
                        dragElement(imgDiv);
                        changeItemVisibility(item, itemValue);
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

function addImg(src, parentElement, imgCallback) {
      let newImg = new Image();
      newImg.src = `./images/${src}.webp`;
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

function movementCheck(event) {
      let clickLocation = Object.create(locationObject);
      clickLocation.x = event.clientX;
      clickLocation.y = event.clientY;
      if (Array.from(event.target.classList).includes(`leave`)) {
            setTimeSpent();
            window.location.href = `../index.html`;
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
            // resetGrid(rightclick);
      }
}

function goToPuzzle(direction) {
      setTimeSpent();
      const queryString = window.location.search;
      let previous = Array.from(direction.classList).filter((classes) => { return classes.includes(`prev`) })[0];
      let next = Array.from(direction.classList).filter((classes) => { return classes.includes(`next`) })[0];
      switch (queryString.replace("?", "")) {
            case "3":
                  if (previous) {
                        window.location.href = `./index.html?2`;
                  }
                  break;
            case "2":
                  if (previous) {
                        window.location.href = `./index.html?1`;
                  } else if (next) {
                        window.location.href = `./index.html?3`; 
                  }
                  break;
            case "1":
            default:
                  if (next) {
                        window.location.href = `./index.html?2`;
                  }
      }
}

function setStrength() {
      let strength = document.getElementById('strength').value;
      resetGrid();
      Array.from(document.querySelectorAll(`.gridButton`)).forEach((element) => {
            element.removeEventListener(`click`, toggleLine);
      });
}

function sendSignal(event) {
      let strength = Array.from(document.querySelectorAll(`.goal`)).length;
      resetGrid();
      Array.from(document.querySelectorAll(`.gridButton`)).forEach((element) => {
            element.removeEventListener(`click`, toggleLine);
      });
      if (strength == NaN) {
            return false;
      }
      // event.target.style.backgroundColor = `#FAE01F`;
      // event.target.style.border = `2px solid #7C638E`;
      if (pushSignal(event.target, strength)) {
            let touchedNodes = Array.from(document.querySelectorAll(`.completed`));
            let goalNodes = Array.from(document.querySelectorAll(`.goal`));
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
            if (arraysEqual(touchedNodes, goalNodes)) {
                  const queryString = window.location.search;
                  switch (queryString.replace("?", "")) {
                        case `3`:
                              workshopData.voltage[2] = true;
                              break;
                        case `2`:
                              workshopData.voltage[1] = true;
                              break;
                        case `1`:
                        default:
                              workshopData.voltage[0] = true;
                  }
                  console.log(workshopData);
                  window.sessionStorage.setItem(`workshopData`, JSON.stringify(workshopData));
            } else {
                  const queryString = window.location.search;
                  switch (queryString.replace("?", "")) {
                        case `3`:
                              workshopData.voltage[2] = false;
                              break;
                        case `2`:
                              workshopData.voltage[1] = false;
                              break;
                        case `1`:
                        default:
                              workshopData.voltage[0] = false;
                  }
                  window.sessionStorage.setItem(`workshopData`, JSON.stringify(workshopData));
            }
            Array.from(document.querySelectorAll(`.gridButton`)).forEach((element) => {
                  element.addEventListener(`click`, toggleLine);
            });
      }
}

function pushSignal(node, strength) {
      if (strength > 0) {
            let allShortestPaths = shortestPath(nodeGraph, node.id);
            let chosenGoal = [node.id, Infinity];
            Array.from(document.querySelectorAll(`.goal`)).forEach((element) => {
                  if (!element.classList.contains(`completed`)) {
                        if (allShortestPaths[element.id] < chosenGoal[1]) {
                              chosenGoal[0] = element.id;
                              chosenGoal[1] = allShortestPaths[element.id];
                              chosenGoal[2] = element.clickNumber;
                        } else if (allShortestPaths[element.id] == chosenGoal[1] && chosenGoal[1] != Infinity) {
                              let tempPathNew = findShortestPath(nodeGraph, node.id, element.id);
                              let tempPathOld = findShortestPath(nodeGraph, node.id, chosenGoal[0]);

                              let lineIDArrayNew = [tempPathNew.path[tempPathNew.path.length - 1], tempPathNew.path[tempPathNew.path.length - 2]];
                              lineIDArrayNew = lineIDArrayNew.sort(function (a, b) { return a - b; });
                              let lineIDNew = `${lineIDArrayNew[0]},${lineIDArrayNew[1]}`;
                              let lineNew = document.getElementById(`${lineIDNew}`);

                              let lineIDArrayOld = [tempPathOld.path[tempPathOld.path.length - 1], tempPathOld.path[tempPathOld.path.length - 2]];
                              lineIDArrayOld = lineIDArrayOld.sort(function (a, b) { return a - b; });
                              let lineIDOld = `${lineIDArrayOld[0]},${lineIDArrayOld[1]}`;
                              let lineOld = document.getElementById(`${lineIDOld}`);
                              if (lineNew.children[0].clickNumber < lineOld.children[0].clickNumber) {
                                    chosenGoal[0] = element.id;
                                    chosenGoal[1] = allShortestPaths[element.id];
                                    chosenGoal[2] = element.clickNumber;
                              }
                        }
                  }
            });
            let pathToGoal = findShortestPath(nodeGraph, node.id, chosenGoal[0]);
            let hitGoal = document.getElementById(`${chosenGoal[0]}`);
            if (strength == pathToGoal.path.length - 1) {
                  //success state
                  hitGoal.style.backgroundColor = lineColor;
                  for (let i = 0; i < pathToGoal.path.length - 1; i++) {
                        let lineIDArray = [pathToGoal.path[i], pathToGoal.path[i + 1]];
                        lineIDArray = lineIDArray.sort(function (a, b) { return a - b; });
                        let lineID = `${lineIDArray[0]},${lineIDArray[1]}`;
                        let line = document.getElementById(`${lineID}`);
                        if (Array.from(line.classList).includes(`poweredLine`)) {
                              line.children[0].classList.add('back');
                        } else {
                              //line.children[0].style.backgroundColor = lineColor;
                              line.children[0].classList.add(`poweredLine`);
                              // line.children[0].style.border = `2px solid #7C638E`;
                        }
                        let nodeInPath = document.getElementById(pathToGoal.path[i]);
                        if(!Array.from(nodeInPath.classList).includes(`goal`)) {
                              nodeInPath.classList.add(`onPath`);
                        }
                  }
                  hitGoal.classList.add(`completed`);
                  hitGoal.classList.add(`active`);
                  hitGoal.lastChild.lastChild.src = `./images/${strength - 1}.webp`;
                  hitGoal.lastChild.style.display = `block`;
                  let touchedNodes = Array.from(document.querySelectorAll(`.completed`));
                  let goalNodes = Array.from(document.querySelectorAll(`.goal`));
                  if (!arraysEqual(touchedNodes, goalNodes)) {
                        pushSignal(hitGoal, strength - 1);
                  }
            }
            else if (strength < pathToGoal.path.length) {
                  //failure state too weak
                  let wrongNode;
                  for (let i = 0; i < strength; i++) {
                        let lineIDArray = [pathToGoal.path[i], pathToGoal.path[i + 1]];
                        lineIDArray = lineIDArray.sort(function (a, b) { return a - b; });
                        let lineID = `${lineIDArray[0]},${lineIDArray[1]}`;
                        let line = document.getElementById(`${lineID}`);
                        //line.children[0].style.backgroundColor = lineColor;
                        line.children[0].classList.add(`poweredLine`);
                        // line.children[0].style.border = `2px solid #7C638E`;
                        let nodeInPath = document.getElementById(pathToGoal.path[i]);
                        if(!Array.from(nodeInPath.classList).includes(`goal`)) {
                              nodeInPath.classList.add(`onPath`);
                        }
                        wrongNode = document.getElementById(`${pathToGoal.path[i + 1]}`);
                  }
                  // wrongNode.style.boxShadow = `0 0 20px #E0403C`;
                  // wrongNode.style.border = `2px solid #E0403C`;
            }
            else {
                  //failure state too strong, carry onward til strength gone
                  if (hitGoal != node) {
                        hitGoal.lastChild.lastChild.src = `./images/warning.webp`;
                        hitGoal.lastChild.style.display = `block`;
                        hitGoal.style.color = `#E0403C`;
                  }
                  for (let i = 0; i < pathToGoal.path.length - 1; i++) {
                        let lineIDArray = [pathToGoal.path[i], pathToGoal.path[i + 1]];
                        lineIDArray = lineIDArray.sort(function (a, b) { return a - b; });
                        let lineID = `${lineIDArray[0]},${lineIDArray[1]}`;
                        let line = document.getElementById(`${lineID}`);
                        //line.children[0].style.backgroundColor = lineColor;
                        line.children[0].classList.add(`poweredLine`);
                        // line.children[0].style.border = `2px solid #7C638E`;
                        let nodeInPath = document.getElementById(pathToGoal.path[i]);
                        if(!Array.from(nodeInPath.classList).includes(`goal`)) {
                              nodeInPath.classList.add(`onPath`);
                        }
                  }
                  let nextNode = hitGoal;
                  for (let i = 0; i < (strength - (pathToGoal.path.length - 1)); i++) {
                        if(!Array.from(nextNode.classList).includes(`goal`)) {
                              nextNode.classList.add(`onPath`);
                        }
                        let connectedLines = overlayCheck(nextNode, `line`);
                        let nextLine = null;
                        for (const line of connectedLines) {
                              //if ((line.style.opacity == 1 && line.style.backgroundColor != `rgb(250, 224, 31)`) && !nextLine) {
                              if ((Array.from(line.classList).includes(`lineOn`) && !Array.from(line.classList).includes(`poweredLine`)) && !nextLine) {
                                    nextLine = line;
                              }
                        }
                        if (!nextLine) {
                              return true;
                        }
                        //nextLine.style.backgroundColor = lineColor;
                        nextLine.classList.add(`poweredLine`);
                        // nextLine.style.border = `2px solid #7C638E`;
                        nextNodeID = nextLine.parentElement.id.replace(nextNode.id, "").replace(",", "");
                        nextNode = document.getElementById(`${nextNodeID}`);
                  }
            }
      }
      return true;
}

function resetGrid(rightclick) {
      Array.from(document.querySelectorAll(`.node`)).forEach((element) => {
            // element.removeEventListener(`click`, sendSignal);
            element.visited = false;
            element.style.backgroundColor = ``;
            element.style.border = ``;
            element.style.boxShadow = ``;
            // element.innerHTML = ``;
            element.style.color = `#0078AB`;
      });
      Array.from(document.querySelectorAll(`.line`)).forEach((element) => {
            element.classList.remove('back');
            // element.style.backgroundColor = ``;
            element.classList.remove(`poweredLine`);
            element.style.border = ``;
      });
      Array.from(document.querySelectorAll(`.goal`)).forEach((element) => {
            // element.style.boxShadow = `0 0 20px #0078AB`;
            // element.style.border = `2px solid #0078AB`;
            element.classList.remove(`completed`);
            element.classList.remove(`active`);
            element.lastChild.style.display = `none`;
      });
      Array.from(document.querySelectorAll(`.onPath`)).forEach((element) => {
            element.classList.remove(`onPath`);
      });
      if (rightclick) {
            Array.from(document.querySelectorAll(`.line`)).forEach((element) => {
                  element.clickNumber = Infinity;
                  //element.style.opacity = `0.1`;
                  element.classList.remove(`lineOn`);
                  element.path = 0;
                  element.classList.remove('path1');
                  element.classList.remove('path2');
                  let adjacentNodes = overlayCheck(element, `node`);
                  nodeGraph[adjacentNodes[0].id][adjacentNodes[1].id] = Infinity;
                  nodeGraph[adjacentNodes[1].id][adjacentNodes[0].id] = Infinity;
                  const queryString = window.location.search;
                  switch (queryString.replace("?", "")) {
                        case `3`:
                              storageToChange = `voltage3`;
                              break;
                        case `2`:
                              storageToChange = `voltage2`;
                              break;
                        case `1`:
                        default:
                              storageToChange = `voltage1`;
                  }
                  window.sessionStorage.setItem(storageToChange, JSON.stringify(nodeGraph));
            });
      }
}

function shortestPath(graph, start) {
      // Create an object to store the shortest distance from the start node to every other node
      let distances = {};

      // A set to keep track of all visited nodes
      let visited = new Set();

      // Get all the nodes of the graph
      let nodes = Object.keys(graph);

      // Initially, set the shortest distance to every node as Infinity
      for (let node of nodes) {
            distances[node] = Infinity;
      }

      // The distance from the start node to itself is 0
      distances[start] = 0;

      // Loop until all nodes are visited
      while (nodes.length) {
            // Sort nodes by distance and pick the closest unvisited node
            nodes.sort((a, b) => distances[a] - distances[b]);
            let closestNode = nodes.shift();

            // If the shortest distance to the closest node is still Infinity, then remaining nodes are unreachable and we can break
            if (distances[closestNode] === Infinity) break;

            // Mark the chosen node as visited
            visited.add(closestNode);

            // For each neighboring node of the current node
            for (let neighbor in graph[closestNode]) {
                  // If the neighbor hasn't been visited yet
                  if (!visited.has(neighbor)) {
                        // Calculate tentative distance to the neighboring node
                        let newDistance = distances[closestNode] + graph[closestNode][neighbor];

                        // If the newly calculated distance is shorter than the previously known distance to this neighbor
                        if (newDistance < distances[neighbor]) {
                              // Update the shortest distance to this neighbor
                              distances[neighbor] = newDistance;
                        }
                  }
            }
      }

      // Return the shortest distance from the start node to all nodes
      return distances;
}

let shortestDistanceNode = (distances, visited) => {
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

let findShortestPath = (graph, startNode, endNode) => {

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

// function buttonSelect(button) {
//       Array.from(document.querySelectorAll(`.genButton`)).forEach((element) => {
//             element.classList.remove('pressed');
//       });
//       if (button.id == 'resetButton') {
//             resetGrid(true);
//             pathStyle = 0;
//       }
//       else {
//             button.classList.add('pressed');
//             if (button.id == 'singleButton') {
//                   pathStyle = 1;
//             } else if (button.id == 'doubleButton') {
//                   pathStyle = 2;
//             }
//       }
// }

var totalClicks = 0;
function toggleLine(event) {
      let line = event.target.children[0];
      if (!line) {
            line = event.target;
      }
      let adjacentNodes = overlayCheck(line, `node`);
      //if (line.style.opacity == `1`) {
      if (Array.from(line.classList).includes(`lineOn`)) {
            line.clickNumber = Infinity;
            // line.style.opacity = `0.1`;
            line.classList.remove(`lineOn`);
            nodeGraph[adjacentNodes[0].id][adjacentNodes[1].id] = Infinity;
            nodeGraph[adjacentNodes[1].id][adjacentNodes[0].id] = Infinity;
      } else {
            line.clickNumber = totalClicks;
            totalClicks++;
            // line.style.opacity = `1`;
            line.classList.add(`lineOn`);
            nodeGraph[adjacentNodes[0].id][adjacentNodes[1].id] = 1;
            nodeGraph[adjacentNodes[1].id][adjacentNodes[0].id] = 1;
      }

      const queryString = window.location.search;
      switch (queryString.replace("?", "")) {
            case `3`:
                  storageToChange = `voltage3`;
                  break;
            case `2`:
                  storageToChange = `voltage2`;
                  break;
            case `1`:
            default:
                  storageToChange = `voltage1`;
      }
      window.sessionStorage.setItem(storageToChange, JSON.stringify(nodeGraph));

      if (batteryLocation) {
            sendSignal(batteryLocation);
      }
}

// function togglePathType(event) {
//       console.log(pathStyle);
//       let line = event.target.children[0];
//       if (!line) {
//             line = event.target;
//       }
//       let adjacentNodes = overlayCheck(line, `node`);
//       console.log(line);
//       if (line.path == 0) {
//             console.log("A");
//             if (pathStyle != 0) {
//                   console.log("B");
//                   line.clickNumber = totalClicks;
//                   totalClicks++;
//                   line.style.opacity = `1`;
//                   line.path = pathStyle;
//                   line.classList.add(`path${pathStyle}`);
//                   nodeGraph[adjacentNodes[0].id][adjacentNodes[1].id] = 1;
//                   nodeGraph[adjacentNodes[1].id][adjacentNodes[0].id] = 1;  
//             }
//       } else {
//             if (line.path == pathStyle) {
//                   console.log("C");
//                   line.clickNumber = Infinity;
//                   line.style.opacity = `0.1`;
//                   line.classList.remove(`path${pathStyle}`);
//                   line.path = 0;
//                   nodeGraph[adjacentNodes[0].id][adjacentNodes[1].id] = Infinity;
//                   nodeGraph[adjacentNodes[1].id][adjacentNodes[0].id] = Infinity;
//             } else {
//                   console.log("D");
//                   line.classList.remove(`path${line.path}`);
//                   line.classList.add(`path${pathStyle}`);
//                   line.clickNumber = totalClicks;
//                   totalClicks++;
//                   line.style.opacity = `1`;
//                   line.path = pathStyle;
//                   nodeGraph[adjacentNodes[0].id][adjacentNodes[1].id] = 1;
//                   nodeGraph[adjacentNodes[1].id][adjacentNodes[0].id] = 1;
//             }
//       }
//       // console.log(line, line.path, pathStyle);
//       if (batteryLocation) {
//             sendSignal(batteryLocation);
//       }
// }

function generateGoalNodes(strength) {
      let keys = Object.keys(fullNodeGraph);
      let startingNode = keys[Math.floor(keys.length * rand())];
      let allDistances = shortestPath(fullNodeGraph, startingNode);
      let goalNodeIDs = [startingNode];
      for (i = 1; i < strength; i++) {
            var filtered = Object.keys(allDistances).reduce(function (filtered, key) {
                  if (allDistances[key] <= i && allDistances[key] != 0 && !goalNodeIDs.includes(key)) {
                        filtered[key] = allDistances[key];
                  }
                  return filtered;
            }, {});
            let nextNode = Object.keys(filtered)[Math.floor(Object.keys(filtered).length * rand())];
            goalNodeIDs.push(nextNode);
      }
      for (let nodeID of goalNodeIDs) {
            let node = document.getElementById(`${nodeID}`);
            // node.style.boxShadow = `0 0 20px #0078AB`;
            // node.style.border = `2px solid #0078AB`;
            node.classList.add(`goal`);
            addImg(`${strength}`, node, (imgDiv) => {
                  imgDiv.style.height = `60%`;
                  imgDiv.style.filter = `invert(100%)`;
                  imgDiv.style.display = `none`;
                  imgDiv.lastChild.onload = null;
                  imgDiv.style.zIndex = 10;
            });
      }
}

function getNextRight(x1, y1) {
      hyp = triangleLength, // hypotenuse
            theta_deg = 30, // theta angle in degrees
            rad = (parseFloat(theta_deg) * Math.PI) / 180, // convert deg to radians

            // opp = hyp * sin(θ)
            opp = Math.round((hyp * Math.sin(rad)) * 100) / 100, // opposite side

            // adj = √( (hyp * hyp) - (opp * opp) )
            adj = Math.round((Math.sqrt((hyp * hyp) - (opp * opp))) * 100) / 100, // adjacent side
            x2 = x1 + adj, y2 = y1 + opp; // end point

      return [x2, y2, adj, hyp];

}

function createNode() {
      var node = document.createElement(`div`);
      node.classList.add(`node`);
      node.classList.add(`gridFill`);
      node.id = nodeID;
      nodeID++;
      dotHolder.appendChild(node);
      nodeWidth = node.clientWidth;
      return node;
}

function generateDots(lastOffset) {
      if (depth <= totalDepth) {
            if (dotsAtDepth[depth].length) {
                  let triangleInfo = getNextRight(0, 0);
                  let offsetLeft = (window.innerWidth - 2 * triangleInfo[2] * (longestChain - 1)) / 2;
                  let offsetTop = (window.innerHeight - triangleInfo[1] * (totalDepth + 1)) / 2;
                  if (!lastOffset) {
                        //offset from Center
                        offsetLeft += triangleInfo[2];
                  }
                  let positionInRow = 0;
                  for (const node of dotsAtDepth[depth]) {
                        if (node == 0) {
                              let newNode = createNode();
                              newNode.style.top = `${offsetTop + triangleInfo[1] * depth}px`;
                              newNode.style.left = `${offsetLeft - newNode.clientWidth / 2 + 2 * triangleInfo[2] * (positionInRow)}px`;
                              nodeCenter = [Math.round(newNode.offsetLeft + newNode.clientWidth / 2), Math.round(newNode.offsetTop + newNode.clientHeight / 2)];
                              nodeSnapPoints.push(nodeCenter);
                              positionInRow++;
                              if (typeof node == `string`) {
                                    newNode.classList.add(`goal`);
                                    addImg(`1`, newNode, (imgDiv) => {
                                          imgDiv.style.height = `60%`;
                                          imgDiv.style.filter = `invert(100%)`;
                                          imgDiv.style.display = `none`;
                                          imgDiv.lastChild.onload = null;
                                          imgDiv.style.zIndex = 10;
                                          loadedStrength++;
                                          if(loadedStrength == goalStrength) {
                                                loadCode();
                                          }
                                    });
                              }
                        } else {
                              positionInRow += node;
                        }
                  }
            }
            depth++;
            generateDots(!lastOffset);
      }
}

function generateBattery(strength) {
      var battery = document.createElement(`div`);
      battery.classList.add(`battery`);
      //battery.innerHTML = `${strength}`;
      addImg(`${strength}`, battery, (imgDiv) => {
            imgDiv.style.height = `60%`;
            imgDiv.style.filter = `invert(100%)`;
            imgDiv.lastChild.onload = null;
            imgDiv.style.zIndex = 10;
      });
      dotHolder.appendChild(battery);
      let triangleInfo = getNextRight(0, 0);
      let offsetLeft = (window.innerWidth - 2 * triangleInfo[2] * (longestChain - 1)) / 2;
      let offsetTop = (window.innerHeight - triangleInfo[1] * (totalDepth + 1)) / 2;
      battery.style.top = `${(window.innerHeight - battery.clientHeight) / 2}px`;
      battery.style.left = `${Math.max(offsetLeft - battery.clientWidth * 3, 0)}px`;
      dragElement(battery);
      return battery;

}

function generateLines() {
      let lineID = 0;
      for (const property of nodeSnapPoints) {
            for (let i = -1; i <= 1; i++) {
                  const button = document.createElement(`button`);
                  button.classList.add(`gridButton`);
                  button.classList.add(`gridFill`);
                  dotHolder.appendChild(button);
                  button.id = lineID;
                  lineID++;
                  button.style.height = triangleLength + `px`;
                  button.style.width = triangleLength / 5 + `px`;
                  button.style.top = `${property[1]}px`;
                  button.style.left = `${(property[0] - button.style.width.replace("px", "") / 2)}px`;
                  button.style.transform = `rotate(${(i) * 60}deg)`;
                  button.addEventListener(`click`, toggleLine);
                  const line = document.createElement(`div`);
                  line.classList.add(`line`);
                  // line.style.opacity = `0.1`;
                  line.style.height = triangleLength + `px`;
                  line.style.width = triangleLength / 18 + `px`;
                  line.path = 0; 
                  button.appendChild(line);
                  let adjacentNodes = overlayCheck(button, `node`);
                  if (adjacentNodes.length != 2) {
                        button.remove();
                  } else {
                        let lineIDArray = [adjacentNodes[0].id, adjacentNodes[1].id];
                        lineIDArray = lineIDArray.sort(function (a, b) { return a - b; });
                        button.id = `${lineIDArray[0]},${lineIDArray[1]}`;
                        if (!nodeGraph[adjacentNodes[0].id]) {
                              nodeGraph[adjacentNodes[0].id] = {};
                        }
                        if (!nodeGraph[adjacentNodes[1].id]) {
                              nodeGraph[adjacentNodes[1].id] = {};
                        }
                        nodeGraph[adjacentNodes[0].id][adjacentNodes[1].id] = Infinity;
                        nodeGraph[adjacentNodes[1].id][adjacentNodes[0].id] = Infinity;
                        if (!fullNodeGraph[adjacentNodes[0].id]) {
                              fullNodeGraph[adjacentNodes[0].id] = {};
                        }
                        if (!fullNodeGraph[adjacentNodes[1].id]) {
                              fullNodeGraph[adjacentNodes[1].id] = {};
                        }
                        fullNodeGraph[adjacentNodes[0].id][adjacentNodes[1].id] = 1;
                        fullNodeGraph[adjacentNodes[1].id][adjacentNodes[0].id] = 1;
                  }
            }
      }
}

function randomColor() {
      let n = (Math.random() * 0xfffff * 1000000).toString(16);
      return '#' + n.slice(0, 6);
}

function arraysEqual(a, b) {
      if (a === b) return true;
      if (a == null || b == null) return false;
      if (a.length !== b.length) return false;

      let aNew = a;
      let bNew = b;
      aNew.sort();
      bNew.sort();

      for (var i = 0; i < aNew.length; ++i) {
            if (aNew[i] !== bNew[i]) return false;
      }
      return true;
}

function shuffle(array) {
      let currentIndex = array.length;

      // While there remain elements to shuffle...
      while (currentIndex != 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(rand() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                  array[randomIndex], array[currentIndex]];
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

//randomization code YOINKED

function cyrb128(str) {
      let h1 = 1779033703, h2 = 3144134277,
            h3 = 1013904242, h4 = 2773480762;
      for (let i = 0, k; i < str.length; i++) {
            k = str.charCodeAt(i);
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
      }
      h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
      h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
      h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
      h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
      h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
      return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

function sfc32(a, b, c, d) {
      return function () {
            a |= 0; b |= 0; c |= 0; d |= 0;
            var t = (a + b | 0) + d | 0;
            d = d + 1 | 0;
            a = b ^ b >>> 9;
            b = c + (c << 3) | 0;
            c = (c << 21 | c >>> 11);
            c = c + t | 0;
            return (t >>> 0) / 4294967296;
      }
}

//end randomization code YOINKED


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
            if (this.id == `pegs`) {
                  let nextPeg = Array.from(this.children).filter((peg) => { return !peg.onPage })[0];
                  placedItem = nextPeg.cloneNode(true);
                  placedItem.style.height = 300 + "px";
                  placedItem.style.width = 300 + "px";
                  nextPeg.style.opacity = `50%`;
                  nextPeg.onPage = true;
                  nextPeg.isPeg = true;
                  placedItem.originalItem = nextPeg;
                  if (Array.from(this.children).filter((peg) => { return !peg.onPage }).length == 0) {
                        this.onPage = true;
                  }
            } else {
                  placedItem = this.cloneNode(true);
                  placedItem.style.height = Math.min(500 * this.children[0].naturalHeight / this.children[0].naturalWidth, this.children[0].naturalHeight) + "px";
                  placedItem.style.width = placedItem.style.height.replace("px", "") * this.children[0].naturalWidth / this.children[0].naturalHeight + "px";
                  if (this.children.length > 1) {
                        placedItem.children[0].style.display = ``;
                        placedItem.children[1].style.display = `none`;
                        placedItem.style.height = Math.min(1000 * this.children[0].naturalHeight / this.children[0].naturalWidth, this.children[0].naturalHeight) + "px";
                        placedItem.style.width = placedItem.style.height.replace("px", "") * this.children[0].naturalWidth / this.children[0].naturalHeight + "px";
                  }
                  this.style.opacity = `50%`;
                  this.onPage = true;
                  placedItem.originalItem = this;
            }
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
            // get the mouse cursor position at startup:
            let inventoryItem = Array.from(elmnt.classList).find((value) => {
                  return value.includes(`dragItem`);
            });
            if(!inventoryItem) {
                  let overlayedNode = overlayCheck(elmnt, `node`);
                  if (overlayedNode[0] && !Array.from(overlayedNode[0].classList).includes(`goal`)) {
                        batteryLocation = null;
                        resetGrid();
                        const queryString = window.location.search;
                        switch (queryString.replace("?", "")) {
                              case `3`:
                                    batteryStorageToChange = `voltage3BatteryLocation`;
                                    break;
                              case `2`:
                                    batteryStorageToChange = `voltage2BatteryLocation`;
                                    break;
                              case `1`:
                              default:
                                    batteryStorageToChange = `voltage1BatteryLocation`;
                        }
                        window.sessionStorage.setItem(batteryStorageToChange, JSON.stringify(false));
                  }
            }
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
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
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }

      function closeDragElement(e) {
            let clickLocation = Object.create(locationObject);
            clickLocation.x = event.clientX;
            clickLocation.y = event.clientY;
            let overInventory = overlayCheck(clickLocation, `inventory`)[0];
            let inventoryItem = Array.from(elmnt.classList).find((value) => {
                  return value.includes(`dragItem`);
            });
            if (overInventory && inventoryItem) {
                  elmnt.remove();
                  elmnt.originalItem.style.opacity = `100%`;
                  elmnt.originalItem.onPage = false;
                  if (elmnt.originalItem.isPeg) {
                        elmnt.originalItem.parentElement.onPage = false;
                  }
            }
            if(!inventoryItem) {
                  let overlayedNode = overlayCheck(elmnt, `node`);
                  if (overlayedNode[0] && !Array.from(overlayedNode[0].classList).includes(`goal`)) {
                        elmnt.style.top = (overlayedNode[0].offsetTop) + "px";
                        elmnt.style.left = (overlayedNode[0].offsetLeft) + "px";
                        batteryLocation = { target: overlayedNode[0] };
                        const queryString = window.location.search;
                        switch (queryString.replace("?", "")) {
                              case `3`:
                                    batteryStorageToChange = `voltage3BatteryLocation`;
                                    break;
                              case `2`:
                                    batteryStorageToChange = `voltage2BatteryLocation`;
                                    break;
                              case `1`:
                              default:
                                    batteryStorageToChange = `voltage1BatteryLocation`;
                        }
                        window.sessionStorage.setItem(batteryStorageToChange, JSON.stringify(overlayedNode[0].id));
                        if (batteryLocation) {
                              sendSignal(batteryLocation);
                        }
                  }
            }
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
      }
}