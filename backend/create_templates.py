from app import create_app, db
from app.models.template import Template

app = create_app('development')

with app.app_context():
    if Template.query.count() == 0:
        templates = [
            Template(
                name='Rent Reminder',
                category='payment',
                theme='friendly',
                content='Hi {tenant_name}, this is a friendly reminder that your rent of KES {amount} for unit {unit_number} is due. Thank you!'
            ),
            Template(
                name='Payment Received',
                category='payment',
                theme='formal',
                content='Dear {tenant_name}, we confirm receipt of your payment of KES {amount} for unit {unit_number}. Reference: {transaction_reference}. Thank you.'
            ),
            Template(
                name='Late Payment Notice',
                category='payment',
                theme='formal',
                content='Dear {tenant_name}, your rent payment for unit {unit_number} is overdue. Please settle the outstanding amount of KES {remaining_amount} at your earliest convenience.'
            ),
            Template(
                name='Lease Renewal Reminder',
                category='lease',
                theme='friendly',
                content='Hello {tenant_name}! Your lease for unit {unit_number} is ending soon. Please contact us to discuss renewal options. We appreciate having you as our tenant!'
            ),
            Template(
                name='Maintenance Notice',
                category='maintenance',
                theme='formal',
                content='Dear {tenant_name}, scheduled maintenance will be conducted in unit {unit_number} on {payment_date}. We apologize for any inconvenience.'
            ),
            Template(
                name='Welcome Message',
                category='general',
                theme='friendly',
                content='Welcome {tenant_name}! We are excited to have you in unit {unit_number}. If you need anything, feel free to reach out. Happy renting!'
            )
        ]
        
        for template in templates:
            db.session.add(template)
        
        db.session.commit()
        print(f'Created {len(templates)} message templates!')
    else:
        print(f'Database already has {Template.query.count()} templates')
