"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, make_response
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
import uuid
import re
from  werkzeug.security import generate_password_hash, check_password_hash
import json


api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/login', methods =['POST'])
def login():
    # creates dictionary of form data
    auth = request.json

    if not auth or not auth.get('email') or not auth.get('password'):
        # devuelve 401 si falta algún correo electrónico o contraseña
        return make_response(
            'Could not verify',
            401,
            {'WWW-Authenticate' : 'Basic realm ="¡Se requiere iniciar sesión !!"'}
            )

    user = User.query\
        .filter_by(email = auth.get('email'))\
        .first()

    if not user:
        # devuelve 401 si el usuario no existe
        return make_response(
            'Could not verify',
            401,
            {'WWW-Authenticate' : 'Basic realm ="Usuario o contraseña incorrectos !!"'}
        )

    if check_password_hash(user.password, auth.get('password')):
        # genera el token JWT
        access_token = create_access_token(identity=user.id)
        return json.dumps({ "token": access_token, "user_id": user.id }), 200
    # devuelve 403 si la contraseña es incorrecta
    return make_response(
        'Could not verify',
        403,
        {'WWW-Authenticate' : 'Basic realm ="Usuario o contraseña incorrectos !!"'}
    )

@api.route('/users', methods=['GET'])
def get_users_table():
    user = User.query.all()
    user = list(map(lambda p:p.serialize(),user))
    return jsonify(user), 200 

@api.route('/users', methods=['POST'])
def create_user():
    request_body = request.get_json()
    email = request_body.get("email")
    password = request_body.get("password")
    errors = {}
    if not email or not re.match(r"^(([^<>()[\],;:\s@']+(\.[^<>()[\],;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$", email):
        errors["email"] = "Invalid email address"
    if not password or not re.match(r"^(?=.*[0-9])(?=.*[!@#$%^&*.,])[a-zA-Z0-9!@#$%^&*.,]{6,16}$", password):
        errors["password"] = "Contraseña debe contener al menos 6 caracteres, Una mayuscula, Una Minuscula, Un Numero y Un Caracter Especial"
    if errors:
        return jsonify(errors), 400
    else:
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return make_response('El usuario ya existe. Inicie sesión', 202)
        else:
            # Create new user and add to database
            new_user = User(**request_body)
            new_user.password = generate_password_hash(password)
            db.session.add(new_user)
            db.session.commit()
            return jsonify(new_user.serialize()), 201