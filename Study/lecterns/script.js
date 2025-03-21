var lecternList = {
      k: {
            1: `The train billowed past along the horizon. It struck me how, from this distance, it may as well be a trail of ants on a branch, closely examined, carrying goods to some colony that knows not of you or your troubles.`,
            2: `Behind you!" Sir Galahad lept at my unseen attacker before anyone else. I spun as quickly as I could, but it was too late. He was pierced through, the blackguard now eyeing me with fear.`,
            3: `Me first," insisted Lady Violet. I noticed her sister grind her teeth, and clench her jaw.`,
            4: `"Click the link to this page next," said Tony the Radical Teen. "It's just video piracy, it's not gonna hurt you!"`,
            5: `On top of that, I considered it a personal affront. Be it his head hung low in apology, or split open to the red air with my blade; I would right this wrong someway.`,
            6: `Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the prop that all men are created equal.`
      },
      q: {
            1: `"Globe, orb, whatever you want to call it, man! Just grab it and lets get out of here! This place gives me the heeby-jeebies."`,
            2: `dice, just one big gamble, and I knew I could change my whole life. If only the odds were in my favor...`,
            3: `Pages upon pages have already been written on this subject, but I will do my best to enumerate and build upon them here. Archeology is not, dear reader, a field fit for those with greedy hearts.`,
            4: `lectern. "First, thank you for inviting me to speak. I'm not sure what I can add that Doctor Hapsburg didn't already eloquently explain."`,
            5: `Link together those things which seem separate in every facet, and you can bet that peers will count you either among the ranks of the world's greatest detectives, or the world's greatest fools. What determines which outcome will befall you? Presentation.`,
            6: `"Button up your shirt, Mark." I could tell there was panic in his voice, despite just being awoken. "I hear them coming up the stairs."`
      },
      r: {
            1: `"Wall -paper sure does taste great, doesn't it samantha?" "Sure does, Greg." We continued to eat wallpaper.`,
            2: `book to the library." The young librarian shot me a reproachful glare. "This is 57 years overdue, sir."`,
            3: `"Stand up for yourself, damnit!" He kept shouting, but the boy remained motionless in the center of the larger boys, too frightened to cry for help, let alone fight.`,
            4: `"Page Doctor Shaw, she needs to see this. Who would have thought this patient was also suffering from Ligma"`,
            5: `"Please don't be too harsh, sire. They are sensitive souls who can take only so many setbacks."`,
            6: `Box it up, slap a sticker on it, and send it my way. Whatever's inside, I'm happy to receive it. That's the magic of the postal service!`
      },
      b: {
            1: `drag on his cigarette. The detective pierced me with a steely gaze, devoid of humanity after decades on the harsh streets of the city.`,
            2: `use for the boy yet. 'Run up to the governor's club and ask the doorman if he's seen John Ripley there today. I'll be around the block at`,
            3: `right as I stepped into the harsh morning light, before my eyes could even adjust, I heard the sharp and mistakable 'click' of a firearm aimed at ones head.`,
            4: `Say, Sally," I sheepishly began to wonder aloud. "If I come back from the fighting, and no lucky guy has swept you up yet... well...`,
            5: `FIND ME THAT BOY!" He roared into the quickly paling faces around the room. Instantly everyone was on their feet and off to work on the task, if only to escape the choking atmosphere.`,
            6: `Click your toungue and wag your finger at me all you want. I'm marrying him no matter the case, mother! I love him.`
      }
}
var lecternTitles = {
      k: {
            1: `Push the Limits`,
            2: `Look out!`,
            3: `Place setting etiquette`,
            4: `Click of a Gun`,
            5: `Open Up: a Guide to Your Feelings`,
            6: `Pull your weight`
      },
      q: {
            1: `Left Alone`,
            2: `Down and Out`,
            3: `Right Away`,
            4: `The Founding Fathers`,
            5: `Up and At 'Em`,
            6: `At the Ballgame`
      },
      r: {
            1: `On my toes`,
            2: `Our New Home`,
            3: `Cat Attack!`,
            4: `Table that Idea`,
            5: `Lamp Magazine`,
            6: `Medicine Habits`
      },
      b: {
            1: `Over the Rainbow`,
            2: `Painting for Beginners`,
            3: `Podium: Third Place`,
            4: `Door to Another World`,
            5: `Head over Heels`,
            6: `Machine Building`
      }
}
var rotationDictionary = { one: 0, two: -60, three: -120, four: -180, five: -240, six: -300, seven: -360, zero: 60 };
var rand;
var backWithDiary = false;

