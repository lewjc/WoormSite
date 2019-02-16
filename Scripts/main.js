document.addEventListener("DOMContentLoaded", function () {
	navModule.init();
	mainModule.siteInit();
});

/* ============ MAIN MODULE ============== */
var mainModule = (() => {
	function siteInit() {
		const cookie = getCookie("navOption");
		if (cookie) {
			// Gets where the user is previously clicked and sets that page to the currently selected one.
			const previousButtonId = cookie.split("=")[1];
			document.querySelector(previousButtonId).click();
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
		if (navOption && navOption.length > 0) {
			return navOption[0];
		} else {
			return null;
		}
	}

	function hideLoader() {
		const loaderPlaceholder = document.getElementById("loader-placeholder");
		loaderPlaceholder.setAttribute("hidden", "hidden");
	}

	function showLoader() {
		const loaderPlaceholder = document.getElementById("loader-placeholder");
		loaderPlaceholder.removeAttribute("hidden");
	}
	return {
		siteInit,
		hideLoader,
		showLoader
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
		},
		Instagram: {
			buttonId: "#instagram-btn",
			link: "../Pages/instagram.html"
		}
	};

	let _currentSelection;

	function init() {
		var elems = document.querySelectorAll(".dropdown-trigger");
		M.Dropdown.init(elems, {
			gutter: 0, // Spacing from edge
			belowOrigin: false, // Displays dropdown below the button
			alignment: "left", // Displays dropdown with edge aligned to the left of button
			container: "body",
			constrainWidth: false,
			onOpenStart: () => {
				document.getElementById("menu-dropdown").style.marginTop = "20px";
			}
		});
		initEvents();
	}

	function initEvents() {
		const portfolioButtons = document.querySelectorAll("#portfolio-btn");
		portfolioButtons.forEach(button =>
			button.addEventListener("click", () =>
				navChangeClick(
					button,
					_navOptions.Portfolio.link,
					_navOptions.Portfolio.buttonId,
					portfolioModule.init
				)
			)
		);

		const aboutButtons = document.querySelectorAll("#about-btn");
		aboutButtons.forEach(button =>
			button.addEventListener("click", () =>
				navChangeClick(button, _navOptions.About.link, _navOptions.About.buttonId)
			)
		);

		const contactButtons = document.querySelectorAll("#contact-btn");
		contactButtons.forEach(button =>
			button.addEventListener("click", () =>
				navChangeClick(button, _navOptions.Contact.link, _navOptions.Contact.buttonId)
			)
		);
		const instagramButtons = document.querySelectorAll("#instagram-btn");
		instagramButtons.forEach(button =>
			button.addEventListener("click", () =>
				navChangeClick(button, _navOptions.Instagram.link, _navOptions.Instagram.buttonId, aboutModule.init)
			)
		);
	}

	function burgerMenuEvents() {
		let _isOpen = false;
		const burgerMenu = document.getElementById("burger-menu");
		burgerMenu.addEventListener("click", () => {
			// We need to show the menu for the user to navigate.
		});
	}

	function navChangeClick(button, fileLink, buttonId, pageLoadCallback) {
		// Here we are setting the loader.
		mainModule.showLoader();
		document.cookie = "navOption=" + buttonId;
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
					resolve();
				} else {
					reject();
				}
			});
			pageLoad.then(() => {
				if (pageLoadCallback) {
					pageLoadCallback();
				} else {
					mainModule.hideLoader();
				}
			});
		};

		request.send();
	}
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
		M.Materialbox.init(elems),
			{
			  inDuration: 0
			};
		// init with element
		setTimeout(() => {
			const gallery = document.querySelector(".gallery");
			const msnry = new Masonry(gallery, {
				itemSelector: ".grid-item",
				fitWidth: true,
				gutter: 10
			});
			msnry.on("layoutComplete", mainModule.hideLoader);
			msnry.layout();
		}, 500);
		// here is where we hide the selector
	}

	return {
		init
	};
})();

/* ============ ABOUT MODULE ============== */
var aboutModule = (() => {
	async function init() {
		const payload = await fetch("./Site/info.json", {
			mode: "cors",
			headers: {
				'Access-Control-Allow-Origin': '*'
			}
		})
			.then(siteInfo => {
				return siteInfo.json();
			}).then(data => {
				let url = data.instagram_api_url;
				const accessToken = data.access_token;
				url += accessToken;
				url += "&count=20";
				return fetchJsonp(url);
			})
			.then(response => {
				return response.json();
			});
		initInstagramCarousel(payload);
	}

	function initInstagramCarousel(payload) {
		const carouselContainer = document.getElementById("instagram-carousel");
		payload.data.forEach(payloadObject => {
			const imageUrl = payloadObject.images.standard_resolution.url;
			const link = payloadObject.link;
			let newMember = createCarouselMember(imageUrl, link);
			carouselContainer.appendChild(newMember);
		});
		const elems = document.querySelectorAll(".carousel");
		M.Carousel.init(elems, {
			// onCycleTo: updateCarouselInfo,
			numVisible: 5,
			indicators: true
		});
		mainModule.hideLoader();
	}

	function createCarouselMember(imageUrl, link) {
		const carouselMember = document.createElement("a");
		carouselMember.classList.add("carousel-item");
		carouselMember.setAttribute("href", link);
		const image = document.createElement("img");
		image.setAttribute("src", imageUrl);
		image.setAttribute("alt", "loading");
		carouselMember.appendChild(image);
		return carouselMember;
	}

	return {
		init
	};
})();


