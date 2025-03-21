var currentCombination = [0,0,0,0];
var correctCombination = [7,0,5,2];

var timeStart;
window.onload = (event) => {
      //time recording code
      timeStart = Date.now();
      //end time recording code
//in case I want to make something run at launch
  document.onclick = movementCheck;
  typeof window.addEventListener === `undefined` && (window.addEventListener = (e, cb) => window.attachEvent(`on${e}`, cb));
  window.addEventListener(`contextmenu`, (e) => {
    e.preventDefault();
  });
  let inventory = window.sessionStorage.getItem(`inventory`);
  if(!inventory) {
    inventory = {
      gradCap: false,
      flatCap: false,
      fedora: false,
      visor: false,
      pegs: 0,
    };
    window.sessionStorage.setItem(`inventory`, JSON.stringify(inventory));
  } else {
    inventory = JSON.parse(inventory);
  }
  for (item in inventory) {
    enterInventoryEntry(item, inventory[item]);
  }
}

function checkPegs() {
  let wallData = window.sessionStorage.getItem(`wallInfo`);
  console.log(wallData);
  if(!wallData) {
    wallData = {
      paintingA: -1, 
      paintingB: -1, 
      paintingC: -1, 
      paintingD: -1, 
    }
    window.sessionStorage.setItem(`wallInfo`, JSON.stringify(wallData));
  } else {
    wallData = JSON.parse(wallData);
    currentCombination = [Number(wallData.paintingA), Number(wallData.paintingB), Number(wallData.paintingC), Number(wallData.paintingD)];
    for(painting in wallData) {
      if(wallData[painting] != -1) {
        let pegHolder = document.getElementById(`pegs`);
        let peg = pegHolder.children[0].cloneNode(true);
        peg.style.display = ``;
        peg.style.height = `100px`;
        peg.style.width = `100px`;
        let button = document.getElementById(`button${painting.slice(-1)}`)
        onPin(peg, button);
        let paintingPair = document.getElementById(painting);
        button.children[0].currentRotation = (Number(wallData[painting]) - 1) / 8;
        directSpotlight(button,paintingPair,{which: 3});
      }
    }
  }
}

var lowerInterval = false;

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

