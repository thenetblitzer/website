// This file handles all the XHR functionality of the application.

// An object holding all the information of the main user that's being searched.
let mainPlayer = {
  status: 'empty',
  name: '',
  realm: '',
  level: 0,
  avatar: '',
  items: [],
  stats: {},
};


// A generic function to send XHR requests and handle the success and error when provided.
const sendXHR = (action, method, success, error) => {
  // Create a new XHR request.
  const xhr = new XMLHttpRequest();
  
  // Tie the callbacks.
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      // If there was a successful response, pass it to the success callback.
      if (xhr.statusText === "OK") {
        success(xhr);
      }
      // If there wasn't, pass it to the error callback (if there is one).
      else if (error !== null) {
        error(xhr);
      }
    }
  }
  
  // Attach an error callback if one is provided.
  if (error !== null) {
    xhr.addEventListener('error', error);
  }
  
  // Open the request to where we want to go.
  xhr.open(method, 'https://us.api.battle.net/wow' + action, true);
  
  // Set the request headers for what we're looking for. All requests will be jsonp.
  xhr.setRequestHeader('Accept', 'application/json');
  
  // Send the XHR request.
  xhr.send();
};


// A function to handle when an error occurs getting the player's main data.
const errorResponse = (xhr) => {
  // Get error responses.
  const response = JSON.parse(xhr.responseText);
  const responseCode = xhr.status;
  console.dir(response);
  
  // Grab the error message element.
  const errorElement = document.querySelector('#formErrorMessage');
  
  // Mark the loading message to be an error.
  errorElement.dataset.error = 'true';
  
  // If there was a user error, let them know that it was an issue with the input.
  if (responseCode >= 400 && responseCode < 500) {
    errorElement.innerHTML = 'Error: ' + response.reason;
    errorElement.dataset.faded = 'false';
  }
  else if (responseCode >= 500 && responseCode < 600) {
    // If there was an error on the server, let the user know.
    errorElement.innerHTML = 'Error: A server error occurred, please try again.';
    errorElement.dataset.faded = 'false';
  }
  
  
  // If there was an error, set the timer to hide the error message.
  setTimeout(() => {
    const errorElement = document.querySelector('#formErrorMessage');
    errorElement.dataset.faded = 'true';
  }, 5000);
};


// A function to grab the main user information to view the statistics of, then send it to
// the action to process the data.
const getMainUser = (e, form) => {
  // Prevent loading a new webpage.
  e.preventDefault();
  
  // Get the method and action for sending the XHR.
  let action = form.getAttribute('action');
  const method = form.getAttribute('method');
  
  // Get user attributes.
  const name = form.querySelector('#nameField').value;
  const realm = form.querySelector('#realmField').value;
  
  // Grab the error message element.
  const errorElement = document.querySelector('#formErrorMessage');
  
  let error = false;
  
  // Verify that the user attributes are valid first.
  if (name === "") {
    errorElement.innerHTML = 'Error: Character name is missing.';
    error = true;
  }
  else if (realm === "") {
    errorElement.innerHTML = 'Error: Realm name is missing.';
    error = true;
  }
  // Make sure another player isn't already being loaded in.
  else if (mainPlayer.status === 'loading') {
    errorElement.innerHTML = 'Error: Another character is already loading.';
    error = true;
  }
  
  // No matter what happens, we want to show the log message.
  errorElement.dataset.faded = 'false';
  
  // If an error occurred, trigger the timer to begin for how long the error message should be shown.
  if (error === true) {
    errorElement.dataset.error = 'true';
    // Set the timer.
    setTimeout(() => {
      const errorElement = document.querySelector('#formErrorMessage');
      errorElement.dataset.faded = 'true';
    }, 3000);
    
    // Return false.
    return false;
  }
  else {
    // If an error didn't occur, indicate to the user that we're loading.
    errorElement.innerHTML = 'Loading...';
    errorElement.dataset.faded = 'false';
    errorElement.dataset.error = 'false';
  }
  
  // If there was no error, we can send the information and get the data.
  action += '/' + realm + '/' + name + '?fields=stats&locale=en_US&apikey=xt4ebjwn8eh63p5gurftp6mj5xwkhqp4';
  
  // Send out the XHR. Make sure we error out if something goes wrong instead of continuing.
  sendXHR(action, method, parseMainUser, errorResponse);
  
  // Return false to prevent the form from trying to change the page.
  return false;
};


