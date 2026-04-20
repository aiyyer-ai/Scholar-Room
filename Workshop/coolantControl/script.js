var SVGsLoaded = 0;
var correctNumber = [32];
//degrees Farenheit, I guess...

//var allNumbers = testNumbers();
var hexGrid = [
      [false, true, true, true, true],
      [true, true, true, true, true],
      [true, true, true, true, true, true],
      [true, true, true, true, true],
      [false, true, true, true, true]
]
var yBorder = 250;
var hexSize = (window.innerHeight - yBorder) / hexGrid.length;
let gameArea = document.getElementById('gameArea');

var allNumbers = [8, 10, 14, 19, 7, 9, 21, 12, 20, 18];
var correctPiecePositions = [1, 6, 8];

var input
var correctNumbers = allNumbers.slice(0, 3);
allNumbers.splice(0, 3);

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
      generatePieceDisplay(board);
      // addIntersections(board);
      liquidColor = getComputedStyle(document.getElementsByClassName('pipeStart')[0]).getPropertyValue('background-color');
      flowLiquid();
}

function testNumbers() {
      let totalInputs = 10;
      let minGroupSize = 3;
      let maxGroupSize = 4;
      let minNumSize = 7;
      let maxNumSize = 48;
      let goalNumber = 32;

      let startNumberList = pickGoalNumbers(minGroupSize);
      for (i = 0; i < totalInputs - minGroupSize; i++) {
            let potentialNumber = minNumSize;
            while (startNumberList.indexOf(potentialNumber) != -1) {
                  potentialNumber++;
            }
            startNumberList = checkApplicableNumber(startNumberList, potentialNumber);
      }

      return startNumberList;

      function checkApplicableNumber(array, number) {
            let potentialNewArray = [...array];
            potentialNewArray.push(number);
            let allPairs = arrayCreate(potentialNewArray, minGroupSize);
            let allGoalPairs = checkArray(allPairs);
            if (allGoalPairs.length > 1) {
                  number++;
                  while (array.indexOf(number) != -1) {
                        number++;
                  }
                  return checkApplicableNumber(array, number);
            } else {
                  return potentialNewArray;
            }

      }

      function pickGoalNumbers(numberCount) {
            let remainingNumber = goalNumber;
            let goalNumberList = [];
            for (i = 0; i < numberCount - 1; i++) {
                  let goalNumber = Math.floor(Math.random() * ((remainingNumber - (numberCount - i) * minNumSize) - minNumSize + 1) + minNumSize);
                  while (goalNumberList.indexOf(goalNumber) != -1) {
                        goalNumber = Math.floor(Math.random() * ((remainingNumber - (numberCount - i) * minNumSize) - minNumSize + 1) + minNumSize);
                  }
                  remainingNumber -= goalNumber;
                  goalNumberList.push(goalNumber);
            }
            goalNumberList.push(remainingNumber);
            return goalNumberList;
      }

      // let currentNumbers = Array(totalInputs).fill(0).map(function (x, i) { return i + minNumSize; });

      // loopTilDone(currentNumbers);

      // function loopTilDone(numberArray) {

      //       let allPairs = arrayCreate(numberArray, minGroupSize);
      //       let allGoalPairs = checkArray(allPairs);
      //       if(allGoalPairs.length == 1) {
      //             return numberArray;
      //       } else {
      //             //change numbers
      //             return loopTilDone(numberArray);
      //       }

      // }

      function checkArray(array) {
            let allGoals = [];
            array.forEach((group) => {
                  let groupSum = group.reduce((partialSum, a) => partialSum + a, 0);
                  if (groupSum == goalNumber) {
                        allGoals.push(group);
                  }
            });
            return allGoals;
      }

      function arrayCreate(array, size) {
            var result = [];
            array.forEach(function iter(parts) {
                  return function (v) {
                        var temp = parts.concat(v);
                        if (parts.includes(v)) {
                              return;
                        }
                        if (temp.length === size) {
                              let alreadyHas = false;
                              result.forEach((group) => {
                                    let sortedGroup = [...group];
                                    sortedGroup.sort(function (a, b) {
                                          return a - b;
                                    });
                                    let sortedTemp = [...temp];
                                    sortedTemp.sort(function (a, b) {
                                          return a - b;
                                    });
                                    if (arraysEqual(sortedGroup, sortedTemp)) {
                                          alreadyHas = true;
                                    }
                              });
                              if (!alreadyHas) {
                                    result.push(temp);
                              }
                              return;
                        }
                        array.forEach(iter(temp));
                  }
            }([]));
            return result;
      }

}

