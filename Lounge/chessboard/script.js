var gameArea = document.getElementById(`gameArea`);
var boardStats = {
  rows: 8,
  columns: 8,
  squareSize: (gameArea.clientHeight / 9.5),
  border: ((gameArea.clientHeight / 9.5) / 2),
  gridGap: 0,
  backlineOrder: [`Rook`, `Knight`, `Bishop`, `Queen`, `King`, `Bishop`, `Knight`, `Rook`],

  usedPieces: {"2,7": `whiteKing`, "6,1": `whiteRook`, "1,5" : `whiteBishop`, "3,6": `whiteknight`, "4,0": `blackKing`, "5,4": `blackQueen`, "2,2": `blackRook`, "4,1": `blackPawn`},

  unusedPieces: [`whitePawn`, `whiteQueen`, `whiteBishop`, `whiteKnight`, `whiteRook`, `blackPawn`, `blackBishop`, `blackBishop`, `blackRook`, `blackKnight`, `blackKnight`],
  rowLabels: [`1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`],
  columnLabels: [`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`]
};
var correctSquare = 'square4,3';
var correctPiece = `whiteBishop`;
var drawerOpen = false;

var timeStart;
window.onload = (event) => {
      //time recording code
      timeStart = Date.now();
      //end time recording code
//in case I want to make something run at launch
  document.onclick = movementCheck;
	let inventory = window.sessionStorage.getItem(`inventoryLounge`);
	if(!inventory) {
		inventory = {
			halfSlipLoungeA: false,
			plate1: false,
			plate2: false,
			plate3: false,
			plate4: false,
			plate5: false,
			plate6: false,
		};
	  window.sessionStorage.setItem(`inventoryLounge`, JSON.stringify(inventory));
	} else {
	  inventory = JSON.parse(inventory);
	}
	for (item in inventory) {
	  enterInventoryEntry(item, inventory[item]);
	}
  createBoard();
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
	if(Array.from(event.target.classList).includes(`leave`)) {
	              setTimeSpent();
            window.location.href = `../index.html`;
	}
}

function pullDownInv(inventoryDiv) {
  if(inventoryDiv.target) {
    inventoryDiv = document.getElementsByClassName(`inventory`)[0];
  }
  inventoryDiv.style.opacity = `100%`;
  inventoryDiv.style.top = 0 + "px";
}

