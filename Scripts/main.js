document.addEventListener("DOMContentLoaded", function () {
	navModule.init();
	mainModule.siteInit();
});

/* ============ MAIN MODULE ============== */

var mainModule = (() => {
	function siteInit() {
		if (getCookie("navOption")) {
		} else {
			document.getElementById("portfolio-btn").click();
		}
	}

	function getCookie(cookieKey) {
		const navOption = document.cookie.split(";").filter(item => {
			if (item.includes(`${cookieKey}=`)) {
				return item;
			}
		});

		if (navOption) {
			console.log(navOption);
		} else {
			return null;
		}
	}

	return {
		siteInit
	};
})();

/* ============ NAVIGATION MODULE ============== */

var navModule = (() => {
	const _navOptions = {
		Portfolio: {
			buttonId: "#portfolio-btn",
			link: "../Pages/portfolio.html"
		},
		About: {
			buttonId: "#about-btn",
			link: "../Pages/about.html"
		},
		Contact: {
			buttonId: "#contact-btn",
			link: "../Pages/contact.html"
		}
	};

	let _currentSelection;

	function init() {
		var elems = document.querySelectorAll('.dropdown-trigger');
		M.Dropdown.init(elems, {
			gutter: 0, // Spacing from edge
			belowOrigin: false, // Displays dropdown below the button
			alignment: 'left', // Displays dropdown with edge aligned to the left of button
			container: "body",
			constrainWidth: false,
			onOpenStart: () => { document.getElementById("menu-dropdown").style.marginTop = "20px"; }
		});
		initEvents();
	}

	function initEvents() {
		const portfolioButtons = document.querySelectorAll("#portfolio-btn");
		portfolioButtons.forEach(button => button.addEventListener("click", () =>
			navChangeClick(button, _navOptions.Portfolio.link, portfolioModule.init)));

		const aboutButtons = document.querySelectorAll("#about-btn");
		aboutButtons.forEach(button => button.addEventListener("click", () =>
			navChangeClick(button, _navOptions.About.link)));

		const contactButtons = document.querySelectorAll("#contact-btn");
		contactButtons.forEach(button => button.addEventListener("click", () =>
			navChangeClick(button, _navOptions.Contact.link)));
	}

	function burgerMenuEvents() {
		let _isOpen = false;
		const burgerMenu = document.getElementById("burger-menu");
		burgerMenu.addEventListener("click", () => {
			// We need to show the menu for the user to navigate.
		});
	}

	function navChangeClick(button, fileLink, pageLoadCallback) {
		document.querySelector("#page-content").innerHTML = loaderHTML;
		setTimeout(() => {
			if (_currentSelection) {
				_currentSelection.classList.remove("nav-selected");
			}
			_currentSelection = button;
			button.classList.add("nav-selected");
			loadMainContent(fileLink, pageLoadCallback);
		}, 250);
	}

	function loadMainContent(contentName, pageLoadCallback) {
		var request = new XMLHttpRequest();
		request.open("GET", `../Pages/${contentName}`, true);
		request.onload = function () {
			let pageLoad = new Promise((resolve, reject) => {
				if (request.status >= 200 && request.status < 400) {
					var resp = request.responseText;
					document.querySelector("#page-content").innerHTML = resp;
					console.log(resp);
					resolve();
				} else {
					reject();
				}
			});
			pageLoad.then(() => {
				if (pageLoadCallback) {
					pageLoadCallback();
				}
			});
		};

		request.send();
	}

	const loaderHTML =
		'<div class="row center-align" style="margin-top:100px"><div class="preloader-wrapper big active"> <div class="spinner-layer spinner-blue"> <div class="circle-clipper left">' +
		'<div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right">' +
		'<div class="circle"></div></div></div></div>';

	return {
		init,
		getNavOptions: () => _navOptions
	};
})();

/* ============ PORTFOLIO MODULE ============== */

var portfolioModule = (() => {
	/**
	 * Call this once the portfolio file has been loaded.
	 *
	 */
	function init() {
		const elems = document.querySelectorAll(".materialboxed");
		M.Materialbox.init(elems);
		// init with element
		setTimeout(() => {
			const gallery = document.querySelector(".gallery");
			var msnry = new Masonry(gallery, {
				itemSelector: ".grid-item",
				fitWidth: true,
				gutter: 5
			});
		}, 50);
	}

	return {
		init
	};
})();

/* ============ ABOUT MODULE ============== */
var aboutModule = (() => {

	function init() {

	}

	return {
		init
	}
})();