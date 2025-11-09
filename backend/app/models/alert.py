from app import db
from datetime import datetime
import pytz

class Alert(db.Model):
    __tablename__ = 'alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    alert_type = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text, nullable=False)
    severity = db.Column(db.String(20), default='info')
    is_read = db.Column(db.Boolean, default=False)
    related_tenant_id = db.Column(db.Integer, db.ForeignKey('tenants.id'))
    related_payment_id = db.Column(db.Integer, db.ForeignKey('payments.id'))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(pytz.timezone('Africa/Nairobi')))
    
    def to_dict(self):
        return {
            'id': self.id,
            'alert_type': self.alert_type,
            'message': self.message,
            'severity': self.severity,
            'is_read': self.is_read,
            'related_tenant_id': self.related_tenant_id,
            'related_payment_id': self.related_payment_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