// A function to parse the main components of the player.
const parseMainUser = (xhr) => {
  // Get the response text.
  const response = JSON.parse(xhr.responseText);
  
  // Mark that the user is now loading in.
  mainPlayer.status = 'loading';
  
  // Go through each major attribute and place it on screen.
  let keys = Object.keys(response);
  
  for (let i = 0; i < keys.length; i++) {
    let element = document.querySelector('#' + keys[i]);
    if (element !== null) {
      element.innerHTML = response[keys[i]];
    }
  }
  
  
  // Set the global player information.
  mainPlayer.name = response.name;
  mainPlayer.realm = response.realm;
  mainPlayer.level = response.level;
  mainPlayer.avatar = response.avatar;
  mainPlayer.stats = response.stats;
  
  // Fill out minor attributes.
  document.querySelector('#str').innerHTML = response.stats.str;
  document.querySelector('#agi').innerHTML = response.stats.agi;
  document.querySelector('#int').innerHTML = response.stats.int;
  document.querySelector('#sta').innerHTML = response.stats.sta;
  document.querySelector('#mana5').innerHTML = response.stats.mana5;
  document.querySelector('#armor').innerHTML = response.stats.armor;
  document.querySelector('#health').innerHTML = response.stats.health;
  document.querySelector('#power').innerHTML = response.stats.power;
  
  // Fill out percentage stats.
  document.querySelector('#dodge').innerHTML = parseFloat(response.stats.dodge).toFixed(2) + "%";
  document.querySelector('#parry').innerHTML = parseFloat(response.stats.parry).toFixed(2) + "%";
  document.querySelector('#block').innerHTML = parseFloat(response.stats.block).toFixed(2) + "%";
  document.querySelector('#crit').innerHTML = parseFloat(response.stats.crit).toFixed(2) + "%";
  document.querySelector('#haste').innerHTML = parseFloat(response.stats.haste).toFixed(2) + "%";
  document.querySelector('#mastery').innerHTML = parseFloat(response.stats.mastery).toFixed(2) + "%";
  document.querySelector('#leech').innerHTML = parseFloat(response.stats.leech).toFixed(2) + "%";
  document.querySelector('#versatility').innerHTML = parseFloat(response.stats.versatility).toFixed(2) + "%";
  
  // Fill out the damage/speed statistics.
  document.querySelector('#mainDamage').innerHTML = response.stats.mainHandDmgMin + ' - ' + response.stats.mainHandDmgMax;
  document.querySelector('#offDamage').innerHTML = response.stats.offHandDmgMin + ' - ' + response.stats.offHandDmgMax;
  document.querySelector('#speed').innerHTML = response.stats.mainHandSpeed.toFixed(2) + ' / ' + response.stats.offHandSpeed.toFixed(2);
  document.querySelector('#dps').innerHTML = response.stats.mainHandDps.toFixed(2) + ' / ' + response.stats.offHandDps.toFixed(2);
  
  // Grab the avatar image of the character.
  let mainAvatar = 'url(http://render-us.worldofwarcraft.com/character/' + response.thumbnail + ')';
  mainAvatar = mainAvatar.replace('avatar', 'main');
  document.querySelector('#playerAvatar').style.backgroundImage = mainAvatar;
  
  // Kick off a search for the player's items.
  const action = '/character/' + response.realm + '/' + response.name + '?fields=items&locale=en_US&apikey=xt4ebjwn8eh63p5gurftp6mj5xwkhqp4';
  const method = 'get';
  
  // Send the XHR request.
  sendXHR(action, method, parseMainUserItemList);
};


// A function to parse each item from a player.
const parseMainUserItemList = (xhr) => {
  // Get the response text.
  const response = JSON.parse(xhr.responseText).items;
  
  // Grab the list container.
  const itemList = document.querySelector('.itemListContainer');
  
  // Clear the list before continuing.
  itemList.innerHTML = "";
  
  // Grab the item prefab to duplicate.
  const itemPrefab = document.querySelector('#itemContainerPrefab');
  
  // Go through each item and create a call to get its detailed stats.
  let keys = Object.keys(response);
    
  // Keep track of how many items have finished loading in.
  let loaded = 0;
  
  for (let i = 2; i < keys.length; i++) {
    // Create the new element for the item.
    const newItem = itemPrefab.cloneNode(true);
    
    // Remove the newItem's id to prevent trying to clone it.
    newItem.removeAttribute('id');
    
    // Append the new item to the item list.
    itemList.appendChild(newItem);
    
    // Create a call to get more in-depth information about the item.
    const action = '/item/' + response[keys[i]].id + '?locale=en_US&apikey=xt4ebjwn8eh63p5gurftp6mj5xwkhqp4';
    sendXHR(action, 'get', (xhr) => {
      // Parse the item.
      parseItem(xhr, newItem);
      
      // Iterate that we've laoded a new item.
      loaded++;
      
      // See if all the items have loaded in.
      if (loaded === keys.length - 2) {
        // If they have, mark the user as finished loading.
        mainPlayer.status = 'loaded';
        
        // Hide the loading message if it didn't become an error. If it did, there's a timer to close it elsewhere already.
        const errorElement = document.querySelector('#formErrorMessage');
        
        if (errorElement.dataset.error !== 'true') {
          errorElement.dataset.faded = 'true';
        }
      }
    });
  }
};


