var myChart;

document.getElementById('calculate-button').addEventListener('click', myFunction);

function myFunction() {
    let div = document.getElementById('savings-form');

    let starting_investment = parseInt(document.getElementById('starting_investment').value);
    let monthly_investment = parseInt(document.getElementById('monthly_investment').value);
    let saving_duration = parseInt(document.getElementById('saving_duration').value);
    let annual_return_percentage = parseFloat(document.getElementById('annual_return_percentage').value);

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

    fetch("/calculate", options)
    .then(res => res.json())
    .then(res => {
        console.log(res);
        if (res["future value"] !== undefined && res["total_investment"] !== undefined && res["profit_made"] !== undefined) {
            money.innerText = `Future Value: ${res["future value"]} kr`;
            investment.innerText = `Total Investment: ${res["total_investment"]} kr`;
            profit.innerText = `Profit Made: ${res["profit_made"]} kr`;
            profit.style.color = 'green';
        } else {
            money.innerText = "Future Value: Not available";
            investment.innerText = "Total Investment: Not available";
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

    //Her splittes listen slik at første halvdel er fondsinvesteringen og andre halvdel er bankinvesteringen
    const fundInvestment = data.slice(0, data.length / 2);
    const bankInvestment = data.slice(data.length / 2);

    var myChart = new Chart(ctx, {
        type: 'line', 
        data: {
            labels: Array.from({ length: fundInvestment.length }, (_, i) => i.toString()),
            datasets: [{
                label: 'Fund Investment',
                data: fundInvestment,  
                borderColor: 'rgb(75, 192, 192)',
                fill: false 
            },
            {
                label: 'Bank Investment',
                data: bankInvestment,
                borderColor: 'rgb(192, 75, 75)',
                fill: false
            }

        ]
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