function pullUpInv(inventoryDiv) {
  if(inventoryDiv.target) {
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
  if(clickedItem) {
    inventoryDiv.toggled = false;
  }
  if(!inventoryDiv.toggled) {
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
  if(div.target) {
    div = div.target;
  }
  let item = Array.from(div.classList).filter((classes) => { return classes.includes(`Item`)})[0].replace(`Item`, ``);
  div.style.visibility = `hidden`;
  let inventory = JSON.parse(window.sessionStorage.getItem(`inventoryLounge`));
  inventory[item] = true;
  window.sessionStorage.setItem(`inventoryLounge`, JSON.stringify(inventory));
let inventoryDiv = document.getElementsByClassName(`inventory`)[0];
if(!inventoryDiv.toggled) {
  pullDownInv(inventoryDiv);
  setTimeout(pullUpInv, 800, inventoryDiv);
}
  enterInventoryEntry(item, inventory[item]);

}

function enterInventoryEntry(item, itemValue) {
  let inventoryDiv = document.getElementsByClassName(`inventory`)[0];
  let inventoryElement = Array.from(inventoryDiv.children).filter((inventoryItem) => { return inventoryItem.id == item})[0];
  if(!inventoryElement) {
    addInv(`${item}`, inventoryDiv, (imgDiv) => {
      if(imgDiv) {
        imgDiv.id = item;
        imgDiv.classList.add(`inventoryItem`);
        addInv(`${item}Alt`, imgDiv, (altImgDiv) => {
          if(altImgDiv) {
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
  inventoryElement = Array.from(inventoryDiv.children).filter((inventoryItem) => { return inventoryItem.id == item})[0];
  if(!itemValue) {
    inventoryElement.style.display = `none`;
  } else {
    inventoryElement.style.display = ``;
  }
  }
}

function goToRoom(div) {
  let room = Array.from(div.classList).filter((classes) => { return classes.includes(`door`)})[0].replace(`door`, ``);
  console.log(room);
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
	  if(parentElement) {
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
    if(parentElement) {
      parentElement.appendChild(newDiv);
    }
    newDiv.classList.add(`imgcontainer`);
    newDiv.appendChild(this);
    if (imgCallback) {
      imgCallback(newDiv);
    }
  }
}

function createBoard() {
  let chessBoard = document.createElement(`div`);
  let text = `auto `
  gameArea.appendChild(chessBoard);
  chessBoard.classList.add(`chessBoard`, `position`);
  chessBoard.id = 'board';
  chessBoard.style.gridTemplateColumns = text.repeat(boardStats.columns);
  chessBoard.style.gap = boardStats.gridGap + "px";
  chessBoard.style.width = (boardStats.squareSize + boardStats.gridGap) * boardStats.columns + "px";
  chessBoard.style.height = (boardStats.squareSize + boardStats.gridGap) * boardStats.rows + "px";
  chessBoard.style.border = `${boardStats.border}px solid maroon`;
  
  for (row = 0; row < boardStats.rows; row++) {
    for (column = 0; column < boardStats.columns; column++) {
      let newSquare = document.createElement('div');
      newSquare.id = `square${column},${row}`;
      newSquare.classList.add(`square`);
      chessBoard.appendChild(newSquare);
      newSquare.style.height = boardStats.squareSize + "px";
      newSquare.style.width = boardStats.squareSize + "px";
      if ((row + column) % 2 == 0) {
        newSquare.style.backgroundColor = `#532f2c`;
      } else {
        newSquare.style.backgroundColor = `#ddc5ab`;
      }
    }
  }
  // Array.from(document.querySelectorAll('.square')).forEach((square) => {
  //   let x = Number(square.id.replace('square', '').split(',')[0]);
  //   let y = Number(square.id.replace('square', '').split(',')[1]);
  //   if (x == 0) {
  //       let label = document.createElement(`span`);
  //       label.innerHTML = boardStats.rowLabels[y];
  //       square.appendChild(label);
  //       label.classList.add('label');
  //       label.style.left = square.offsetLeft - ((boardStats.squareSize / 2) / 2) + 'px';
  //       label.style.top = square.offsetTop + (square.clientHeight / 2) + 'px';
  //     }
  //     if (y == 7) {
  //       let label = document.createElement(`span`);
  //       label.innerHTML = boardStats.columnLabels[x];
  //       square.appendChild(label);
  //       label.classList.add('label');
  //       label.style.top = square.offsetTop + square.clientHeight + ((boardStats.squareSize / 2) / 3) + 'px';
  //       label.style.left = square.offsetLeft + (square.clientHeight / 2) + 'px';
  //     }
  // });
  chessBoard.bounds = chessBoard.getBoundingClientRect();
  placePieces(chessBoard);
  addGuide(chessBoard);
}

function placePieces(board) {
  let pieceIterator = 0;
  for ([squareSpot, piece] of Object.entries(boardStats.usedPieces)) {
    let pieceName = piece;
      addImg(piece, document.getElementById(`square${squareSpot}`), (pieceDiv) => {
        pieceDiv.classList.add(`piece`,`${pieceName}`);
        pieceDiv.id = pieceName;
        pieceDiv.style.height = boardStats.squareSize + 'px';
        pieceDiv.style.width = boardStats.squareSize + 'px';
        pieceDiv.style.zIndex = pieceIterator;
        piece.capture = false;
        pieceIterator ++;
        dragElement(pieceDiv);
      });
  }
}

function capture(piece) {
  piece.style.left = - piece.clientWidth - boardStats.border + "px";
  piece.style.top = (piece.clientHeight * Object.values(boardStats.usedPieces).indexOf(piece.id)) + "px";
}

// function placePiecesRegular(board) {
//   Array.from(document.querySelectorAll('.square')).forEach((square) => {
//     let x = Number(square.id.replace('square', '').split(',')[0]);
//     let y = Number(square.id.replace('square', '').split(',')[1]);
//     let src = '';
//     switch(y) {
//       case 0:
//         src = `black${boardStats.backlineOrder[x]}`
//         break;
//       case 1:
//         src = `blackPawn`
//         break;
//       case 6:
//         src = `whitePawn`
//         break;
//       case 7:
//         src = `white${boardStats.backlineOrder[x]}`
//         break;
//       default:
//     }
//     addImg(src, square, (piece) => {
//       piece.classList.add(`piece`);
//       piece.id = src;
//       piece.style.height = boardStats.squareSize + 'px';
//       piece.style.width = boardStats.squareSize + 'px';
//       dragElement(piece);
//     });
//   });
// }

function addGuide(chessBoard) {
  addImg("guide", gameArea, (guide) => {
    guide.classList.add(`guide`, `position`);
    guide.style.aspectRatio = "0.48346";
    guide.style.height = (chessBoard.clientHeight / 1.25) + "px";
    if(guide.clientWidth > (window.innerWidth - chessBoard.clientWidth) / 2) {
      guide.style.height = ``;
      guide.style.width = ((window.innerWidth - chessBoard.clientWidth) / 2) * (4/5) + 'px';
    }
    guide.style.left = (chessBoard.offsetLeft - guide.clientWidth - (boardStats.rows - 1)) / 2 + 'px';
    guide.style.top = window.innerHeight / 2 - guide.clientHeight / 2 + 'px';
  });
}

function operateDrawer() {
  let inventory = JSON.parse(window.sessionStorage.getItem(`inventoryLounge`));
  if (!inventory.halfSlipLoungeA) {
    return;
  }
  if (drawerOpen == false) {
    let drawer = document.createElement(`div`);
    let board = document.getElementById(`board`);
    drawer.classList.add(`drawer`);
    drawer.id = (`drawer`);
    gameArea.appendChild(drawer);
    let border = 10;
    drawer.style.height = board.clientHeight / 2 + 'px';
    drawer.style.width = (window.innerWidth - (board.clientWidth + (boardStats.border * 2))) / 4 + "px";
    drawer.style.border = `${border}px solid #4f3927`;
    drawer.style.left = board.offsetLeft + board.clientWidth + (boardStats.border * 2) + boardStats.rows - border + "px";
    drawer.style.top = window.innerHeight / 2 - drawer.clientHeight / 2 + 'px';
    for (const piece of boardStats.unusedPieces) {
      addImg(`${piece}`, drawer, (piece) => {
        piece.classList.add(`piece`);
        piece.style.height = boardStats.squareSize + 'px';
        piece.style.width = boardStats.squareSize + 'px';
        piece.style.left = getRandomInt(piece.clientWidth,drawer.clientWidth) - piece.clientWidth + "px";
        piece.style.top = getRandomInt(piece.clientHeight,drawer.clientHeight) - piece.clientHeight + "px";
        piece.style.transformOrigin = ` 50% 50%`;
        piece.style.transform = `rotate(${getRandomInt(1,359)}deg)`;
        piece.style.zIndex = 2;
      });
    }
    if(!inventory.plate1) {
      addImg("plate1", drawer, (gear) => {
        gear.classList.add(`position`, `plate1Item`);
        gear.style.height = drawer.clientWidth / 2 + 'px';
        gear.style.width = drawer.clientWidth / 2 + 'px';
        gear.style.left = getRandomInt(gear.clientWidth,drawer.clientWidth) - gear.clientWidth + "px";
        gear.style.top = getRandomInt(gear.clientHeight,drawer.clientHeight) - gear.clientHeight + "px";
        gear.style.zIndex = 3;
        gear.onclick = takeItem;
      });
    }
    if(!inventory.plate2) {
      addImg("plate2", drawer, (gear) => {
        gear.classList.add(`position`, `plate2Item`);
        gear.style.height = drawer.clientWidth / 2 + 'px';
        gear.style.width = drawer.clientWidth / 2 + 'px';
        gear.style.left = getRandomInt(gear.clientWidth,drawer.clientWidth) - gear.clientWidth + "px";
        gear.style.top = getRandomInt(gear.clientHeight,drawer.clientHeight) - gear.clientHeight + "px";
        gear.style.zIndex = 3;
        gear.onclick = takeItem;
      });
    }
    if(!inventory.plate4) {
      addImg("plate4", drawer, (gear) => {
        gear.classList.add(`position`, `plate4Item`);
        gear.style.height = drawer.clientWidth / 2 + 'px';
        gear.style.width = drawer.clientWidth / 2 + 'px';
        gear.style.left = getRandomInt(gear.clientWidth,drawer.clientWidth) - gear.clientWidth + "px";
        gear.style.top = getRandomInt(gear.clientHeight,drawer.clientHeight) - gear.clientHeight + "px";
        gear.style.zIndex = 3;
        gear.onclick = takeItem;
      });
    }
    drawerOpen = true;
  } else if (drawerOpen == true) {
    let drawer = document.getElementById(`drawer`);
    drawer.remove();
    drawerOpen = false;
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
	  if(inventoryItem) {
		  elmnt.onmousedown = copyAndDrag;
	  } else {
		  elmnt.onmousedown = dragMouseDown;
	  }
  }

	function copyAndDrag(event) {
		if(this.onPage) {
			return;
		}
		let placedItem;
		placedItem = this.cloneNode(true);
    if (this.children.length > 1) {
      placedItem.children[0].style.display = ``;
      placedItem.children[1].style.display = `none`;
    }
		placedItem.style.height = Math.min(500 * this.children[0].naturalHeight / this.children[0].naturalWidth, this.children[0].naturalHeight) + "px";
		placedItem.style.width = placedItem.style.height.replace("px","") * this.children[0].naturalWidth / this.children[0].naturalHeight + "px";
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
  let inventoryItem = Array.from(elmnt.classList).find((value) => {
    return value.includes(`dragItem`);
  });
  if(!inventoryItem) {
    Array.from(document.querySelectorAll(`.piece`)).forEach((div) => {
      if(div.style.zIndex > elmnt.style.zIndex && div.id != elmnt.id) {
        div.style.zIndex = div.style.zIndex-1;
      }
    });
    elmnt.style.zIndex = Array.from(document.querySelectorAll(`.piece`)).length;
  }
  // get the mouse cursor position at startup:
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
    if(overInventory && inventoryItem) {
      elmnt.remove();
      elmnt.originalItem.style.opacity = `100%`;
      elmnt.originalItem.onPage = false;
    }
    if(!inventoryItem) {
      let pieceToCapture = overlayCheck(clickLocation, `piece`);
      let onSquare = overlayCheck(clickLocation, "square");
      if (onSquare[0]) {
        elmnt.style.top = onSquare[0].offsetTop + onSquare[0].offsetHeight / 2 - elmnt.offsetHeight / 2 + "px";
        elmnt.style.left = onSquare[0].offsetLeft + onSquare[0].offsetWidth / 2 - elmnt.offsetWidth / 2 + "px";
        let otherPiece = pieceToCapture.filter((pieceDiv) => { return pieceDiv.id != elmnt.id})[0];
        if (otherPiece) {
          capture(otherPiece);
          if (elmnt.id == "whiteBishop" && otherPiece.id == "blackRook") {
            operateDrawer();
          }
        }
      }
    }
  }
}

function overlayCheck(div, tagToCheck) {
  let points = Array.from(document.querySelectorAll(`.${tagToCheck}`));
  points.sort((a, b) => {
  let topfirst = a.style.top.replace("px","") - b.style.top.replace("px","");
  let leftfirst = a.style.left.replace("px","") - b.style.left.replace("px","");
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
  x:0,
  y:0,
  width:0,
  height:0,
  getBoundingClientRect() {
  return {right:(this.x + this.width), left:(this.x), top:(this.y), bottom:(this.y + this.height)};
  }
} 

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}