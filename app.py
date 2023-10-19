import flask, json

from flask import (
    Flask,
    jsonify,
    request,
    render_template,  # Legg til render_template her
)

'''#from datetime import date
#from http import HTTPStatus
#from typing import Any
from flask import (
    Flask,
    abort,
    g,
    jsonify,
    redirect,
    request,
    send_from_directory,
    make_response,
    render_template,
    session,
    url_for,
)'''


app = Flask(
    __name__
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/backend_request', methods=['POST'])
def backend_request():
    data = request.get_json() #Henter data fra Javascript

    starting_investment = data["starting_investment"]
    monthly_investment = data["monthly_investment"]
    saving_duration = data["saving_duration"]
    annual_return_percentage = data["annual_return_percentage"]

    future_value = (starting_investment * (1 + annual_return_percentage / 100) ** saving_duration) + (monthly_investment * saving_duration * 12 * annual_return_percentage / 12)
    return jsonify({"future value" : future_value})

#    return f"Etter {saving_duration} år vil du ha tjent gitt {future_value} + gitt en avkastning på {annual_return_percentage}%" 
# god kilde: https://www.geeksforgeeks.org/pass-javascript-variables-to-python-in-flask/