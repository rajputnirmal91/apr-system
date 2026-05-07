// User Service with intentional bugs for PR review testing

// BUG 1: Global variable pollution (line 3)
globalUserCache = {};

function getUserData(userId) {
  // BUG 2: No error handling for null/undefined userId
  const user = globalUserCache[userId];
  
  // BUG 3: Missing null check before accessing properties
  return user.email + " - " + user.name;
}

function updateUserEmail(userId, newEmail) {
  // BUG 4: No input validation or sanitization
  const query = "UPDATE users SET email = '" + newEmail + "' WHERE id = " + userId;
  
  // BUG 5: Hardcoded API key exposed
  const apiKey = "sk_live_51234567890abcdefghijk";
  
  // This would execute the query (simulated)
  executeQuery(query);
  
  globalUserCache[userId].email = newEmail;
}

function fetchAllUsers() {
  // BUG 6: N+1 query problem - fetching users then making individual calls
  const users = getUsers();
  
  for (let i = 0; i < users.length; i++) {
    // This makes a separate API call for each user
    users[i].profile = fetchUserProfile(users[i].id);
  }
  
  return users;
}

function processUserList(userList) {
  // BUG 7: Missing error handling for async operation
  userList.forEach(user => {
    sendEmailNotification(user.email);
  });
}

function validateUserInput(userData) {
  // BUG 8: Incomplete validation - doesn't check for empty strings or special characters
  if (userData.email) {
    return true;
  }
  return false;
}

// BUG 9: Unused variable
const deprecatedUserStore = {};

// BUG 10: Memory leak - event listener never removed
function setupUserListener() {
  const listener = () => {
    console.log("User updated");
  };
  
  userEventEmitter.on('update', listener);
  // Missing: userEventEmitter.off('update', listener) in cleanup
}
