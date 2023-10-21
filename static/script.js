var myChart;

document.getElementById('calculate-button').addEventListener('click', myFunction);

function myFunction() {
    let savings_form = document.getElementById('savings-form');

    let starting_investment = parseInt(document.getElementById('starting_investment').value);
    let monthly_investment = parseInt(document.getElementById('monthly_investment').value);
    let saving_duration = parseInt(document.getElementById('saving_duration').value);
    let annual_return_percentage = Number(document.getElementById('annual_return_percentage').value);

    let canvas = document.getElementById('myChart');
    
    //Removes the canvas if it already exists in order to be able to create a new graph
    if (canvas) {
        canvas.remove();
    }

    //Creates a new canvas element for the graph
    var newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('id', 'myChart');
    savings_form.appendChild(newCanvas);

    //Create these variables in order to update them
    const money = document.getElementById('money')
    const investment = document.getElementById("investment")
    const profit = document.getElementById("profit")

    //This sets money, investment and profit to Invalid data if one the inupts isNaN
    if (
        isNaN(starting_investment) ||
        isNaN(monthly_investment) ||
        isNaN(saving_duration) ||
        isNaN(annual_return_percentage)
    ) {
        money.innerText = "Invalid data. Please enter valid numbers.";
        investment.innerText = "Invalid data. Please enter valid numbers.";
        profit.innerText = "Invalid data. Please enter valid numbers.";
        return;
    }
    
    let data = {
        starting_investment: starting_investment,
        monthly_investment: monthly_investment,
        saving_duration: saving_duration,
        annual_return_percentage: annual_return_percentage
    };

    //Options for HTTP request
    let options = { 
        method: 'POST', 
        headers: { 
            'Content-Type':  
                'application/json;charset=utf-8'
        }, 
        body: JSON.stringify(data) 
    } 

    /*Sends HTTP request by fetch to /calculate with the options. 
    When it gets a respone from the backend it changes the text of money, investment, profit and creates a chart*/
    fetch("/calculate", options)
    .then(res => res.json())
    .then(res => {
        if (res["future value"] !== undefined && res["total_investment"] !== undefined && res["profit_made"] !== undefined) {
            money.innerText = `Future Value: ${res["future value"]} kr`;
            investment.innerText = `Total Investment: ${res["total_investment"]} kr`;
            profit.innerText = `Profit Made: ${res["profit_made"]} kr`;
            profit.style.color = 'green';
            createChart(res["graph_data"]);
        } else {
            money.innerText = "Future Value: Not available";
            investment.innerText = "Total Investment: Not available";
            profit.innerText = "Profit Made: Not available";
            profit.style.color = "black"
        }
    })
    .catch(err => console.log(err));
}

//Creates a chart with help from Chart.js. Creates one line that shows fund investments and one line for bank investments
function createChart(data) {
    var ctx = document.getElementById('myChart').getContext('2d');

    //Splits the list such that first half is the fund investment and second half is bank investment
    const fund_investment = data.slice(0, data.length / 2);
    const bank_investment = data.slice(data.length / 2);

    var myChart = new Chart(ctx, {
        type: 'line', 
        data: {
            labels: Array.from({ length: fund_investment.length }, (_, i) => i.toString()),
            datasets: [{
                label: 'Fund Investment',
                data: fund_investment,  
                borderColor: 'rgb(75, 192, 192)',
                fill: false 
            },
            {
                label: 'Bank Investment',
                data: bank_investment,
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
                        text: 'Years'  // Label for x-axis
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Value'  // Label for y-axis
                    }
                }
            }
        }
    });
}