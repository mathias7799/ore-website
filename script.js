// Constants
const LANGUAGES_JSON_URL = 'languages.json';
const LANGUAGE_DATA_URL = 'lang/';
const DEFAULT_LANGUAGE = 'en';

// Functions

// Function to fetch and load JSON data based on user's language preference
async function loadLanguageOptions() {
    try {
        const response = await fetch(LANGUAGES_JSON_URL);
        return await response.json();
    } catch (error) {
        console.error('Error fetching language options:', error);
        return []; // Return an empty array if there's an error
    }
}

// Function to populate language options dropdown
function populateLanguageOptions(languages) {
    const languageOptionsContainer = document.getElementById('language-options-container');
    languageOptionsContainer.innerHTML = ''; // Clear previous options

    languages.forEach(language => {
        const option = document.createElement('a');
        option.href = '#';
        option.textContent = language.name;
        option.classList.add('text-gray-800', 'block', 'px-4', 'py-2', 'text-lg');
        option.setAttribute('role', 'menuitem');
        option.setAttribute('tabindex', '-1');
        option.addEventListener('click', () => selectLanguage(language.code, language.name));
        languageOptionsContainer.appendChild(option);
    });
}

// Function to toggle dropdown menu visibility
function toggleDropdown() {
    const dropdownMenu = document.getElementById('language-options');
    dropdownMenu.classList.toggle('hidden');
}

// Event listener to toggle dropdown menu
document.getElementById('language-button').addEventListener('click', toggleDropdown);

// Function to close dropdown menu when clicking outside
document.addEventListener('click', function(event) {
    const dropdownMenu = document.getElementById('language-options');
    const button = document.getElementById('language-button');
    if (!dropdownMenu.contains(event.target) && event.target !== button) {
        dropdownMenu.classList.add('hidden');
    }
});

// Function to fetch and load JSON data based on user's language preference
async function loadLocalizationData(language) {
    console.log(`Fetching localization data for language: ${language}`);
    try {
        const response = await fetch(`${LANGUAGE_DATA_URL}${language}.json`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching JSON:', error);
        return {}; // Return an empty object if there's an error
    }
}

// Function to populate the page with localized content
function populatePage(data) {
    console.log('Populating page with localized content:', data);

    // Populate hero section
    document.getElementById('hero-title').innerText = data.hero.title;
    document.getElementById('hero-subtitle').innerText = data.hero.subtitle;
    document.getElementById('hero-button').innerText = data.hero.button;

    // Populate information section
    document.getElementById('info-title').innerText = data.info.title;
    document.getElementById('info-title-last').innerText = data.info['title-last']; // Corrected here
    document.getElementById('info-subtitle').innerText = data.info.subtitle;
    document.getElementById('info-learn-more').innerText = data.info['learn-more']; // Corrected here
    document.getElementById('info-trans').innerText = data.info.trans;

    // Populate supply section
    document.getElementById('supply-title').innerText = data.supply.title;
    document.getElementById('supply-title-last').innerText = data.supply['title-last']; // Corrected here
    document.getElementById('supply-subtitle').innerText = data.supply.subtitle;
    document.getElementById('supply-learn-more').innerText = data.info['learn-more']; // Corrected here
    document.getElementById('info-trans').innerText = data.info.trans;

    

    // Populate footer section
    document.getElementById('copyright').innerText = data.footer.copyright;
    document.getElementById('privacy_policy').innerText = data.footer.privacy_policy;
    document.getElementById('terms_of_service').innerText = data.footer.terms_of_service;
}

// Function to select language
async function selectLanguage(code, name) {
    console.log(`Switching language to: ${name} (${code})`);
    // Update the language button text
    document.getElementById('current-language').innerText = name;
    try {
        const data = await loadLocalizationData(code);
        populatePage(data); // Update the UI with localized content
        toggleDropdown(); // Hide the dropdown after selecting a language
    } catch (error) {
        console.error('Error loading localization data:', error);
    }
}

// Load and populate content with default language (e.g., English)
(async () => {
    try {
        const data = await loadLocalizationData(DEFAULT_LANGUAGE);
        console.log('Default language data loaded successfully:', data);
        populatePage(data);
    } catch (error) {
        console.error('Error loading default language data:', error);
    }
})();

// Load and populate language options
loadLanguageOptions()
    .then(languages => populateLanguageOptions(languages));
