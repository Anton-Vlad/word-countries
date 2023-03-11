let countries = [];
const grid = document.getElementById('grid-container');
grid.innerHTML = '';


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
        console.log(countries)
    }
}

const renderCountries = function (localCountries) {
    localCountries.forEach(country => {
        createCountryCard(country)
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
    card.href = '/single-view?country=' + country.cca3;

    let cardHeader = document.createElement('div');
    cardHeader.className = 'card__header';

    let cardImage = document.createElement('img');
    cardImage.className = 'card__image';
    cardImage.src = country.flags.png;

    cardHeader.appendChild(cardImage);
 

    let cardBody = document.createElement('div');
    cardBody.className = 'card__body';
    let cardTitle = document.createElement('h2');
    cardTitle.className = 'card__title';
    cardTitle.innerHTML = country.name.official;
    
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
    grid.appendChild(card);
}

document.body.onload = initCountries;
