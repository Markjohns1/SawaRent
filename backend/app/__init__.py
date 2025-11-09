from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from config import config
import os

db = SQLAlchemy()
login_manager = LoginManager()

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    CORS(app, supports_credentials=True)
    
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    
    with app.app_context():
        from app.models import user, tenant, payment, template, sms_log, alert
        
        from app.routes import auth_routes, tenant_routes, payment_routes, dashboard_routes, messaging_routes, mpesa_routes
        
        app.register_blueprint(auth_routes.bp)
        app.register_blueprint(tenant_routes.bp)
        app.register_blueprint(payment_routes.bp)
        app.register_blueprint(dashboard_routes.bp)
        app.register_blueprint(messaging_routes.bp)
        app.register_blueprint(mpesa_routes.bp)
        
        db.create_all()
    
    return app
