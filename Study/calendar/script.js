var timeStart;
window.onload = (event) => {
      //time recording code
      timeStart = Date.now();
      //end time recording code
      //in case I want to make something run at launch
      typeof window.addEventListener === `undefined` && (window.addEventListener = (e, cb) => window.attachEvent(`on${e}`, cb));
      window.addEventListener(`contextmenu`, (e) => {
            e.preventDefault();
      });
      document.onmousedown = movementCheck;
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
      fillBoard(6, 7);
      generatePieces();
      let slipData = [0, 14, 35, 36, 41, 27, 21];
      generateSlip(slipData);
      placePieces();
}

function generateSlip(slipData) {
      let slip = document.getElementById(`slip`);
      let templateFill = `auto `;
      let slipCalendar = document.getElementById(`slipCalendar`);
      slipCalendar.style.gridTemplateColumns = templateFill.repeat(slipData.length + 1);
      let firstLoop = true;
      dragElement(slip);
      for (number of slipData) {
            let slipSpace = document.createElement(`div`);
            slipSpace.classList.add(`slipSpot`);
            slipSpace.id = `slipSpace${number}`;
            slipCalendar.appendChild(slipSpace);
            if (firstLoop) {
                  firstLoop = false;
                  slipSpace.style.display = `grid`;
                  addImg(`cake2`, slipSpace, (cakeDiv) => {
                        cakeDiv.classList.add(`cake`);
                  });
            }
            let numberMakeUp = [Math.floor(number / 7) * 7, number % 7];
            for (let numberPart of numberMakeUp) {
                  if (numberPart != 0) {
                        addImg(numberPart, slipSpace, (numberDiv) => {
                              numberDiv.classList.add(`number`, `position`);
                              numberDiv.children[0].style.filter = `invert(100%)`;
                        });
                  }
            }
      }
}

function fillBoard(boardHeight, boardWidth) {
      let board = document.getElementById(`board`);
      let templateFill = `auto `;
      board.style.gridTemplateColumns = templateFill.repeat(boardWidth);
      for (let divID = 0; divID < boardHeight * boardWidth; divID++) {
            let boardSpace = document.createElement(`div`);
            boardSpace.classList.add(`filledSpace`);
            boardSpace.id = `boardSpace${divID}`;
            board.appendChild(boardSpace);
            if (divID == 14) {
                  boardSpace.style.display = `grid`;
                  addImg(`cake2`, boardSpace, (cakeDiv) => {
                        cakeDiv.classList.add(`cake`);
                  });
            }
            // let allNumbers = [1, 2, 3, 4, 5, 6, 7, 14, 21, 28, 35, 42];
            // for (number of allNumbers) {
            // 	let assignedNumber = number;
            // 	addImg(number, boardSpace, (numberDiv) => {
            // 		numberDiv.classList.add(`number`, `position`, assignedNumber);
            // 		numberDiv.style.height = `80px`;
            // 		numberDiv.style.top = boardSpace.offsetTop + (boardSpace.clientHeight - numberDiv.clientHeight) / 2 + "px";
            // 		numberDiv.style.left = boardSpace.offsetLeft + (boardSpace.clientWidth - numberDiv.clientWidth) / 2 + "px";
            // 		numberDiv.children[0].style.filter = `invert(100%)`;
            // 		numberDiv.style.visibility = `hidden`;
            // 	});
            // }
      }
}

let pieceList = {
      pieceA:
      {
            shape:
                  [
                        [0, 1, 0],
                        [1, 1, 1],
                        [1, 1, 1]
                  ],
            number: 35,
            color: [245, 66, 66],
            startRotation: 0,
      },
      pieceB:
      {
            shape:
                  [
                        [1, 0, 0],
                        [1, 1, 1],
                        [1, 1, 1]
                  ],
            number: 1,
            color: [245, 161, 66],
            startRotation: 0,
      },
      pieceC:
      {
            shape:
                  [
                        [1, 1],
                        [1, 1],
                        [1, 1],
                        [1, 1]
                  ],
            number: 21,
            color: [245, 239, 66],
            startRotation: 0,
      },
      pieceD:
      {
            shape:
                  [
                        [1, 1, 0, 0, 0, 0],
                        [0, 1, 0, 0, 0, 0],
                        [0, 1, 1, 1, 1, 1]
                  ],
            number: 4,
            color: [90, 245, 66],
            startRotation: 90,
      },
      pieceE:
      {
            shape:
                  [
                        [1, 0],
                        [1, 1],
                        [1, 0],
                        [1, 0],
                        [1, 0],
                        [1, 1]
                  ],
            number: 14,
            color: [66, 245, 221],
            startRotation: 0,
      },
      pieceF:
      {
            shape:
                  [
                        [1, 1, 1],
                        [1, 1, 0],
                        [1, 1, 0]
                  ],
            number: 6,
            color: [215, 66, 245],
            startRotation: 0,
      },
}

