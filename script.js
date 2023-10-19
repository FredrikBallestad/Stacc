let div = document.getElementById('savings-form');

let starting_investment = parseInt(div.dataset('starting_investment'));
let monthly_investment = parseInt(div.dataset('monthly_investment'));
let saving_duration = parseInt(div.dataset('saving_duration'));
let annual_return_percentage = parseFloat(div.dataset('annual_return_percentage'));

const money = document.getElementById('money')

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

fetch("http://127.0.0.1:5000/backend_request", options)  // Endre URL til riktig Flask-rute
    .then(res => res.json())
    .then(res => {
        money.innerText = res["future value"];
    })
    .catch(err => console.log(err));