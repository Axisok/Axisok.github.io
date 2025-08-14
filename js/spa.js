axisok.page = document.getElementById("page-content");
axisok.paths = window.axisok.promises.paths;

// Local cache for all requests, faster than using the browser cache.
window.axisok.json = new Map();
window.axisok.html = new Map();

axisok.pathExists = async (path) => {
	// Useful when the website isn't finished yet.
	return path in (await axisok.paths);
};

axisok.localRoute = async (path) => {
	// Simple route logic from a JSON file, it really needs a 404.html somewhere.
	const paths = await axisok.paths;

	if (path.length > 1 && path[path.length - 1] === "/")
		path = path.slice(0, path.length - 1);

	finalPath = "?";
	while (true) {
		if (path in paths) {
			if (paths[path][0] === "*")
				// Reroute to another path.
				// It CAN be circular and will cause an infinite loop, don't do that please.
				path = paths[path].slice(1);
			else {
				// Path found.
				finalPath = paths[path];
				break;
			}
		} else
			// Path not found.
			break;
	}
	if (finalPath === "?" || finalPath[0] === "*")
		// If the path wasn't found, or the rerouting target couldn't be found.
		return ["/404", paths["/404"]];
	else
		// The path was found, return it.
		return [path, finalPath];
};

axisok.fetchPage = async (path) => {
	// Fetches page and caches it.
	if (!window.axisok.html.has(path))
		window.axisok.html.set(
			path,
			await fetch(path).then((res) => res.text()),
		);

	return window.axisok.html.get(path);
};

axisok.fetchJSON = async (path) => {
	// Fetches JSON and caches it.
	if (!window.axisok.json.has(path))
		window.axisok.json.set(
			path,
			await fetch(path).then((res) => res.json()),
		);

	return window.axisok.json.get(path);
};

axisok.changePage = async (path) => {
	axisok.page.innerHTML = await axisok.fetchPage(path);
	await axisok.translateElement(axisok.page);
	await axisok.updateNavbar();
};

axisok.updatePage = async (event) => {
	// Find out current page and go to it.
	const [pathname, path] = await axisok.localRoute(window.location.pathname);
	axisok.changePage(path);
	history.replaceState(null, "", pathname);
};

axisok.updatePage();

addEventListener("popstate", axisok.updatePage);
