let countries = [];
let singleCountryCode = '';

let theme = 'light';

const init = function () {
    initCountries();
    initThemeMod();
}

const initThemeMod = function () {
    theme = localStorage.getItem("theme");

    if (theme == null) {
        theme = 'light';
        document.body.classList.remove('theme-mode--light');
        document.body.classList.remove('theme-mode--dark');

        document.body.classList.add('theme-mode--' + theme);
        localStorage.setItem("theme", 'light');
    } else {
        document.body.classList.remove('theme-mode--light');
        document.body.classList.remove('theme-mode--dark');

        document.body.classList.add('theme-mode--' + theme);
    }
}

const initCountries = function () {
    countries = localStorage.getItem("countries");

    singleCountryCode = window.location.search;

    if (singleCountryCode && singleCountryCode.length > 0) {
        singleCountryCode = singleCountryCode.replace('?country=', '');
    }

    if (countries == null) {
        // get api response with countries
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function() {
            localStorage.setItem("countries", this.responseText);
            countries = JSON.parse(this.responseText);
    
            renderCountry(countries)
        }
        xhttp.open("GET", "https://restcountries.com/v3.1/all");
        xhttp.send();
    
    } else {
        // get countries from localstorage
        countries = JSON.parse(countries)
        renderCountry(countries)
    }
}

const renderCountry = function (localCountries) {
    
    
    localCountries.forEach(country => {
        if (country.cca3 == singleCountryCode) {
            createCountryPage(country)
            return;
        }
    });
}

const createCountryPage = function (country) {
    console.log('COUNTRY', country)

    const countryFlagEl = document.getElementById('the-country-flag');
    countryFlagEl.src = country.flags.svg;
    if (country.flags.alt) {
        countryFlagEl.alt = country.flags.alt;
    }

    const countryTitleEl = document.getElementById('the-country-title');
    countryTitleEl.innerHTML = country.name.common;

    const countryDetailsEl = document.getElementById('the-country-details');
    countryDetailsEl.innerHTML = '';
    let countrydStatisticsFields = [
        {
            tag: 'name',
            label: 'Native Name:',
            type: 'nativeName'
        }, 
        {
            tag: 'population',
            label: 'Population:',
            type: 'number'
        },
        {
            tag: 'region',
            label: 'Region:',
            type: 'string'
        },
        {
            tag: 'subregion',
            label: 'Sub Region:',
            type: 'string'
        },
        {
            tag: 'capital',
            label: 'Capital:',
            type: 'array'
        },
        {
            tag: 'tld',
            label: 'Top Level Domain:',
            type: 'array'
        },
        {
            tag: 'currencies',
            label: 'Currencies:',
            type: 'currencies',
        },
        {
            tag: 'languages',
            label: 'Languages:',
            type: 'languages',
        },
    ];
    countrydStatisticsFields.forEach(stat => {

        if (country[stat.tag]) {
            let elRow = document.createElement('li')
            elRow.className = 'country-statistic'

            let elLabel = document.createElement('div')
            elLabel.className = 'country-statistic__label'
            elLabel.innerHTML = stat.label
        
            let elValue = document.createElement('div')
            elValue.className = 'country-statistic__value'
            let value = '';
            if (stat.type == 'array') {
                value = (country[stat.tag] ? country[stat.tag][0] : '');
            }
            if (stat.type == 'string') {
                value = country[stat.tag];
            }
            if (stat.type == 'number') {
                value = country[stat.tag];
                value = new Intl.NumberFormat('en-US', {}).format(value)
            }
            if (stat.type == 'nativeName') {
                let names = Object.values(country.name.nativeName);
                value = [];
                if (names && names.length > 0) {
                    names.forEach(element => {
                        if (value.length < 2) {
                            value.push(element.common)
                        }
                    });

                    value = value.join(', ');
                }
            }
            if (stat.type == 'currencies') {
                let curr = Object.values(country.currencies);
                value = (curr && curr.length > 0 ? curr[0].name : 'Unknown');
            }
            if (stat.type == 'languages') {
                let langs = Object.values(country.languages);
                value = [];
                if (langs && langs.length > 0) {
                    langs.forEach(element => {
                        value.push(element)
                    });

                    value = value.join(', ');
                    elValue.classList.add('overflow-text')
                    elValue.title = value
                }
            }
            elValue.innerHTML = value

            elRow.appendChild(elLabel);
            elRow.appendChild(elValue);
            countryDetailsEl.appendChild(elRow)
        }
    });

    const bordersEl = document.getElementById('the-country-borders');
    bordersEl.innerHTML = '';

    let borderCountries = country.borders;
    if (borderCountries) {
        borderCountries.forEach(bCode => {
            //get the country name, from the country code
            let c = countries.filter(x => x.cca3 == bCode);
            if (c && c.length) {
                let elButton = document.createElement('a')
                elButton.className = 'button'
                elButton.href = window.location.origin + window.location.pathname + '/single.html?country=' + c[0].cca3;
                elButton.innerHTML = c[0].name.common;
    
                bordersEl.appendChild(elButton);
            }
        });
    } else {
        bordersEl.innerHTML = '<span style="padding-top: 10px;">No neighbors</span>';
    }
};


document.body.onload = init;