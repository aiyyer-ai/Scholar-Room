var pegsGone = 0;
var pegCount = [3, 4];
var playArea = document.getElementById("playArea");
var hatHooks = { fedora: 0, flatCap: 10, gradCap: 15, visor: -50 };
var hatNames = {
      fedora: 375,
      flatCap: 315,
      gradCap: 475,
      visor: 275
};
let inventoryLength = 0;
var inventoryLoaded = 0;
var timeStart;
window.onload = (event) => {
      //time recording code
      timeStart = Date.now();
      //end time recording code
      document.onclick = movementCheck;
      let inventory = window.sessionStorage.getItem(`inventory`);
      if (!inventory) {
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
      inventoryLength = Object.keys(inventory).length;
      if (Object.keys(inventory).includes(`pegs`)) {
            inventoryLength += 3;
      }
      console.log(inventoryLength);
      for (item in inventory) {
            enterInventoryEntry(item, inventory[item]);
      }
      let wallData = window.sessionStorage.getItem(`wallInfo`);
      if (wallData) {
            wallData = JSON.parse(wallData);
      } else {
            wallData = {
                  paintingA: -1,
                  paintingB: -1,
                  paintingC: -1,
                  paintingD: -1,
            };
      }
      let wallPegCount = 4 - Object.values(wallData).filter((value) => { return value == -1 }).length;
      if (!inventory.pegs) {
            pegsGone = Number(wallPegCount);
      } else {
            pegsGone = Number(inventory.pegs) + Number(wallPegCount);
      }


      for (var row = 0; row < pegCount[0]; row++) {
            for (var column = 0; column < pegCount[1]; column++) {
                  var pegs = document.createElement("div");
                  pegs.id = `pegs,${row},${column}`;
                  pegs.classList.add(`pegs`);
                  if (pegs.id == "pegs,0,1" || pegs.id == "pegs,1,2" || pegs.id == "pegs,1,3" || pegs.id == "pegs,2,2") {
                        pegs.addEventListener("click", clickPeg);
                        pegs.classList.add(`pegsItem`);
                        if (pegsGone > 0) {
                              pegs.style.visibility = "hidden";
                              pegsGone--;
                        }
                  }
                  playArea.appendChild(pegs);
            }
      }

      Array.from(document.querySelectorAll(`.pegs`)).forEach((peg) => {
            peg.topDist = peg.offsetTop + "px";
            peg.leftDist = peg.offsetLeft + "px";
      });

      Array.from(document.querySelectorAll(`.pegs`)).forEach((peg) => {
            peg.style.position = `absolute`;
            peg.style.top = peg.topDist;
            peg.style.left = peg.leftDist;
      });

      var draggableElements = document.getElementsByClassName("hat");

      for (var i = 0; i < draggableElements.length; i++) {
            dragElement(draggableElements[i]);
      }

}

function afterInventory() {
      let inventory = JSON.parse(window.sessionStorage.getItem(`inventory`));
      let hatData = window.sessionStorage.getItem(`hatRackData`);
      if (!hatData) {
            hatData = {
                  gradCap: false,
                  flatCap: false,
                  fedora: false,
                  visor: "pegs,1,3",
            }
            window.sessionStorage.setItem(`hatRackData`, JSON.stringify(hatData));
      } else {
            hatData = JSON.parse(hatData);
      }
      for (hat of Object.keys(hatData)) {
            if (hatData[hat]) {
                  //THERE ARE NO HATS LOADED WHEN THE NEW INVENTORY EXISTS
                  let peg = document.getElementById(hatData[hat]);
                  let hatDiv = document.getElementById(hat).cloneNode(true);
                  document.getElementById(hat).style.display = `none`;
                  hatDiv.style.display = ``;
                  hatDiv.style.width = hatNames[hatDiv.id] + "px";
                  hatDiv.classList.remove(`inventoryItem`);
                  hatDiv.classList.add(`hat`);
                  hatDiv.classList.add(`position`);
                  inventory[hat] = false;
                  dragElement(hatDiv);
                  playArea.appendChild(hatDiv);
                  if (peg) {
                        hatDiv.style.left = peg.offsetLeft - hatDiv.clientWidth / 2 + peg.clientWidth / 2 + "px";
                        if (hatDiv.id == `visor`) {
                              peg.style.zIndex = 7;
                              hatDiv.hookedOn = peg;
                        }
                        let topDist = peg.offsetTop - hatHooks[hatDiv.id];
                        hatDiv.style.top = topDist + "px";
                  }
            }
      }
      window.sessionStorage.setItem(`inventory`, JSON.stringify(inventory));
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
      if (item == `pegs`) {
            inventory[item] = Math.min(Number(inventory[item]) + 1, 4);
      } else {
            inventory[item] = true;
      }
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
            if (item == "pegs") {
                  let pegs = document.createElement(`div`);
                  pegs.id = item;
                  pegs.style.width = inventoryDiv.clientHeight + "px";
                  pegs.style.height = inventoryDiv.clientHeight + "px";
                  pegs.classList.add(`inventoryItem`);
                  dragElement(pegs);
                  inventoryDiv.appendChild(pegs);
                  let appendFixer = 0;
                  for (i = 1; i <= 4; i++) {
                        let imgNum = i;
                        addInv(`${item}`, pegs, (imgDiv) => {
                              imgDiv.style.position = `relative`;
                              imgDiv.id = `${imgNum}peg`;
                              imgDiv.style.transform = `rotate(-120deg)`;
                              imgDiv.style.height = pegs.clientWidth * 0.70 + "px";
                              imgDiv.style.left = 100 - 40 * imgNum + "px";
                              imgDiv.style.top = -27 + 20 * imgNum + "px";
                              changeItemVisibility(item, itemValue);
                              appendFixer++;
                              inventoryLoaded++;
                              if (appendFixer == 4) {
                                    sortPegs(pegs);
                              }
                              console.log(inventoryLoaded);
                              if (inventoryLoaded >= inventoryLength) {
                                    afterInventory();
                              }
                        });
                  }

                  function sortPegs(pegHolder) {
                        let correctOrder = Array.from(pegHolder.children).sort(function (a, b) {
                              return Number(Array.from(a.id)[0]) - Number(Array.from(b.id)[0]);
                        });
                        for (peg of correctOrder) {
                              pegHolder.appendChild(peg);
                        }
                  }
            } else {
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
                        inventoryLoaded++;
                        console.log(inventoryLoaded);
                        if (inventoryLoaded >= inventoryLength) {
                              afterInventory();
                        }
                  });
            }
      } else {
            changeItemVisibility(item, itemValue);
      }
      function changeItemVisibility(item, itemValue) {
            inventoryElement = Array.from(inventoryDiv.children).filter((inventoryItem) => { return inventoryItem.id == item })[0];
            if (item == "pegs") {
                  for (i = 1; i <= 4; i++) {
                        let pegDiv = document.getElementById(`${i}peg`);
                        if (pegDiv) {
                              pegDiv.style.display = ``;
                        }
                  }
                  for (i = 4; i > itemValue; i--) {
                        let pegDiv = document.getElementById(`${i}peg`);
                        if (pegDiv) {
                              pegDiv.style.display = `none`;
                        }
                  }
            } else {
                  if (!itemValue) {
                        inventoryElement.style.display = `none`;
                  } else {
                        inventoryElement.style.display = ``;
                  }
            }
      }
}

