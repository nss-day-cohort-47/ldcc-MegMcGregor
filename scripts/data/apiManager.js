const apiURL = "http://localhost:8088";

///////////////////////////////////// USER FUNCTIONS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
let loggedInUser = {}

//GET LOGGED IN USER
export const getLoggedInUser = () => {
	return { ...loggedInUser };
}

//LOG OUT USER
export const logoutUser = () => {
	loggedInUser = {}
}

//SET LOGGED IN USER
export const setLoggedInUser = (userObj) => {
	loggedInUser = userObj;
}

//LOG IN USER
export const loginUser = (userObj) => {
	return fetch(`${apiURL}/users?name=${userObj.name}&email=${userObj.email}`)
		.then(response => response.json())
		.then(parsedUser => {
			//is there a user?
			if (parsedUser.length > 0) {
				setLoggedInUser(parsedUser[0]);
				return getLoggedInUser();
			} else {
				//no user
				return false;
			}
		})
}

//REGISTER USER
export const registerUser = (userObj) => {
	return fetch(`${apiURL}/users`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(userObj)
	})
		.then(response => response.json())
		.then(parsedUser => {
			setLoggedInUser(parsedUser);
			return getLoggedInUser();
		})
}

/////////////////////////////////// SNACK FUNCTIONS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

let snackCollection = [];

//useSnackCollection()
export const useSnackCollection = () => {
  //Best practice: we don't want to alter the original state, so
  //make a copy of it and then return it
  //the spread operator makes quick work
  const snackCollectionCopy = [...snackCollection]
  return snackCollectionCopy;
}

//getSnacks()
export const getSnacks = () => {
	return fetch(`${apiURL}/snacks`)
		.then(response => response.json())
		.then(parsedResponse => {
			snackCollection = parsedResponse
			return parsedResponse;
		})
}

//getSingleSnack()
export const getSingleSnack = (snackId) => {
	return fetch(`${apiURL}/snacks/${snackId}`)
	.then(response => response.json())
}