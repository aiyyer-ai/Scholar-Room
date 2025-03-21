var faxSounds = new Audio('./audio/faxSounds.wav');
var faxTriggered = false;
var timeStart;
window.onload = (event) => {
      //time recording code
      timeStart = Date.now();
      //end time recording code
      //in case I want to make something run at launch
      document.onclick = movementCheck;
      let inventory = window.sessionStorage.getItem(`inventory`);
      if (!inventory || Object.keys(JSON.parse(inventory)).includes(`pegs`)) {
            inventory = {
                  scholarDiary: false,
                  faxPaper: false,
                  faxSlip: false,
            };
            window.sessionStorage.setItem(`inventory`, JSON.stringify(inventory));
      } else {
            inventory = JSON.parse(inventory);
      }
      inventory.scholarDiary = false;
      window.sessionStorage.setItem(`inventory`, JSON.stringify(inventory));
      for (item in inventory) {
            enterInventoryEntry(item, inventory[item]);
      }

      if (!inventory[`faxData`]) {
            let faxData = document.getElementById(`faxDataFax`);
            faxData.style.left = (faxData.parentElement.clientWidth / 2) - (faxData.clientWidth / 2) + 'px';
            triggerFax(500, false);
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
      if(workshopData.pipes) {
            let pipesCheck = document.getElementById(`pipeCheck`);
            pipesCheck.style.display = `block`;
      }
      if(workshopData.voltage.filter((value) => { return value == true}).length == 3) {
            let voltageCheck = document.getElementById(`voltageCheck`);
            voltageCheck.style.display = `block`;
      }
      if(workshopData.temperature) {
            let temperatureCheck = document.getElementById(`temperatureCheck`);
            temperatureCheck.style.display = `block`;
      }

      if(workshopData.pipes && workshopData.voltage.filter((value) => { return value == true}).length == 3 && workshopData.temperature) {
            let centerThingButton = document.getElementById(`centerThingButton`);
            centerThingButton.style.backgroundColor = `lightgreen`;
            centerThingButton.style.boxShadow = `0px 0px 10px 10px rgba(202, 255, 202, 0.8)`;
      }
      

}

function createCSV(div) {
      let timingDictionary = JSON.parse(window.sessionStorage.getItem(`timeData`));
      let playerName = JSON.parse(window.sessionStorage.getItem(`playerName`));
      let csvContent = ``;
      let allRooms = {
            Foyer: [],
            Office: [],
            Lounge: [],
            Study: [],
            Workshop: []
      }
      if(!playerName) {
            playerName = `PlayerName`;
      }
      let allRows = [["", playerName]];
      let currentRow = [];

      for (let room of Object.entries(timingDictionary)) {
            currentRow.push(`AAmain room`);
            currentRow.push(room[1].time_spent);
            allRooms[room[0]].push(currentRow);
            currentRow = [];
            currentRow.push(`AAmain room paused`);
            if(room[1].time_spent_paused) {
                  currentRow.push(room[1].time_spent_paused);
            } else {
                  currentRow.push(0);
            }
            allRooms[room[0]].push(currentRow);
            currentRow = [];
            let innerAreas = {...room[1]};
            delete innerAreas.time_spent;
            delete innerAreas.time_spent_paused;
            if(Object.keys(innerAreas).length > 0) {
                  depthRead(innerAreas);
            }

            function depthRead(object) {
                  Object.keys(object).forEach((key) => {
                        currentRow.push(key);
                        currentRow.push(object[key].time_spent);
                        allRooms[room[0]].push(currentRow);
                        currentRow = [];
                        currentRow.push(`${key} paused`);
                        if(object[key].time_spent_paused) {
                              currentRow.push(object[key].time_spent_paused);
                        } else {
                              currentRow.push(0);
                        }
                        allRooms[room[0]].push(currentRow);
                        currentRow = [];

                        let innerAreas = {...object[key]};
                        delete innerAreas.time_spent;
                        delete innerAreas.time_spent_paused;
                        if(Object.keys(innerAreas).length > 0) {
                              depthRead(innerAreas);
                        }
                  });
            }
      }
      Object.entries(allRooms).forEach((entry) => {
            allRooms[entry[0]] = entry[1].sort((a, b) => {
                  return a[0].localeCompare(b[0]);
            });
      });

      for (let room of Object.entries(allRooms)) {
            allRows.push([room[0]]);
            let newRoomData = [];
            room[1].forEach((miniArray) => {
                  miniArray[0] = miniArray[0].replace(`AA`, ``);
                  newRoomData.push(miniArray);
            })
            allRows = allRows.concat(newRoomData);
      }
      allRows.forEach((row) => {
            csvContent += row.join(`,`) + '\n';
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' });
      const objUrl = URL.createObjectURL(blob);
      div.setAttribute(`href`, objUrl);
      div.setAttribute(`download`, `TimeBreakdown.csv`);
}

var canPressFae = true;

function attemptFae() {
      if(!canPressFae) {
            return;
      }
      canPressFae = false;
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
      if(workshopData.pipes && workshopData.voltage.filter((value) => { return value == true}).length == 3 && workshopData.temperature) {
            setTimeSpent();
            let timingDictionary = JSON.parse(window.sessionStorage.getItem(`timeData`));
            const flattenObject = (obj, delimiter = '.', prefix = '') =>
                  Object.keys(obj).reduce((acc, k) => {
                    const pre = prefix.length ? `${prefix}${delimiter}` : '';
                    if (
                      typeof obj[k] === 'object' &&
                      obj[k] !== null &&
                      Object.keys(obj[k]).length > 0
                    )
                      Object.assign(acc, flattenObject(obj[k], delimiter, pre + k));
                    else acc[pre + k] = obj[k];
                    return acc;
                  }, {});
            let flattenedObject = flattenObject(timingDictionary, `/`);
            let totalSeconds = 0;
            Object.keys(flattenedObject).forEach((key) => {
                  if(!key.includes(`pause`)) {
                        totalSeconds += flattenedObject[key];
                  }
            });
            let totalMinutes = Math.floor(totalSeconds / 60);
            let totalHours = Math.floor(totalMinutes / 60);
            let remainderSeconds = totalSeconds % 60;
            let remainderMinutes = totalMinutes % 60;
            let readableTime = ``;
            if(totalHours > 0) {
                  readableTime = `${totalHours}:${remainderMinutes}:${remainderSeconds}`;
            } else {
                  readableTime = `${remainderMinutes}:${remainderSeconds}`;
            }
            let centerThing = document.getElementById(`centerThing`);
            centerThing.classList.add(`shaky`);
            let pipeCheck = document.getElementById(`pipeCheck`);
            Array.from(pipeCheck.children).forEach((thingBottom) => {
                  thingBottom.classList.add(`slosh`);
            });
            let roomOverlay = document.getElementById(`roomOverlay`);
            roomOverlay.classList.add(`dimRoom`);
            setTimeout(() => {
                  let explosion = document.getElementById(`explosion`);
                  explosion.classList.add(`explode`);
                  let newDiv = document.createElement(`div`);
                  setTimeout(() => {
                        newDiv.classList.add(`textCenter`, `position`, `fadeIn`);
                        newDiv.innerHTML = `YOU DIED`;
                        document.body.appendChild(newDiv);
                        newDiv.style.left = (window.innerWidth - newDiv.clientWidth) / 2 + "px";
                        newDiv.style.top = (window.innerHeight - newDiv.clientHeight) / 2 + "px";
                        let breakDownDiv = document.createElement(`a`);
                        breakDownDiv.classList.add(`excelButton`, `position`);
                        breakDownDiv.innerHTML = `Get Time Breakdown For Gavin`;
                        document.body.appendChild(breakDownDiv);
                        breakDownDiv.style.left = (window.innerWidth - breakDownDiv.clientWidth) / 2 + "px";
                        breakDownDiv.style.top = (window.innerHeight - breakDownDiv.clientHeight) / 2 + breakDownDiv.clientHeight * 3 + "px";
                        createCSV(breakDownDiv);
                        setTimeout(() => {
                              newDiv.innerHTML = `or did you?`;
                              newDiv.style.left = (window.innerWidth - newDiv.clientWidth) / 2 + "px";
                              newDiv.style.top = (window.innerHeight - newDiv.clientHeight) / 2 + "px";
                              setTimeout(() => {
                                    newDiv.innerHTML = `Time: ${readableTime}`;
                                    newDiv.style.left = (window.innerWidth - newDiv.clientWidth) / 2 + "px";
                                    newDiv.style.top = (window.innerHeight - newDiv.clientHeight) / 2 + "px";
                                    setTimeout(() => {
                                          newDiv.classList.remove(`fadeIn`);
                                    }, 2000);
                              }, 3000);
                        }, 3000);
                  }, 5000);
            }, 5000);
            // setTimeout(() => {
            //       centerThing.classList.remove(`shaky`);
            //       Array.from(pipeCheck.children).forEach((thingBottom) => {
            //             thingBottom.classList.remove(`slosh`);
            //       });
            // }, 5000);
      }
}

function triggerFax(delay, sound=true) {
      faxTriggered = true;
      let inventory = JSON.parse(window.sessionStorage.getItem(`inventory`));
      if (!inventory[`faxData`]) {
            let faxData = document.getElementById(`faxDataFax`);
            if(sound) {
                  faxSounds.volume = 0.05;
                  faxSounds.play();
            }
            setTimeout(() => {
                  faxData.style.transform = "rotateX(-30deg)";
                  setTimeout(() => {
                        faxData.style.transition = 'none';
                  }, 2000);
            }, delay);
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
      if(!faxTriggered) {
            triggerFax(2000);
      }
      let clickLocation = Object.create(locationObject);
      clickLocation.x = event.clientX;
      clickLocation.y = event.clientY;
      if(Array.from(event.target.classList).includes(`leave`)) {
            setTimeSpent();
            window.location.href = `../Study/index.html`;
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
      pullDownInv(inventoryDiv);
      setTimeout(pullUpInv, 800, inventoryDiv);
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
                        // if(imgDiv.clientWidth > 200) {
                        addInv(`${item}Alt`, imgDiv, (altImgDiv) => {
                              if (altImgDiv) {
                                    imgDiv.appendChild(altImgDiv.children[0]);
                                    altImgDiv.remove();
                                    imgDiv.children[0].style.display = `none`;
                                    imgDiv.style.width = imgDiv.children[1].clientHeight * imgDiv.children[1].naturalWidth / imgDiv.children[1].naturalHeight + "px";
                              } else {
                                    imgDiv.style.width = imgDiv.children[0].clientHeight * imgDiv.children[0].naturalWidth / imgDiv.children[0].naturalHeight + "px";
                              }
                        });
                        // }
                        dragElement(imgDiv);
                        changeItemVisibility(item, itemValue);
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
      newImg.src = `./inventoryItems/${src}.webp`;
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
            if (placedItem.id.includes(`scholarDiary`)) {
                  placedItem.style.height = Math.min(1000 * this.children[0].naturalHeight / this.children[0].naturalWidth, this.children[0].naturalHeight) + "px";
                  placedItem.style.width = placedItem.style.height.replace("px", "") * this.children[0].naturalWidth / this.children[0].naturalHeight + "px";
            } else {
                  placedItem.style.height = Math.min(500 * this.children[0].naturalHeight / this.children[0].naturalWidth, this.children[0].naturalHeight) + "px";
                  placedItem.style.width = placedItem.style.height.replace("px", "") * this.children[0].naturalWidth / this.children[0].naturalHeight + "px";
            }
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
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
            let inventoryItem = Array.from(elmnt.classList).find((value) => {
                  return value.includes(`dragItem`);
            });
            if (!inventoryItem) {
                  //PLACE CODE HERE FOR SPECIAL MOVEMENT OF ITEMS IN ROOM
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
            if (!inventoryItem) {
                  //PLACE CODE HERE FOR SPECIAL MOVEMENT OF ITEMS IN ROOM
            }
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }

      function closeDragElement(event) {
            let parentClasslist = Array.from(event.target.parentElement.classList);
            if (parentClasslist.includes(`HRA`)) {
                  event.target.style.height = event.target.clientHeight / 1.15 + "px";
            }
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