var pauseTimeStart;

function save() {
      let jsonData = { ...window.sessionStorage };
      jsonData.lastRoom = `${window.location.pathname}`;
      function download(content, fileName, contentType) {
            var a = document.createElement("a");
            var file = new Blob([content], { type: contentType });
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();
      }
      download(JSON.stringify(jsonData), 'ScholarSaveData.txt', 'text/plain');
}


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
      if (!timing_dict_level["time_spent_paused"]) {
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

function populateGrid() {
      let fullBoard = document.createElement('div');
      fullBoard.classList.add(`board`);
      fullBoard.id = `board`;
      gameArea.appendChild(fullBoard);
      let longestRowCount = Math.max(...hexGrid.map(array => array.length));
      let totalRowCount = hexGrid.length;
      fullBoard.style.height = totalRowCount * hexSize + "px";
      fullBoard.style.width = (longestRowCount + 1) * (hexSize * (Math.cos(30 * (Math.PI / 180)))) + "px";
      // let testDot = document.createElement(`div`);
      // testDot.classList.add(`dot`);
      // gameArea.appendChild(testDot);
      // testDot.style.left = `calc(50% - ${testDot.clientWidth / 2}px)`;
      // testDot.style.top = `calc(50% - ${testDot.clientHeight / 2}px)`;
      let iterator = 0
      hexGrid.forEach((rowData, rowPosition) => {
            rowData.forEach((hexExists, slotPosition) => {
                  if (hexExists) {
                        //create and place the hex adjusted to center of page
                        let newHex = document.createElement(`div`);
                        newHex.classList.add(`hexElement`);
                        newHex.classList.add(`slot`);
                        newHex.id = `${slotPosition}, ${rowPosition}`;
                        let hexHolder = document.createElement(`div`);
                        hexHolder.classList.add(`paddedHex`);
                        hexHolder.appendChild(newHex);
                        newHex.style.height = hexSize + "px";
                        hexHolder.style.height = hexSize + "px";
                        hexHolder.style.width = hexSize + "px";
                        fullBoard.appendChild(hexHolder);
                        hexHolder.hexDistance = hexHolder.clientWidth - newHex.clientWidth;
                        hexHolder.style.left = hexHolder.clientWidth * (slotPosition + rowPosition % 2 * 0.5) + (fullBoard.clientWidth - longestRowCount * hexHolder.clientWidth) / 2 + (hexHolder.hexDistance / 2) + "px";
                        hexHolder.style.top = hexHolder.clientHeight * (Math.sqrt(3) / 2) * rowPosition + (fullBoard.clientHeight - ((totalRowCount - 1) * hexHolder.clientHeight * (3 / 4) + hexHolder.clientHeight)) / 4 + "px";

                        //adds intersections as we go
                        let pieceRight = hexGrid[rowPosition][slotPosition + 1];
                        let pieceDownRight = !(hexGrid[rowPosition + 1] == undefined || (rowPosition % 2 == 0 ? !(hexGrid[rowPosition + 1][slotPosition]) : !(hexGrid[rowPosition + 1][slotPosition + 1])));
                        let pieceDownLeft = !(hexGrid[rowPosition + 1] == undefined || (rowPosition % 2 == 0 ? !(hexGrid[rowPosition + 1][slotPosition - 1]) : !(hexGrid[rowPosition + 1][slotPosition])));

                        // for (i = 0; i < 3; i++) {
                        for (i = 2; i >= 0; i--) {
                              let rotation = 60 * i;
                              if ((rotation == 0 && !pieceRight) || (rotation == 60 && !pieceDownRight) || (rotation == 120 && !pieceDownLeft)) {
                                    continue;
                              }
                              let newIntersection = document.createElement(`div`);
                              newIntersection.classList.add(`intersection`);
                              hexHolder.appendChild(newIntersection);
                              let heightOffset = 20;
                              let widthOffset = 2;
                              newIntersection.style.width = hexHolder.hexDistance + widthOffset + "px";
                              newIntersection.style.height = hexSize * 0.5 + heightOffset + "px";
                              newIntersection.style.top = (hexSize * 0.5 - heightOffset) / 2 + "px";
                              newIntersection.style.left = hexSize - hexHolder.hexDistance - widthOffset / 2 + "px";
                              newIntersection.style.transformOrigin = `${-(hexSize - hexHolder.hexDistance - widthOffset) / 2}px ${((hexSize * 0.5 + heightOffset) / 2)}px`;
                              newIntersection.style.transform = `rotate(${rotation}deg)`;
                              newIntersection.id = iterator;
                              iterator++;
                              underSection = newIntersection.cloneNode(true);
                              underSection.classList.remove(`intersection`);
                              underSection.classList.add(`undersection`);
                              hexHolder.appendChild(underSection);
                              if (i == 0) {
                                    pieceOneRelativeCoords = [1, 1];
                                    pieceTwoRelativeCoords = [1, -1];
                              }
                              else if (i == 1) {
                                    pieceOneRelativeCoords = [0, 1];
                                    pieceTwoRelativeCoords = [1, 0];
                              }
                              else {
                                    pieceOneRelativeCoords = [-1, 0];
                                    pieceTwoRelativeCoords = [1, 1];
                              }
                              if (rowPosition % 2 == 0) {
                                    pieceOneRelativeCoords[0] -= Math.abs(pieceOneRelativeCoords[1]);
                                    pieceTwoRelativeCoords[0] -= Math.abs(pieceTwoRelativeCoords[1]);
                              }
                              let firstPiece = !(hexGrid[rowPosition + pieceOneRelativeCoords[1]] == undefined ||
                                    !hexGrid[rowPosition + pieceOneRelativeCoords[1]][slotPosition + pieceOneRelativeCoords[0]]);
                              let secondPiece = !(hexGrid[rowPosition + pieceTwoRelativeCoords[1]] == undefined ||
                                    !hexGrid[rowPosition + pieceTwoRelativeCoords[1]][slotPosition + pieceTwoRelativeCoords[0]]);
                              let pushDistance = hexSize / 2;
                              if (!firstPiece) {
                                    let direction = 1;
                                    addOutlet(underSection, rotation, pushDistance, direction);
                              }
                              if (!secondPiece) {
                                    let direction = -1;
                                    addOutlet(underSection, rotation, pushDistance, direction);
                              }
                        }
                  }
            });
      });
      return fullBoard;
}

var iterator = 0;

function addOutlet(touchingIntersection, rotation, pushDistance, direction) {
      let referenceHex = touchingIntersection.parentElement;
      let newOutput = document.createElement(`div`);
      newOutput.classList.add(`pipeExit`);
      newOutput.id = `pipeEnd`;
      board.appendChild(newOutput);
      let borderSize = Number(getComputedStyle(newOutput).getPropertyValue('border').split(" ")[0].replace(`px`, ``));
      let heightOffset = 30;
      let widthOffset = 20;
      newOutput.style.width = referenceHex.hexDistance + widthOffset + "px";
      newOutput.style.height = hexSize * 0.5 + heightOffset + "px";
      newOutput.style.top = referenceHex.offsetTop + (hexSize * 0.5 - heightOffset) / 2 - borderSize + direction * pushDistance * Math.cos(rotation * (Math.PI / 180)) + "px";
      newOutput.style.left = referenceHex.offsetLeft + hexSize - referenceHex.hexDistance - widthOffset / 2 - borderSize - direction * pushDistance * Math.sin(rotation * (Math.PI / 180)) + "px";
      newOutput.style.transformOrigin = `${-(hexSize - referenceHex.hexDistance - widthOffset) / 2 + borderSize}px ${((hexSize * 0.5 + heightOffset) / 2 + borderSize)}px`;
      newOutput.style.transform = `rotate(${rotation}deg)`;
      let placedNum = [2, 1, 0, 7, 14, 3, 21, 4, 28, 5, 35, 6, 0, 42];
      newOutput.number = placedNum[iterator];
      addSVG(placedNum[iterator], newOutput, (div) => {
            div.style.filter = `invert(100%)`;
            div.style.width = 60 + "%";
            div.style.height = div.clientWidth / newOutput.clientHeight * 100 + "%";
            if (direction == 1) {
                  div.style.top = `calc(100% - ${borderSize}px - ${hexSize * 0.4 / 2}px)`;
            } else {
                  div.style.top = 10 + "px";
            }
            div.style.left = (newOutput.clientWidth - div.clientWidth) / 2 + "px";
            div.style.transform = `rotate(${-rotation}deg)`;
            div.firstChild.onload = null;
            SVGsLoaded++;
            if (SVGsLoaded == tileSystem.length + 1) {
                  placePiecesOnBoard();
            }
      });
      if (iterator == 2) {
            newOutput.classList.add(`pipeStart`);
            let coolantText = document.createElement(`div`);
            coolantText.classList.add(`inputText`, `pipeText`);
            coolantText.innerHTML = `INPUT`;
            newOutput.appendChild(coolantText);
            touchingIntersection.style.zIndex = -2;
            coolantText.style.top = borderSize + 13 + "px";
            coolantText.style.left = (newOutput.clientWidth - coolantText.getBoundingClientRect().height) / 2 + "px";
      }
      if (iterator == 12) {
            newOutput.classList.add(`pipeEnd`);
            let coolantText = document.createElement(`div`);
            coolantText.classList.add(`outputText`, `pipeText`);
            coolantText.innerHTML = `OUTPUT`;
            newOutput.appendChild(coolantText);
            coolantText.style.top = `calc(100% - ${coolantText.getBoundingClientRect().width}px - ${borderSize + 18}px)`;
            coolantText.style.left = (newOutput.clientWidth - coolantText.getBoundingClientRect().height) / 2 + "px";
      }
      iterator++;
}

function rotatePiece(piece) {
      //WE ARE ODD-R
      let matrix = piece.currentMatrix;
      const cubeCoords = [];

      for (row = 0; row < matrix.length; row++) {
            for (col = 0; col < matrix[row].length; col++) {
                  if (!matrix[row][col]) continue;
                  const q = col - (row - (row & 1)) / 2;
                  const r = row;
                  const s = - q - r;
                  cubeCoords.push({ q, r, s });
            }
      }

      const rotated = cubeCoords.map(({ q, r, s }) => {
            return { q: -r, r: -s, s: -q };
      });

      const minQ = Math.min(...rotated.map(coords => coords.q));
      const minR = Math.min(...rotated.map(coords => coords.r));

      const normalizedCube = rotated.map(({ q, r, s }) => ({
            q: q - minQ,
            r: r - minR,
            s: - (q - minQ) - (r - minR)
      }));

      const offsetCoords = normalizedCube.map(({ q, r, s }) => {
            const row = r;
            const col = q + (r - (r & 1)) / 2;
            return {row, col};
      });

      const minRow = Math.min(...offsetCoords.map(coords => coords.row));
      const minCol = Math.min(...offsetCoords.map(coords => coords.col));

      const normalized = offsetCoords.map(({ row, col }) => ({
            row: row - minRow,
            col: col - minCol
      }));

      const maxRow = Math.max(...normalized.map(coords => coords.row));
      const maxCol = Math.max(...normalized.map(coords => coords.col));

      let result = Array(maxRow + 1).fill(false).map(() => Array(maxCol + 1).fill(false));
      for (coord of normalized) {
            result[coord.row][coord.col] = true;
      }

      Array.from(piece.firstChild.children).forEach((hexDiv) => {
            hexDiv.remove();
      });
      let elmnt = makeHexesFromMatrix(result, piece.firstChild, hexSize);
      piece.currentMatrix = result;
      return elmnt;
}

function generatePieceDisplay(board) {
      let panels = ["left", "right"];
      for (side of panels) {
            let displayer = document.createElement(`div`);
            let marginFromSide = hexSize / 2;
            displayer.classList.add(`pieceDisplay`);
            displayer.id = `${side}Display`;
            gameArea.appendChild(displayer);
            // pieceDisplay.style.width = (window.innerWidth - board.clientWidth - (sideMargin * 2) - hexSize) / 2 + `px`;
            displayer.style.width = hexSize * 2 + 'px';
            displayer.style.height = window.innerHeight - hexSize + 'px';
            displayer.style.top = marginFromSide + `px`;
            if (side == "left") {
                  displayer.style.left = marginFromSide + `px`;
            } else {
                  displayer.style.right = marginFromSide + `px`;
            }
            generatePiecesFromSystem(displayer);
      }
}

var tileSystem = [
      [
            [false, true, true],
            [true],
      ],
      [
            [true, false, true],
            [true, true],
      ],
      [
            [false, true, true],
            [true],
            [true]
      ],
      [
            [false, true],
            [true, true],
            [true, true],
            [true]
      ],
      [
            [true, true],
            [true, true],
      ],
      [
            [true, true, true],
      ],
];

function makeHexesFromMatrix(piece, container, size) {
      let leftSquareMultiplier = Math.min(...piece.map((array, index) => {
            if (index % 2 == 0) {
                  if (array[0] == true) {
                        return 0;
                  } else {
                        return 2;
                  }
            } else {
                  if (array[0] == true) {
                        return 1;
                  } else {
                        return 3;
                  }
            }
      }));
      piece.forEach((rowData, rowPosition) => {
            rowData.forEach((hexExists, slotPosition) => {
                  if (hexExists) {
                        //create and place the hex adjusted to center of page
                        let newHex = document.createElement(`div`);
                        newHex.classList.add(`hexElement`, 'pieceElement');
                        newHex.id = `${slotPosition}, ${rowPosition}Piece${tileSystem.indexOf(piece)}`;
                        let hexHolder = document.createElement(`div`);
                        hexHolder.classList.add(`paddedHex`);
                        hexHolder.appendChild(newHex);
                        newHex.style.height = size + "px";
                        hexHolder.style.height = size + "px";
                        hexHolder.style.width = size + "px";
                        container.appendChild(hexHolder);
                        hexHolder.hexDistance = hexHolder.clientWidth - newHex.clientWidth;
                        hexHolder.style.left = hexHolder.clientWidth * (slotPosition + rowPosition % 2 * 0.5) - (hexHolder.clientWidth / 2) * leftSquareMultiplier + "px";
                        hexHolder.style.top = hexHolder.clientHeight * (Math.sqrt(3) / 2) * rowPosition + (container.clientHeight - ((piece.length - 1) * hexHolder.clientHeight * (3 / 4) + hexHolder.clientHeight)) / 4 + "px";

                        //adds intersections as we go
                        let pieceRight = piece[rowPosition][slotPosition + 1];
                        let pieceDownRight = !(piece[rowPosition + 1] == undefined || (rowPosition % 2 == 0 ? !(piece[rowPosition + 1][slotPosition]) : !(piece[rowPosition + 1][slotPosition + 1])));
                        let pieceDownLeft = !(piece[rowPosition + 1] == undefined || (rowPosition % 2 == 0 ? !(piece[rowPosition + 1][slotPosition - 1]) : !(piece[rowPosition + 1][slotPosition])));

                        // for (i = 0; i < 3; i++) {
                        for (i = 2; i >= 0; i--) {
                              let rotation = 60 * i;
                              if ((rotation == 0 && !pieceRight) || (rotation == 60 && !pieceDownRight) || (rotation == 120 && !pieceDownLeft)) {
                                    continue;
                              }
                              let newIntersection = document.createElement(`div`);
                              newIntersection.classList.add('pieceElement', `intersectionBlocker`);
                              hexHolder.appendChild(newIntersection);
                              let heightOffset = 0;
                              let widthOffset = 2;
                              newIntersection.style.width = hexHolder.hexDistance + widthOffset + "px";
                              newIntersection.style.height = size * 0.5 + heightOffset + "px";
                              newIntersection.style.top = (size * 0.5 - heightOffset) / 2 + "px";
                              newIntersection.style.left = size - hexHolder.hexDistance - widthOffset / 2 + "px";
                              newIntersection.style.transformOrigin = `${-(size - hexHolder.hexDistance - widthOffset) / 2}px ${((size * 0.5 + heightOffset) / 2)}px`;
                              newIntersection.style.transform = `rotate(${rotation}deg)`;
                        }
                  }
            });
      });
      elmnt = undefined;
      Array.from(container.children).forEach((child) => {
            if (!elmnt) {
                  elmnt = child;
            }
            dragElement(child);
      })
      return elmnt;
}

function generatePiecesFromSystem(parent) {
      let parentPieces = parent.id.includes(`left`) ? tileSystem.slice(0, Math.ceil(tileSystem.length / 2)) : tileSystem.slice(Math.ceil(tileSystem.length / 2), tileSystem.length);
      let longestRowCountOverall = Math.max(...tileSystem.map(piece => Math.max(...piece.map(array => array.length))));
      parentPieces.forEach((piece) => {
            let longestPieceRowCount = Math.max(...piece.map(array => array.length));
            let absolutePiece = document.createElement(`div`);
            absolutePiece.classList.add('absolutePiece', 'selection');
            absolutePiece.id = tileSystem.indexOf(piece);
            let heightGap = 20;
            let allOtherChildHeights = Array.from(parent.children).map((child) => child.getBoundingClientRect().height).reduce((accumulator, currentValue) => accumulator + currentValue + heightGap, 0);
            parent.appendChild(absolutePiece);
            let newPieceHolder = document.createElement(`div`);
            newPieceHolder.classList.add('pieceHolder');
            absolutePiece.appendChild(newPieceHolder);
            let totalRowCount = piece.length;
            let leftSquareMultiplier = Math.min(...piece.map((array, index) => {
                  if (index % 2 == 0) {
                        if (array[0] == true) {
                              return 0;
                        } else {
                              return 2;
                        }
                  } else {
                        if (array[0] == true) {
                              return 1;
                        } else {
                              return 3;
                        }
                  }
            }));
            newPieceHolder.style.height = totalRowCount * hexSize + "px";
            newPieceHolder.style.width = longestPieceRowCount * hexSize - (hexSize / 2) * leftSquareMultiplier - (hexSize - hexSize * Math.cos(30 * (Math.PI / 180))) + "px";
            absolutePiece.style.transformOrigin = `0px 0px`;
            absolutePiece.style.transform = `scale(${(parent.clientWidth / hexSize) / longestRowCountOverall})`;
            absolutePiece.style.left = (parent.clientWidth - absolutePiece.clientWidth * ((parent.clientWidth / hexSize) / longestRowCountOverall)) / 2 + "px";
            absolutePiece.style.top = allOtherChildHeights + "px";
            makeHexesFromMatrix(piece, newPieceHolder, hexSize);
            // dragElement(absolutePiece);
      });
}

function placePiecesOnBoard() {
      let piecePositions = window.sessionStorage.getItem(`temperaturePieces`);
      if (!piecePositions) {
            piecePositions = {};
            Array.from(document.querySelectorAll(`.selection`)).forEach((piece) => {
                  piecePositions[piece.id] = false;
            });
            window.sessionStorage.setItem(`temperaturePieces`, JSON.stringify(piecePositions));
      } else {
            piecePositions = JSON.parse(piecePositions);
      }
      for (let locationData of Object.entries(piecePositions)) {
            if (locationData[1]) {
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

function addSVG(src, parentElement, svgCallback) {
      let svgObject = document.createElement("object");
      svgObject.setAttribute("data", `./images/test/${src}.svg`);
      svgObject.setAttribute('type', "image/svg+xml");
      svgObject.setAttribute("height", 100 + "%");
      svgObject.setAttribute("width", 100 + "%");
      svgObject.onload = addToPage;
      let newDiv = document.createElement(`div`);
      if (parentElement) {
            parentElement.appendChild(newDiv);
      }
      newDiv.classList.add(`svgContainer`);
      newDiv.appendChild(svgObject);
      function addToPage(event) {
            if (svgCallback) {
                  svgCallback(newDiv);
            }
      }
}

function flowLiquid() {
      let correctSolution = true;
      Array.from(document.querySelectorAll(`.intersection`)).forEach((intersection) => {
            intersection.style.opacity = 0;
            intersection.blocked = false;
      });

      Array.from(document.querySelectorAll(`.pipeStart`)).forEach((pipeStart) => {
            let touchingIntersection = overlayCheck(pipeStart, `intersection`);
            runLiquid(touchingIntersection[0]);

            function runLiquid(intersection) {
                  let blockers = overlayCheck(intersection, `snappedIntersection`);
                  for (blocker of blockers) {
                        if(blocker) {
                              let intersectionBounds = intersection.getBoundingClientRect();
                              let blockerBounds = blocker.getBoundingClientRect();
                              let dx = Math.abs(blockerBounds.left - intersectionBounds.left);
                              let dy = Math.abs(blockerBounds.top - intersectionBounds.top);
                              let distance = Math.sqrt(dx * dx + dy * dy);
                              if(distance < 20 || !distance) {
                                    intersection.blocked = true;
                              }
                        }
                  }
                  if(!intersection.blocked) {
                        intersection.style.backgroundColor = liquidColor;
                        intersection.style.opacity = 100;
                        let nextIntersections = overlayCheck(intersection, `intersection`).filter((result) => {
                              return result.style.opacity == 0 && !result.blocked;
                        });
                        nextIntersections.forEach(runLiquid);
                  }
            }

            Array.from(document.querySelectorAll(`.pipeExit`)).forEach((pipeExit) => {
                  let touchingIntersection = overlayCheck(pipeExit, `intersection`);
                  if (touchingIntersection[0] && touchingIntersection[0].style.opacity == `100`) {
                        pipeExit.style.backgroundColor = liquidColor;
                  } else {
                        pipeExit.style.backgroundColor = ``;
                  }
                  if(((pipeExit.number != 4 && pipeExit.number != 28 && pipeExit.number != 0) && pipeExit.style.backgroundColor) || ((pipeExit.number == 4 || pipeExit.number == 28 || pipeExit.number == 0) && !pipeExit.style.backgroundColor)) {
                        correctSolution = false;
                  }
            });
      });
      if(correctSolution) {
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
      }
}

function dragElement(elmnt) {
      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      if (document.getElementById(elmnt.id + "header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
      } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            let elmntParent = elmnt.parentElement.parentElement;
            let selectionItem = Array.from(elmntParent.classList).find((value) => {
                  return value.includes(`selection`);
            });
            let inventoryItem = Array.from(elmnt.classList).find((value) => {
                  return value.includes(`inventoryItem`);
            });
            if (selectionItem) {
                  elmntParent.onmousedown = copyAndDrag;
            } else if (inventoryItem) {
                  elmnt.onmousedown = copyAndDragInv;
            } else {
                  elmnt.onmousedown = dragMouseDown;
            }
      }

      function copyAndDrag(event) {
            if (this.taken) {
                  return;
            }
            let newPiece = this.cloneNode(true);
            this.taken = true;
            this.style.filter = `opacity(50%)`;
            gameArea.appendChild(newPiece);
            newPiece.classList.add(`dragHex`);
            newPiece.classList.remove(`selection`);
            newPiece.style.transform = null;
            let oldBounds = this.getBoundingClientRect();
            let newBounds = newPiece.getBoundingClientRect();
            newPiece.style.left = event.x - (event.x - oldBounds.left) * Math.round(newBounds.width / oldBounds.width) + "px";
            newPiece.style.top = event.y - (event.y - oldBounds.top) * Math.round(newBounds.width / oldBounds.width) + "px";
            newPiece.originalPiece = this;
            newPiece.currentMatrix = tileSystem[this.id];
            newPiece.rotation = 0;
            elmnt = undefined;
            Array.from(newPiece.firstChild.children).forEach((child) => {
                  if(!elmnt) {
                        elmnt = child;
                  }
                  dragElement(child);
            })
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
            let elmntParent = elmnt.parentElement.parentElement;
            let inventoryItem = Array.from(elmnt.classList).find((value) => {
                  return value.includes(`dragItem`);
            });
            if (!inventoryItem) {
                  //PLACE CODE HERE FOR SPECIAL MOVEMENT OF ITEMS IN ROOM
                  Array.from(elmntParent.firstChild.children).forEach((childHex) => {
                        childHex.classList.remove(`snapped`);
                        Array.from(childHex.children).filter((child) => Array.from(child.classList).includes("intersectionBlocker")).forEach((pieceIntersection) => {
                              pieceIntersection.classList.remove(`snappedIntersection`);
                        });
                  });
                  flowLiquid();
            }

            var rightclick;
            if (e.which) {
                  rightclick = (e.which == 3);
            }
            else if (e.button) {
                  rightclick = (e.button == 2);
            }
            if (rightclick) {
                  elmnt = rotatePiece(elmntParent);
                  return closeDragElement(e);
            }

            if (e.shiftKey) {
                  elmntParent.style.top = e.clientY + "px";
                  elmntParent.style.left = e.clientX + "px";
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
                  let elmntParent = elmnt.parentElement.parentElement;
                  elmntParent.style.top = (elmntParent.offsetTop - pos2) + "px";
                  elmntParent.style.left = (elmntParent.offsetLeft - pos1) + "px";
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
                  let elmntParent = elmnt.parentElement.parentElement;
                  let backToSpawn = overlayCheck(clickLocation, "pieceDisplay");
                  if (backToSpawn[0] && event.shiftKey != true) {
                        elmntParent.remove();
                        elmntParent.originalPiece.style.filter = ``;
                        elmntParent.originalPiece.taken = false;
                        return;
                  }
                  let willSnap = true;
                  let allSnaps = [];
                  let snapOffsets = [];
                  Array.from(elmntParent.firstChild.children).forEach((childHex) => {
                        let centerLocation = Object.create(locationObject);
                        let hexBounds = childHex.getBoundingClientRect();
                        centerLocation.x = hexBounds.left + (hexBounds.width / 2);
                        centerLocation.y = hexBounds.top + (hexBounds.height / 2);
                        let placedOver = overlayCheck(centerLocation, "slot");
                        let alreadyThere = overlayCheck(centerLocation, "snapped");
                        let isRoom = true;
                        if(alreadyThere[0]) {
                              let alreadyHexBounds = alreadyThere[0].getBoundingClientRect();
                              let alreadyDx = Math.abs(alreadyHexBounds.left - hexBounds.left);
                              let alreadyDy = Math.abs(alreadyHexBounds.top - hexBounds.top);
                              let alreadyDistance = Math.sqrt(alreadyDx * alreadyDx + alreadyDy * alreadyDy);
                              if(alreadyDistance < hexSize / 2) {
                                    isRoom = false;
                              }
                        }
                        if (!placedOver[0] || !isRoom) {
                              willSnap = false;
                        } else {
                              let otherHexBounds = placedOver[0].getBoundingClientRect();
                              let dx = Math.abs(otherHexBounds.left - hexBounds.left);
                              let dy = Math.abs(otherHexBounds.top - hexBounds.top);
                              let distance = Math.sqrt(dx * dx + dy * dy);
                              if(distance > hexSize / 2) {
                                    willSnap = false;
                              } else {
                                          allSnaps.push(placedOver[0].parentElement);
                                          snapOffsets.push({
                                                top: hexBounds.top - elmntParent.offsetTop,
                                                left: hexBounds.left - elmntParent.offsetLeft,
                                          });
                              }
                        }
                  });
                  if (willSnap) {
                        elmntParent.style.top = allSnaps[0].offsetTop + allSnaps[0].parentElement.offsetTop - snapOffsets[0].top + "px";
                        elmntParent.style.left = allSnaps[0].offsetLeft + allSnaps[0].parentElement.offsetLeft - snapOffsets[0].left + "px";
                        Array.from(elmntParent.firstChild.children).forEach((childHex) => {
                              childHex.classList.add(`snapped`);
                              Array.from(childHex.children).filter((child) => Array.from(child.classList).includes("intersectionBlocker")).forEach((pieceIntersection) => {
                                    pieceIntersection.classList.add(`snappedIntersection`);
                              });
                        });
                        flowLiquid();
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