import flask, json
from flask_cors import CORS

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

@app.route('/backend_request', methods=['POST'])
def backend_request():
    try:
        data = request.get_json() #Henter data fra Javascript

        starting_investment = data["starting_investment"]
        monthly_investment = data["monthly_investment"]
        saving_duration = data["saving_duration"]
        annual_return_percentage = data["annual_return_percentage"]

        if None in (starting_investment, monthly_investment, saving_duration, annual_return_percentage):
            return jsonify({"error": "Missing or invalid data"}), 400  # Returner en feilmelding

        future_value = (starting_investment * (1 + annual_return_percentage / 100) ** saving_duration) + (monthly_investment * saving_duration * 12 * annual_return_percentage / 12)
        return jsonify({"future value" : future_value})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(port=5001)

#    return f"Etter {saving_duration} år vil du ha tjent gitt {future_value} + gitt en avkastning på {annual_return_percentage}%" 
# god kilde: https://www.geeksforgeeks.org/pass-javascript-variables-to-python-in-flask/