function placePieces() {
      let piecePositions = window.sessionStorage.getItem(`calendarPositions`);
      if (!piecePositions) {
            piecePositions = {...pieceList};
            Object.keys(piecePositions).forEach((key) => {
                  piecePositions[key] = {
                        rotation: pieceList[key].startRotation,
                        position: false,
                  };
            });
            window.sessionStorage.setItem(`calendarPositions`, JSON.stringify(piecePositions));
      } else {
            piecePositions = JSON.parse(piecePositions);
      }
      for (const [key, value] of Object.entries(piecePositions)) {
            if(value.position) {
                  let piece = document.getElementById(key);
                  piece.style.transform = `rotate(${value.rotation}deg)`;
                  piece.rotation = value.rotation;
                  piece.style.top = value.position.y + "px";
                  piece.style.left = value.position.x + "px";
            }
      }
}

function generatePieces() {
      for ([pieceID, data] of Object.entries(pieceList)) {
            let newPiece = document.createElement(`div`);
            newPiece.classList.add(`piece`, `position`);
            newPiece.id = pieceID;
            newPiece.rotation = data.startRotation;
            newPiece.style.transform = `rotate(${data.startRotation}deg)`;
            newPiece.style.zIndex = `${Object.keys(pieceList).indexOf(pieceID)}`;
            newPiece.setZIndex = Object.keys(pieceList).indexOf(pieceID);
            newPiece.currentColor = data.color;
            //newPiece.number = data.number;
            let gameArea = document.getElementById(`gameArea`);
            gameArea.appendChild(newPiece);
            newPiece.style.top = `calc(50% - ${newPiece.clientHeight / 2}px)`;
            let boardBounds = document.getElementById(`mainCalendar`).getBoundingClientRect();
            let halfOffset = (window.innerWidth - boardBounds.width) / 4;
            newPiece.style.left = newPiece.setZIndex / Object.keys(pieceList).length >= 0.5 ? `${halfOffset}px` : `${boardBounds.right + halfOffset}px`;
            dragElement(newPiece);
            let gridPosition = {
                  x: 0,
                  y: 0
            };
            let pieceCenter = {
                  x: data.shape[0].length / 2,
                  y: data.shape.length / 2
            };
            for (let row of data.shape) {
                  for (let columnValue of row) {
                        if (columnValue) {
                              let pieceSpace = document.createElement(`div`);
                              pieceSpace.classList.add(`position`, `piecePart`);
                              newPiece.appendChild(pieceSpace);
                              pieceSpace.style.top = `${(gridPosition.y - pieceCenter.y) * 100}px`;
                              pieceSpace.style.left = `${(gridPosition.x - pieceCenter.x) * 100}px`;
                              pieceSpace.style.backgroundColor = `rgba(${data.color[0]}, ${data.color[1]}, ${data.color[2]}, 0.5)`;
                              addImg(data.number, pieceSpace, (numberDiv) => {
                                    numberDiv.classList.add(`number`);
                                    numberDiv.children[0].style.filter = `invert(100%)`;
                              });
                              let neighboringPieces = {
                                    top: {
                                          x: 0,
                                          y: -1,
                                    },
                                    right: {
                                          x: 1,
                                          y: 0,
                                    },
                                    bottom: {
                                          x: 0,
                                          y: 1,
                                    },
                                    left: {
                                          x: -1,
                                          y: 0,
                                    },
                              }
                              for (let direction of Object.keys(neighboringPieces)) {
                                    let relativeCoords = neighboringPieces[direction];
                                    let globalCoords = Object.values(relativeCoords).map((distance, idx) => {
                                          return distance + Object.values(gridPosition)[idx];
                                    });
                                    // global coords are in the form of [x, y]
                                    //data.shape is in the form of data.shape[y][x]
                                    if (!data.shape[globalCoords[1]] || !data.shape[globalCoords[1]][globalCoords[0]]) {
                                          let borderThickness = 3;
                                          switch (direction) {
                                                case `top`:
                                                      pieceSpace.style.borderTop = `${borderThickness}px solid black`;
                                                      break;
                                                case `right`:
                                                      pieceSpace.style.borderRight = `${borderThickness}px solid black`;
                                                      break;
                                                case `bottom`:
                                                      pieceSpace.style.borderBottom = `${borderThickness}px solid black`;
                                                      break;
                                                case `left`:
                                                      pieceSpace.style.borderLeft = `${borderThickness}px solid black`;
                                                      break;
                                                default:
                                                      console.log(`direction error??? ${direction} is not a direction somehow???`)
                                          }
                                    }
                              }
                        }
                        gridPosition.x += 1;
                  }
                  gridPosition.y += 1;
                  gridPosition.x = 0;
            }
      }
}

