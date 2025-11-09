from app import db
from datetime import datetime
import pytz

class Template(db.Model):
    __tablename__ = 'templates'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    theme = db.Column(db.String(20), nullable=False)
    content = db.Column(db.Text, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(pytz.timezone('Africa/Nairobi')))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(pytz.timezone('Africa/Nairobi')), onupdate=lambda: datetime.now(pytz.timezone('Africa/Nairobi')))
    
    def render(self, **kwargs):
        content = self.content
        for key, value in kwargs.items():
            placeholder = '{' + key + '}'
            content = content.replace(placeholder, str(value))
        return content
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'theme': self.theme,
            'content': self.content,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
