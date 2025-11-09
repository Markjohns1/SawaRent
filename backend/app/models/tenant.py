from app import db
from datetime import datetime
import pytz

class Tenant(db.Model):
    __tablename__ = 'tenants'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120))
    unit_number = db.Column(db.String(20), nullable=False)
    expected_rent = db.Column(db.Float, nullable=False)
    deposit_amount = db.Column(db.Float, default=0.0)
    lease_start_date = db.Column(db.Date, nullable=False)
    lease_end_date = db.Column(db.Date, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(pytz.timezone('Africa/Nairobi')))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(pytz.timezone('Africa/Nairobi')), onupdate=lambda: datetime.now(pytz.timezone('Africa/Nairobi')))
    
    payments = db.relationship('Payment', backref='tenant', lazy=True, cascade='all, delete-orphan')
    
    def get_initials(self):
        parts = self.full_name.split()
        return ''.join([p[0].upper() for p in parts if p])
    
    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'phone': self.phone,
            'email': self.email,
            'unit_number': self.unit_number,
            'expected_rent': self.expected_rent,
            'deposit_amount': self.deposit_amount,
            'lease_start_date': self.lease_start_date.isoformat() if self.lease_start_date else None,
            'lease_end_date': self.lease_end_date.isoformat() if self.lease_end_date else None,
            'is_active': self.is_active,
            'notes': self.notes,
            'initials': self.get_initials(),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