var timeStart;
window.onload = (event) => {
      //time recording code
      timeStart = Date.now();
      //end time recording code
      typeof window.addEventListener === `undefined` && (window.addEventListener = (e, cb) => window.attachEvent(`on${e}`, cb));
      window.addEventListener(`contextmenu`, (e) => {
            e.preventDefault();
      });
      //in case I want to make something run at launch
      document.onclick = movementCheck;
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
      if(inventory.scholarDiary) {
            backWithDiary = true;
      }
      setSeed(`LECTERNS`);
}

function generateLecterns() {
      let gameArea = document.getElementById(`gameArea`);
      // let lecternDistance = window.innerWidth / 2;
      let lecternDistance = 0;
      for (lectern in lecternList) {
            let newPerspective = document.createElement(`div`);
            newPerspective.classList.add(`perspective`);
            newPerspective.id = `${lectern}perspective`;
            gameArea.appendChild(newPerspective);
            newPerspective.style.left = -12 + lecternDistance + "px";
            let newLectern = document.createElement(`div`);
            newLectern.classList.add(`lectern`);
            newLectern.id = `${lectern}`;
            newPerspective.appendChild(newLectern);
            newPerspective.style.zIndex = Object.keys(lecternList).indexOf(lectern);
            let lecternData = lectern;
            for (bookNum in lecternList[lectern]) {
                  let newFace = document.createElement(`div`);
                  newFace.classList.add(`face`, `${Object.keys(rotationDictionary)[bookNum - 1]}`);
                  newFace.id = `${lectern}${bookNum}`;
                  newLectern.appendChild(newFace);
                  let bookNumber = bookNum;
                  if(backWithDiary) {
                        let bookColorRand = rand();
                        addImg(`closedBook`, newFace, (closedBookDiv) => {
                              closedBookDiv.classList.add(`position`, `closedBook`, `lecternContainer`);
                              let closedBookText = document.createElement(`div`);
                              closedBookText.classList.add(`position`, `closedTitle`);
                              closedBookText.innerHTML = `${lecternTitles[lecternData][bookNumber]}`;
                              closedBookDiv.appendChild(closedBookText);
                              closedBookText.style.maxWidth = closedBookDiv.clientWidth * 0.7 + "px";
                              closedBookDiv.style.filter = `hue-rotate(${bookColorRand * 360}deg)`;
                        });
                  }
                  addImg(`book`, newFace, (book) => {
                        book.classList.add(`book`, `lecternContainer`);
                        let bookText = document.createElement(`div`);
                        bookText.classList.add(`position`, `page`);
                        book.children[0].classList.add(`position`, `openImage`);
                        let wordArray = lecternList[lecternData][bookNumber].split(" ");
                        let firstWord = wordArray.shift();
                        let otherWords = wordArray.join(" ");
                        bookText.innerHTML = `<span class="bigText">${firstWord}</span> ${otherWords}`;
                        book.appendChild(bookText);
                        book.style.width = book.children[0].clientWidth + "px";
                        book.style.left = (newFace.clientWidth - book.clientWidth) / 4 + 'px';
                        let textAdjustment = window.getComputedStyle(bookText).getPropertyValue('margin-left').replace("px", "");
                        bookText.style.width = book.children[0].clientWidth - (textAdjustment * 2) + "px";
                        if (backWithDiary) {
                              book.onmousedown = closeBook;
                        }
                  });
                  addImg(`${bookNum}`, newFace, (number) => {
                        number.classList.add(`number`, `lecternContainer`);
                  });

            }
            lecternDistance += newLectern.clientWidth * .8;
            newLectern.addEventListener("click", setRotation);
            newLectern.lecternRotation = 0;
            let faceWidth = Array.from(newLectern.children).filter((child) => { return Array.from(child.classList).includes(`face`) })[0].clientWidth;
            for (let baseParts = 0; baseParts <= 2; baseParts++) {
                  let newBasePart = document.createElement(`div`);
                  newLectern.appendChild(newBasePart);
                  dragRotateElement(newBasePart);
                  newLectern.baseRotation = -30;
                  newBasePart.style.left = newLectern.clientWidth / 2 + "px";
                  if (baseParts < 2) {
                        newBasePart.classList.add(`leg`);
                        if (baseParts == 0) {
                              newBasePart.classList.add(`rightLeg`);
                        } else if (baseParts == 1) {
                              newBasePart.classList.add(`leftLeg`);
                        }
                  } else {
                        newBasePart.classList.add(`bottom`);
                        newBasePart.style.top = newLectern.clientHeight / 2 - newBasePart.clientHeight / 2 + "px";
                  }
            }
            let rightWall = document.createElement(`div`);
            newLectern.appendChild(rightWall);
            rightWall.classList.add(`wall`, `rightWall`);
            rightWall.style.left = newLectern.clientWidth / 2 - rightWall.clientWidth / 2 + "px";
            rightWall.style.top = newLectern.clientHeight / 2 - rightWall.clientHeight / 2 + "px";
            rightWall.style.backgroundImage = `url('./images/wallplank${lectern.toUpperCase()}.webp')`;
            rightWall.currentRotation = 0;
            let leftWall = document.createElement(`div`);
            newLectern.appendChild(leftWall);
            leftWall.classList.add(`wall`, `leftWall`);
            leftWall.style.left = newLectern.clientWidth / 2 - leftWall.clientWidth / 2 + "px";
            leftWall.style.top = newLectern.clientHeight / 2 - leftWall.clientHeight / 2 + "px";
            leftWall.style.backgroundImage = `url('./images/wallplank${lectern.toUpperCase()}.webp')`;
            leftWall.currentRotation = 0;
            let matchingPlaque = document.getElementById(`plaque${lectern.toUpperCase()}`)
            let leftlecternBounds = leftWall.getBoundingClientRect();
            let rightlecternBounds = rightWall.getBoundingClientRect();
            matchingPlaque.style.left = (leftlecternBounds.left + ((rightlecternBounds.right - leftlecternBounds.left) / 2)) - (matchingPlaque.clientWidth / 2) + 'px';

            //set to predetermined stuff
            let lecternRotations = window.sessionStorage.getItem(`studyLecternRotations`);
            if (!lecternRotations) {
                  lecternRotations = {
                        K: `one`,
                        Q: `one`,
                        R: `one`,
                        B: `one`,
                  };
                  window.sessionStorage.setItem(`studyLecternRotations`, JSON.stringify(lecternRotations));
            } else {
                  lecternRotations = JSON.parse(lecternRotations);
            }
            setRotation(null, newLectern, lecternRotations[lectern.toUpperCase()]);
      }
}

