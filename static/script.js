var myChart;

document.getElementById('calculate-button').addEventListener('click', myFunction);

function myFunction() {
    let div = document.getElementById('savings-form');

    let starting_investment = parseInt(document.getElementById('starting_investment').value);
    let monthly_investment = parseInt(document.getElementById('monthly_investment').value);
    let saving_duration = parseInt(document.getElementById('saving_duration').value);
    let annual_return_percentage = parseInt(document.getElementById('annual_return_percentage').value);

    let canvas = document.getElementById('myChart');
    // Først, fjern eksisterende canvas-element
    if (canvas) {
        canvas.remove();
    }

    // Opprett et nytt canvas-element
    var newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('id', 'myChart');
    div.appendChild(newCanvas);


    const money = document.getElementById('money')
    const investment = document.getElementById("investment")
    const profit = document.getElementById("profit")

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

    fetch("/calculate_profit", options)
    .then(res => res.json())
    .then(res => {
        console.log(res);
        if (res && res["profit_made"] !== undefined) {
            profit.innerText = `Profit Made: ${res["profit_made"]} kr`;
        } else {
            profit.innerText = "Profit Made: Not available";
        }
    })
    .catch(err => console.log(err));

    fetch('/generate_graph', options)  
    .then(response => response.json())  
    .then(data => {
        createChart(data);
    })
    .catch(error => console.log(error));
}

function createChart(data) {
    var ctx = document.getElementById('myChart').getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'line',  // Du kan velge riktig graf-type (linje, stolpe, osv.)
        data: {
            labels: Array.from({ length: data.length }, (_, i) => i.toString()),
            datasets: [{
                label: 'Future Value',
                data: data,  // Dette er dataene du mottar fra backend
                borderColor: 'rgb(75, 192, 192)',
                fill: false  // Du kan justere grafstilen her
            }]
        },
        options: {
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Years'  // Label for x-aksen
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Value'  // Label for y-aksen
                    }
                }
            }
        }
    });
}