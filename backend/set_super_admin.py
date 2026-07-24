import sys
import os
import argparse
from dotenv import load_dotenv
import psycopg2

def main():
    # Load env variables from backend/.env
    load_dotenv()
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("Error: DATABASE_URL is not set in backend/.env", file=sys.stderr)
        sys.exit(1)
        
    parser = argparse.ArgumentParser(description="Create or update Vstay Super Admin credentials.")
    parser.add_argument("--email", required=True, help="Super admin email address")
    parser.add_argument("--password", required=True, help="Super admin password")
    parser.add_argument("--name", default="Super Admin", help="Super admin full name")
    
    args = parser.parse_args()
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # Check if email is in use by someone else
        cur.execute("SELECT id, role, email FROM users WHERE LOWER(email) = LOWER(%s)", (args.email,))
        conflict = cur.fetchone()
        
        if conflict:
            conflicting_id, conflicting_role, conflicting_email = conflict
            if conflicting_role != 'super_admin':
                # Rename the conflicting non-super_admin user to free up the email
                parts = args.email.split('@')
                new_email = f"{parts[0]}+owner@{parts[1]}"
                cur.execute("UPDATE users SET email = %s WHERE id = %s", (new_email, conflicting_id))
                print(f"Renamed conflicting {conflicting_role} (ID: {conflicting_id}) from {args.email} to {new_email}")

        # Check if a super admin already exists
        cur.execute("SELECT id FROM users WHERE role = 'super_admin'")
        existing = cur.fetchone()
        
        if existing:
            user_id = existing[0]
            cur.execute(
                "UPDATE users SET email = %s, password = %s, full_name = %s WHERE id = %s",
                (args.email, args.password, args.name, user_id)
            )
            print(f"Updated existing super admin (ID: {user_id}) to email: {args.email}")
        else:
            user_id = "u_super_1"
            cur.execute(
                "INSERT INTO users (id, email, password, full_name, role, workspace_ids) VALUES (%s, %s, %s, %s, 'super_admin', '{}'::text[])",
                (user_id, args.email, args.password, args.name)
            )
            print(f"Created new super admin (ID: {user_id}) with email: {args.email}")
            
        conn.commit()
        cur.close()
        conn.close()
        print("Success! Super admin credentials saved in database.")
    except Exception as e:
        print(f"Database error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
