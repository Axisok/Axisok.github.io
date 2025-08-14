// Map of languages with the key being the id (like "en") and the value being the path to the language.
axisok.languages = axisok.promises.languages.then((lang) => {
	return new Map(lang.map((l) => [l.id, { name: l.name, path: l.path }]));
});

axisok.currentLanguage;
axisok.currentLanguageId;

axisok.isLanguageSupported = async (language) => {
	const languages = await axisok.languages;
	return languages.has(language);
};

axisok.changeLanguage = async (language) => {
	const languages = await axisok.languages;
	return axisok.fetchJSON(languages.get(language).path);
};

axisok.translateElement = async (element) => {
	const lang = await axisok.currentLanguage;

	let elements = element.querySelectorAll("[data-i18n-key]");

	for (e of elements) e.innerHTML = lang[e.getAttribute("data-i18n-key")];
};

axisok.currentLanguageId = (async () => {
	// Tries to find a preferred language supported, and uses the first one found.

	let id;

	for (l of navigator.languages) {
		l = l.split("-", 2)[0];
		if (axisok.isLanguageSupported(l)) {
			axisok.currentLanguage = axisok.changeLanguage(l);
			id = l;
			break;
		}
	}

	return id;
})();

axisok.langselectElement = document.getElementById("language-select");

(async () => {
	// Create language selection buttons for supported languages.
	const lang = await axisok.languages;
	for (k of lang.keys()) {
		const v = lang.get(k);

		const element = document.createElement("option");
		axisok.langselectElement.appendChild(element);

		element.setAttribute("value", k);
		element.innerHTML = v.name;
	}

	// Selection changes current language of the page.
	// Done here AFTER setting defaults, preventing it from running a second time.
	axisok.langselectElement.value = await axisok.currentLanguageId;

	axisok.langselectElement.onchange = async (event) => {
		axisok.currentLanguage = axisok.changeLanguage(event.target.value);
		axisok.currentLanguageId = event.target.value;
		axisok.translateElement(document);
	};
})();
