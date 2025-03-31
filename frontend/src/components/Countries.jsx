// utils/countryFlags.js
const countries = (countryName) => {
    const countryCodeMap = {
        'sweden': 'se',
        'denmark': 'dk',
        'germany': 'de',
        'france': 'fr',
        'italy': 'it',
        'spain': 'es',
        'netherlands': 'nl',
        'belgium': 'be',
        'norway': 'no',
        'finland': 'fi',
        'iceland': 'is',
        'austria': 'at',
        'switzerland': 'ch',
        'portugal': 'pt',
        'ireland': 'ie',
        'poland': 'pl',
        'czechia': 'cz',
        'slovakia': 'sk',
        'hungary': 'hu',
        'slovenia': 'si',
        'croatia': 'hr',
        'bosnia and herzegovina': 'ba',
        'serbia': 'rs',
        'montenegro': 'me',
        'north macedonia': 'mk',
        'albania': 'al',
        'greece': 'gr',
        'bulgaria': 'bg',
        'romania': 'ro',
        'moldova': 'md',
        'ukraine': 'ua',
        'belarus': 'by',
        'russia': 'ru',
        'china': 'cn',
        'japan': 'jp',
        'south korea': 'kr',
        "saudi arabia": "sa",
        "luxembourg": "lu",
        "iran": "ir",
        'israel': 'il',

        // Add more countries as needed
    };

    const lowerCaseCountry = countryName.toLowerCase();
    return countryCodeMap[lowerCaseCountry] || '🏳️';
};

export default countries;
