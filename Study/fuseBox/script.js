var fuseBox = document.getElementById(`fusebox`);
let columns = 7;
let rows = 5;
var rightSide = false;
var leftSide = false;
var colors = {
	light: `#FFFFE0`,
	dark: `#3d4247`,
}
var timeStart;
window.onload = function() {
      //time recording code
      timeStart = Date.now();
      //end time recording code
	document.onclick = movementCheck;
	let inventory = window.sessionStorage.getItem(`inventory`);
	if(!inventory) {
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

	for(let i1 = 0; i1 < rows; i1++) {
		for(let i2 = 0; i2 < columns; i2++) {
			var light = document.createElement(`div`);
			light.classList.add(`grid`);
			light.style.backgroundColor = hexToRGB(colors.dark);
			light.id = `${i1},${i2}`;
			fuseBox.appendChild(light);
		}
	}
	let allGrid = document.getElementsByClassName('grid');

	// let tempButton = document.getElementById(`tempButton`);
	// tempButton.addEventListener("click", lightsOutSwap);
	Array.from(allGrid).forEach(function(gridSpot){
		let gridLocation = gridSpot.id.split(`,`);
	    gridSpot.addEventListener("click", triggerClick);
	});

	let fuseBoxLights = window.sessionStorage.getItem(`fuseBoxLights`);
	if(fuseBoxLights == "true") {
		let fuseBoxLightsDiv = document.getElementById(`fuseBoxLights`);
		fuseBoxLightsDiv.style.visibility = `visible`;
	}

	let fuseBoxData = window.sessionStorage.getItem(`foyerFuseBox`);
	if(fuseBoxData) {
		let foyerLight = document.getElementById(`foyerLight`);
		foyerLight.classList.remove(`lightRed`);
		foyerLight.classList.remove(`lightYellow`);
		foyerLight.classList.add(`lightGreen`);
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
	let item = Array.from(div.classList).filter((classes) => { return classes.includes(`Item`)})[0].replace(`Item`, ``);
	div.style.visibility = `hidden`;
	let inventory = JSON.parse(window.sessionStorage.getItem(`inventory`));
	if(item == `pegs`) {
		inventory[item] = Math.min(Number(inventory[item]) + 1, 4);
	  } else {
		inventory[item] = true;
	  }
	window.sessionStorage.setItem(`inventory`, JSON.stringify(inventory));
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
		if(item == "pegs") {
			let pegs = document.createElement(`div`);
			pegs.id = item;
			pegs.style.width = inventoryDiv.clientHeight + "px";
			pegs.style.height = inventoryDiv.clientHeight + "px";
			pegs.classList.add(`inventoryItem`);
			dragElement(pegs);
			inventoryDiv.appendChild(pegs);
			let appendFixer = 0;
			for(i = 1; i <= 4; i++) {
				let imgNum = i;
				addImg(`inventoryItems/${item}`, pegs, (imgDiv) => {
					imgDiv.style.position = `relative`;
					imgDiv.id = `${imgNum}peg`;
					imgDiv.style.transform = `rotate(-120deg)`;
					imgDiv.style.height = pegs.clientWidth * 0.70 + "px";
					imgDiv.style.left = 100 - 40 * imgNum + "px";
					imgDiv.style.top = -27 + 20 * imgNum + "px";
					changeItemVisibility(item, itemValue);
					appendFixer++;
					if(appendFixer == 4) {
						sortPegs(pegs);
					}
				});				
			}

			function sortPegs(pegHolder) {
				let correctOrder = Array.from(pegHolder.children).sort(function(a, b) {
					return Number(Array.from(a.id)[0]) - Number(Array.from(b.id)[0]);
				});
				for (peg of correctOrder) {
					pegHolder.appendChild(peg);
				}
			}
		} else {
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
		}
	} else {
		changeItemVisibility(item, itemValue);
	}
	function changeItemVisibility(item, itemValue) {
		inventoryElement = Array.from(inventoryDiv.children).filter((inventoryItem) => { return inventoryItem.id == item})[0];
		if(item == "pegs") {
			for(i = 1; i <= 4; i++) {
				let pegDiv = document.getElementById(`${i}peg`);
				if(pegDiv) {
					pegDiv.style.display = ``;
				}
			} 
			for(i = 4; i > itemValue; i--) {
				let pegDiv = document.getElementById(`${i}peg`);
				if(pegDiv) {
					pegDiv.style.display = `none`;
				}
			}
		} else {
			if(!itemValue) {
				inventoryElement.style.display = `none`;
			} else {
				inventoryElement.style.display = ``;
			}
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

function triggerClick(event) {
	swapColor(event.target);
	checkGrid();
}

function lightsOutSwap(event) {
	let allGrid = document.getElementsByClassName('grid');
	Array.from(allGrid).forEach(function(gridSpot){
		let gridLocation = gridSpot.id.split(`,`);
	    gridSpot.removeEventListener("click", triggerClick);
	    if(!(gridLocation[0] == `4` || gridLocation[1] == `6`)) {
		    gridSpot.addEventListener("click", lightsOut);
			var random_boolean = Math.random() < 0.5;
			if(random_boolean) {
				gridSpot.style.backgroundColor = hexToRGB(colors.light);
			} else {
				gridSpot.style.backgroundColor = hexToRGB(colors.dark);
			}
	    } else {
	    	gridSpot.addEventListener("click", longsOut);
	    	gridSpot.style.backgroundColor = `rgb(184, 74, 61)`;
	    }
	});
}

function lightsOut(event) {
	let clickedDiv = event.target;
	let clickedGrid = clickedDiv.id.split(`,`);
	clickedGrid[0] = Number(clickedGrid[0]);
	clickedGrid[1] = Number(clickedGrid[1]);
	let upDiv = document.getElementById(`${clickedGrid[0]-1},${clickedGrid[1]}`);
	let downDiv = document.getElementById(`${clickedGrid[0]+1},${clickedGrid[1]}`);
	let leftDiv = document.getElementById(`${clickedGrid[0]},${clickedGrid[1]-1}`);
	let rightDiv = document.getElementById(`${clickedGrid[0]},${clickedGrid[1]+1}`);
	swapColor(clickedDiv);
	swapColor(upDiv);
	swapColor(leftDiv);
	if(!(rightDiv.id.split(',')[1] == `6`)) {
		swapColor(rightDiv);
	}
	if(!(downDiv.id.split(',')[0] == `4`)) {
		swapColor(downDiv);
	}
}

function longsOut(event) {
	let clickedDiv = event.target;
	let clickedGrid = clickedDiv.id.split(`,`);
	clickedGrid[0] = Number(clickedGrid[0]);
	if(clickedGrid[0] == `4`) {
		if(clickedGrid[1] == `6`) {
			let div = document.getElementById(`${3},${5}`);
			return swapColor(div);			
		}
		for(let i = 3; i >= Math.ceil(rows/2)-2; i--) {
			let div = document.getElementById(`${i},${clickedGrid[1]}`);
			swapColor(div);
		}
	} else {
		for(let i = 5; i >= Math.floor(columns/2); i--) {
			let div = document.getElementById(`${clickedGrid[0]},${i}`);
			swapColor(div);
		}		
	}
}

function swapColor(div) {
	if (div && div.tagName == `DIV`) {
		if(div.style.backgroundColor == hexToRGB(colors.light)) {
			div.style.backgroundColor = hexToRGB(colors.dark);	
		} else {
			div.style.backgroundColor = hexToRGB(colors.light);					
		}
	}
}


function checkGrid() {
	let allGrid = document.getElementsByClassName('grid');
	let foyerAnswer = [
		[1,0,0,0,0,1,0],
		[1,1,1,1,0,1,0],
		[0,0,0,1,1,1,0],
		[0,1,1,1,0,1,1],
		[0,1,0,0,0,0,0],
	];
	let currentAnswer = [
		[],
		[],
		[],
		[],
		[],
	];
	Array.from(allGrid).forEach(function(button){
		let buttonID = button.id.split(`,`);
		if(button.style.backgroundColor == hexToRGB(colors.light)) {
			currentAnswer[buttonID[0]].push(1);		
		} else {
			currentAnswer[buttonID[0]].push(0);
		}
	});
	let arrayIterator = 0;
	let passCheckFoyer = true;
	currentAnswer.forEach(function(row){
		if(!arraysEqual(row, foyerAnswer[arrayIterator])) {
			passCheckFoyer = false;
		}
		arrayIterator++;
	});

	if(passCheckFoyer) {
		window.sessionStorage.setItem(`foyerFuseBox`, true);
		let foyerLight = document.getElementById(`foyerLight`);
		foyerLight.classList.remove(`lightRed`);
		foyerLight.classList.remove(`lightYellow`);
		foyerLight.classList.add(`lightGreen`);
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
		if(this.id == `pegs`) {
			let nextPeg = Array.from(this.children).filter((peg) => { return !peg.onPage})[0];
			placedItem = nextPeg.cloneNode(true);
			placedItem.style.height = 200 + "px";
			placedItem.style.width = 200 + "px";
			nextPeg.style.opacity = `50%`;
			nextPeg.onPage = true;
			nextPeg.isPeg = true;
			placedItem.originalItem = nextPeg;
			if(Array.from(this.children).filter((peg) => { return !peg.onPage}).length == 0) {
				this.onPage = true;
			}
		} else {
			placedItem = this.cloneNode(true);
			if (this.children.length > 1) {
				placedItem.children[0].style.display = ``;
				placedItem.children[1].style.display = `none`;
			}
			placedItem.style.height = Math.min(700 * this.children[0].naturalHeight / this.children[0].naturalWidth, this.children[0].naturalHeight) + "px";
			placedItem.style.width = placedItem.style.height.replace("px","") * this.children[0].naturalWidth / this.children[0].naturalHeight + "px";
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
			if(elmnt.originalItem.isPeg) {
				elmnt.originalItem.parentElement.onPage = false;
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

function hexToRGB(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
  }