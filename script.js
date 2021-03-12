const trackers = [...document.querySelectorAll(".tracker")];
const formSection = [...document.querySelectorAll(".form-section")];
const separators = [...document.querySelectorAll(".separator")];
const btnGroup = document.querySelector(".btn-group");

class FieldSection {
	constructor(trackerText, name, label, type, validateRegex, invalidText) {
		this.trackerText = trackerText;
		this.label = label;
		this.name = name;
		this.type = type;
		this.validateRegex = validateRegex;
		this.invalidText = invalidText;
	}
}

const sections = [
	new FieldSection(
		"Name",
		"fullName",
		"Full Name",
		"text",
		/[a-z]/i,
		"Full Name must be entered"
	),
	new FieldSection(
		"Email",
		"email",
		"Email",
		"text",
		/^[^\s@]+@[^\s@]+$/i,
		"Value is not a valid email format"
	),
	new FieldSection(
		"Password",
		"password",
		"Password",
		"password",
		/^[a-z0-9!@#$%^&]{5,10}$/i,
		"Password must be between 0 & 10 characters"
	),
	new FieldSection(
		"Address",
		"address",
		"Address",
		"text",
		/[a-z]/i,
		"Please input your address"
	),
];

const sLength = sections.length;

function defaultSections() {
	sections.forEach((sectionInfo, idx) => {
		const tracker = trackers[idx];
		tracker.innerText = sectionInfo.trackerText;
		const section = formSection[idx];

		if (idx === 0) {
			tracker.addEventListener("click", (e) => updateTracking(e, idx));
			section.classList.add("active");
		} else {
			section.classList.add("hidden");
		}

		const label = section.querySelector("label");
		const input = section.querySelector("input");
		const backBtn = section.querySelector(".btn-back");
		const nextBtn = section.querySelector(".btn-next");
		const invalid = section.querySelector(".invalid");

		label.innerText = sectionInfo.label;
		input.setAttribute("value", "");
		input.type = sectionInfo.type;
		input.addEventListener("keyup", (e) =>
			handleInputKey(e, input, nextBtn)
		);

		backBtn.addEventListener("click", (e) => updateTracking(e, idx - 1));
		if (idx < sections.length - 1) {
			nextBtn.addEventListener("click", (e) =>
				handleNextBtn(sectionInfo, input, invalid, tracker, e, idx)
			);
		} else {
			nextBtn.addEventListener("click", (e) => handleLastNextBtn(e));
		}
	});
}

function updateTracking(e, idx) {
	e.preventDefault();
	document.querySelector(".btn-group").classList.add("hidden");
	document.querySelector(".completed-section").classList.add("hidden");
	if (idx - 1 >= 0) {
		separators[idx - 1].classList.add("active");
		// for (let i = idx; i < separators.length; i++) {
		// 	separators[i].classList.remove("active");
		// }
	}

	const currActiveTracker = document.querySelector(".tracker.active");
	currActiveTracker.classList.remove("active");
	const tracker = trackers[idx];
	tracker.classList.add("active");

	const currentSection = document.querySelector(".form-section.active");
	currentSection.classList.add("hidden");
	currentSection.classList.remove("active");

	formSection[idx].classList.remove("hidden");
	formSection[idx].classList.add("active");
	let newInput = formSection[idx].querySelector("input");
	newInput.focus();
}

function handleInputKey(e, input, nextBtn) {
	e.preventDefault();
	if (e.key === "Enter") {
		nextBtn.click();
	}
	input.setAttribute("value", e.target.value);
}

function handleNextBtn(sectionInfo, input, invalid, tracker, e, idx) {
	e.preventDefault();
	if (idx >= sLength) {
		document.querySelector(".btn-group").classList.remove("hidden");
	}
	if (!sectionInfo.validateRegex.test(input.value)) {
		invalid.innerText = sectionInfo.invalidText;
		tracker.classList.remove("complete");
		return undefined;
	}
	invalid.innerText = "";

	tracker.classList.add("complete");
	trackers[idx + 1].addEventListener("click", (e) =>
		updateTracking(e, idx + 1)
	);

	updateTracking(e, idx + 1);
}

function handleLastNextBtn(e) {
	e.preventDefault();
	const currentSection = document.querySelector(".form-section.active");
	currentSection.classList.add("hidden");

	btnGroup.classList.remove("hidden");
}

function handleClear(e) {
	e.preventDefault();
	trackers.forEach((tracker) => {
		tracker.classList.remove("complete");
	});
	defaultSections();
	updateTracking(e, 0);
}

btnGroup.children[0].addEventListener("click", handleClear);

function handleBtnGroupBack(e) {
	e.preventDefault();
	updateTracking(e, sections.length - 1);
}

btnGroup.children[1].addEventListener("click", handleBtnGroupBack);

function handleBtnGroupSubmit(e) {
	e.preventDefault();
	btnGroup.classList.add("hidden");
	const completedSection = document.querySelector(".completed-section");
	completedSection.classList.remove("hidden");
	completedSection.setAttribute("display", "block");
}

btnGroup.children[2].addEventListener("click", handleBtnGroupSubmit);

defaultSections();
