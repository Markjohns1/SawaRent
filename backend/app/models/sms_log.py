from app import db
from datetime import datetime
import pytz

class SMSLog(db.Model):
    __tablename__ = 'sms_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    recipient_phone = db.Column(db.String(20), nullable=False)
    recipient_name = db.Column(db.String(120))
    message = db.Column(db.Text, nullable=False)
    message_type = db.Column(db.String(50))
    status = db.Column(db.String(20), default='pending')
    sent_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    sent_at = db.Column(db.DateTime, default=lambda: datetime.now(pytz.timezone('Africa/Nairobi')))
    
    def to_dict(self):
        return {
            'id': self.id,
            'recipient_phone': self.recipient_phone,
            'recipient_name': self.recipient_name,
            'message': self.message,
            'message_type': self.message_type,
            'status': self.status,
            'sent_by': self.sent_by,
            'sent_at': self.sent_at.isoformat() if self.sent_at else None
        }