function goToRoom(div) {
      let room = Array.from(div.classList).filter((classes) => { return classes.includes(`door`) })[0].replace(`door`, ``);
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

function clickPeg(e) {
      e.target.gravity = setInterval(applyGravity, 10, e.target);
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
            if (this.id == `pegs`) {
                  let nextPeg = Array.from(this.children).filter((peg) => { return !peg.onPage })[0];
                  placedItem = nextPeg.cloneNode(true);
                  placedItem.style.height = 100 + "px";
                  placedItem.style.width = 100 + "px";
                  nextPeg.style.opacity = `50%`;
                  nextPeg.onPage = true;
                  nextPeg.isPeg = true;
                  placedItem.originalItem = nextPeg;
                  if (Array.from(this.children).filter((peg) => { return !peg.onPage }).length == 0) {
                        this.onPage = true;
                  }
            } else if (Object.keys(hatNames).includes(this.id)) {
                  placedItem = this.cloneNode(true);
                  // placedItem.style.height = 500 + "px";
                  placedItem.style.width = hatNames[this.id] + "px";
                  placedItem.classList.add(`hat`);
                  this.style.opacity = `50%`;
                  this.onPage = true;
                  placedItem.originalItem = this;
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
            pos3 = e.clientX;
            pos4 = e.clientY;

            if (elmnt.id == `visor` && elmnt.hookedOn) {
                  elmnt.hookedOn.style.zIndex = 2;
            }

            Array.from(document.querySelectorAll(`.hat`)).forEach((div) => {
                  if (div.style.zIndex > elmnt.style.zIndex && div.id != elmnt.id) {
                        div.style.zIndex = div.style.zIndex - 1;
                  }
            });

            elmnt.style.zIndex = 6;
            if (elmnt.gravity) {
                  clearInterval(elmnt.gravity);
                  elmnt.gravity = false;
                  elmnt.timesBounced = 0;
                  elmnt.speedY = 0;
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

      function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
            let pegsUnder = overlayCheck(elmnt, "pegs");
            let allowedError = 100;
            let hookablepegs = pegsUnder.filter((peg) => {
                  return (Math.abs((elmnt.offsetLeft + elmnt.clientWidth / 2) - peg.offsetLeft) < allowedError);
            });
            hookablepegs.sort(function (a, b) {
                  return a.offsetTop - b.offsetTop;
            });
            let hatOrPeg = Array.from(elmnt.classList).find((value) => {
                  return (value.includes(`hat`) || value.includes(`peg`));
            });
            if (hatOrPeg) {
                  hook(hookablepegs, elmnt);
            }
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
      }
}

function hook(pegArray, hat) {
      let peg = pegArray[0];
      if (peg && peg.style.visibility != "hidden") {
            if (peg.id == "pegs,0,1" || peg.id == "pegs,1,2" || peg.id == "pegs,1,3" || peg.id == "pegs,2,2") {
                  pegArray.shift();
                  clickPeg({ target: peg });
                  return hook(pegArray, hat);
            } else {
                  hat.style.left = peg.offsetLeft - hat.clientWidth / 2 + peg.clientWidth / 2 + "px";
                  let hatData = JSON.parse(window.sessionStorage.getItem(`hatRackData`));
                  let inventory = JSON.parse(window.sessionStorage.getItem(`inventory`));
                  hatData[hat.id] = peg.id;
                  inventory[hat.id] = false;
                  window.sessionStorage.setItem(`hatRackData`, JSON.stringify(hatData));
                  window.sessionStorage.setItem(`inventory`, JSON.stringify(inventory));
                  if (hat.id == `visor`) {
                        peg.style.zIndex = 7;
                        hat.hookedOn = peg;
                  }
                  let topDist = peg.offsetTop - hatHooks[hat.id];
                  if (Math.abs(hat.style.top - topDist) < 100) {
                        hat.style.top = topDist + "px";
                  } else {
                        hat.bounces = 0;
                        hat.gravity = setInterval(applyGravity, 10, hat, topDist);
                  }
            }
      } else {
            hat.gravity = setInterval(applyGravity, 10, hat);
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

function closest(val, arr) {
      return arr.reduce((a, b) => {
            return Math.abs(b - val) < Math.abs(a - val) ? b : a;
      });
}

function applyGravity(div, stopPoint) {
      if (div.speedY == undefined) {
            div.timesBounced = 0;
            div.speedY = 0;
            div.speedX = 0;
      }
      if (div.bounces == undefined) {
            div.bounces = 3;
      }
      let floor;
      if (!stopPoint) {
            floor = window.scrollY + window.innerHeight - div.clientHeight;
      } else {
            floor = stopPoint;
      }
      if (div.id.includes(`pegs`)) {
            const rand = Math.random() < 0.5;
            if (div.speedX == 0) {
                  if (rand) {
                        div.speedX = 10;
                  } else {
                        div.speedX = -10;
                  }
            }
            let rotation = div.style.transform.replace(/\D/g, '') || 1;
            rotation = Number(rotation) + 10;
            div.style.transform = `rotate(${rotation}deg)`;
            div.style.left = `${div.offsetLeft - div.speedX}px`;
      }
      if (div.offsetTop >= floor) {
            if (div.timesBounced < div.bounces) {
                  div.speedY = -10 / div.timesBounced;
                  div.style.top = `${floor + div.speedY}px`;
                  div.timesBounced++;
            } else {
                  div.style.top = `${floor}px`;
                  clearInterval(div.gravity);
                  div.gravity = false;
                  div.timesBounced = 0;
                  div.speedY = 0;
                  if (div.id.includes(`pegs`)) {
                        takeItem(div)
                  }
            }
      } else {
            div.style.top = `${div.offsetTop + div.speedY}px`;
            div.speedY += 1;
      }
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