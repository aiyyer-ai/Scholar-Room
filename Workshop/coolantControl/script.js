var SVGsLoaded = 0;
var correctNumber = 71;
//degrees Farenheit, I guess...

var liquidColor;

var timeStart;
window.onload = (event) => {
      //time recording code
      timeStart = Date.now();
      //end time recording code

      //ignores Right Click context Menu
      typeof window.addEventListener === `undefined` && (window.addEventListener = (e, cb) => window.attachEvent(`on${e}`, cb));
      window.addEventListener(`contextmenu`, (e) => {
            e.preventDefault();
      });
      //end ignore

      document.onclick = movementCheck;
      let inventory = window.sessionStorage.getItem(`inventory`);
      if (!inventory) {
            inventory = {
                  scholarDiary: true,
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

      let board = populateGrid();
      pieceDisplay(board);
      addIntersections(board);
      liquidColor = getComputedStyle(document.getElementsByClassName('pipeStart')[0]).getPropertyValue('background-color');
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

var totalHexes = 12;
var hexSize = 175;
let gameArea = document.getElementById('gameArea');

function populateGrid() {
      let hexHolder = document.createElement('div');
      hexHolder.classList.add(`board`);
      hexHolder.id = `board`;
      hexHolder.style.width = hexSize * 4 + `px`;
      gameArea.appendChild(hexHolder);
      for (i = 0; i < totalHexes; i++) {
            let newHex = document.createElement(`div`);
            newHex.classList.add(`hexElement`, `outerHex`);
            newHex.classList.add(`slot`);
            newHex.id = `${i}slot`;
            hexHolder.appendChild(newHex);
            if (i == 0 || i == 7) {
                  newHex.style.marginLeft = `${(100 / 4) / 2}%`;
            }
            if (i == 10) {
                  newHex.style.marginLeft = `${100 / 4}%`;
            }
            newHex.style.width = 100 / 4 + "%";
            newHex.style.marginBottom = -(100 / 4) / 3 + "%";
            let newInnerHex = document.createElement(`div`);
            newInnerHex.classList.add(`hexElement`, `innerHex`);
            newHex.appendChild(newInnerHex);
            newInnerHex.style.width = '85%';
            newInnerHex.style.top = 50 - Math.ceil(newInnerHex.clientHeight / (newHex.clientHeight * 2) * 100) + "%";
            newInnerHex.style.left = 50 - Math.ceil(newInnerHex.clientWidth / (newHex.clientWidth * 2) * 100) + "%";
      }
      return hexHolder;
}

function addIntersections(board) {
      let rotationAngle = [0, 0, 60, 300, 120, 240, 120, 240, 180];
      for (let boardHex of Array.from(board.children)) {
            //1 7 11
            for (i = 0; i < 3; i++) {
                  let newIntersection = document.createElement(`div`);
                  newIntersection.classList.add(`intersection`);
                  board.appendChild(newIntersection);
                  newIntersection.style.width = boardHex.clientWidth * .25 + "px";
                  newIntersection.style.height = boardHex.clientHeight * .10 + "px";
                  newIntersection.style.top = boardHex.offsetTop + boardHex.clientHeight / 2 - newIntersection.clientHeight / 2 + "px";
                  newIntersection.style.left = boardHex.offsetLeft + boardHex.clientWidth - newIntersection.clientWidth / 2 + "px";
                  newIntersection.style.transformOrigin = `${-boardHex.clientWidth / 2 + newIntersection.clientWidth / 2}px ${newIntersection.clientHeight / 2}px`;
                  newIntersection.style.transform = `rotate(${i * 60}deg)`;
                  let actualIntersection = document.createElement(`div`);
                  actualIntersection.classList.add(`actualIntersection`);
                  newIntersection.appendChild(actualIntersection);
                  actualIntersection.style.width = `68%`;
                  actualIntersection.style.height = `430%`;
                  actualIntersection.style.top = newIntersection.clientHeight / 2 - actualIntersection.clientHeight / 2 + "px";
                  actualIntersection.style.left = newIntersection.clientWidth / 2 - actualIntersection.clientWidth / 2 + "px";
                  let overTwoHexes = overlayCheck(newIntersection, `slot`);
                  if (overTwoHexes.length != 2) {
                        newIntersection.remove();
                  } else {
                        newIntersection.id = `${overTwoHexes[0].id}/${overTwoHexes[1].id}`;
                        newIntersection.style.opacity = `0%`;
                  }
            }
            if (boardHex.id != `4slot` && boardHex.id != `5slot` && boardHex.id != `8slot`) {
                  let newPipeEnd = document.createElement(`div`);
                  newPipeEnd.classList.add(`pipeExit`);
                  newPipeEnd.id = boardHex.id.replace(`slot`, `pipeEnd`);
                  board.appendChild(newPipeEnd);
                  newPipeEnd.style.width = boardHex.clientWidth * .18 + "px";
                  newPipeEnd.style.height = boardHex.clientHeight * .5 + "px";
                  newPipeEnd.style.top = boardHex.offsetTop - (boardHex.clientHeight / 6) + "px";
                  newPipeEnd.style.left = boardHex.offsetLeft + boardHex.clientWidth - newPipeEnd.clientWidth / 2 - 13 + "px";
                  let pipeBounds = newPipeEnd.getBoundingClientRect();
                  let hexBounds = boardHex.getBoundingClientRect();
                  let boundsDifference = hexBounds.top - pipeBounds.top;
                  newPipeEnd.style.transformOrigin = `${-boardHex.clientWidth / 2 + newPipeEnd.clientWidth / 2 + 13}px ${boundsDifference + boardHex.clientHeight / 2}px`;
                  newPipeEnd.style.transform = `rotate(${rotationAngle.shift()}deg)`;
                  if (boardHex.id == `1slot` || boardHex.id == `7slot` || boardHex.id == `11slot`) {
                        switch (boardHex.id) {
                              case `1slot`:
                                    newPipeEnd.classList.add(`pipeStart`);
                                    break;
                              case `7slot`:
                              case `11slot`:
                                    newPipeEnd.classList.add(`pipeEnd`);
                                    break;
                              default:
                                    console.log(`ERROR`);
                        }
                  }
            }
      }
}

function rotatePiece(piece) {
      let possibleRotations = [0, 60, 120, 180, 240, 300];
      let rotationIndex = possibleRotations.indexOf(piece.rotation) + 1 == possibleRotations.length ? 0 : possibleRotations.indexOf(piece.rotation) + 1;
      let rotation = possibleRotations[rotationIndex];
      let hexNum = 0;
      let hasNumber = false;
      for (const hex of piece.children) {
            if (tileSystem[piece.id][rotation][hexNum]) {
                  if (!hasNumber) {
                        hasNumber = true;
                        hex.appendChild(piece.numberDisplay);
                  }
                  hex.classList.remove(`invisiblePiece`);
                  hex.classList.add(`placeCheck`);
                  dragElement(hex);
            } else {
                  hex.classList.remove(`placeCheck`);
                  hex.classList.add(`invisiblePiece`);
                  hex.onmousedown = null;
            }
            hexNum++;
      }
      piece.rotation = rotation;
}

function pieceDisplay(board) {
      let pieceHolderLeft = document.createElement(`div`);
      pieceHolderLeft.classList.add(`pieceHolder`);
      pieceHolderLeft.id = `leftHolder`;
      gameArea.appendChild(pieceHolderLeft);
      pieceHolderLeft.style.width = hexSize * 1.5 + `px`;
      pieceHolderLeft.style.height = window.innerHeight - hexSize + 'px';
      pieceHolderLeft.style.left = hexSize / 2 + `px`;
      pieceHolderLeft.style.top = hexSize / 2 + `px`;
      generatePiecesFromSystem(pieceHolderLeft);
      let pieceHolderRight = document.createElement(`div`);
      pieceHolderRight.classList.add(`pieceHolder`);
      pieceHolderRight.id = `rightHolder`;
      gameArea.appendChild(pieceHolderRight);
      pieceHolderRight.style.width = hexSize * 1.5 + `px`;
      pieceHolderRight.style.height = window.innerHeight - hexSize + 'px';
      pieceHolderRight.style.right = hexSize / 2 + `px`;
      pieceHolderRight.style.top = hexSize / 2 + `px`;
      generatePiecesFromSystem(pieceHolderRight);

      //temperature Display

      let thermometerBase = document.createElement(`div`);
      thermometerBase.classList.add(`thermometerBase`);
      gameArea.appendChild(thermometerBase);
      thermometerBase.style.width = hexSize * .4 + `px`;
      thermometerBase.style.height = hexSize * .4 + 'px';
      thermometerBase.style.left = pieceHolderLeft.getBoundingClientRect().right + (board.getBoundingClientRect().left - pieceHolderLeft.getBoundingClientRect().right - thermometerBase.clientWidth) / 2 + `px`;
      thermometerBase.style.top = (window.innerHeight - 576) / 2 + 576 - thermometerBase.clientHeight + `px`;
      thermometerBase.style.zIndex = -2;
      let thermometer = document.createElement(`div`);
      thermometer.classList.add(`thermometer`);
      thermometer.id = `thermometer`;
      thermometerBase.appendChild(thermometer);
      thermometer.style.width = hexSize * .2 + `px`;
      thermometer.style.height = 576 + 'px';
      thermometer.style.bottom = hexSize * .4 - 5 + `px`;
      let thermometerBar = document.createElement(`div`);
      thermometerBar.classList.add(`thermometerBar`);
      thermometerBar.id = `thermometerBar`;
      thermometer.appendChild(thermometerBar);
      let thermometerScale = document.createElement(`div`);
      thermometerScale.classList.add(`thermometerScale`);
      thermometerScale.id = `thermometerScale`;
      thermometer.appendChild(thermometerScale);
      thermometerScale.style.zIndex = 2;
      thermometer.style.zIndex = -1;
}

var tileSystem = [
      {
            0: [
                  1, 1, 0,
                  0, 0, 1, 0,
                  0, 0, 0,
                  0, 0,
            ],
            60: [
                  0, 1, 0,
                  0, 0, 1, 0,
                  0, 1, 0,
                  0, 0,
            ],
            120: [
                  0, 0, 0,
                  0, 0, 1, 0,
                  1, 1, 0,
                  0, 0,
            ],
            180: [
                  0, 0, 0,
                  1, 0, 0, 0,
                  1, 1, 0,
                  0, 0,
            ],
            240: [
                  1, 0, 0,
                  1, 0, 0, 0,
                  1, 0, 0,
                  0, 0,
            ],
            300: [
                  1, 1, 0,
                  1, 0, 0, 0,
                  0, 0, 0,
                  0, 0,
            ],
            number: 24
      },
      {
            0: [
                  1, 1, 0,
                  0, 1, 1, 0,
                  0, 0, 0,
                  0, 0,
            ],
            60: [
                  0, 1, 0,
                  0, 1, 1, 0,
                  0, 1, 0,
                  0, 0,
            ],
            120: [
                  0, 0, 0,
                  0, 1, 1, 0,
                  1, 1, 0,
                  0, 0,
            ],
            180: [
                  0, 0, 0,
                  1, 1, 0, 0,
                  1, 1, 0,
                  0, 0,
            ],
            240: [
                  1, 0, 0,
                  1, 1, 0, 0,
                  1, 0, 0,
                  0, 0,
            ],
            300: [
                  1, 1, 0,
                  1, 1, 0, 0,
                  0, 0, 0,
                  0, 0,
            ],
            number: 17
      },
      {
            0: [
                  0, 0, 0,
                  1, 1, 1, 0,
                  0, 0, 0,
                  0, 0,
            ],
            60: [
                  1, 0, 0,
                  0, 1, 0, 0,
                  0, 1, 0,
                  0, 0,
            ],
            120: [
                  0, 1, 0,
                  0, 1, 0, 0,
                  1, 0, 0,
                  0, 0,
            ],
            180: [
                  0, 0, 0,
                  1, 1, 1, 0,
                  0, 0, 0,
                  0, 0,
            ],
            240: [
                  1, 0, 0,
                  0, 1, 0, 0,
                  0, 1, 0,
                  0, 0,
            ],
            300: [
                  0, 1, 0,
                  0, 1, 0, 0,
                  1, 0, 0,
                  0, 0,
            ],
            number: 22
      },
      {
            0: [
                  0, 1, 0,
                  1, 1, 0, 0,
                  1, 0, 0,
                  0, 0,
            ],
            60: [
                  1, 0, 0,
                  1, 1, 1, 0,
                  0, 0, 0,
                  0, 0,
            ],
            120: [
                  1, 1, 0,
                  0, 1, 0, 0,
                  0, 1, 0,
                  0, 0,
            ],
            180: [
                  0, 1, 0,
                  0, 1, 1, 0,
                  1, 0, 0,
                  0, 0,
            ],
            240: [
                  0, 0, 0,
                  1, 1, 1, 0,
                  0, 1, 0,
                  0, 0,
            ],
            300: [
                  1, 0, 0,
                  0, 1, 0, 0,
                  1, 1, 0,
                  0, 0,
            ],
            number: 45
      },
      {
            0: [
                  1, 0, 1,
                  1, 1, 1, 0,
                  0, 0, 0,
                  0, 0,
            ],
            60: [
                  1, 1, 0,
                  0, 1, 0, 0,
                  0, 1, 1,
                  0, 0,
            ],
            120: [
                  0, 1, 0,
                  0, 1, 1, 0,
                  1, 0, 0,
                  1, 0,
            ],
            180: [
                  0, 0, 0,
                  0, 1, 1, 1,
                  1, 0, 1,
                  0, 0,
            ],
            240: [
                  0, 0, 0,
                  1, 1, 0, 0,
                  0, 1, 0,
                  1, 1,
            ],
            300: [
                  0, 1, 0,
                  0, 0, 1, 0,
                  1, 1, 0,
                  1, 0,
            ],
            number: 32
      },
      {
            0: [
                  0, 1, 0,
                  0, 0, 0, 0,
                  0, 0, 0,
                  0, 0,
            ],
            60: [
                  0, 1, 0,
                  0, 0, 0, 0,
                  0, 0, 0,
                  0, 0,
            ],
            120: [
                  0, 1, 0,
                  0, 0, 0, 0,
                  0, 0, 0,
                  0, 0,
            ],
            180: [
                  0, 1, 0,
                  0, 0, 0, 0,
                  0, 0, 0,
                  0, 0,
            ],
            240: [
                  0, 1, 0,
                  0, 0, 0, 0,
                  0, 0, 0,
                  0, 0,
            ],
            300: [
                  0, 1, 0,
                  0, 0, 0, 0,
                  0, 0, 0,
                  0, 0,
            ],
            number: 8
      },
      {
            0: [
                  0, 0, 0,
                  0, 1, 1, 0,
                  1, 0, 1,
                  0, 0,
            ],
            60: [
                  0, 0, 0,
                  0, 1, 1, 0,
                  0, 0, 1,
                  0, 1,
            ],
            120: [
                  0, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 1,
                  1, 1,
            ],
            180: [
                  0, 0, 0,
                  0, 0, 0, 0,
                  1, 0, 1,
                  1, 1,
            ],
            240: [
                  0, 0, 0,
                  0, 1, 0, 0,
                  1, 0, 0,
                  1, 1,
            ],
            300: [
                  0, 0, 0,
                  0, 1, 1, 0,
                  1, 0, 0,
                  1, 0,
            ],
            number: 19
      },
      {
            0: [
                  1, 1, 0,
                  0, 0, 1, 0,
                  0, 0, 0,
                  0, 0,
            ],
            60: [
                  0, 1, 0,
                  0, 0, 1, 0,
                  0, 1, 0,
                  0, 0,
            ],
            120: [
                  0, 0, 0,
                  0, 0, 1, 0,
                  1, 1, 0,
                  0, 0,
            ],
            180: [
                  0, 0, 0,
                  1, 0, 0, 0,
                  1, 1, 0,
                  0, 0,
            ],
            240: [
                  1, 0, 0,
                  1, 0, 0, 0,
                  1, 0, 0,
                  0, 0,
            ],
            300: [
                  1, 1, 0,
                  1, 0, 0, 0,
                  0, 0, 0,
                  0, 0,
            ],
            number: 7
      },
      {
            0: [
                  1, 1, 0,
                  0, 0, 1, 0,
                  0, 0, 1,
                  0, 0,
            ],
            60: [
                  0, 1, 0,
                  0, 0, 1, 0,
                  0, 1, 0,
                  1, 0,
            ],
            120: [
                  0, 0, 0,
                  0, 0, 0, 1,
                  1, 1, 1,
                  0, 0,
            ],
            180: [
                  1, 0, 0,
                  0, 1, 0, 0,
                  0, 1, 1,
                  0, 0,
            ],
            240: [
                  0, 1, 0,
                  0, 1, 0, 0,
                  1, 0, 0,
                  1, 0,
            ],
            300: [
                  0, 0, 0,
                  0, 1, 1, 1,
                  1, 0, 0,
                  0, 0,
            ],
            number: 12
      },
      {
            0: [
                  1, 1, 0,
                  0, 1, 0, 0,
                  0, 0, 0,
                  0, 0,
            ],
            60: [
                  0, 1, 0,
                  0, 1, 1, 0,
                  0, 0, 0,
                  0, 0,
            ],
            120: [
                  0, 0, 0,
                  0, 1, 1, 0,
                  0, 1, 0,
                  0, 0,
            ],
            180: [
                  0, 0, 0,
                  0, 1, 0, 0,
                  1, 1, 0,
                  0, 0,
            ],
            240: [
                  0, 0, 0,
                  1, 1, 0, 0,
                  1, 0, 0,
                  0, 0,
            ],
            300: [
                  1, 0, 0,
                  1, 1, 0, 0,
                  0, 0, 0,
                  0, 0,
            ],
            number: 27
      },
];

function generatePiecesFromSystem(parent) {
      let multiplier = 1.15;
      let miniHexSize = (hexSize * multiplier) / 4;
      let boardShape = document.getElementById(`board`);
      let lastShapeBottom = 0;
      let parentPieces = parent.id.includes(`left`) ? tileSystem.slice(0, Math.ceil(tileSystem.length / 2)) : tileSystem.slice(Math.ceil(tileSystem.length / 2), tileSystem.length);
      let totalHeight = 0;
      for (const piece of parentPieces) {
            let newShape = boardShape.cloneNode(true);
            newShape.classList.remove(`board`);
            newShape.classList.add(`shape`);
            newShape.classList.add(`selection`);
            newShape.style.width = miniHexSize * 4 * multiplier + "px";
            newShape.id = tileSystem.indexOf(piece);
            newShape.numberID = piece.number;
            parent.appendChild(newShape);
            let hexNum = 0;
            let top, bottom, left, right;
            top = left = Infinity;
            bottom = right = 0;
            for (const hex of newShape.children) {
                  hex.classList.remove(`slot`);
                  hex.classList.add(`touchable`);
                  hex.style.marginBottom = -(100 / 4) / 2.5 + "%";
                  hex.style.backgroundColor = `black`;
                  hex.style.backgroundImage = `none`;
                  hex.firstChild.style.backgroundColor = `black`;
                  if (piece[0][hexNum]) {
                        dragElement(hex);
                        let hexBounds = hex.getBoundingClientRect();
                        if (hexBounds.top < top) {
                              top = Math.ceil(hexBounds.top);
                        }
                        if (hexBounds.bottom > bottom) {
                              bottom = Math.ceil(hexBounds.bottom);
                        }
                        if (hexBounds.left < left) {
                              left = Math.ceil(hexBounds.left);
                        }
                        if (hexBounds.right > right) {
                              right = Math.ceil(hexBounds.right);
                        }
                        if (!newShape.pickupPoint) {
                              newShape.pickupPoint = {
                                    top: (hexBounds.top - newShape.offsetTop - parent.offsetTop),
                                    left: (hexBounds.left - newShape.offsetLeft - parent.offsetLeft)
                              };
                              addSVG(piece.number, hex, (div) => {
                                    div.style.filter = `invert(100%)`;
                                    div.style.width = 60 + "%";
                                    div.style.height = div.clientWidth / hex.clientHeight * 100 + "%";
                                    div.style.top = 50 - Math.ceil(div.clientHeight / (hex.clientHeight * 2) * 100) + "%";
                                    div.style.left = 50 - Math.ceil(div.clientWidth / (hex.clientWidth * 2) * 100) + "%";
                                    newShape.numberDisplay = div;
                                    SVGsLoaded++;
                                    if(SVGsLoaded == tileSystem.length) {
                                          placePiecesOnBoard();
                                    }
                              });
                        }
                  } else {
                        hex.classList.add(`invisiblePiece`);
                  }
                  hexNum++;
            }
            let pieceOffsetTop = ((top - parent.offsetTop) - newShape.offsetTop);
            let pieceOffsetLeft = ((left - parent.offsetLeft) - newShape.offsetLeft);
            newShape.style.left = parent.clientWidth / 2 - (right - left) / 2 - pieceOffsetLeft + "px";
            newShape.style.top = lastShapeBottom - pieceOffsetTop + "px";
            totalHeight += bottom - top;
            lastShapeBottom = bottom - top + newShape.offsetTop + pieceOffsetTop;
      }
      //pieceGap should be height of parent minus size of all pieces divided by total number of pieces
      let pieceGap = Math.ceil((parent.clientHeight - totalHeight) / (parentPieces.length + 1));
      let childIterator = 1;
      for (let childShape of parent.children) {
            childShape.style.top = childShape.offsetTop + pieceGap * childIterator + "px";
            childIterator++
      }
}

function placePiecesOnBoard() {
      let piecePositions = window.sessionStorage.getItem(`temperaturePieces`);
      if(!piecePositions) {
            piecePositions = {};
            Array.from(document.querySelectorAll(`.selection`)).forEach((piece) => {
                  piecePositions[piece.id] = false;
            });
            window.sessionStorage.setItem(`temperaturePieces`, JSON.stringify(piecePositions));
      } else {
            piecePositions = JSON.parse(piecePositions);
      }
      for (let locationData of Object.entries(piecePositions)) {
            if(locationData[1]) {
                  let pieceSelector = document.getElementById(locationData[0]);
                  const event = new MouseEvent("mousedown", {
                        clientX: locationData[1].x,
                        clientY: locationData[1].y,
                        shiftKey: true,
                        view: window,
                        bubbles: true,
                        cancelable: true,
                  });
                  let selectorChild = Array.from(pieceSelector.children).filter((childDiv) => {
                        return Array.from(childDiv.classList).includes(`touchable`) && !Array.from(childDiv.classList).includes(`invisiblePiece`);
                  })[0];
                  selectorChild.dispatchEvent(event);
                  let newPiece = Array.from(document.getElementsByClassName(`dragHex`)).filter((element) => {
                        return element.id == pieceSelector.id;
                  })[0];
                  for (i = 0; i < locationData[1].rotation / 60; i++) {
                        const event = new MouseEvent("mousedown", {
                              clientX: locationData[1].x,
                              clientY: locationData[1].y,
                              button: 2,
                              shiftKey: true,
                              view: window,
                              bubbles: true,
                              cancelable: true,
                        });
                        let newChild = Array.from(newPiece.children).filter((childDiv) => {
                              return Array.from(childDiv.classList).includes(`placeCheck`);
                        })[0];
                        newChild.dispatchEvent(event);
                  }
                  let newChild = Array.from(newPiece.children).filter((childDiv) => {
                        return Array.from(childDiv.classList).includes(`placeCheck`);
                  })[0];
                  const finalEvent = new MouseEvent("mousedown", {
                        clientX: locationData[1].x,
                        clientY: locationData[1].y,
                        shiftKey: true,
                        view: window,
                        bubbles: true,
                        cancelable: true,
                  });
                  newChild.dispatchEvent(finalEvent);
            }
      }
}

function addSVG(src, parentElement, imgCallback) {
      let newImg = new Image();
      newImg.src = `./images/SVGNumbers/${src}.svg`;
      newImg.onload = addToPage;
      function addToPage(event) {
            let newDiv = document.createElement(`div`);
            if (parentElement) {
                  parentElement.appendChild(newDiv);
            }
            newDiv.classList.add(`hexContainer`);
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
            let selectionItem = Array.from(elmnt.parentElement.classList).find((value) => {
                  return value.includes(`selection`);
            });
            let inventoryItem = Array.from(elmnt.classList).find((value) => {
                  return value.includes(`inventoryItem`);
            });
            if (selectionItem) {
                  elmnt.onmousedown = copyAndDrag;
            } else if(inventoryItem) {
                  elmnt.onmousedown = copyAndDragInv;
            } else {
                  elmnt.onmousedown = dragMouseDown;
            }
      }

      function copyAndDrag(event) {
            if(this.parentElement.taken) {
                  return;
            }
            let newPiece = this.parentElement.cloneNode(true);
            this.parentElement.taken = true;
            this.parentElement.style.filter = `opacity(50%)`;
            gameArea.appendChild(newPiece);
            newPiece.classList.add(`dragHex`);
            newPiece.classList.remove(`selection`);
            newPiece.style.width = 4 * hexSize + "px";
            newPiece.style.left = (this.parentElement.parentElement.offsetLeft + this.parentElement.offsetLeft + this.offsetLeft) - (this.parentElement.pickupPoint.left * 4) + "px";
            newPiece.style.top = (this.parentElement.parentElement.offsetTop + this.parentElement.offsetTop + this.offsetTop) - (this.parentElement.pickupPoint.top * 4) + "px";
            newPiece.originalPiece = this.parentElement;
            newPiece.rotation = 0;
            newPiece.numberID = this.parentElement.numberID;
            for (let child of newPiece.children) {
                  if (child.children.length >= 2) {
                        newPiece.numberDisplay = child.lastChild;
                  }
            }
            elmnt = null;
            for (let hex of Array.from(newPiece.children)) {
                  if (!Array.from(hex.classList).includes(`invisiblePiece`)) {
                        hex.onmousedown = null;
                        hex.classList.add(`placeCheck`);
                        if (!elmnt) {
                              elmnt = hex;
                        }
                        dragElement(hex);
                  }
                  hex.style.marginBottom = -(100 / 4) / 3 + "%";
            }
            dragMouseDown(event);
      }

      function copyAndDragInv(event) {
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
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;

            let inventoryItem = Array.from(elmnt.classList).find((value) => {
                  return value.includes(`dragItem`);
            });
            if (!inventoryItem) {
                  //PLACE CODE HERE FOR SPECIAL MOVEMENT OF ITEMS IN ROOM
                  if (Array.from(elmnt.parentElement.classList).includes(`onBoard`)) {
                        for (let hex of elmnt.parentElement.children) {
                              if (Array.from(hex.classList).includes(`placeCheck`)) {
                                    hex.classList.remove(`snapped`);
                              }
                        }
                        for (let boardHex of elmnt.parentElement.onBoard) {
                              if ((Array.from(boardHex.classList).includes(`hexContainer`))) {
                                    boardHex.remove();
                              } else if ((Array.from(boardHex.classList).includes(`innerHex`))) {
                                    boardHex.style.backgroundColor = '';
                              } else {
                                    boardHex.style.opacity = '0%';
                              }
                        }
                        elmnt.parentElement.classList.remove(`onBoard`);
                        elmnt.parentElement.onBoard = [];

                        let thermometerBar = document.getElementById(`thermometerBar`);
                        let totalTemp = 0;
                        Array.from(document.querySelectorAll(`.onBoard`)).forEach((onBoardPiece) => {
                              let pieceNumber = Number(onBoardPiece.numberID);
                              totalTemp += pieceNumber;
                        });
                        let baseHeight = Number(getComputedStyle(thermometerBar).getPropertyValue('--thermometerBaseHeight').replace(`px`, ``));
                        thermometerBar.style.height = baseHeight + (totalTemp * 5) + "px";

                        let piecePositions = window.sessionStorage.getItem(`temperaturePieces`);
                        if(!piecePositions) {
                              piecePositions = {};
                              Array.from(document.querySelectorAll(`.selection`)).forEach((piece) => {
                                    piecePositions[piece.id] = false;
                              });
                              window.sessionStorage.setItem(`temperaturePieces`, JSON.stringify(piecePositions));
                        } else {
                              piecePositions = JSON.parse(piecePositions);
                        }
                        if(piecePositions[elmnt.parentElement.id]) {
                              piecePositions[elmnt.parentElement.id] = false;
                              window.sessionStorage.setItem(`temperaturePieces`, JSON.stringify(piecePositions));
                              Array.from(document.querySelectorAll(`.pipeExit`)).forEach((pipeEnd) => {
                                    if (pipeEnd.style.backgroundColor) {
                                          pipeEnd.style.backgroundColor = '';
                                    }
                              });
                              Array.from(document.querySelectorAll(`.intersection`)).forEach((intersection) => {
                                    if (intersection.firstChild.style.backgroundColor) {
                                          intersection.style.opacity = `0%`;
                                          intersection.firstChild.style.backgroundColor = ``;
                                    }
                              });
                        }

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
                        workshopData[`temperature`] = false;
                        window.sessionStorage.setItem(`workshopData`, JSON.stringify(workshopData));

                  }
            }

            var rightclick;
            if (e.which) {
                  rightclick = (e.which == 3);
            }
            else if (e.button) {
                  rightclick = (e.button == 2);
            }
            if (rightclick) {
                  rotatePiece(elmnt.parentElement);
                  return closeDragElement(e);
            }

            if (e.shiftKey) {
                  elmnt.parentElement.style.top = e.clientY + "px";
                  elmnt.parentElement.style.left = e.clientX + "px";
                  return closeDragElement(e);
            }
            document.onmouseup = closeDragElement;
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
            let inventoryItem = Array.from(elmnt.classList).find((value) => {
                  return value.includes(`dragItem`);
            });
            if (!inventoryItem) {
                  //PLACE CODE HERE FOR SPECIAL MOVEMENT OF ITEMS IN ROOM
                  elmnt.parentElement.style.top = (elmnt.parentElement.offsetTop - pos2) + "px";
                  elmnt.parentElement.style.left = (elmnt.parentElement.offsetLeft - pos1) + "px";
            } else {
                  elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                  elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }
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
                  let backToSpawn = overlayCheck(clickLocation, "pieceHolder");
                  if (backToSpawn[0] && event.shiftKey != true) {
                        elmnt.parentElement.remove();
                        elmnt.parentElement.originalPiece.style.filter = ``;
                        elmnt.parentElement.originalPiece.taken = false;
                        return;
                  }
                  let willSnap = true;
                  let snapDiv = null;
                  for (let hex of elmnt.parentElement.children) {
                        if (Array.from(hex.classList).includes(`invisiblePiece`)) {
                              continue;
                        }
                        let centerLocation = Object.create(locationObject);
                        centerLocation.x = hex.parentElement.offsetLeft + hex.offsetLeft + (hex.clientWidth / 2);
                        centerLocation.y = hex.parentElement.offsetTop + hex.offsetTop + (hex.clientHeight / 2);
                        let placedOver = overlayCheck(centerLocation, "slot");
                        let alreadyThere = overlayCheck(centerLocation, "snapped");
                        alreadyThere = alreadyThere.filter((hexDiv) => {
                              return hexDiv.parentElement.id != elmnt.parentElement.id;
                        });
                        if (!placedOver[0] || alreadyThere[0]) {
                              willSnap = false;
                        } else {
                              if (!snapDiv) {
                                    snapDiv = placedOver[0];
                                    let hexBounds = hex.getBoundingClientRect();
                                    elmnt.parentElement.snapOffset = {
                                          top: hexBounds.top - elmnt.parentElement.offsetTop,
                                          left: hexBounds.left - elmnt.parentElement.offsetLeft,
                                    };
                              }
                        }
                  }
                  if (willSnap) {
                        elmnt.parentElement.style.top = snapDiv.offsetTop - elmnt.parentElement.snapOffset.top + "px";
                        elmnt.parentElement.style.left = snapDiv.offsetLeft - elmnt.parentElement.snapOffset.left + "px";
                        elmnt.parentElement.classList.add(`onBoard`);
                        let piecePositions = window.sessionStorage.getItem(`temperaturePieces`);
                        if(!piecePositions) {
                              piecePositions = {};
                              Array.from(document.querySelectorAll(`.selection`)).forEach((piece) => {
                                    piecePositions[piece.id] = false;
                              });
                              window.sessionStorage.setItem(`temperaturePieces`, JSON.stringify(piecePositions));
                        } else {
                              piecePositions = JSON.parse(piecePositions);
                        }
                        piecePositions[elmnt.parentElement.id] = {
                              x: snapDiv.offsetLeft - elmnt.parentElement.snapOffset.left,
                              y: snapDiv.offsetTop - elmnt.parentElement.snapOffset.top,
                              rotation: elmnt.parentElement.rotation,
                        };
                        window.sessionStorage.setItem(`temperaturePieces`, JSON.stringify(piecePositions));
                        for (let hex of elmnt.parentElement.children) {
                              if (Array.from(hex.classList).includes('placeCheck')) {
                                    hex.classList.add(`snapped`);
                                    let centerLocation = Object.create(locationObject);
                                    centerLocation.x = hex.parentElement.offsetLeft + hex.offsetLeft + (hex.clientWidth / 2);
                                    centerLocation.y = hex.parentElement.offsetTop + hex.offsetTop + (hex.clientHeight / 2);
                                    let placedOver = overlayCheck(centerLocation, "slot");
                                    placedOver[0].firstChild.style.backgroundColor = 'black';
                                    if (!elmnt.parentElement.onBoard) {
                                          elmnt.parentElement.onBoard = [];
                                    }
                                    if (Array.from(hex.lastChild.classList).includes(`hexContainer`)) {
                                          copiedNumber = hex.lastChild.cloneNode(true);
                                          placedOver[0].firstChild.appendChild(copiedNumber);
                                          copiedNumber.style.width = `60%`;
                                          copiedNumber.style.height = copiedNumber.clientWidth / copiedNumber.parentElement.clientHeight * 100 + "%";
                                          elmnt.parentElement.onBoard.push(copiedNumber);
                                    }
                                    elmnt.parentElement.onBoard.push(placedOver[0].firstChild);
                                    let pieceIntersections = overlayCheck(hex, "intersection");
                                    if (pieceIntersections.length > 0) {
                                          for (let intersection of pieceIntersections) {
                                                if (!elmnt.parentElement.onBoard.includes(intersection)) {
                                                      let showIntersection = true;
                                                      let hexesOnIntersection = overlayCheck(intersection, `snapped`);
                                                      for (let checkHex of hexesOnIntersection) {
                                                            if (!Array.from(elmnt.parentElement.children).includes(checkHex) || hexesOnIntersection.length < 2) {
                                                                  showIntersection = false;
                                                            }
                                                      }
                                                      if (showIntersection) {
                                                            intersection.style.opacity = `100%`;
                                                            elmnt.parentElement.onBoard.push(intersection);
                                                      }
                                                }
                                          }
                                    }
                              }
                        }

                        //add to thermometer
                        let thermometerBar = document.getElementById(`thermometerBar`);
                        let totalTemp = 0;
                        Array.from(document.querySelectorAll(`.onBoard`)).forEach((onBoardPiece) => {
                              let pieceNumber = Number(onBoardPiece.numberID);
                              totalTemp += pieceNumber;
                        });
                        let baseHeight = Number(getComputedStyle(thermometerBar).getPropertyValue('--thermometerBaseHeight').replace(`px`, ``));
                        thermometerBar.style.height = baseHeight + (totalTemp * 5) + "px";

                        //lets check if everything is snapped
                        let boardFilled = true;
                        Array.from(document.querySelectorAll(`.slot`)).forEach((boardHex) => {
                              let centerLocation = Object.create(locationObject);
                              let hexBounds = boardHex.getBoundingClientRect();
                              centerLocation.x = hexBounds.left + (boardHex.clientWidth / 2);
                              centerLocation.y = hexBounds.top + (boardHex.clientHeight / 2);
                              let snappedOn = overlayCheck(centerLocation, `snapped`);
                              if (!snappedOn[0]) {
                                    boardFilled = false;
                              }
                        });
                        if (boardFilled) {
                              Array.from(document.querySelectorAll(`.pipeStart`)).forEach((pipeStart) => {
                                    let touchingIntersection = overlayCheck(pipeStart, `intersection`);
                                    if (touchingIntersection[0] && touchingIntersection[0].style.opacity == `0`) {
                                          runLiquid(touchingIntersection[0].firstChild);

                                          function runLiquid(actualIntersection) {
                                                actualIntersection.parentElement.style.opacity = `100%`;
                                                actualIntersection.style.backgroundColor = liquidColor;
                                                let nextIntersections = overlayCheck(actualIntersection, `actualIntersection`).filter((result) => {
                                                      return result.parentElement.style.opacity == 0;
                                                });
                                                nextIntersections.forEach(runLiquid);
                                          }

                                          Array.from(document.querySelectorAll(`.pipeExit`)).forEach((pipeExit) => {
                                                let touchingStart = overlayCheck(pipeExit, `intersection`);
                                                if (touchingStart[0] && touchingStart[0].firstChild.style.backgroundColor == liquidColor) {
                                                      if(Array.from(pipeExit.classList).includes(`pipeEnd`)) {
                                                            pipeExit.style.backgroundColor = `green`;
                                                      } else if(Array.from(pipeExit.classList).includes(`pipeStart`)) {
                                                            pipeExit.style.backgroundColor = liquidColor;
                                                      } else {
                                                            pipeExit.style.backgroundColor = `red`;
                                                      }
                                                      
                                                }
                                          });
                                    }
                              });
                              if (totalTemp == correctNumber) {
                                    let correctAnswer = true;
                                    Array.from(document.querySelectorAll(`.pipeExit`)).forEach((pipeExit) => {
                                          if (pipeExit.style.backgroundColor == `red` || (Array.from(pipeExit.classList).includes(`pipeEnd`) && pipeExit.style.backgroundColor != `green`)) {
                                                correctAnswer = false;
                                          }
                                    });
                                    if (correctAnswer) {
                                          let workshopData =  window.sessionStorage.getItem(`workshopData`);
                                          if(!workshopData) {
                                                workshopData = {
                                                      voltage: false,
                                                      temperature: false,
                                                      pipes: false,
                                                }
                                                window.sessionStorage.setItem(`workshopData`, JSON.stringify(workshopData));
                                          } else {
                                                workshopData = JSON.parse(workshopData);
                                          }
                                          workshopData[`temperature`] = true;
                                          window.sessionStorage.setItem(`workshopData`, JSON.stringify(workshopData));
                                          // Array.from(document.querySelectorAll(`.intersection`)).forEach((intersection) => {
                                          //       if (intersection.firstChild.style.backgroundColor == liquidColor) {
                                          //             intersection.firstChild.style.backgroundColor = `green`;
                                          //       }
                                          // });
                                          // Array.from(document.querySelectorAll(`.pipeExit`)).forEach((pipeExit) => {
                                          //       if ((Array.from(pipeExit.classList).includes(`pipeEnd`) || Array.from(pipeExit.classList).includes(`pipeStart`))) {
                                          //             pipeExit.style.backgroundColor = `green`;
                                          //       }
                                          // });

                                    }
                              }
                        }
                  }
            }
            if (overInventory && inventoryItem) {
                  elmnt.remove();
                  elmnt.originalItem.style.opacity = `100%`;
                  elmnt.originalItem.onPage = false;
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