from flask import Blueprint, request, jsonify
from flask_login import login_required
from app import db
from app.models.tenant import Tenant
from app.utils.decorators import admin_or_caretaker_required
from datetime import datetime

bp = Blueprint('tenants', __name__, url_prefix='/api/tenants')

@bp.route('', methods=['GET'])
@login_required
@admin_or_caretaker_required
def get_tenants():
    search = request.args.get('search', '')
    is_active = request.args.get('is_active', 'true').lower() == 'true'
    
    query = Tenant.query.filter_by(is_active=is_active)
    
    if search:
        search_filter = f'%{search}%'
        query = query.filter(
            db.or_(
                Tenant.full_name.ilike(search_filter),
                Tenant.phone.ilike(search_filter),
                Tenant.unit_number.ilike(search_filter),
                Tenant.email.ilike(search_filter)
            )
        )
    
    tenants = query.all()
    return jsonify({'tenants': [t.to_dict() for t in tenants]}), 200

@bp.route('/<int:tenant_id>', methods=['GET'])
@login_required
@admin_or_caretaker_required
def get_tenant(tenant_id):
    tenant = Tenant.query.get_or_404(tenant_id)
    return jsonify({'tenant': tenant.to_dict()}), 200

@bp.route('', methods=['POST'])
@login_required
@admin_or_caretaker_required
def create_tenant():
    data = request.get_json()
    
    tenant = Tenant(
        full_name=data['full_name'],
        phone=data['phone'],
        email=data.get('email', ''),
        unit_number=data['unit_number'],
        expected_rent=data['expected_rent'],
        deposit_amount=data.get('deposit_amount', 0.0),
        lease_start_date=datetime.fromisoformat(data['lease_start_date']).date(),
        lease_end_date=datetime.fromisoformat(data['lease_end_date']).date(),
        notes=data.get('notes', '')
    )
    
    db.session.add(tenant)
    db.session.commit()
    
    return jsonify({'message': 'Tenant created successfully', 'tenant': tenant.to_dict()}), 201

@bp.route('/<int:tenant_id>', methods=['PUT'])
@login_required
@admin_or_caretaker_required
def update_tenant(tenant_id):
    tenant = Tenant.query.get_or_404(tenant_id)
    data = request.get_json()
    
    tenant.full_name = data.get('full_name', tenant.full_name)
    tenant.phone = data.get('phone', tenant.phone)
    tenant.email = data.get('email', tenant.email)
    tenant.unit_number = data.get('unit_number', tenant.unit_number)
    tenant.expected_rent = data.get('expected_rent', tenant.expected_rent)
    tenant.deposit_amount = data.get('deposit_amount', tenant.deposit_amount)
    tenant.notes = data.get('notes', tenant.notes)
    
    if 'lease_start_date' in data:
        tenant.lease_start_date = datetime.fromisoformat(data['lease_start_date']).date()
    if 'lease_end_date' in data:
        tenant.lease_end_date = datetime.fromisoformat(data['lease_end_date']).date()
    
    db.session.commit()
    
    return jsonify({'message': 'Tenant updated successfully', 'tenant': tenant.to_dict()}), 200

@bp.route('/<int:tenant_id>', methods=['DELETE'])
@login_required
@admin_or_caretaker_required
def delete_tenant(tenant_id):
    tenant = Tenant.query.get_or_404(tenant_id)
    tenant.is_active = False
    db.session.commit()
    
    return jsonify({'message': 'Tenant deactivated successfully'}), 200