function setSeed(seedString) {
	var seedHash = cyrb128(seedString);
	rand = sfc32(seedHash[0], seedHash[1], seedHash[2], seedHash[3]);
      generateLecterns();
}

function closeBook(event) {
      var rightclick;
      if (event.which) {
            rightclick = (event.which == 3);
      }
      else if (event.button) {
            rightclick = (event.button == 2);
      }
      if (!rightclick) {
            return;
      }
      let clickedBookImage = Array.from(event.target.children).filter((child) => {
            return child.nodeName == "IMG" && Array.from(child.classList).includes(`openImage`);
      })[0];
      let clickedBookText = Array.from(event.target.children).filter((child) => {
            return child.nodeName == "DIV";
      })[0];
      if(clickedBookImage.style.visibility == `hidden`) {
            clickedBookImage.style.visibility = `visible`;
            clickedBookText.style.visibility = `visible`;
      } else {
            clickedBookImage.style.visibility = `hidden`;
            clickedBookText.style.visibility = `hidden`;
      }
      
}

function setRotation(event, lectern = false, wantedFace = false) {
      let clickedFace;
      let targetLectern;
      if (!lectern) {
            targetLectern = this;
      } else {
            targetLectern = lectern;
      }
      if (!wantedFace) {
            let target = event.target;
            if(Array.from(target.classList).includes(`book`)) {
                  target = target.parentElement;
            }
            clickedFace = Array.from(target.classList).filter((className) => {
                  return Object.keys(rotationDictionary).includes(className);
            })[0];
            if (!clickedFace) {
                  return;
            }
            let lecternRotations = JSON.parse(window.sessionStorage.getItem(`studyLecternRotations`));
            lecternRotations[targetLectern.id.toUpperCase()] = clickedFace;
            window.sessionStorage.setItem(`studyLecternRotations`, JSON.stringify(lecternRotations));
      } else {
            clickedFace = wantedFace;
      }

      if (!clickedFace) {
            return;
      }
      let transformDictionaryFaces = {
            one: `translateZ(var(--lecternDistance)) rotateX(var(--lecternTilt)) scale(calc(1 / var(--antiBlurScaling)))`,
            two: `rotateX(60deg) translateZ(var(--lecternDistance)) rotateX(-60deg) rotateX(var(--lecternTilt)) scale(calc(1 / var(--antiBlurScaling)))`,
            three: `rotateX(120deg) translateZ(var(--lecternDistance)) rotateX(-120deg) rotateX(var(--lecternTilt)) scale(calc(1 / var(--antiBlurScaling)))`,
            four: `rotateX(180deg) translateZ(var(--lecternDistance)) rotateX(-180deg) rotateX(var(--lecternTilt)) scale(calc(1 / var(--antiBlurScaling)))`,
            five: `rotateX(240deg) translateZ(var(--lecternDistance)) rotateX(-240deg) rotateX(var(--lecternTilt)) scale(calc(1 / var(--antiBlurScaling)))`,
            six: `rotateX(300deg) translateZ(var(--lecternDistance)) rotateX(-300deg) rotateX(var(--lecternTilt)) scale(calc(1 / var(--antiBlurScaling)))`,
      };
      let transformDictionarySlats = {
            one: `translateY(calc(var(--lecternHeight) / 2)) rotateX(90deg) scale(calc(1 / var(--antiBlurScaling)))`,
            two: `translateY(calc(var(--lecternHeight) / 2)) rotateX(90deg) rotateX(60deg) scale(calc(1 / var(--antiBlurScaling)))`,
            three: `translateY(calc(var(--lecternHeight) / 2)) rotateX(90deg) rotateX(120deg) scale(calc(1 / var(--antiBlurScaling)))`,
            four: `translateY(calc(var(--lecternHeight) / 2)) rotateX(90deg) rotateX(180deg) scale(calc(1 / var(--antiBlurScaling)))`,
            five: `translateY(calc(var(--lecternHeight) / 2)) rotateX(90deg) rotateX(240deg) scale(calc(1 / var(--antiBlurScaling)))`,
            six: `translateY(calc(var(--lecternHeight) / 2)) rotateX(90deg) rotateX(300deg) scale(calc(1 / var(--antiBlurScaling)))`,
      };
      let transformDictionaryWalls = {
            rightWall: `rotateY(90deg) translateZ(var(--lecternDistance))`,
            leftWall: `rotateY(90deg) translateZ(calc(var(--lecternDistance) * -1))`,
            six: `seven`,
            one: `zero`
      };
      let desiredOrder = reorder(Object.keys(transformDictionaryFaces), clickedFace);
      let basicTransformationsFaces = Object.values(transformDictionaryFaces);
      let basicTransformationsSlats = Object.values(transformDictionarySlats);
      for (lecternPart of Array.from(targetLectern.children)) {
            let partID = Array.from(lecternPart.classList).filter((className) => {
                  return Object.keys(rotationDictionary).includes(className.replace(`slat`, ``));
            })[0];
            if (partID) {
                  if (partID.includes(`slat`)) {
                        lecternPart.style.transform = basicTransformationsSlats[desiredOrder.indexOf(partID.replace(`slat`, ``))];
                  } else {
                        lecternPart.style.transform = basicTransformationsFaces[desiredOrder.indexOf(partID)];
                  }
            } else {
                  let wallID = Array.from(lecternPart.classList).filter((className) => {
                        return className.includes(`Wall`);
                  })[0];
                  if (wallID) {
                        if ((lecternPart.currentRotation == 0 && rotationDictionary[clickedFace] == -300) || (lecternPart.currentRotation == -300 && rotationDictionary[clickedFace] == 0)) {
                              lecternPart.classList.add("notransition");
                              lecternPart.style.transform = transformDictionaryWalls[wallID] + ` rotate(${rotationDictionary[transformDictionaryWalls[clickedFace]]}deg)`;
                              lecternPart.offsetHeight;
                              lecternPart.classList.remove("notransition");
                        }
                        lecternPart.style.transform = transformDictionaryWalls[wallID] + ` rotate(${rotationDictionary[clickedFace]}deg)`;
                        lecternPart.currentRotation = rotationDictionary[clickedFace];
                  }
            }
      }
}

