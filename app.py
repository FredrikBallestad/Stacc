import flask, json
from flask_cors import CORS
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
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate_money', methods=['POST'])
def calculate_profit():
    try:
        data = request.get_json() #Henter data fra Javascript

        starting_investment = data["starting_investment"]
        monthly_investment = data["monthly_investment"]
        saving_duration = data["saving_duration"]
        annual_return_percentage = data["annual_return_percentage"]
        annual_return_percentage = annual_return_percentage / 100

        if None in (starting_investment, monthly_investment, saving_duration, annual_return_percentage):
            return jsonify({"error": "Missing or invalid data"}), 400  # Returner en feilmelding
        
        future_value_starting_investment = starting_investment * (1 + annual_return_percentage) ** saving_duration

        future_value_on_monthly_investments = monthly_investment * (1 + annual_return_percentage/12)
        for i in range(0, (saving_duration*12-1)):
            future_value_on_monthly_investments = (future_value_on_monthly_investments + monthly_investment) * (1 + annual_return_percentage/12)

        future_value = int(future_value_starting_investment + future_value_on_monthly_investments)
        return jsonify({"future value" : future_value})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/calculate_investment', methods=['POST'])
def calculate_investment():
    try:
        data = request.get_json()

        starting_investment = data["starting_investment"]
        monthly_investment = data["monthly_investment"]
        saving_duration = data["saving_duration"]

        if None in (starting_investment, monthly_investment, saving_duration):
            return jsonify({"error": "Missing or invalid data"}), 400  # Returner en feilmelding
        
        total_investment = starting_investment + monthly_investment * 12 * saving_duration
        return jsonify({"total_investment" : total_investment})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)

#    return f"Etter {saving_duration} år vil du ha tjent gitt {future_value} + gitt en avkastning på {annual_return_percentage}%" 
# god kilde: https://www.geeksforgeeks.org/pass-javascript-variables-to-python-in-flask/