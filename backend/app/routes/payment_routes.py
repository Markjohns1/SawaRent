from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app import db
from app.models.payment import Payment
from app.models.tenant import Tenant
from app.models.alert import Alert
from app.services.messaging_service import MessagingService
from app.utils.decorators import admin_or_caretaker_required
from datetime import datetime

bp = Blueprint('payments', __name__, url_prefix='/api/payments')

@bp.route('', methods=['GET'])
@login_required
@admin_or_caretaker_required
def get_payments():
    tenant_id = request.args.get('tenant_id')
    
    query = Payment.query
    if tenant_id:
        query = query.filter_by(tenant_id=tenant_id)
    
    payments = query.order_by(Payment.payment_date.desc()).all()
    return jsonify({'payments': [p.to_dict() for p in payments]}), 200

@bp.route('/<int:payment_id>', methods=['GET'])
@login_required
@admin_or_caretaker_required
def get_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    return jsonify({'payment': payment.to_dict()}), 200

@bp.route('', methods=['POST'])
@login_required
@admin_or_caretaker_required
def create_payment():
    data = request.get_json()
    
    tenant = Tenant.query.get_or_404(data['tenant_id'])
    
    payment = Payment(
        tenant_id=data['tenant_id'],
        amount=data['amount'],
        payment_date=datetime.fromisoformat(data['payment_date']).date(),
        payment_method=data['payment_method'],
        transaction_reference=data.get('transaction_reference', ''),
        notes=data.get('notes', ''),
        logged_by=current_user.id
    )
    
    payment.calculate_status(tenant.expected_rent)
    
    db.session.add(payment)
    
    alert = Alert(
        alert_type='payment_logged',
        message=f'Payment of KES {payment.amount} logged for {tenant.full_name} - Unit {tenant.unit_number}',
        severity='info',
        related_tenant_id=tenant.id,
        related_payment_id=payment.id
    )
    db.session.add(alert)
    
    db.session.commit()
    
    if data.get('send_receipt', False):
        messaging_service = MessagingService()
        messaging_service.send_payment_receipt(payment, tenant)
    
    return jsonify({'message': 'Payment logged successfully', 'payment': payment.to_dict()}), 201

@bp.route('/<int:payment_id>/send-receipt', methods=['POST'])
@login_required
@admin_or_caretaker_required
def send_receipt(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    tenant = Tenant.query.get(payment.tenant_id)
    
    messaging_service = MessagingService()
    success = messaging_service.send_payment_receipt(payment, tenant)
    
    if success:
        payment.receipt_sent = True
        db.session.commit()
        return jsonify({'message': 'Receipt sent successfully'}), 200
    
    return jsonify({'error': 'Failed to send receipt'}), 500

@bp.route('/audit-trail', methods=['GET'])
@login_required
@admin_or_caretaker_required
def get_audit_trail():
    payments = Payment.query.order_by(Payment.created_at.desc()).all()
    
    audit_data = []
    for payment in payments:
        tenant = Tenant.query.get(payment.tenant_id)
        audit_data.append({
            **payment.to_dict(),
            'tenant_name': tenant.full_name if tenant else 'Unknown',
            'unit_number': tenant.unit_number if tenant else 'Unknown'
        })
    
    return jsonify({'audit_trail': audit_data}), 200