function reorder(data, entry) {
      let index = data.indexOf(entry);
      return data.slice(index).concat(data.slice(0, index))
};

function dragRotateElement(elmnt) {
      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      if (document.getElementById(elmnt.id + "header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "header").onmousedown = dragRotateDown;
      } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragRotateDown;
      }

      function dragRotateDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragRotateElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementRotateDrag;
      }

      function elementRotateDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.parentElement.baseRotation -= pos1 / 3;
            elmnt.parentElement.style.transform = `rotateY(${elmnt.parentElement.baseRotation}deg)`;
      }

      function closeDragRotateElement(event) {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
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
            if (!inventoryItem) {
                  //PLACE CODE HERE FOR SPECIAL MOVEMENT OF ITEMS IN ROOM
                  if (Array.from(elmnt.classList).includes(`box`)) {
                        let gameArea = document.getElementById(`gameArea`);
                        elmnt.classList.add(`position`);
                        let clickLocation = Object.create(locationObject);
                        clickLocation.x = e.clientX;
                        clickLocation.y = e.clientY;
                        let overMachineSpot = overlayCheck(clickLocation, `slot`)[0];
                        if (overMachineSpot && overMachineSpot.fill && overMachineSpot.fill.filter((div) => { return div.id == elmnt.id })[0]) {
                              overMachineSpot.fill = overMachineSpot.fill.filter((div) => {
                                    return div.id != elmnt.id;
                              });
                              currentInput[overMachineSpot.id.replace(`slot`, ``)] -= Number(elmnt.id.replace(`box`, ``));
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
            if (!inventoryItem) {
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
            if (!inventoryItem) {
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
                        if (overMachineSpot.fill.length < 2) {
                              let machineSlotBounds = overMachineSpot.getBoundingClientRect();
                              overMachineSpot.fill.push(elmnt);
                              if (!currentInput[overMachineSpot.id.replace(`slot`, ``)]) {
                                    currentInput[overMachineSpot.id.replace(`slot`, ``)] = 0;
                              }
                              currentInput[overMachineSpot.id.replace(`slot`, ``)] += Number(elmnt.id.replace(`box`, ``));
                              elmnt.style.left = machineSlotBounds.left + 'px';
                              elmnt.style.top = machineSlotBounds.top + 'px';
                              if (arraysEqual(currentInput, slipData)) {
                                    dispenseSlip();
                              }
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
      console.log(div);
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

function getKeyByValue(object, value) {
      return Object.keys(object).find(key => object[key] === value);
}

function cyrb128(str) {
      let h1 = 1779033703, h2 = 3144134277,
          h3 = 1013904242, h4 = 2773480762;
      for (let i = 0, k; i < str.length; i++) {
          k = str.charCodeAt(i);
          h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
          h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
          h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
          h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
      }
      h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
      h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
      h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
      h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
      h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
      return [h1>>>0, h2>>>0, h3>>>0, h4>>>0];
  }
  
  function sfc32(a, b, c, d) {
      return function() {
        a |= 0; b |= 0; c |= 0; d |= 0; 
        var t = (a + b | 0) + d | 0;
        d = d + 1 | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
      }
  }