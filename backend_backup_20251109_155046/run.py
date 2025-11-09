from app import create_app, db
from app.models.user import User
from app.models.tenant import Tenant
from app.models.payment import Payment
from app.models.template import Template
from app.models.sms_log import SMSLog
from app.models.alert import Alert
import os

app = create_app(os.getenv('FLASK_ENV', 'development'))

@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'User': User,
        'Tenant': Tenant,
        'Payment': Payment,
        'Template': Template,
        'SMSLog': SMSLog,
        'Alert': Alert
    }

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    app.run(host='0.0.0.0', port=8000, debug=True)
