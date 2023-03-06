from flask_sqlalchemy import SQLAlchemy
import uuid

db = SQLAlchemy()

def random_uuid():
    return str(uuid.uuid4())

class User(db.Model):
    id = db.Column(db.String(100), primary_key=True, default=random_uuid)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }