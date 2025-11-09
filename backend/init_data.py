from app import create_app, db
from app.models.user import User
from app.models.tenant import Tenant
from app.models.template import Template
from datetime import datetime, timedelta
import pytz

app = create_app('development')

def init_sample_data():
    with app.app_context():
        db.create_all()
        
        if User.query.count() == 0:
            admin = User(
                username='admin',
                email='admin@property.com',
                role='super_admin',
                phone='+254712345678',
                full_name='Property Owner'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            
            caretaker = User(
                username='caretaker',
                email='caretaker@property.com',
                role='caretaker',
                phone='+254723456789',
                full_name='John Caretaker'
            )
            caretaker.set_password('care123')
            db.session.add(caretaker)
            
            print('✓ Created users: admin/admin123, caretaker/care123')
        
        if Tenant.query.count() == 0:
            tz = pytz.timezone('Africa/Nairobi')
            today = datetime.now(tz).date()
            
            tenants_data = [
                {
                    'full_name': 'Jane Wanjiku',
                    'phone': '+254701234567',
                    'email': 'jane@email.com',
                    'unit_number': 'A101',
                    'expected_rent': 15000,
                    'deposit_amount': 30000,
                    'lease_start_date': today - timedelta(days=180),
                    'lease_end_date': today + timedelta(days=185)
                },
                {
                    'full_name': 'Peter Kamau',
                    'phone': '+254702345678',
                    'email': 'peter@email.com',
                    'unit_number': 'A102',
                    'expected_rent': 18000,
                    'deposit_amount': 36000,
                    'lease_start_date': today - timedelta(days=150),
                    'lease_end_date': today + timedelta(days=215)
                },
                {
                    'full_name': 'Mary Njeri',
                    'phone': '+254703456789',
                    'email': 'mary@email.com',
                    'unit_number': 'B201',
                    'expected_rent': 20000,
                    'deposit_amount': 40000,
                    'lease_start_date': today - timedelta(days=90),
                    'lease_end_date': today + timedelta(days=275)
                },
                {
                    'full_name': 'David Ochieng',
                    'phone': '+254704567890',
                    'email': 'david@email.com',
                    'unit_number': 'B202',
                    'expected_rent': 17000,
                    'deposit_amount': 34000,
                    'lease_start_date': today - timedelta(days=200),
                    'lease_end_date': today + timedelta(days=165)
                },
                {
                    'full_name': 'Grace Akinyi',
                    'phone': '+254705678901',
                    'email': 'grace@email.com',
                    'unit_number': 'C301',
                    'expected_rent': 22000,
                    'deposit_amount': 44000,
                    'lease_start_date': today - timedelta(days=60),
                    'lease_end_date': today + timedelta(days=305)
                }
            ]
            
            for tenant_data in tenants_data:
                tenant = Tenant(**tenant_data)
                db.session.add(tenant)
            
            print(f'✓ Created {len(tenants_data)} sample tenants')
        
        if Template.query.count() == 0:
            templates_data = [
                {
                    'name': 'Payment Receipt - Formal',
                    'category': 'receipt',
                    'theme': 'formal',
                    'content': 'Dear {tenant_name}, this is to confirm receipt of KES {amount} for Unit {unit_number} on {payment_date}. Transaction Ref: {transaction_reference}. Balance: KES {remaining_amount}. Thank you.'
                },
                {
                    'name': 'Payment Receipt - Friendly',
                    'category': 'receipt',
                    'theme': 'friendly',
                    'content': 'Hi {tenant_name}! We received your payment of KES {amount} for Unit {unit_number}. Thanks! Remaining balance: KES {remaining_amount}.'
                },
                {
                    'name': 'Rent Reminder - Formal',
                    'category': 'reminder',
                    'theme': 'formal',
                    'content': 'Dear {tenant_name}, this is a reminder that your rent of KES {remaining_amount} for Unit {unit_number} is due. Please make payment at your earliest convenience.'
                },
                {
                    'name': 'Rent Reminder - Friendly',
                    'category': 'reminder',
                    'theme': 'friendly',
                    'content': 'Hey {tenant_name}! Just a friendly reminder about the rent for Unit {unit_number}. KES {remaining_amount} is due. Let us know if you need anything!'
                },
                {
                    'name': 'Partial Payment Follow-up - Formal',
                    'category': 'follow_up',
                    'theme': 'formal',
                    'content': 'Dear {tenant_name}, we acknowledge your partial payment. Your remaining balance for Unit {unit_number} is KES {remaining_amount}. Please complete payment soon.'
                },
                {
                    'name': 'Partial Payment Follow-up - Friendly',
                    'category': 'follow_up',
                    'theme': 'friendly',
                    'content': 'Hi {tenant_name}! Thanks for the partial payment. You still have KES {remaining_amount} pending for Unit {unit_number}. No rush, just keeping you updated!'
                }
            ]
            
            for template_data in templates_data:
                template = Template(**template_data)
                db.session.add(template)
            
            print(f'✓ Created {len(templates_data)} message templates')
        
        db.session.commit()
        print('\n✅ Database initialized successfully!')
        print('\nLogin Credentials:')
        print('  Admin: admin / admin123')
        print('  Caretaker: caretaker / care123')

if __name__ == '__main__':
    init_sample_data()
