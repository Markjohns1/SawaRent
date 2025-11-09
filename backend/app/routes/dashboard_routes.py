from flask import Blueprint, request, jsonify
from flask_login import login_required
from app import db
from app.models.tenant import Tenant
from app.models.payment import Payment
from app.models.alert import Alert
from app.utils.decorators import admin_or_caretaker_required
from datetime import datetime, timedelta
from sqlalchemy import func
import pytz

bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@bp.route('/summary', methods=['GET'])
@login_required
@admin_or_caretaker_required
def get_summary():
    tz = pytz.timezone('Africa/Nairobi')
    current_month = datetime.now(tz).month
    current_year = datetime.now(tz).year
    
    tenants = Tenant.query.filter_by(is_active=True).all()
    total_tenants = len(tenants)
    total_expected = sum([t.expected_rent for t in tenants])
    
    payments_this_month = Payment.query.filter(
        func.extract('month', Payment.payment_date) == current_month,
        func.extract('year', Payment.payment_date) == current_year
    ).all()
    
    total_collected = sum([p.amount for p in payments_this_month])
    
    paid_tenants = []
    partial_tenants = []
    overdue_tenants = []
    
    for tenant in tenants:
        tenant_payments = [p for p in payments_this_month if p.tenant_id == tenant.id]
        total_paid = sum([p.amount for p in tenant_payments])
        
        if total_paid >= tenant.expected_rent:
            paid_tenants.append(tenant.id)
        elif total_paid > 0:
            partial_tenants.append({
                'tenant_id': tenant.id,
                'tenant_name': tenant.full_name,
                'unit_number': tenant.unit_number,
                'expected_rent': tenant.expected_rent,
                'paid_amount': total_paid,
                'remaining_amount': tenant.expected_rent - total_paid
            })
        else:
            overdue_tenants.append({
                'tenant_id': tenant.id,
                'tenant_name': tenant.full_name,
                'unit_number': tenant.unit_number,
                'expected_rent': tenant.expected_rent
            })
    
    return jsonify({
        'total_tenants': total_tenants,
        'total_expected': total_expected,
        'total_collected': total_collected,
        'paid_count': len(paid_tenants),
        'partial_count': len(partial_tenants),
        'overdue_count': len(overdue_tenants),
        'partial_tenants': partial_tenants,
        'overdue_tenants': overdue_tenants
    }), 200

@bp.route('/alerts', methods=['GET'])
@login_required
@admin_or_caretaker_required
def get_alerts():
    unread_only = request.args.get('unread_only', 'false').lower() == 'true'
    
    query = Alert.query.order_by(Alert.created_at.desc())
    if unread_only:
        query = query.filter_by(is_read=False)
    
    alerts = query.limit(50).all()
    return jsonify({'alerts': [a.to_dict() for a in alerts]}), 200

@bp.route('/alerts/<int:alert_id>/mark-read', methods=['PUT'])
@login_required
@admin_or_caretaker_required
def mark_alert_read(alert_id):
    alert = Alert.query.get_or_404(alert_id)
    alert.is_read = True
    db.session.commit()
    
    return jsonify({'message': 'Alert marked as read'}), 200

@bp.route('/lease-expiring', methods=['GET'])
@login_required
@admin_or_caretaker_required
def get_expiring_leases():
    tz = pytz.timezone('Africa/Nairobi')
    today = datetime.now(tz).date()
    thirty_days = today + timedelta(days=30)
    
    expiring_tenants = Tenant.query.filter(
        Tenant.is_active == True,
        Tenant.lease_end_date <= thirty_days,
        Tenant.lease_end_date >= today
    ).all()
    
    return jsonify({
        'expiring_leases': [
            {
                **t.to_dict(),
                'days_remaining': (t.lease_end_date - today).days
            } for t in expiring_tenants
        ]
    }), 200
