console.log('yum, yum, yum');

// Go back and figure out why inFlavor won't display in the details section

//Make LD the admin and everyone else NOT the admin

// 1a. There should be a list of toppings stored in the database
// 1b.There should be some way to mix and match the toppings with the snacks.
// 2. The snack detail will need to display all the toppings for the one snack. Make this a comma separated list in a paragraph.
// 3a.Club members would love to have the option to display snacks with particular toppings.
// 3b. The dropdown menu should read from the toppings list in the DB and be displayed in the navbar. 
// 3c. The dropdown list of all toppings should trigger a call to DB for only those snacks and then display them.




import { LoginForm } from "./auth/LoginForm.js";
import { RegisterForm } from "./auth/RegisterForm.js";
import { NavBar } from "./nav/NavBar.js";
import { SnackList } from "./snacks/SnackList.js";
import { SnackDetails } from "./snacks/SnackDetails.js";
import { Footer } from "./nav/Footer.js";
import {
	logoutUser, setLoggedInUser, loginUser, registerUser, getLoggedInUser,
	getSnacks, getSingleSnack, getSnackTopping, useSnackTopping, getSnackToppingDetail, useSnackToppingDetail
} from "./data/apiManager.js";

const applicationElement = document.querySelector("#ldsnacks");

////////////////////EVENT LISTENERS\\\\\\\\\\\\\\\\\\\\\\\\\\

//LOGIN SUBMIT BUTTON
applicationElement.addEventListener("click", event => {
	event.preventDefault();
	if (event.target.id === "login__submit") {
		//collect all the details into an object
		const userObject = {
			name: document.querySelector("input[name='name']").value,
			email: document.querySelector("input[name='email']").value,
		}
		console.log(userObject);
		loginUser(userObject)
			.then(dbUserObj => {
				if (dbUserObj) {
					sessionStorage.setItem("user", JSON.stringify(dbUserObj));
					startLDSnacks();
				} else {
					//got a false value - no user
					const entryElement = document.querySelector(".entryForm");
					entryElement.innerHTML = `<p class="center">That user does not exist. Please try again or register for your free account.</p> ${LoginForm()} <hr/> <hr/> ${RegisterForm()}`;
				}
			})
	} else if (event.target.id === "register__submit") {
		//collect all the details into an object
		const userObject = {
			name: document.querySelector("input[name='registerName']").value,
			email: document.querySelector("input[name='registerEmail']").value,
			isAdmin: false
		}
		registerUser(userObject)
			.then(dbUserObj => {
				sessionStorage.setItem("user", JSON.stringify(dbUserObj));
				startLDSnacks();
			})
	}
})

//LOGOUT BUTTON
applicationElement.addEventListener("click", event => {
	if (event.target.id === "logout") {
		logoutUser();
		sessionStorage.clear();
		checkForUser();
	}
})

//CAKE DETAILS BUTTON
applicationElement.addEventListener("click", event => {
	event.preventDefault();

	if (event.target.id.startsWith("detailscake")) {
		const snackId = event.target.id.split("__")[1];
		getSingleSnack(snackId)
			.then(response => {
				showDetails(response);
			})
	}
})

//ALL SNACKS BUTTON
applicationElement.addEventListener("click", event => {
	event.preventDefault();
	if (event.target.id === "allSnacks") {
		showSnackList();
	}
})


//showDetails()
const showDetails = (snackObj, toppingObject) => {
	const listElement = document.querySelector("#mainContent");
	listElement.innerHTML = SnackDetails(snackObj);
}

//checkForUser()
const checkForUser = () => {
	if (sessionStorage.getItem("user")) {
		setLoggedInUser(JSON.parse(sessionStorage.getItem("user")));
		startLDSnacks();
	} else {
		applicationElement.innerHTML = "";
		//show login/register
		showNavBar()
		showLoginRegister();
	}
}

//showLoginRegister()
const showLoginRegister = () => {
	//template strings can be used here too
	applicationElement.innerHTML += `${LoginForm()} <hr/> <hr/> ${RegisterForm()}`;
}

//showNavBar()
const showNavBar = (menu) => {
	console.log(menu);
	// applicationElement.innerHTML += NavBar(menu);	
	applicationElement.innerHTML += NavBar(menu);
}

//showSnackList()
const showSnackList = () => {
	getSnacks().then(allSnacks => {
		const listElement = document.querySelector("#mainContent")
		listElement.innerHTML = SnackList(allSnacks);
	})
}

//showFooter()
const showFooter = () => {
	applicationElement.innerHTML += Footer();
}


//startLDSnacks//
const startLDSnacks = () => {
	getSnackTopping().then(() => {
		const menu = useSnackTopping()
		applicationElement.innerHTML = "";
		showNavBar(menu);
		applicationElement.innerHTML += `<div id="mainContent"></div>`;
		showSnackList();
		showFooter()
	}
	)
}

checkForUser();