import requests
from flask import current_app
from app.models.tenant import Tenant
from datetime import datetime
import base64

class MPesaService:
    def __init__(self):
        self.consumer_key = current_app.config['MPESA_CONSUMER_KEY']
        self.consumer_secret = current_app.config['MPESA_CONSUMER_SECRET']
        self.shortcode = current_app.config['MPESA_SHORTCODE']
        self.passkey = current_app.config['MPESA_PASSKEY']
        self.callback_url = current_app.config['MPESA_CALLBACK_URL']
        self.environment = current_app.config['MPESA_ENVIRONMENT']
        
        if self.environment == 'sandbox':
            self.base_url = 'https://sandbox.safaricom.co.ke'
        else:
            self.base_url = 'https://api.safaricom.co.ke'
    
    def get_access_token(self):
        url = f'{self.base_url}/oauth/v1/generate?grant_type=client_credentials'
        
        try:
            response = requests.get(url, auth=(self.consumer_key, self.consumer_secret))
            response.raise_for_status()
            return response.json().get('access_token')
        except Exception as e:
            current_app.logger.error(f'Failed to get M-PESA access token: {str(e)}')
            return None
    
    def initiate_stk_push(self, phone, amount, account_reference):
        access_token = self.get_access_token()
        if not access_token:
            return None
        
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password = base64.b64encode(
            f'{self.shortcode}{self.passkey}{timestamp}'.encode()
        ).decode('utf-8')
        
        headers = {'Authorization': f'Bearer {access_token}'}
        
        payload = {
            'BusinessShortCode': self.shortcode,
            'Password': password,
            'Timestamp': timestamp,
            'TransactionType': 'CustomerPayBillOnline',
            'Amount': int(amount),
            'PartyA': phone,
            'PartyB': self.shortcode,
            'PhoneNumber': phone,
            'CallBackURL': self.callback_url,
            'AccountReference': account_reference,
            'TransactionDesc': 'Rent Payment'
        }
        
        url = f'{self.base_url}/mpesa/stkpush/v1/processrequest'
        
        try:
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()
            return response.json().get('CheckoutRequestID')
        except Exception as e:
            current_app.logger.error(f'Failed to initiate STK push: {str(e)}')
            return None
    
    def process_callback(self, callback_data):
        try:
            result_code = callback_data.get('Body', {}).get('stkCallback', {}).get('ResultCode')
            
            if result_code != 0:
                return None
            
            callback_metadata = callback_data.get('Body', {}).get('stkCallback', {}).get('CallbackMetadata', {}).get('Item', [])
            
            amount = None
            phone = None
            transaction_id = None
            
            for item in callback_metadata:
                if item.get('Name') == 'Amount':
                    amount = item.get('Value')
                elif item.get('Name') == 'PhoneNumber':
                    phone = str(item.get('Value'))
                elif item.get('Name') == 'MpesaReceiptNumber':
                    transaction_id = item.get('Value')
            
            if not all([amount, phone, transaction_id]):
                return None
            
            tenant = self.match_tenant(phone)
            
            return {
                'amount': amount,
                'phone': phone,
                'transaction_id': transaction_id,
                'tenant': tenant
            }
        except Exception as e:
            current_app.logger.error(f'Failed to process M-PESA callback: {str(e)}')
            return None
    
    def match_tenant(self, phone):
        normalized_phone = phone.replace('+', '').replace(' ', '')
        
        tenants = Tenant.query.filter_by(is_active=True).all()
        
        for tenant in tenants:
            tenant_phone = tenant.phone.replace('+', '').replace(' ', '')
            if tenant_phone.endswith(normalized_phone[-9:]) or normalized_phone.endswith(tenant_phone[-9:]):
                return tenant
        
        return None