// A function to parse each individual item and its information.
const parseItem = (xhr, itemContainer, callback) => {
  // Parse the response.
  const response = JSON.parse(xhr.responseText);
  
  // Go through the item and fill out its container's attributes.
  itemContainer.querySelector('.itemName').innerHTML = '(' + response.requiredLevel + ') ' + response.name;
  itemContainer.querySelector('.itemIcon').src = 'https://wow.zamimg.com/images/wow/icons/large/' + response.icon + '.jpg';
  
  // Figure out how many gold, silver, and copper things are worth.
  let price = parseInt(response.buyPrice);
  let gold, silver, copper;
  
  // Get the gold, then alter the price.
  gold = Math.floor(price / 10000);
  price %= 10000;
  // Get the silver, then alther the price.
  silver = Math.floor(price / 100);
  price %= 100;
  // Copper is the remainder.
  copper = price;
  
  itemContainer.querySelector('.itemBuy').innerHTML = 'Buy: <span class="money gold"></span>' + gold + '<span class="money silver"></span>' + silver + '<span class="money copper"></span>' + copper;
  
  // Do the same for sell price now.
  price = parseInt(response.sellPrice);
  // Get the gold, then alter the price.
  gold = Math.floor(price / 10000);
  price %= 10000;
  // Get the silver, then alther the price.
  silver = Math.floor(price / 100);
  price %= 100;
  // Copper is the remainder.
  copper = price;
  
  itemContainer.querySelector('.itemSell').innerHTML = 'Sell: <span class="money gold"></span>' + gold + '<span class="money silver"></span>' + silver + '<span class="money copper"></span>' + copper;
  
  // Grab the item's name so we can modify its color.
  const itemName = itemContainer.querySelector('.itemName');
  
  // Change the item name's color based on its quality.
  itemName.classList.add('Quality' + response.quality);
  
  // Enable the item container's visibilty.
  itemContainer.dataset.visible = 'true';
  
  // Add this item to the player's item list.
  mainPlayer.items.push(response);
};


// A function to clear the screen of current player details.
const clearPlayerDetails = () => {
  // Check to make sure a player isn't currently loading.
  if (mainPlayer.status === 'loading') {
    // If they are, tell the user and return.
    const errorElement = document.querySelector('#formErrorMessage');
    errorElement.innerHTML = 'Error: Can\'t clear while character loads.';
    errorElement.dataset.error = 'true';
    
    // Set a timer to clear the error message.
    setTimeout(() => {
      errorElement.dataset.faded = 'true';
    }, 3000);
    
    return false;
  }
  
  // Get all player stats DOM elements.
  const statContainers = document.querySelectorAll('.infoSub em');
  
  // Go through each stat and clear it to default values.
  for (let i = 0; i < statContainers.length; i++) {
    // Get the item.
    const stat = statContainers[i];
    
    // Reset its value.
    stat.innerHTML = '-';
  }
  
  // Correct special cases.
  document.querySelector('#speed').innerHTML = '- / -';
  document.querySelector('#dps').innerHTML = '- / -';
  
  // Correct the avatar image.
  document.querySelector('#playerAvatar').style.backgroundImage = '';
  
  // Correct the player name.
  document.querySelector('#name').innerHTML = '';
  
  // Get each player item.
  const items = Array.prototype.slice.call(document.querySelectorAll('.itemListContainer .itemContainer'));
  
  // Make sure we have items to clear.
  if (items.length > 0) {
    // Set up an interval to go through each item and fade it in a sequence.
    const intervalID = setInterval(() => {
      // Find a random item number.
      const r = Math.floor(Math.random() * items.length);
      
      // Get the item.
      const item = items[r];

      // Fade it out.
      item.dataset.visible = 'false';
      
      // Remove the item from the list.
      items.splice(r, 1);

      // If we're out of items, stop this interval and set up a timer to delete all the items after they're done fading.
      if (items.length === 0) {
        clearInterval(intervalID);

        // Create a timer to delete all the items.
        setTimeout(() => {
          // Grab the list container.
          const itemList = document.querySelector('.itemListContainer');

          // Clear the list.
          itemList.innerHTML = "";
          
          // Reset the player's information.
          mainPlayer = {
            status: 'empty',
            name: '',
            realm: '',
            level: 0,
            avatar: '',
            items: [],
            stats: {},
          };
        }, 1000);
      }
    }, 50);
  }
};


// Initialize the window and connect listeners.
const init = () => {
  // Get the objects to attach listeners to.
  const playerSearchForm = document.querySelector('#playerSearchForm');
  const clearButton = document.querySelector('#clearButton');
  
  // Create methods to pass the events and forms along.
  const searchPlayer = (e) => getMainUser(e, playerSearchForm);
  
  // Connect the forms to the listeners.
  playerSearchForm.onsubmit = searchPlayer;
  clearButton.onclick = clearPlayerDetails;
};

// Connect the window.onload to init.
window.onload = init;