var mainDiv = document.getElementById(`mainGrid`);
var squareSize = 100;
var gridGap = 1;
var solution = {plant:[5,1], cup:[3,3], statue:[4,5], candle:[0,4], painting:[2,0]};
var currentPosition = {plant:[3,3], cup:[1,2], statue:[0,3], candle:[3,5], painting:[1,5]};
var debug = false;
var pageData = [
 {innerHTML:`<span class="title">Greetings from <br> Geomancy American Bureaucracy!</span><brb> GAB wants to assist you in arranging your home so that you can be the best you! The following items' placement within your rooms crucially determine the vibe: <brb>Plants <brb>Coffee Cups <brb>Statues <brb>Candles <brb>Paintings <brb>To help you figure out how you should arrange these items, GAB has created this simple and handy guide:<brb>`},
 {innerHTML:`
 	<span class="scribbles offset">Gotta Practice!</span>
 	Start by dividing your room into a <br> <span class="large">▮</span> <span class="scribbles six">6</span> by <span class="large">▮</span> <span class="scribbles six">6</span> grid. <brb>
	Items cannot be in the same row or column as another item.<brb>
	Paintings must be hung where there is <span class="large">▮</span> <span class="scribbles one">1</span> hook to the left and <span class="large">▮</span> <span class="scribbles two">2</span> hooks to the right.<brb>
	Plants must always touch a wall.<brb>
	Candles must be at least <span class="large">▮</span> <span class="scribbles three">3</span> squares away from the nearest door. <brb>
	When given the option, Statues should be as close to Plants as possible. <brb>
	`},
	{innerHTML:`
	<div class="row pamphlet">
	<div class="sideText">
	Items should be arranged in height to bring the eye naturally from floor to ceiling.<brb>
	Try a height arrangement like the following:<brb>
	(Online Help: <brb> Height of Surfaces, Lowest to Highest: <brb> Floor <br> Coffee Table <br> Desk <br> Piano Top <br> Mantle <br> Wall)
	</div>
	<img class="heightChart" src="./images/heightChart.webp">
	</div>
	`},
];
createGrid(6,6);
loadItems(5);
turnToPage(0);
var timeStart;
window.onload = () => {
      timeStart = Date.now();
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
	let halfSlipState = window.sessionStorage.getItem(`halfSlipState`);
	let halfSlip = document.getElementById(`halfSlipLoungeA`);
	if (!inventory.halfSlipLoungeA) {
		if (halfSlipState == "out") {
			halfSlip.style.visibility = "visible";
			halfSlip.classList.add(`halfSlipLoungeAItem`);
			halfSlip.onclick = takeItem;
		}
	}
	// debugSolution();
};

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

function loadItems(totalImages) {
  for(i = 1; i <= totalImages; i++) {
		let img = new Image();
		img.count = i;
		img.onload = addToPage;
		img.src = `./images/item${i}.webp`;
  }
  function addToPage() {
		let imgContainer = document.createElement(`div`);
		let imageSize = 90;
		imgContainer.classList.add(`imgcontainer`, `moveable`, `position`);
		imgContainer.appendChild(this);
		mainDiv.appendChild(imgContainer);
		if(imgContainer.offsetHeight > imgContainer.offsetWidth) {
		  imgContainer.style.width = Math.floor(imgContainer.offsetWidth / imgContainer.offsetHeight * imageSize) + "px";
		} else {
		  imgContainer.style.width = `${imageSize}px`;
		}
		switch(this.count) {
			case 1:
				imgContainer.id = `cup`;
				break;
			case 2:
				imgContainer.id = `plant`;
				break;
			case 3:
				imgContainer.id = `painting`;
				break;
			case 4:
				imgContainer.id = `candle`;
				break;
			case 5:
				imgContainer.id = `statue`;
				break;
			default:
				console.log(`oh no`);
		}
		let placementSquare = document.getElementById(currentPosition[imgContainer.id].join());
		imgContainer.style.top = placementSquare.offsetTop + placementSquare.offsetHeight / 2 - imgContainer.offsetHeight / 2 + "px";
		imgContainer.style.left = placementSquare.offsetLeft + placementSquare.offsetWidth / 2 - imgContainer.offsetWidth / 2 + "px";
		dragElement(imgContainer);
  }
}

