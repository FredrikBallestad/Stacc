let div = document.getElementById('savings-form');

let starting_investment = div.dataset('starting_investment');
let monthly_investment = div.dataset('monthly_investment');
let saving_duration = div.dataset('saving_duration');
let annual_return_percentage = div.dataset('annual_return_percentage');

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

let fetchRes = fetch( 
    "file://wsl.localhost/Ubuntu/home/fredrik/Stacc/Stacc/index.html", options); 

            fetchRes.then(res => 
                res.json()).then(data => { 
                    console.log(data) 
                }) 
