document.getElementById('calculate-button').addEventListener('click', myFunction);

function myFunction() {
    let div = document.getElementById('savings-form');

    let starting_investment = parseInt(document.getElementById('starting_investment').value);
    let monthly_investment = parseInt(document.getElementById('monthly_investment').value);
    let saving_duration = parseInt(document.getElementById('saving_duration').value);
    let annual_return_percentage = parseInt(document.getElementById('annual_return_percentage').value);


    const money = document.getElementById('money')
    const investment = document.getElementById("investment")

    if (
        isNaN(starting_investment) ||
        isNaN(monthly_investment) ||
        isNaN(saving_duration) ||
        isNaN(annual_return_percentage)
    ) {
        money.innerText = "Invalid data. Please enter valid numbers.";
        return; // Avbryt hvis dataene er ugyldige
    }


    let data = {
        starting_investment: starting_investment,
        monthly_investment: monthly_investment,
        saving_duration: saving_duration,
        annual_return_percentage: annual_return_percentage
    };

    let options = { 
        method: 'POST', 
        headers: { 
            'Content-Type':  
                'application/json;charset=utf-8'
        }, 
        body: JSON.stringify(data) 
    } 

    fetch("/calculate_money", options)
    .then(res => res.json())
    .then(res => {
        console.log(res);
        if (res && res["future value"] !== undefined) {
            money.innerText = `Future Value: ${res["future value"]} kr`;
        } else {
            money.innerText = "Future Value: Not available";
        }
    })
    .catch(err => console.log(err));

    fetch("/calculate_investment", options)
    .then(res => res.json())
    .then(res => {
        console.log(res);
        if (res && res["total_investment"] !== undefined) {
            investment.innerText = `Total Investment: ${res["total_investment"]} kr`;
        } else {
            investment.innerText = "Total Investment: Not available";
        }
    })
    .catch(err => console.log(err));


    /*
    fetch("/backend_request", options)  // Endre URL til riktig Flask-rute
        .then(res => res.json())
        .then(res => {
            money.innerText = `Future Value: ${res["future value"]}`;
        })
        .catch(err => console.log(err));*/
}
