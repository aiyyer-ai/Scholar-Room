let slipData = [0, 18, 39, 36, 36, 22, 21];
let currentInput = [0, ];
let randomSeed = Math.random();

var timeStart;
window.onload = (event) => {
      //time recording code
      timeStart = Date.now();
      //end time recording code
//in case I want to make something run at launch
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
	generateBoxes();
	let buttonHolder = document.getElementById(`dispenser`);
	let machineGrid = document.getElementById(`machine`);
	buttonHolder.style.left = machineGrid.getBoundingClientRect().left + "px";
	generateSlip(slipData);
	//dispenseSlip();
}

function generateBoxes() {
	let cabinet = document.getElementById(`cabinet`);
	let masterList = [1, 4, 6, 14, 15, 18, 20, 21, 22, 25, 27, 35, 36, 39, 41];
	let neededNumbers = [18, 39, 36, 35, 1, 22, 21];
	masterList = masterList.filter( function( number ) {
		//return number != 36;
		return neededNumbers.indexOf( number ) < 0;
	});
	let neededCombos = [[14, 4], [35, 4], [35, 1], [21, 1]];
	masterList = masterList.filter( function( number ) {
		return number != 4;
	});
	let totalBoxes = 12;
	shuffle(masterList);
	let foodList = neededNumbers.concat(masterList.slice(0, totalBoxes - neededNumbers.length));
	shuffle(foodList);
	for (let i = 0; i < foodList.length; i++) {
		let boxSpot = document.createElement(`div`);
		boxSpot.classList.add(`boxSpot`);
		cabinet.appendChild(boxSpot);
		boxSpot.id = `box${foodList[i]}spot`;
		let newBox = document.createElement(`div`);
		newBox.classList.add(`box`);
		boxSpot.appendChild(newBox);
		newBox.id = `box${foodList[i]}`;
		let dosageText = document.createElement(`div`);
		dosageText.classList.add(`dosage`);
		dosageText.innerHTML = `${foodList[i]}mg`;
		newBox.appendChild(dosageText);
		newBox.values = [foodList[i] % 7, foodList[i] - (foodList[i] % 7)];
		if(newBox.values.includes(0)) {
			newBox.style.backgroundImage = `url("./images/halfBottle.webp")`;
			newBox.style.height = newBox.clientHeight / 2 + "px";
			newBox.bottleSize = 1;
		} else {
			newBox.bottleSize = 2;
		}
		// newBox.values.forEach((number) => {
		// 	if (number) {
		// 		addImg(number, newBox, (imgDiv) => {
		// 			imgDiv.id = `${newBox.id}number`;
		// 			imgDiv.classList.add(`number`, `position`);
		// 		});
		// 	}
		// });
		dragElement(newBox);
	}
	let columnCounter = foodList.length / 2;
	let column = "auto ";
	cabinet.style.gridTemplateColumns = `${column.repeat(Math.ceil(columnCounter))}`;
}

function dispenseSlip() {
	let inventory = JSON.parse(window.sessionStorage.getItem(`inventory`));
	if(!inventory.faxSlip) {
		let slip = document.getElementById(`slip`);
		slip.style.visibility = `visible`;
		slip.style.transform = `translateX(0px)`;
		slip.classList.add(`faxSlipItem`);
		setTimeout(() => {
			slip.style.transition = `none`;
		  }, "2000");
	}	  
}

