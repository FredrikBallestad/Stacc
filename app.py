import flask, json

from flask import (
    Flask,
    jsonify,
    request,
    render_template, 
)

app = Flask(
    __name__
)

if __name__ == '__main__':
    app.run(port=5001)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        data = request.get_json() #Receives data from Javascript

        starting_investment = data["starting_investment"]
        monthly_investment = data["monthly_investment"]
        saving_duration = data["saving_duration"]
        annual_return_percentage = data["annual_return_percentage"]

        if None in (starting_investment, monthly_investment, saving_duration, annual_return_percentage):
            return jsonify({"error": "Missing or invalid data"}), 400  #Returns an error
        
        future_value = calculate_future_value(starting_investment, monthly_investment, saving_duration, annual_return_percentage)
        total_investment = calculate_total_investment(starting_investment, monthly_investment, saving_duration)
        profit_made = future_value - total_investment

        graph_data = get_graph_data(starting_investment, monthly_investment, saving_duration, annual_return_percentage)

        return jsonify({"future value" : future_value, "total_investment": total_investment, "profit_made" : profit_made, "graph_data": graph_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

#Collects graph data into a list. The first half of the graph_data list is fund investment, while the second half will is bank investment    
def get_graph_data(starting_investment, monthly_investment, saving_duration, annual_return_percentage):
    #First half is data from the fund investment, second part is data from the bank investment
    graph_data = []


    for i in range(saving_duration+1):
        value = calculate_future_value(starting_investment, monthly_investment, i, annual_return_percentage)
        graph_data.append(value)
    
    for i in range(saving_duration+1):
        value = calculate_future_value(starting_investment, monthly_investment, i, 3)
        graph_data.append(value)
    return graph_data

#Calculates future value after x amount of years
def calculate_future_value(starting_investment, monthly_investment, saving_duration, annual_return_percentage):
    annual_return_percentage = annual_return_percentage / 100

    future_value_starting_investment = starting_investment * (1 + annual_return_percentage) ** saving_duration

    future_value_on_monthly_investments = monthly_investment * (1 + annual_return_percentage / 12)
    for i in range(0, (saving_duration * 12 - 1)):
        future_value_on_monthly_investments = (future_value_on_monthly_investments + monthly_investment) * (1 + annual_return_percentage / 12)

    future_value = int(future_value_starting_investment + future_value_on_monthly_investments)
    return future_value

#Calculates total investment
def calculate_total_investment(starting_investment, monthly_investment, saving_duration):
    return starting_investment + monthly_investment *12 * saving_duration