document.addEventListener("DOMContentLoaded", function() {
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
		initEvents();
	}

	function initEvents() {
		const portfolioButton = document.getElementById("portfolio-btn");
		portfolioButton.addEventListener("click", () =>
			navChangeClick(portfolioButton, _navOptions.Portfolio.link, portfolioModule.init)
		);
		const aboutButton = document.getElementById("about-btn");
		aboutButton.addEventListener("click", () =>
			navChangeClick(aboutButton, _navOptions.About.link)
		);
		const contactButton = document.getElementById("contact-btn");
		contactButton.addEventListener("click", () =>
			navChangeClick(contactButton, _navOptions.Contact.link)
		);
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
		request.onload = function() {
			let pageLoad = new Promise((resolve, reject) => {
				if (request.status >= 200 && request.status < 400) {
					var resp = request.responseText;
					document.querySelector("#page-content").innerHTML = resp;
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
		}, 250);
	}

	return {
		init
	};
})();
