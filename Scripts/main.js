var lazyLoadInstance = new LazyLoad({
	elements_selector: ".lazy"
});

function lazyLoadRefresh() {
	if (lazyLoadInstance) {
		lazyLoadInstance.update();
	}
}

document.addEventListener("DOMContentLoaded", function () {
	document.addEventListener("scroll", lazyLoadRefresh)
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
		document.getElementById("loader-placeholder").setAttribute("hidden", "hidden");
	}

	function showLoader() {
		document.getElementById("loader-placeholder").removeAttribute("hidden");

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
				navChangeClick(button, _navOptions.Contact.link, _navOptions.Contact.buttonId, contactModule.init)
			)
		);
		const instagramButtons = document.querySelectorAll("#instagram-btn");
		instagramButtons.forEach(button =>
			button.addEventListener("click", () =>
				navChangeClick(button, _navOptions.Instagram.link, _navOptions.Instagram.buttonId, aboutModule.init)
			)
		);
	}

	function navChangeClick(button, fileLink, buttonId, pageLoadCallback) {
		if (_currentSelection) {
			_currentSelection.classList.remove("nav-selected");
		}
		button.classList.add("nav-selected");
		// mainModule.showLoader();
		document.cookie = "navOption=" + buttonId;
		setTimeout(() => {
			_currentSelection = button;
			loadMainContent(fileLink, pageLoadCallback);
		}, 50);
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
			}).catch(error => {
				console.log("Error");
				console.log(error);
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
	let _portfolioImageNumber;
	let _imagesLoaded;
	/**
	 * Call this once the portfolio file has been loaded.
	 *
	 */
	function init() {
		_imagesLoaded = 0;
		const allImages = document.getElementById("page-content");
		_portfolioImageNumber = allImages.length;
		const gallery = document.querySelector(".gallery");
		const msnry = new Masonry(gallery, {
			itemSelector: ".grid-item",
			fitWidth: true,
			gutter: 10
		});
		mainModule.hideLoader();
		// init with element
	}

	function imageLoaded() {
		_imagesLoaded++;
		console.log(_imagesLoaded);
		if (_imagesLoaded === _portfolioImageNumber) {
			allImagesLoaded();
		}
	}

	return {
		init
	};
})();

/* ============ ABOUT MODULE ============== */
var aboutModule = (() => {
	async function init() {
		const payload = await fetch("./Site/info.json").then(siteInfo => {
			return siteInfo.json();
		}).then(data => {
			let url = data.instagram_api_url;
			const accessToken = data.access_token;
			url += accessToken;
			url += "&count=20";
			return fetchJsonp(url);
		}).then(response => {
			return response.json();
		}).catch(error => {
			// Error loading the instagram images.
			console.log(error);
			// Show snackbar -> instagram could not be loaded.
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
			indicators: false,
			dist: -120
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

var contactModule = (function () {

	function init() {
		var elems = document.querySelectorAll('.tooltipped');
		var instances = M.Tooltip.init(elems, {
			outDuration: 100
		});
		mainModule.hideLoader();
	}
	return {
		init
	};
})();