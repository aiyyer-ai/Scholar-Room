var gameArea = document.getElementById('gameArea');
var keys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
var numberAudios = [-6, -5, -4, -3, -2, -1, `start`, 1, 2, 3, 4, 5, 6];
var audios = [];
var keyOffset = 0;
var lastBlank = -1;
var gearBase = window.innerWidth * .05;
var gearSizes = [1,1,1,1,1,1,2,2,2,3.5];
var gearNumbers = [1, 1, 3, 5, 4, 6, 1, 1, 2, 2];
var rowCount = 4;
var sideGearRow = 1;
var correctSolution = [1, -2, 1, -6, -2, -4, 1, 5, 3, 1];
var currentSolution = [];
var gearPath = [];
var gearMemory = {};
var gearsLoaded = 0;
var gearNeighbors = {
	1: {
		1:[[1, 0], [-1, 0], [0, -1], [0, 1]], 
		2:[[1, 1], [1, -1], [-1, 1], [-1, -1]], 
		3.5: [[-1, -2], [-2, -1], [1, -2], [2, -1], [-1, 2], [-2, 1], [1, 2], [2, 1]]
	},
	2: {
		1:[[1, 1], [1, -1], [-1, 1], [-1, -1]],
		2:[[2, 0], [0, 2], [-2, 0], [0, -2]]
	},
	3.5: {
		1:[[-1, -2], [-2, -1], [1, -2], [2, -1], [-1, 2], [-2, 1], [1, 2], [2, 1]]
	},
};
var timeStart;
window.onload = (event) => {
      //time recording code
      timeStart = Date.now();
      //end time recording code
//in case I want to make something run at launch
	document.onclick = movementCheck;
	let inventory = window.sessionStorage.getItem(`inventoryLounge`);
	gearMemory = window.sessionStorage.getItem(`gearMemory`);
	if(!gearMemory) {
		gearMemory = {};
		window.sessionStorage.setItem(`gearMemory`, JSON.stringify(gearMemory));
	} else {
		gearMemory = JSON.parse(gearMemory);
	}
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
	audios = numberAudios.map(fileName => {
		const audio = new Audio(`./audio/${fileName}.wav`);
		audio.load(); // Preload the audio
		audio.playbackRate = 0.8;
		return audio;
	});
	makeBoard(gearBase);
	generateGears();
	// openSecret();
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

function openSecret() {
	let holeDivHider = document.createElement(`div`);
	holeDivHider.classList.add(`position`, `holeHider`);
	gameArea.appendChild(holeDivHider);
	let holeDiv = document.createElement(`div`);
	holeDiv.classList.add(`position`, `hole`);
	holeDivHider.appendChild(holeDiv);
	setTimeout(() => {
		holeDiv.style.left = `0px`;
	}, 100);
	let inventory = JSON.parse(window.sessionStorage.getItem(`inventoryLounge`));
    if(!inventory.plate3) {
		addImg("plate3", holeDiv, (gear) => {
			gear.classList.add(`position`, `plate3Item`);
			gear.style.height = holeDiv.clientWidth / 2 + 'px';
			gear.style.width = holeDiv.clientWidth / 2 + 'px';
			gear.style.left = getRandomInt(gear.clientWidth,holeDiv.clientWidth) - gear.clientWidth + "px";
			gear.style.top = getRandomInt(gear.clientHeight,holeDiv.clientHeight) - gear.clientHeight + "px";
			gear.style.zIndex = 3;
			gear.onclick = takeItem;
		});
	}
	if(!inventory.plate5) {
		addImg("plate5", holeDiv, (gear) => {
			gear.classList.add(`position`, `plate5Item`);
			gear.style.height = holeDiv.clientWidth / 2 + 'px';
			gear.style.width = holeDiv.clientWidth / 2 + 'px';
			gear.style.left = getRandomInt(gear.clientWidth,holeDiv.clientWidth) - gear.clientWidth + "px";
			gear.style.top = getRandomInt(gear.clientHeight,holeDiv.clientHeight) - gear.clientHeight + "px";
			gear.style.zIndex = 3;
			gear.onclick = takeItem;
		});
	}
	// if(!inventory.plate6) {
	// 	addImg("plate6", holeDiv, (gear) => {
	// 		gear.classList.add(`position`, `plate6Item`);
	// 		gear.style.height = holeDiv.clientWidth / 2 + 'px';
	// 		gear.style.width = holeDiv.clientWidth / 2 + 'px';
	// 		gear.style.left = getRandomInt(gear.clientWidth,holeDiv.clientWidth) - gear.clientWidth + "px";
	// 		gear.style.top = getRandomInt(gear.clientHeight,holeDiv.clientHeight) - gear.clientHeight + "px";
	// 		gear.style.zIndex = 3;
	// 		gear.onclick = takeItem;
	// 	});
	// }
}

function getRandomInt(min, max) {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);
	return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function generateGears() {
	let totalGears = {...gearNeighbors};
	for (size of Object.keys(totalGears)) {
		totalGears[size] = 0;
	}
	for (size in gearSizes) {
		let newGearSize = gearSizes[size];
		let gearCount = size;
		addImg(`gear`, gameArea, (gear) => {
			gear.style.height =  gearBase * newGearSize + 'px';
			gear.style.width =  gearBase * newGearSize + 'px';
			gear.classList.add(`gear`, `position`);
			gear.size = newGearSize;
			gear.id = gearCount;
			addImg(`${gearNumbers[gearCount]}`, gear, (number) => {
				number.classList.add(`number`, `position`);
				gear.numberValue = gearNumbers[gearCount];
				number.style.height = number.parentElement.clientHeight / 1.66 + 'px';
				number.style.top = number.parentElement.clientHeight / 2 - number.clientHeight / 2 + "px";
				number.style.left = number.parentElement.clientWidth / 2 - number.clientWidth / 2  + "px";
			});
			dragElement(gear);
			let gearNumArray = Object.keys(gearNeighbors).map( function (x) { 
				return parseInt(x, 10); 
			});
			gear.style.left = window.innerWidth - 80 - (gearBase * gearNumArray.slice(gearNumArray.indexOf(newGearSize), gearNumArray.length).reduce((a,b)=>a+b,0)) + 'px';
			gear.style.top = 40 + (gearBase * newGearSize) * totalGears[newGearSize] + `px`;
			totalGears[newGearSize] += 1;
			if (`${gear.id}` in gearMemory) {
				gearsLoaded++;
				let matchingPeg = document.getElementById(gearMemory[`${gear.id}`]);
				// console.log(matchingPeg);
				gear.style.top = matchingPeg.offsetTop + matchingPeg.offsetParent.offsetTop + matchingPeg.offsetHeight / 2 - gear.offsetHeight / 2 + "px";
				gear.style.left = matchingPeg.offsetLeft + matchingPeg.offsetParent.offsetLeft + matchingPeg.offsetWidth / 2 - gear.offsetWidth / 2 + "px";
				gear.pegValue = matchingPeg.id;
				if(gearsLoaded == Object.keys(gearMemory).length) {
					const event = new MouseEvent("mousedown", {
						clientX: matchingPeg.offsetLeft + matchingPeg.offsetParent.offsetLeft + matchingPeg.offsetWidth / 2 - gear.offsetWidth / 2,
						clientY: matchingPeg.offsetTop + matchingPeg.offsetParent.offsetTop + matchingPeg.offsetHeight / 2 - gear.offsetHeight / 2,
						shiftKey: true,
						view: window,
						bubbles: true,
						cancelable: true,
					});
					gear.dispatchEvent(event);
				}
			}

		});
	}
}

function makeBoard(gearSize) {
	let board = document.createElement(`div`);
	gameArea.appendChild(board);
	board.classList.add(`board`);
	board.id = `board`;
	board.style.width = gearSize * keys.length + "px";
	board.style.top = `15%`;
	board.style.height = (gearBase - 1) * rowCount + "px";
	let text = "auto ";
	board.style.gridTemplateColumns = text.repeat(keys.length);
	for (var pegRows = 0; pegRows < rowCount; pegRows++) {
		for (var i = 0; i < keys.length; i++) {
			let newPeg = document.createElement(`div`);
			board.appendChild(newPeg);
			newPeg.classList.add(`peg`);
			newPeg.id = `${i},${pegRows}`;
			if(pegRows >= rowCount / 2) {
				newPeg.pitchUp = -1;
			} else {
				newPeg.pitchUp = 1;
			}
			if (pegRows == sideGearRow && i == 0) {
				generateSideGear(newPeg);
			}
		}
	}
	let pitchBar = document.createElement(`div`);
	gameArea.appendChild(pitchBar);
	pitchBar.classList.add(`position`, `pitchBar`);
	pitchBar.style.width = gearSize * keys.length + "px";
	pitchBar.style.left = board.offsetLeft + "px";
	pitchBar.style.top = board.offsetTop + board.clientHeight / 2 - pitchBar.clientHeight / 2 + "px";
	pitchBar.innerHTML = `⬆ PITCH ⬇`;
}

function generateSideGear(refPeg) {
	let sideGearStart = document.getElementById(`startGear`);
		sideGearStart.style.height =  gearBase + 'px';
		sideGearStart.style.width =  gearBase + 'px';
		sideGearStart.style.zIndex = 2;
		sideGearStart.size = 1;
		sideGearStart.style.left = (refPeg.parentElement.offsetLeft + refPeg.offsetLeft) - (sideGearStart.clientWidth / 2) + (refPeg.clientWidth / 2) - gearBase + "px";
		sideGearStart.style.top = (refPeg.parentElement.offsetTop) + (sideGearStart.clientHeight * sideGearRow) + "px";
		let gearOffsetLeftStart = 1;
		sideGearStart.pegValue = `${-gearOffsetLeftStart},${sideGearRow}`;
		spin(sideGearStart);
		const sideGearInterval = setInterval(spin, 100, sideGearStart);
	let sideGearEnd = document.getElementById(`startGearEnd`);
		sideGearEnd.style.height =  gearBase + 'px';
		sideGearEnd.style.width =  gearBase + 'px';
		sideGearEnd.style.zIndex = 2;
		sideGearEnd.size = 1;
		sideGearEnd.style.left = (refPeg.parentElement.offsetLeft + refPeg.parentElement.clientWidth) + "px";
		sideGearEnd.style.top = (refPeg.parentElement.offsetTop) + (sideGearEnd.clientHeight * 2) + "px";
		let gearOffsetLeftEnd = keys.length;
		sideGearEnd.pegValue = `${gearOffsetLeftEnd},${sideGearRow + 1}`;
	// addImg(`gear`, gameArea, (gear) => {
	// 	gear.style.height =  gearBase + 'px';
	// 	gear.style.width =  gearBase + 'px';
	// 	gear.classList.add(`gear`, `position`, `sideGear`);
	// 	gear.id = `startGear`;
	// 	gear.style.zIndex = 2;
	// 	gear.size = 1;
	// 	gear.style.left = (refPeg.parentElement.offsetLeft + refPeg.offsetLeft) - (gear.clientWidth / 2) + (refPeg.clientWidth / 2) - gearBase + "px";
	// 	gear.style.top = (refPeg.parentElement.offsetTop + refPeg.offsetTop) - (gear.clientHeight / 2) + (refPeg.clientHeight / 2) + "px";
	// 	let gearOffsetLeft = 1;
	// 	gear.pegValue = `${-gearOffsetLeft},${sideGearRow}`;
	// 	const sideGearInterval = setInterval(spin, 100, gear);
	// });
	// addImg(`gear`, gameArea, (gear) => {
	// 	gear.style.height =  gearBase + 'px';
	// 	gear.style.width =  gearBase + 'px';
	// 	gear.classList.add(`gear`, `position`, `sideGearEnd`);
	// 	gear.id = `startGearEnd`;
	// 	gear.style.zIndex = 2;
	// 	gear.size = 1;
	// 	gear.style.left = (refPeg.parentElement.offsetLeft + refPeg.parentElement.clientWidth) + "px";
	// 	gear.style.top = (refPeg.parentElement.offsetTop) + (gear.clientHeight * 2) + "px";
	// 	let gearOffsetLeft = keys.length;
	// 	gear.pegValue = `${gearOffsetLeft},${sideGearRow + 1}`;
	// });
}

function keyMatch (peg, gear, active, lastGear) {
	if (active) {
		if(!gear.rotateInterval) {
			spin(gear, lastGear.direction);
			gear.rotateInterval = setInterval(spin, 100, gear, lastGear.direction);
			if(peg && peg.id.split(',')[0] != keys.length) {
				if(!currentSolution[peg.id.split(',')[0]]) {
					currentSolution[peg.id.split(',')[0]] = 0;
				}
				currentSolution[peg.id.split(',')[0]] += gear.numberValue * peg.pitchUp;
			}
		}
	} else {
		if(gear.rotateInterval) {
			clearInterval(gear.rotateInterval);
			gear.rotateInterval = false;
			gear.style.transform = ``;
			gear.rotation = 0;
			if(peg && peg.id.split(',')[0] != keys.length) {
				currentSolution[peg.id.split(',')[0]] -= gear.numberValue * peg.pitchUp;
			}
		}
	}
}

function solutionCheck(currentGear, currentPeg, lastGear) {
	if(currentPeg) {
		keyMatch(currentPeg, currentGear, true, lastGear);
		gearPath.push(currentGear.id);
		currentGear.alreadyChecked = true;
	}
	let allPairs = [];
	for (const [key, value] of Object.entries(gearNeighbors[currentGear.size])) {
		allPairs = allPairs.concat(Object.values(value).flat(0));
	}
	for (var coordDifference of allPairs) {
		var checkLocation = currentGear.pegValue.split(",").map(function (num, idx) {
		  return Number(num) + Number(coordDifference[idx]);
		});
		let allowedSize = false;
		for (const [key, value] of Object.entries(gearNeighbors[currentGear.size])) {
		  if(value.includes(coordDifference)) {
		  	allowedSize = key;
		  }
		}
		let checkPeg = document.getElementById(`${checkLocation}`);
		if(checkLocation == `${keys.length},${sideGearRow + 1}`) {
			checkPeg = {id: `${keys.length},${sideGearRow + 1}`};
		}
		if(checkPeg) {
			let nextGear = Array.from(document.querySelectorAll(`.gear`)).filter((gear) => {
				return gear.pegValue == checkPeg.id;
			});
			if(nextGear[0] && nextGear.length == 1 && nextGear[0].size == allowedSize && nextGear[0].id != lastGear.id) {
				if(nextGear[0].alreadyChecked) {
					Array.from(document.querySelectorAll(`.gear`)).forEach((gear) => {
						if(gear.pegValue) {
							keyMatch(document.getElementById(gear.pegValue), gear, false);
						}
					});
				} else {
					solutionCheck(nextGear[0], checkPeg, currentGear);
				}
			}
		}
	}
	return true;
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

function spin(div, direction) {
	if(!div.rotation) {
		div.rotation = 0;
	}
	if(!div.direction) {
		if(!direction) {
			div.direction = 1;
		} else {
			div.direction = -1 * direction;
		}
	}
	div.rotation += 10 * div.direction;
	if(div.rotation >= 360 || div.rotation <= -360) {
		div.rotation = 0;
	}
	div.style.transform = `rotate(${div.rotation}deg)`;
}

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
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
	  if (Array.from(e.target.classList).includes(`gear`)) {
		e.target.pegValue = null;
		let chainCheck = false;
		if(e.target.alreadyChecked) {
			chainCheck = true;
		}
		Array.from(document.querySelectorAll(`.gear`)).forEach((gear) => {
			if(chainCheck) {
				if(gearPath.indexOf(e.target.id) < gearPath.indexOf(gear.id)) {
					gearPath.splice(gearPath.indexOf(gear.id), 1);
					keyMatch(document.getElementById(gear.pegValue), gear, false);
				}
			}
			gear.alreadyChecked = false;
		});
		gearPath.splice(gearPath.indexOf(e.target.id), 1);
		delete gearMemory[e.target.id];
		window.sessionStorage.setItem(`gearMemory`, JSON.stringify(gearMemory));
		let centerLocation = Object.create(locationObject);
		let allowedError = gearBase / 2;
		centerLocation.width = allowedError;
		centerLocation.height = allowedError;
		centerLocation.x = e.target.offsetLeft + (e.target.clientWidth - centerLocation.width) / 2;
		centerLocation.y = e.target.offsetTop + (e.target.clientHeight - centerLocation.height) / 2;
		let onSquare = overlayCheck(centerLocation, "peg");
		if (onSquare[0]) {
		  keyMatch(onSquare[0], elmnt, false);
		}
	  }
	  // call a function whenever the cursor moves:
	  document.onmousemove = elementDrag;
	  if(e.shiftKey) {
		closeDragElement(e);
	  } else {
		document.onmouseup = closeDragElement;
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
	  elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
	  elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}
  
	function closeDragElement(event) {
	  // stop moving when mouse button is released:
			document.onmouseup = null;
			document.onmousemove = null;
			let centerLocation = Object.create(locationObject);
			let allowedError = gearBase / 2;
			centerLocation.width = allowedError;
			centerLocation.height = allowedError;
			centerLocation.x = event.target.offsetLeft + (event.target.clientWidth - centerLocation.width) / 2;
			centerLocation.y = event.target.offsetTop + (event.target.clientHeight - centerLocation.height) / 2;
			let inventoryItem = Array.from(elmnt.classList).find((value) => {
				return value.includes(`dragItem`);
			  });
			let overPeg = overlayCheck(centerLocation, `peg`)[0];
			if (overPeg) {
				if (!inventoryItem) {
					event.target.style.top = overPeg.offsetTop + overPeg.offsetParent.offsetTop + overPeg.offsetHeight / 2 - event.target.offsetHeight / 2 + "px";
					event.target.style.left = overPeg.offsetLeft + overPeg.offsetParent.offsetLeft + overPeg.offsetWidth / 2 - event.target.offsetWidth / 2 + "px";
					event.target.pegValue = overPeg.id;
					gearMemory[event.target.id] = event.target.pegValue;
					window.sessionStorage.setItem(`gearMemory`, JSON.stringify(gearMemory));
				}
			}
			if(solutionCheck(document.getElementById(`startGear`), false, {id:-1})) {
				// let correct = true;
				// Array.from(document.querySelectorAll(`.whitekey`)).forEach((key) => {
				// 	if(!key.audioValue || correctSolution[key.keyNumber] != key.audioValue) {
				// 		correct = false;
				// 	}
				// });
				//
				//arraysEqual(currentSolution, correctSolution)
				// let nonZeroSolution = currentSolution.filter((note) => {return note != 0;});
				if(arraysEqual(currentSolution, correctSolution)) {
					let timeoutDelay = 0;
				    correctSolution.forEach((note) => {
					   setTimeout(playSong, timeoutDelay, note);
					   timeoutDelay += 600;
					});
					openSecret();
				}
			}
			let clickLocation = Object.create(locationObject);
			clickLocation.x = event.clientX;
			clickLocation.y = event.clientY;
			let overInventory = overlayCheck(clickLocation, `inventory`)[0];
			if(overInventory && inventoryItem) {
				elmnt.remove();
				elmnt.originalItem.style.opacity = `100%`;
				elmnt.originalItem.onPage = false;
			}
	}
}

function playSong(note) {
	let noteAudio = audios[numberAudios.indexOf(note)];
	if(noteAudio) {
		noteAudio.pause();
		noteAudio.currentTime = 0;
		noteAudio.play();
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
