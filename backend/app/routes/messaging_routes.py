from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app import db
from app.models.template import Template
from app.models.sms_log import SMSLog
from app.models.tenant import Tenant
from app.services.messaging_service import MessagingService
from app.utils.decorators import admin_or_caretaker_required, admin_required

bp = Blueprint('messaging', __name__, url_prefix='/api/messaging')

@bp.route('/templates', methods=['GET'])
@login_required
@admin_or_caretaker_required
def get_templates():
    category = request.args.get('category')
    theme = request.args.get('theme')
    
    query = Template.query.filter_by(is_active=True)
    
    if category:
        query = query.filter_by(category=category)
    if theme:
        query = query.filter_by(theme=theme)
    
    templates = query.all()
    return jsonify({'templates': [t.to_dict() for t in templates]}), 200

@bp.route('/templates', methods=['POST'])
@login_required
@admin_required
def create_template():
    data = request.get_json()
    
    template = Template(
        name=data['name'],
        category=data['category'],
        theme=data['theme'],
        content=data['content']
    )
    
    db.session.add(template)
    db.session.commit()
    
    return jsonify({'message': 'Template created successfully', 'template': template.to_dict()}), 201

@bp.route('/send-sms', methods=['POST'])
@login_required
@admin_or_caretaker_required
def send_sms():
    data = request.get_json()
    
    tenant = Tenant.query.get_or_404(data['tenant_id'])
    
    if 'template_id' in data:
        template = Template.query.get_or_404(data['template_id'])
        message = template.render(
            tenant_name=tenant.full_name,
            unit_number=tenant.unit_number,
            **data.get('placeholders', {})
        )
    else:
        message = data['message']
    
    messaging_service = MessagingService()
    success = messaging_service.send_sms(tenant.phone, message, tenant.full_name)
    
    sms_log = SMSLog(
        recipient_phone=tenant.phone,
        recipient_name=tenant.full_name,
        message=message,
        message_type=data.get('message_type', 'manual'),
        status='sent' if success else 'failed',
        sent_by=current_user.id
    )
    db.session.add(sms_log)
    db.session.commit()
    
    if success:
        return jsonify({'message': 'SMS sent successfully'}), 200
    
    return jsonify({'error': 'Failed to send SMS'}), 500

@bp.route('/sms-logs', methods=['GET'])
@login_required
@admin_or_caretaker_required
def get_sms_logs():
    logs = SMSLog.query.order_by(SMSLog.sent_at.desc()).limit(100).all()
    return jsonify({'sms_logs': [log.to_dict() for log in logs]}), 200
