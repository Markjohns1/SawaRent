from flask import current_app
from app.models.template import Template
from app import db

class MessagingService:
    def __init__(self):
        self.provider = current_app.config.get('SMS_PROVIDER', 'twilio')
    
    def send_sms(self, phone, message, recipient_name=''):
        if self.provider == 'twilio':
            return self._send_via_twilio(phone, message)
        else:
            current_app.logger.info(f'SMS to {phone} ({recipient_name}): {message}')
            return True
    
    def _send_via_twilio(self, phone, message):
        try:
            from twilio.rest import Client
            
            account_sid = current_app.config.get('TWILIO_ACCOUNT_SID')
            auth_token = current_app.config.get('TWILIO_AUTH_TOKEN')
            from_phone = current_app.config.get('TWILIO_PHONE_NUMBER')
            
            if not all([account_sid, auth_token, from_phone]):
                current_app.logger.warning('Twilio credentials not configured. SMS not sent.')
                return False
            
            client = Client(account_sid, auth_token)
            
            message = client.messages.create(
                body=message,
                from_=from_phone,
                to=phone
            )
            
            return True
        except Exception as e:
            current_app.logger.error(f'Failed to send SMS via Twilio: {str(e)}')
            return False
    
    def send_payment_receipt(self, payment, tenant):
        template = Template.query.filter_by(
            category='receipt',
            theme='formal',
            is_active=True
        ).first()
        
        if template:
            message = template.render(
                tenant_name=tenant.full_name,
                unit_number=tenant.unit_number,
                amount=payment.amount,
                payment_date=payment.payment_date.strftime('%d/%m/%Y'),
                remaining_amount=payment.remaining_amount,
                transaction_reference=payment.transaction_reference or 'N/A'
            )
        else:
            message = f'Receipt: Payment of KES {payment.amount} received for Unit {tenant.unit_number} on {payment.payment_date.strftime("%d/%m/%Y")}.'
            if payment.remaining_amount > 0:
                message += f' Remaining balance: KES {payment.remaining_amount}.'
        
        return self.send_sms(tenant.phone, message, tenant.full_name)
    
    def send_rent_reminder(self, tenant, remaining_amount=None):
        template = Template.query.filter_by(
            category='reminder',
            is_active=True
        ).first()
        
        if template:
            message = template.render(
                tenant_name=tenant.full_name,
                unit_number=tenant.unit_number,
                remaining_amount=remaining_amount or tenant.expected_rent
            )
        else:
            message = f'Reminder: Rent of KES {remaining_amount or tenant.expected_rent} is due for Unit {tenant.unit_number}.'
        
        return self.send_sms(tenant.phone, message, tenant.full_name)