function removeItemFromInv(div) {
  let item = div.id.replace(/[0-9]/g, '');
  let inventory = JSON.parse(window.sessionStorage.getItem(`inventory`));
	if(item == `pegs`) {
		inventory[item] = Math.max(Number(inventory[item]) - 1, 0);
	} else {
		inventory[item] = false;
	}
  window.sessionStorage.setItem(`inventory`, JSON.stringify(inventory));
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
				addInv(`${item}`, pegs, (imgDiv) => {
					imgDiv.style.position = `relative`;
					imgDiv.id = `${imgNum}pegs`;
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
        checkPegs();
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
				let pegDiv = document.getElementById(`${i}pegs`);
				if(pegDiv) {
					pegDiv.style.display = ``;
				}
			} 
			for(i = 4; i > itemValue; i--) {
				let pegDiv = document.getElementById(`${i}pegs`);
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

function directSpotlight(button, painting, event) {
  if (event.which == 3) {
    if(!button.children[0]) {
      return;
    }
    let pegTurn = rotatePeg(button);
    let paintingBounds = painting.getBoundingClientRect();
    let spotlight = document.getElementById(`spotlight${painting.id.replace("painting","")}`);
    if(!spotlight) {
      spotlight = document.createElement(`div`);
      spotlight.id = `spotlight${painting.id.replace("painting","")}`;
      spotlight.classList.add(`circle`);
      spotlight.classList.add(`spotlight`);
      let gameArea = document.getElementById(`gameArea`);
      gameArea.appendChild(spotlight);
    }
    let spotLocations = [
      [
        paintingBounds.top + spotlight.clientHeight/1.75,
        paintingBounds.left + paintingBounds.width/2
      ],
      [
        paintingBounds.top + spotlight.clientHeight * 1.5,
        paintingBounds.right - spotlight.clientWidth / 1.5
      ],
      [
        paintingBounds.top + paintingBounds.height/2,
        paintingBounds.right - spotlight.clientWidth / 1.5
      ],
      [
        paintingBounds.bottom - spotlight.clientHeight * 1.5,
        paintingBounds.right - spotlight.clientWidth / 1.5
      ],
      [
        paintingBounds.bottom - spotlight.clientHeight/1.75,
        paintingBounds.left + paintingBounds.width/2
      ],
      [
        paintingBounds.bottom - spotlight.clientHeight * 1.5,
        paintingBounds.left + spotlight.clientWidth / 1.5
      ],
      [
        paintingBounds.top + paintingBounds.height/2,
        paintingBounds.left + spotlight.clientWidth / 1.5
      ],
      [
        paintingBounds.top + spotlight.clientHeight * 1.5,
        paintingBounds.left + spotlight.clientWidth / 1.5
      ]
    ];
    spotlight.style.top = spotLocations[pegTurn][0] - spotlight.clientHeight/2 + "px";
    spotlight.style.left = spotLocations[pegTurn][1] - spotlight.clientWidth/2 + "px";
    currentCombination[(painting.id.replace("painting","").charCodeAt(0)-65)] = pegTurn;
  }
}

function onPin(peg, circle) {
  if(circle.children[0]) {
    return;
  }
  circle.style.position = "relative";
  circle.appendChild(peg);
  peg.style.top = `-${peg.clientHeight - circle.clientHeight / 2 - 5}px`;
  peg.style.left = `-${peg.clientWidth / 2 - circle.clientWidth / 2 + 5}px`;
  peg.style.transformOrigin = "50% 95%";
  peg.style.transform = null;
  peg.onmousedown = false;
  let wallData = JSON.parse(window.sessionStorage.getItem(`wallInfo`));
  if(wallData[`painting${circle.id.slice(-1)}`] == -1) {
    removeItemFromInv(peg);
  }
  wallData[`painting${circle.id.slice(-1)}`] = 0;
  window.sessionStorage.setItem(`wallInfo`, JSON.stringify(wallData));
}

function rotatePeg(button) {
  let slices = 8;
  console.log(button.children[0].currentRotation);
  if(!button.children[0].currentRotation) {
    button.children[0].currentRotation = 0;
  } else if(button.children[0].currentRotation >= (1/slices)*(slices-1)) {
    button.children[0].currentRotation = -(1/slices);
  }
  button.children[0].currentRotation += (1/slices);
  button.children[0].style.transform = `rotate(${button.children[0].currentRotation}turn)`;
  let spotSlice =  button.children[0].currentRotation * slices;
  let wallData = JSON.parse(window.sessionStorage.getItem(`wallInfo`));
  wallData[`painting${button.id.slice(-1)}`] = spotSlice;
  window.sessionStorage.setItem(`wallInfo`, JSON.stringify(wallData));
  return spotSlice;
}

function lowerLight() {
  if(chandelier.offsetTop < -(window.innerHeight * 0.3)) {
    chandelier.style.top = Number(chandelier.offsetTop) + 10 + "px"
  } else {
    clearInterval(lowerInterval);
  }
}

function takeHat() {
  this.style.visibility = "hidden";
  searchParams.set("Hat Rack3", true);
  let link = document.getElementById("backButton");
  link.href = link.href.split(`?`)[0];
  link.href += `?${searchParams.toString()}`;
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

	function copyAndDrag(event) {
		if(this.onPage) {
			return;
		}
		let placedItem;
		if(this.id == `pegs`) {
			let nextPeg = Array.from(this.children).filter((peg) => { return !peg.onPage && !(peg.style.display == `none`)})[Array.from(this.children).filter((peg) => { return !peg.onPage && !(peg.style.display == `none`)}).length - 1];
			placedItem = nextPeg.cloneNode(true);
			placedItem.style.height = 100 + "px";
			placedItem.style.width = 100 + "px";
			nextPeg.style.opacity = `50%`;
			nextPeg.onPage = true;
			nextPeg.isPeg = true;
			placedItem.originalItem = nextPeg;
			if(Array.from(this.children).filter((peg) => { return !peg.onPage}).length == 0) {
				this.onPage = true;
			}
		} else {
			placedItem = this.cloneNode(true);
			placedItem.style.height = Math.min(500 * this.children[0].naturalHeight / this.children[0].naturalWidth, this.children[0].naturalHeight) + "px";
			placedItem.style.width = placedItem.style.height.replace("px","") * this.children[0].naturalWidth / this.children[0].naturalHeight + "px";
			if (this.children.length > 1) {
				placedItem.children[0].style.display = ``;
				placedItem.children[1].style.display = `none`;
				placedItem.style.height = Math.min(1000 * this.children[0].naturalHeight / this.children[0].naturalWidth, this.children[0].naturalHeight) + "px";
				placedItem.style.width = placedItem.style.height.replace("px","") * this.children[0].naturalWidth / this.children[0].naturalHeight + "px";
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

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    let overlap = overlayCheck(elmnt, "button");
    if (overlap[0] && elmnt.id.includes(`peg`)) {
      onPin(elmnt, overlap[0]);
    }
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

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function applyGravity(div, stopPoint) {
  if(div.speedY == undefined) {
      div.timesBounced = 0;
      div.speedY = 0;
      div.speedX = 0;
  }
  if(div.bounces == undefined) {
    div.bounces = 3;
  }
  let floor;
  if(!stopPoint) {
    floor = window.scrollY + window.innerHeight - div.clientHeight;
  } else {
    floor = stopPoint;
  }
  if(div.id.includes(`peg`)) {
    const rand = Math.random() < 0.5;
    if(div.speedX == 0) {
     if(rand) {
       div.speedX = 2;
     } else {
       div.speedX = -2;
     }
    }
    let rotation = div.style.transform.replace(/\D/g,'') || 1;
    rotation = Number(rotation) + 10;
    div.style.transform = `rotate(${rotation}deg)`;
    div.style.left = `${div.offsetLeft - div.speedX}px`;
  }
  if(div.offsetTop >= floor) {
    if(div.timesBounced < div.bounces) {
      div.speedY = -10/div.timesBounced;
      div.style.top = `${floor + div.speedY}px`;
      div.timesBounced++;
    } else {
      div.style.top = `${floor}px`;
      clearInterval(div.gravity);
      div.gravity = false;
      div.timesBounced = 0;
      div.speedY = 0;
      dragElement(div);
    }
  } else {
    div.style.top = `${div.offsetTop + div.speedY}px`;
    div.speedY += 1;
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