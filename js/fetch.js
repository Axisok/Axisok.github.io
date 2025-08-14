// Creates a global and immediately fetches a few things asynchronously.
// Subsequent globals can use axisok as a namespace.

window.axisok = {
	promises: {
		navbuttons: fetch("/json/navbar.json").then((res) => res.json()),
		paths: fetch("/json/paths.json").then((res) => res.json()),
		languages: fetch("/json/languages.json").then((res) => res.json()),
	},
};
