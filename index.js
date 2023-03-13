let countries = [];
const grid = document.getElementById('grid-container');
grid.innerHTML = '';

let regionFilterOpen = false;
let regionFilterValue = null;

let theme = 'light';

const init = function () {
    initCountries();
    initFilters();
    initThemeMod();
}

const initCountries = function () {
    countries = localStorage.getItem("countries");

    if (countries == null) {
        // get api response with countries
    
        console.log('get api response with countries')
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function() {
            localStorage.setItem("countries", this.responseText);
            countries = JSON.parse(this.responseText);
    
            renderCountries(countries)
        }
        xhttp.open("GET", "https://restcountries.com/v3.1/all");
        xhttp.send();
    
    } else {
        // get countries from localstorage
        console.log('get countries from localstorage')
    
        countries = JSON.parse(countries)
        renderCountries(countries)
    }
}

const initThemeMod = function () {
    const themeSwitch = document.getElementById('theme-switcher-control');
    const themeSwitchLabel = document.getElementById('theme-switcher-label');

    theme = localStorage.getItem("theme");

    if (theme == null) {
        theme = 'light';
        document.body.classList.remove('theme-mode--light');
        document.body.classList.remove('theme-mode--dark');

        document.body.classList.add('theme-mode--' + theme);
        localStorage.setItem("theme", theme);
    } else {
        document.body.classList.remove('theme-mode--light');
        document.body.classList.remove('theme-mode--dark');

        document.body.classList.add('theme-mode--' + theme);
    }

    if (theme == 'light') {
        themeSwitchLabel.innerHTML = 'Dark Mode';
    } else {
        themeSwitchLabel.innerHTML = 'Light Mode';
    }

    if (themeSwitch && themeSwitchLabel) {
        themeSwitch.addEventListener('click', function () {
            if (theme == 'light') {
                theme = 'dark';
                themeSwitchLabel.innerHTML = 'Light Mode';
            } else {
                theme = 'light';
                themeSwitchLabel.innerHTML = 'Dark Mode';
            }

            document.body.classList.remove('theme-mode--light');
            document.body.classList.remove('theme-mode--dark');
            document.body.classList.add('theme-mode--' + theme);
            localStorage.setItem("theme", theme);
        })
    }
}

const renderCountries = function (localCountries, filters=null) {
    grid.innerHTML = '';
    let filteredCountries = JSON.parse(JSON.stringify(localCountries));
    
    if (filters) {
        if (filters.region) {
            filteredCountries = localCountries.filter(x => x.region == filters.region)
        }
        if (filters.name) {
            filteredCountries = localCountries.filter(x => x.name.common.toLowerCase().includes(filters.name.toLowerCase()))
        }
    }
    
    filteredCountries.forEach(country => {
        grid.appendChild(createCountryCard(country))
    });
}

const createCountryCard = function (country) {
    let demo = `                <a class="card" href="#">
                                    <div class="card__header">
                                        <img class="card__image" src="https://flagcdn.com/w320/dz.png" alt="">
                                    </div>
                                    <div class="card__body">
                                        <h2 class="card__title">
                                            Algeria
                                        </h2>
                                        <div class="card__details">
                                            <div class="country-statistic">
                                                <div class="country-statistic__label">
                                                    Population:
                                                </div>
                                                <div class="country-statistic__value">
                                                    323,947,000
                                                </div>
                                            </div>
                                            <div class="country-statistic">
                                                <div class="country-statistic__label">
                                                    Region:
                                                </div>
                                                <div class="country-statistic__value">
                                                    Americas
                                                </div>
                                            </div>
                                            <div class="country-statistic">
                                                <div class="country-statistic__label">
                                                    Capital:
                                                </div>
                                                <div class="country-statistic__value">
                                                    Washington, D.C.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>`

    let card = document.createElement("a");
    card.className = 'card';
    card.href = window.location.origin + '/word-countries/single.html?country=' + country.cca3;

    let cardHeader = document.createElement('div');
    cardHeader.className = 'card__header';

    let cardImage = document.createElement('img');
    cardImage.className = 'card__image';
    cardImage.src = country.flags.png;
    if (country.flags.alt) {
        cardImage.alt = country.flags.alt;
    }

    cardHeader.appendChild(cardImage);
 

    let cardBody = document.createElement('div');
    cardBody.className = 'card__body';
    let cardTitle = document.createElement('h2');
    cardTitle.className = 'card__title';
    cardTitle.innerHTML = country.name.common;
    
    let cardDetails = document.createElement('div');
    cardDetails.className = 'card__details';

    let cardStatisticsFields = [
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
            tag: 'capital',
            label: 'Capital:',
            type: 'array'
        }
    ];
    cardStatisticsFields.forEach(stat => {
        let elRow = document.createElement('div')
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
        elValue.innerHTML = value

        elRow.appendChild(elLabel);
        elRow.appendChild(elValue);
        cardDetails.appendChild(elRow)
    });

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardDetails);

    card.appendChild(cardHeader);
    card.appendChild(cardBody);

    return card;
}

const openRegionList = function (regionOptions) {
    regionOptions.classList.add('active');
    setTimeout(() => {
        regionOptions.classList.add('visible');
    }, 100)
    regionFilterOpen = true;
}

const closeRegionList = function (regionOptions) {
    regionOptions.classList.remove('visible');
    setTimeout(() => {
        regionOptions.classList.remove('active');
    }, 600)
    regionFilterOpen = false;
}

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

const resetRegionFilter = function () {
    regionFilter.querySelector('.region-filter-value').innerHTML = 'Filter by Region';
}

const regionFilter = document.getElementById('region-filter');
const regionOptions = document.getElementById('region-options');
const nameSearchFilter = document.getElementById('name-search-filter');

const inputEventCb = () => {
    resetRegionFilter()
    // filter the countries
    renderCountries(countries, {name: nameSearchFilter.value})
}; 
const debouncedCb = debounce(inputEventCb, 1000);

const initFilters = function () {
    if (regionFilter && regionOptions) {
        regionFilter.addEventListener("click", function () {
            if (!regionFilterOpen) {
                openRegionList(regionOptions);
            } else {
                closeRegionList(regionOptions);
            }
        })

        for (let i = 0; i < regionOptions.children.length; i++) {
            regionOptions.children[i].addEventListener("click", function (e) {

                regionFilterValue = e.target.dataset.region;
                regionFilter.querySelector('.region-filter-value').innerHTML = '<b>Region</b>: ' + regionFilterValue;
                closeRegionList(regionOptions);

                // filter the countries
                renderCountries(countries, {region: regionFilterValue})
            })
        }
    }

    if (nameSearchFilter) {
        nameSearchFilter.addEventListener("input", debouncedCb)
    }
}

document.body.onload = init;