function debugSolution() {
	debug = true;
	Array.from(document.querySelectorAll(`.moveable`)).forEach((element) => {
		let placementSquare = document.getElementById(solution[element.id].join());
		element.style.top = placementSquare.offsetTop + placementSquare.offsetHeight / 2 - element.offsetHeight / 2 + "px";
		element.style.left = placementSquare.offsetLeft + placementSquare.offsetWidth / 2 - element.offsetWidth / 2 + "px";
	});
}

function createGrid(width, height) {
	let text = `auto `;
	mainDiv.style.gridTemplateColumns = text.repeat(width);
	mainDiv.style.gridGap = gridGap + "px";
	mainDiv.style.width = (squareSize + gridGap) * width + "px";
	mainDiv.style.height = (squareSize + gridGap) * height + "px";
	mainDiv.style.zIndex = "6";
	// let roomMapEdge = document.getElementById('mapEdge');
	// let startSquare;
	// roomMapEdge.style.width = (squareSize + gridGap) * width + 100 + "px";
	for (gridHeight = 0; gridHeight < height; gridHeight++) {
		for (gridWidth = 0; gridWidth < width; gridWidth++) {
			let newSquare = document.createElement(`div`);
			newSquare.classList.add(`square`);
			mainDiv.appendChild(newSquare);
			newSquare.style.backgroundImage = `url(./images/roomMap.webp)`;
			newSquare.style.backgroundSize = squareSize * width + "px";
			newSquare.style.backgroundPosition = squareSize * (width - gridWidth) + "px " + squareSize * (height -gridHeight) + "px";
			newSquare.style.width = squareSize + "px";
			newSquare.style.height = squareSize + "px";
			newSquare.id = `${gridWidth},${gridHeight}`;
			// if(gridHeight == 0 && gridWidth == 0) {
			// 	startSquare = newSquare;
			// } else if(gridHeight == height - 1 && gridWidth == width - 1) {
			// 	roomMapEdge.style.top = startSquare.offsetTop - 50 + "px";
			// 	roomMapEdge.style.left = startSquare.offsetLeft - 50 + "px";
			// }
		}
	}
	let totalSize = [mainDiv.offsetWidth, mainDiv.offsetHeight];
	return totalSize;
}

function turnToPage(pageNumber) {
	let nextButton = document.getElementById(`nextButton`);
	let lastButton = document.getElementById(`lastButton`);
	let text = document.getElementById(`notePad`);
	if(pageData[pageNumber]) {
		if(pageNumber == 0) {
			lastButton.style.visibility = `hidden`;
			nextButton.style.visibility = `visible`;
		} else if (pageNumber == pageData.length - 1) {
			nextButton.style.visibility = `hidden`;
			lastButton.style.visibility = `visible`;
		} else {
			lastButton.style.visibility = `visible`;
			nextButton.style.visibility = `visible`;
		}
		text.pageID = pageNumber;
		text.innerHTML = pageData[pageNumber].innerHTML;
	}
}

function nextPage() {
	let text = document.getElementById(`notePad`);
	turnToPage(Number(text.pageID) + 1);
}

function lastPage() {
	let text = document.getElementById(`notePad`);
	turnToPage(Number(text.pageID) - 1);
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
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		let inventoryItem = Array.from(elmnt.classList).find((value) => {
			return value.includes(`dragItem`);
		  });
		  if(!inventoryItem) {
			currentPosition[e.target.id] = [-1,-1];
		  }
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
			let onSquare = overlayCheck(clickLocation, "square");
			if (onSquare[0]) {
				elmnt.style.top = onSquare[0].offsetTop + onSquare[0].offsetHeight / 2 - elmnt.offsetHeight / 2 + "px";
				elmnt.style.left = onSquare[0].offsetLeft + onSquare[0].offsetWidth / 2 - elmnt.offsetWidth / 2 + "px";
				currentPosition[event.target.id] = onSquare[0].id.split(",").map(Number);
				// if(checkSolution() && !debug) {
				// 	let allData = document.getElementById(`center`);
				// 	allData.innerHTML = `YAY`;
				// }
			}
		}
	}
}

function checkSolution() {
	for (const [key, value] of Object.entries(currentPosition)) {
	  if(!arraysEqual(value, solution[key])) {
	  	return false;
	  }
	}
	return true;
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