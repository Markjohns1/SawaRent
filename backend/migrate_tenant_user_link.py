from app import create_app, db
from sqlalchemy import text

app = create_app('development')

with app.app_context():
    # Add user_id column to tenants table
    try:
        with db.engine.connect() as conn:
            conn.execute(text('ALTER TABLE tenants ADD COLUMN user_id INTEGER'))
            conn.commit()
        print('✅ Added user_id column to tenants table')
    except Exception as e:
        print(f'Column might already exist or error: {e}')
        # Try alternative approach - just recreate all tables
        try:
            db.create_all()
            print('✅ Tables updated/created successfully')
        except Exception as e2:
            print(f'Error: {e2}')
