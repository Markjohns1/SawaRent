from app import create_app, db
from app.models.user import User

app = create_app('development')

with app.app_context():
    # Check if admin exists
    admin = User.query.filter_by(username='admin').first()
    
    if not admin:
        admin = User(
            username='admin',
            email='admin@sawarent.com',
            role='super_admin',
            phone='+254700000000',
            full_name='System Administrator'
        )
        admin.set_password('admin123')
        
        db.session.add(admin)
        db.session.commit()
        
        print('Admin user created successfully!')
        print('Username: admin')
        print('Password: admin123')
        print('Please change the password after first login!')
    else:
        print('Admin user already exists')
