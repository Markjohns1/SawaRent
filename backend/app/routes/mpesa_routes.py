from flask import Blueprint, request, jsonify
from flask_login import login_required
from app import db
from app.models.payment import Payment
from app.models.tenant import Tenant
from app.models.alert import Alert
from app.services.mpesa_service import MPesaService
from app.utils.decorators import admin_or_caretaker_required
from datetime import datetime

bp = Blueprint('mpesa', __name__, url_prefix='/api/mpesa')

@bp.route('/callback', methods=['POST'])
def mpesa_callback():
    data = request.get_json()
    
    mpesa_service = MPesaService()
    result = mpesa_service.process_callback(data)
    
    if result:
        tenant = result.get('tenant')
        if tenant:
            payment = Payment(
                tenant_id=tenant.id,
                amount=result['amount'],
                payment_date=datetime.now().date(),
                payment_method='M-PESA',
                transaction_reference=result['transaction_id']
            )
            
            payment.calculate_status(tenant.expected_rent)
            
            db.session.add(payment)
            
            alert = Alert(
                alert_type='mpesa_payment_received',
                message=f'M-PESA payment of KES {payment.amount} received from {tenant.full_name}',
                severity='success',
                related_tenant_id=tenant.id,
                related_payment_id=payment.id
            )
            db.session.add(alert)
            
            db.session.commit()
            
            return jsonify({'message': 'Payment processed successfully'}), 200
        else:
            alert = Alert(
                alert_type='mpesa_unmatched',
                message=f'Unmatched M-PESA payment of KES {result["amount"]} from {result["phone"]}',
                severity='warning'
            )
            db.session.add(alert)
            db.session.commit()
            
            return jsonify({'message': 'Payment received but tenant not matched'}), 200
    
    return jsonify({'error': 'Failed to process callback'}), 400

@bp.route('/initiate-stk', methods=['POST'])
@login_required
@admin_or_caretaker_required
def initiate_stk_push():
    data = request.get_json()
    
    tenant = Tenant.query.get_or_404(data['tenant_id'])
    amount = data['amount']
    
    mpesa_service = MPesaService()
    result = mpesa_service.initiate_stk_push(tenant.phone, amount, tenant.full_name)
    
    if result:
        return jsonify({'message': 'STK push initiated', 'checkout_request_id': result}), 200
    
    return jsonify({'error': 'Failed to initiate STK push'}), 500