function rotatePiece(piece) {
      let rotations = [0, 90, 180, 270];
      let rotationIndex = rotations.indexOf(piece.rotation) + 1 == rotations.length ? 0 : rotations.indexOf(piece.rotation) + 1;
      let newRotation = rotations[rotationIndex];
      piece.style.transform = `rotate(${newRotation}deg)`;
      piece.rotation = newRotation;
};

function toTop(piece) {
      let allPieces = Array.from(document.querySelectorAll(`.piece`));
      for (otherPiece of allPieces) {
            if (piece.setZIndex < otherPiece.setZIndex && piece.id != otherPiece.id) {
                  zExchange = otherPiece.setZIndex - 1;
                  otherPiece.setZIndex = zExchange;
                  otherPiece.style.zIndex = `${otherPiece.setZIndex}`;
            }
      }
      piece.setZIndex = allPieces.length;
      piece.style.zIndex = `${piece.setZIndex}`;
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
      var rightclick;
      if (event.which) {
            rightclick = (event.which == 3);
      }
      else if (event.button) {
            rightclick = (event.button == 2);
      }
      if (!rightclick) {
            if (Array.from(event.target.classList).includes(`leave`)) {
                              setTimeSpent();
            window.location.href = `../index.html`;
            }
      } else {
            let overlayingDivs = overlayCheck(clickLocation, `piecePart`);
            if (overlayingDivs[0]) {
                  rotatePiece(overlayingDivs[0].parentElement);
            }
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
      let inventory = JSON.parse(window.sessionStorage.getItem(`inventoryWorkshop`));
      inventory[item] = true;
      window.sessionStorage.setItem(`inventoryWorkshop`, JSON.stringify(inventory));
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
            placedItem.style.height = Math.min(500 * this.children[0].naturalHeight / this.children[0].naturalWidth, this.children[0].naturalHeight) + "px";
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
                  let piece = Array.from(elmnt.classList).find((value) => {
                        return value.includes(`piece`);
                  });
                  if (piece) {
                        toTop(elmnt);
                        let piecePositions = JSON.parse(window.sessionStorage.getItem(`calendarPositions`));
                        piecePositions[elmnt.id].rotation = pieceList[elmnt.id].startRotation;
                        piecePositions[elmnt.id].position = false;
                        window.sessionStorage.setItem(`calendarPositions`, JSON.stringify(piecePositions));
                        if (elmnt.alteredData) {
                              for (childSquare of Array.from(elmnt.children).filter((childDiv) => { return Array.from(childDiv.classList).includes(`piecePart`) })) {
                                    childSquare.style.backgroundColor = `rgba(${elmnt.currentColor[0]}, ${elmnt.currentColor[1]}, ${elmnt.currentColor[2]}, 0.5)`;
                              }
                              for (childSquareOver of elmnt.alteredData) {
                                    childSquareOver.allColors = childSquareOver.allColors.filter((colorPart) => { return !arraysEqual(colorPart, elmnt.currentColor) });
                                    childSquareOver.currentColor = averageArrays(childSquareOver.allColors);
                                    childSquareOver.style.backgroundColor = `rgb(${childSquareOver.currentColor[0]}, ${childSquareOver.currentColor[1]}, ${childSquareOver.currentColor[2]})`;
                              }
                              elmnt.alteredData = false;
                        }
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
                  return;
            }
            document.onmousemove = elementDrag;
            if (e.shiftKey) {
                  closeDragElement(e);
            } else {
                  document.onmouseup = closeDragElement;
            }
            // call a function whenever the cursor moves:
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
            let clickLocation = Object.create(locationObject);
            clickLocation.x = event.clientX;
            clickLocation.y = event.clientY;
            // var rightclick;
            // if (event.which) {
            //   rightclick = (event.which == 3);
            // } 
            // else if (event.button) {
            //   rightclick = (event.button == 2);
            // }
            // if(rightclick) {
            // 	let overlayingDivs = overlayCheck(clickLocation, `piecePart`).filter((piecePart) => { 
            // 		return piecePart.parentElement == elmnt
            // 	});
            // 	if(overlayingDivs[0]) {
            // 		return rotatePiece(elmnt);
            // 	}
            // }
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
            let overInventory = overlayCheck(clickLocation, `inventory`)[0];
            let inventoryItem = Array.from(elmnt.classList).find((value) => {
                  return value.includes(`dragItem`);
            });
            let slipTape = Array.from(elmnt.classList).find((value) => {
                  return value.includes(`slip`);
            });
            if (!inventoryItem && !slipTape) {
                  //PLACE CODE HERE FOR SPECIAL MOVEMENT OF ITEMS IN ROOM
                  let overSquare = overlayCheck(clickLocation, `filledSpace`)[0];
                  if (overSquare) {
                        let willSnap = true;
                        for (childSquare of Array.from(elmnt.children).filter((childDiv) => { return Array.from(childDiv.classList).includes(`piecePart`) })) {
                              let squareCenter = Object.create(locationObject);
                              let squareBounds = childSquare.getBoundingClientRect();
                              squareCenter.x = squareBounds.right - squareBounds.width / 2;
                              squareCenter.y = squareBounds.bottom - squareBounds.height / 2;
                              let centeredOverSquare = overlayCheck(squareCenter, `filledSpace`)[0];
                              if (!centeredOverSquare) {
                                    willSnap = false;
                              }
                        }
                        if (willSnap) {
                              let overPiecePart = overlayCheck(clickLocation, `piecePart`).filter((part) => { return part.parentElement == elmnt })[0];
                              if (overPiecePart) {
                                    let overPiecePartBounds = overPiecePart.getBoundingClientRect();
                                    let overPiecePartCenter = Object.create(locationObject);
                                    overPiecePartCenter.x = overPiecePartBounds.right - overPiecePartBounds.width / 2;
                                    overPiecePartCenter.y = overPiecePartBounds.bottom - overPiecePartBounds.height / 2;
                                    let overPieceSquare = overlayCheck(overPiecePartCenter, `filledSpace`)[0];
                                    let overPieceSquareBounds = overPieceSquare.getBoundingClientRect();
                                    elmnt.style.top = elmnt.offsetTop + (overPieceSquareBounds.bottom - overPieceSquareBounds.height / 2) - overPiecePartCenter.y + "px";
                                    elmnt.style.left = elmnt.offsetLeft + (overPieceSquareBounds.right - overPieceSquareBounds.width / 2) - overPiecePartCenter.x + "px";
                                    let piecePositions = JSON.parse(window.sessionStorage.getItem(`calendarPositions`));
                                    piecePositions[elmnt.id].rotation = elmnt.rotation;
                                    piecePositions[elmnt.id].position = {
                                          x: elmnt.offsetLeft,
                                          y: elmnt.offsetTop,
                                    };
                                    window.sessionStorage.setItem(`calendarPositions`, JSON.stringify(piecePositions));
                                    //turn invisible and fuck with the stuff below :(
                                    //elmnt.style.opacity = `0%`;
                                    for (childSquare of Array.from(elmnt.children).filter((childDiv) => { return Array.from(childDiv.classList).includes(`piecePart`) })) {
                                          let squareCenter = Object.create(locationObject);
                                          let squareBounds = childSquare.getBoundingClientRect();
                                          squareCenter.x = squareBounds.right - squareBounds.width / 2;
                                          squareCenter.y = squareBounds.bottom - squareBounds.height / 2;
                                          let childOverSquare = overlayCheck(squareCenter, `filledSpace`)[0];
                                          if (childOverSquare) {
                                                if (!childOverSquare.allColors) {
                                                      //childOverSquare.currentColor = elmnt.currentColor;
                                                      // childOverSquare.currentColor = [255, 255, 255].map((colorNum, idx) => {
                                                      // 	return (elmnt.currentColor[idx] + colorNum) / 2;
                                                      // });
                                                      childOverSquare.allColors = [[255, 255, 255]];
                                                }
                                                childOverSquare.allColors.push(elmnt.currentColor);
                                                childOverSquare.currentColor = averageArrays(childOverSquare.allColors);
                                                // childOverSquare.currentColor = childOverSquare.currentColor.map((colorNum, idx) => {
                                                // 	return (elmnt.currentColor[idx] + colorNum) / 2;
                                                // });
                                                // if(!childOverSquare.affectedParts) {
                                                // 	childOverSquare.affectedParts = [];
                                                // }
                                                //childOverSquare.affectedParts.push(elmnt.currentColor);
                                                childOverSquare.style.backgroundColor = `rgb(${childOverSquare.currentColor[0]}, ${childOverSquare.currentColor[1]}, ${childOverSquare.currentColor[2]})`;
                                                childSquare.style.backgroundColor = `rgba(${elmnt.currentColor[0]}, ${elmnt.currentColor[1]}, ${elmnt.currentColor[2]}, 0)`;
                                                // let numberDiv = Array.from(childOverSquare.children).filter((childNumber) => { 
                                                // 	return Array.from(childNumber.classList).includes(elmnt.number.toString());
                                                // })[0];
                                                // if(numberDiv) {
                                                // 	numberDiv.style.visibility = `visible`;
                                                // 	numberDiv.style.transform = `rotate(${elmnt.rotation}deg)`;
                                                // }
                                                if (!elmnt.alteredData) {
                                                      elmnt.alteredData = [];
                                                }
                                                elmnt.alteredData.push(childOverSquare);
                                          }
                                    }
                              }
                        }
                  }
            }
            if (slipTape) {
                  let willSnap = true;
                  for (childSquare of Array.from(elmnt.children[1].children).filter((childDiv) => { return Array.from(childDiv.classList).includes(`slipSpot`) })) {
                        let squareCenter = Object.create(locationObject);
                        let squareBounds = childSquare.getBoundingClientRect();
                        squareCenter.x = squareBounds.right - squareBounds.width / 2;
                        squareCenter.y = squareBounds.bottom - squareBounds.height / 2;
                        let centeredOverSquare = overlayCheck(squareCenter, `filledSpace`)[0];
                        if (!centeredOverSquare) {
                              willSnap = false;
                        }
                  }
                  if (willSnap) {
                        let overPiecePart = elmnt.children[1].children[0];
                        if (overPiecePart) {
                              let overPiecePartBounds = overPiecePart.getBoundingClientRect();
                              let overPiecePartCenter = Object.create(locationObject);
                              overPiecePartCenter.x = overPiecePartBounds.right - overPiecePartBounds.width / 2;
                              overPiecePartCenter.y = overPiecePartBounds.bottom - overPiecePartBounds.height / 2;
                              let overPieceSquare = overlayCheck(overPiecePartCenter, `filledSpace`)[0];
                              let overPieceSquareBounds = overPieceSquare.getBoundingClientRect();
                              elmnt.style.top = elmnt.offsetTop + (overPieceSquareBounds.bottom - overPieceSquareBounds.height / 2) - overPiecePartCenter.y + "px";
                              elmnt.style.left = elmnt.offsetLeft + (overPieceSquareBounds.right - overPieceSquareBounds.width / 2) - overPiecePartCenter.x + "px";
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

function averageArrays(arrays) {
      let result = [];
      for (var i = 0; i < arrays[0].length; i++) {
            var num = 0;
            for (var i2 = 0; i2 < arrays.length; i2++) {
                  num += arrays[i2][i];
            }
            result.push(Math.round(num / arrays.length));
      }

      return result;
}