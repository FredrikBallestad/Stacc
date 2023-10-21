import flask, json
import math as Math

from flask import (
    Flask,
    jsonify,
    request,
    render_template,  # Legg til render_template her
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
        data = request.get_json() #Henter data fra Javascript

        starting_investment = data["starting_investment"]
        monthly_investment = data["monthly_investment"]
        saving_duration = data["saving_duration"]
        annual_return_percentage = data["annual_return_percentage"]

        if None in (starting_investment, monthly_investment, saving_duration, annual_return_percentage):
            return jsonify({"error": "Missing or invalid data"}), 400  # Returner en feilmelding
        
        future_value = calculate_future_value(starting_investment, monthly_investment, saving_duration, annual_return_percentage)
        total_investment = calculate_total_investment(starting_investment, monthly_investment, saving_duration)
        profit_made = future_value - total_investment

        return jsonify({"future value" : future_value, "total_investment": total_investment, "profit_made" : profit_made})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/generate_graph', methods = ['Post'])
def generate_graph():
    data = request.get_json()

    starting_investment = data["starting_investment"]
    monthly_investment = data["monthly_investment"]
    saving_duration = data["saving_duration"]
    annual_return_percentage = data["annual_return_percentage"]

    if None in (starting_investment, monthly_investment, saving_duration, annual_return_percentage):
            return jsonify({"error": "Missing or invalid data"}), 400  # Returner en feilmelding
    
    graph_data = get_graph_data(starting_investment, monthly_investment, saving_duration, annual_return_percentage)

    return jsonify(graph_data)

#Samler grafdata til en liste. Første halvdel av listen er fondsinvestering, mens andre havldel vil være en bankinvestering    
def get_graph_data(starting_investment, monthly_investment, saving_duration, annual_return_percentage):
    #First half is data from the fund investment, second part is the bank investment
    graph_data = []

    for i in range(saving_duration+1):
        value = calculate_future_value(starting_investment, monthly_investment, i, annual_return_percentage)
        graph_data.append(value)
    
    for i in range(saving_duration+1):
        value = calculate_future_value(starting_investment, monthly_investment, i, 2)
        graph_data.append(value)
    return graph_data

#Kalkulerer fremtidig verdi etter x antall år
def calculate_future_value(starting_investment, monthly_investment, saving_duration, annual_return_percentage):
    annual_return_percentage = annual_return_percentage / 100

    future_value_starting_investment = starting_investment * (1 + annual_return_percentage) ** saving_duration

    future_value_on_monthly_investments = monthly_investment * (1 + annual_return_percentage / 12)
    for i in range(0, (saving_duration * 12 - 1)):
        future_value_on_monthly_investments = (future_value_on_monthly_investments + monthly_investment) * (1 + annual_return_percentage / 12)

    future_value = int(future_value_starting_investment + future_value_on_monthly_investments)
    return future_value

#Kalkulerer total investering
def calculate_total_investment(starting_investment, monthly_investment, saving_duration):
    return starting_investment + monthly_investment *12 * saving_duration