function generateSlip(slipData) {
	let slip = document.getElementById(`slip`);
	let templateFill = `auto `;
	let slipCalendar = document.getElementById(`slipCalendar`);
	slipCalendar.innerHTML = ``;
	slipCalendar.style.gridTemplateColumns = templateFill.repeat(slipData.length + 1);
	for(number of slipData) {
		let slipSpace = document.createElement(`div`);
		slipSpace.classList.add(`slipSpot`);
		slipSpace.id = `slipSpace${number}`;
		slipCalendar.appendChild(slipSpace);
		let numberMakeUp = [Math.floor(number / 7) * 7, number % 7];
		for(let numberPart of numberMakeUp) {
			if(numberPart != 0) {
				addImg(numberPart, slipSpace, (numberDiv) => {
					numberDiv.classList.add(`numberSlip`, `position`);
					numberDiv.children[0].style.filter = `invert(100%)`;
				});
			}
		}
	}
	let buttonHolder = document.getElementById(`dispenser`);
	let buttonBounds = buttonHolder.getBoundingClientRect();
	slip.style.top = (buttonBounds.height / 2) - slip.offsetHeight / 2 + "px";
	slip.style.visibility = `hidden`;
	slip.style.transition = `all 2s linear`;
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
		placedItem.style.height = Math.min(1000 * this.children[0].naturalHeight / this.children[0].naturalWidth, this.children[0].naturalHeight) + "px";
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
		console.log(placedItem);
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
      let inventoryItem = Array.from(elmnt.classList).find((value) => {
        return value.includes(`dragItem`);
      });
      if(!inventoryItem) {
        //PLACE CODE HERE FOR SPECIAL MOVEMENT OF ITEMS IN ROOM
		if (Array.from(elmnt.classList).includes(`box`)) {
			let gameArea = document.getElementById(`gameArea`);
			elmnt.classList.add(`position`);
			let clickLocation = Object.create(locationObject);
			clickLocation.x = e.clientX;
			clickLocation.y = e.clientY;
			let overMachineSpot = overlayCheck(clickLocation, `slot`)[0];
			if (overMachineSpot && overMachineSpot.fill && overMachineSpot.fill.filter((div) => { return div.id == elmnt.id})[0]) {
				overMachineSpot.fill = overMachineSpot.fill.filter((div) => {
					return div.id != elmnt.id;
				});
				let machineSlotBounds = overMachineSpot.getBoundingClientRect();
				overMachineSpot.fill.forEach((fillDiv) => {
					fillDiv.style.top = machineSlotBounds.top + 'px';
				})
				currentInput[overMachineSpot.id.replace(`slot`,``)] -= Number(elmnt.id.replace(`box`, ``));
			}
			gameArea.appendChild(elmnt);
			elmnt.style.left = e.clientX - elmnt.clientWidth / 2 + "px";
			elmnt.style.top = e.clientY - elmnt.clientHeight / 2 + "px";
		}
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
      if(!inventoryItem) {
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
		if(!inventoryItem) {
			//PLACE CODE HERE FOR SPECIAL MOVEMENT OF ITEMS IN ROOM
			let overSpot = overlayCheck(clickLocation, `boxSpot`)[0];
			let overBox = overlayCheck(clickLocation, `box`).filter((div) => {
				return div != elmnt;
			});
			if (overSpot && !overBox[0]) {
				elmnt.classList.remove(`position`);
				overSpot.appendChild(elmnt);
			}
			let overMachineSpot = overlayCheck(clickLocation, `slot`)[0];
			if (overMachineSpot) {
				if (!overMachineSpot.fill) {
					overMachineSpot.fill = [];
				}
				let fillSize = overMachineSpot.fill.reduce((accumulator, currentValue) => { return accumulator + currentValue.bottleSize }, 0);
				if ((fillSize + elmnt.bottleSize) <= 2) {
					let machineSlotBounds = overMachineSpot.getBoundingClientRect();
					overMachineSpot.fill.push(elmnt);
					if(!currentInput[overMachineSpot.id.replace(`slot`,``)]) {
						currentInput[overMachineSpot.id.replace(`slot`,``)] = 0;
					}
					currentInput[overMachineSpot.id.replace(`slot`,``)] += Number(elmnt.id.replace(`box`, ``));
					elmnt.style.left = machineSlotBounds.left + 'px';
					elmnt.style.top = machineSlotBounds.top + (fillSize * elmnt.clientHeight) + 'px';
					if(arraysEqual(currentInput, slipData)) {
						dispenseSlip();
					}
				}
			}
		}
		if(overInventory && inventoryItem) {
			elmnt.remove();
			elmnt.originalItem.style.opacity = `100%`;
			elmnt.originalItem.onPage = false;
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
	console.log(div);
	let item = Array.from(div.classList).filter((classes) => { return classes.includes(`Item`)})[0].replace(`Item`, ``);
	div.style.visibility = `hidden`;
	let inventory = JSON.parse(window.sessionStorage.getItem(`inventory`));
	inventory[item] = true;
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

function shuffle(array) {
	let currentIndex = array.length,  randomIndex;
  
	// While there remain elements to shuffle.
	while (currentIndex > 0) {
  
	  // Pick a remaining element.
		randomIndex = Math.floor(randomSeed * currentIndex);
		currentIndex--;
  
	  // And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
  
	return array;
}