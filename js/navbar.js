axisok.navbuttons = new Map();
axisok.navmenuElement = document.getElementById("navbar-buttons");

axisok.updateNavbar = async () => {
	// Sets the relevant navbar button as active, if applicable (some pages aren't part of any button).

	// Waits to make sure the navbar is fully built.
	await axisok.navbarBuilt;

	for (b of axisok.navbuttons.values()) {
		if (window.location.pathname === b.element.getAttribute("href"))
			b.element.classList.add("active");
		else b.element.classList.remove("active");
	}
};

axisok.navbarBuilt = (async () => {
	// Populate navbar buttons.
	const nav = await axisok.promises.navbuttons;
	for (k of Object.keys(nav)) {
		// The website isn't finished yet, so this is useful.
		// I can make callback jokes.
		if (!(await axisok.pathExists(nav[k].path))) continue;

		const element = document.createElement("button");
		axisok.navbuttons.set(k, {
			"i18n-key": nav[k]["i18n-key"],
			path: nav[k].path,
			element: element,
		});
		axisok.navmenuElement.appendChild(element);

		element.className = "nav-button";
		element.setAttribute("data-i18n-key", nav[k]["i18n-key"]);
		element.setAttribute("href", nav[k].path);

		element.onclick = async (event) => {
			const [pathname, path] = await axisok.localRoute(
				element.getAttribute("href"),
			);
			axisok.changePage(path);
			history.pushState(null, "", pathname);
		};
	}

	axisok.translateElement(axisok.navmenuElement);
})();
