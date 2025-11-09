from app import db
from datetime import datetime
import pytz

class Payment(db.Model):
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenants.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.Date, nullable=False)
    payment_method = db.Column(db.String(20), nullable=False)
    payment_status = db.Column(db.String(20), nullable=False)
    transaction_reference = db.Column(db.String(100))
    remaining_amount = db.Column(db.Float, default=0.0)
    notes = db.Column(db.Text)
    logged_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    receipt_sent = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(pytz.timezone('Africa/Nairobi')))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(pytz.timezone('Africa/Nairobi')), onupdate=lambda: datetime.now(pytz.timezone('Africa/Nairobi')))
    
    def calculate_status(self, expected_rent):
        if self.amount >= expected_rent:
            self.payment_status = 'Full'
            self.remaining_amount = 0.0
        else:
            self.payment_status = 'Partial'
            self.remaining_amount = expected_rent - self.amount
    
    def to_dict(self):
        return {
            'id': self.id,
            'tenant_id': self.tenant_id,
            'amount': self.amount,
            'payment_date': self.payment_date.isoformat() if self.payment_date else None,
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'transaction_reference': self.transaction_reference,
            'remaining_amount': self.remaining_amount,
            'notes': self.notes,
            'logged_by': self.logged_by,
            'receipt_sent': self.receipt_sent,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
