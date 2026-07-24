import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("vstay.email")


def send_tenant_onboarding_email(
    to_email: str, name: str, username: str, password: str, login_url: str = ""
) -> bool:
    """Send tenant onboarding credentials via Gmail SMTP."""
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "").strip()
    smtp_password = os.getenv("SMTP_PASSWORD", "").replace(" ", "").strip()
    from_email = os.getenv("FROM_EMAIL", smtp_user).strip() or smtp_user

    if not smtp_user or not smtp_password:
        logger.warning("SMTP credentials missing. Email skipped.")
        print(f"[EMAIL SKIPPED] To: {to_email} | Username: {username} | Password: {password}")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Welcome to Vstay – Onboarding Credentials for {name}"
        msg["From"] = f"Vstay <{from_email}>"
        msg["To"] = to_email

        text_body = f"""Hello {name},

Welcome to Vstay! Your tenant account has been created.

Your Login Credentials:
- Username: {username}
- Email: {to_email}
- Password: {password}

Dashboard Login URL:
{login_url}

Thank you,
Vstay Team
"""

        html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; color: #333; margin: 0; padding: 20px; }}
        .card {{ max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }}
        .header {{ text-align: center; border-bottom: 1px solid #eef2f5; padding-bottom: 20px; margin-bottom: 24px; }}
        .header h2 {{ color: #10b981; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }}
        .credentials {{ background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0; }}
        .cred-item {{ margin: 10px 0; font-size: 15px; }}
        .cred-label {{ font-weight: 600; color: #64748b; display: inline-block; width: 100px; }}
        .cred-value {{ font-weight: 700; color: #0f172a; font-family: monospace; font-size: 16px; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; }}
        .btn {{ display: inline-block; background: #10b981; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; text-align: center; margin-top: 16px; }}
        .footer {{ text-align: center; font-size: 12px; color: #94a3b8; margin-top: 32px; }}
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h2>Vstay</h2>
        </div>
        <p>Hello <strong>{name}</strong>,</p>
        <p>Welcome to Vstay! Your tenant account has been created successfully. Below are your login credentials to access your tenant portal.</p>
        
        <div class="credentials">
            <div class="cred-item"><span class="cred-label">Username:</span> <span class="cred-value">{username}</span></div>
            <div class="cred-item"><span class="cred-label">Email:</span> <span class="cred-value">{to_email}</span></div>
            <div class="cred-item"><span class="cred-label">Password:</span> <span class="cred-value">{password}</span></div>
        </div>

        {f'<div style="text-align: center;"><a href="{login_url}" class="btn" target="_blank">Login to Tenant Dashboard</a></div>' if login_url else ''}

        <div class="footer">
            <p>If you have any questions, please contact your property manager.</p>
            <p>&copy; Vstay Property Management. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
"""

        msg.attach(MIMEText(text_body, "plain"))
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)

        logger.info(f"Successfully sent onboarding email to {to_email}")
        print(f"[EMAIL SENT SUCCESS] To: {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        print(f"[EMAIL ERROR] Failed to send email to {to_email}: {e}")
        return False


def send_staff_onboarding_email(
    to_email: str, name: str, username: str, password: str, login_url: str = "", role: str = "Staff"
) -> bool:
    """Send staff onboarding credentials & dashboard login link via Gmail SMTP."""
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "").strip()
    smtp_password = os.getenv("SMTP_PASSWORD", "").replace(" ", "").strip()
    from_email = os.getenv("FROM_EMAIL", smtp_user).strip() or smtp_user

    if not smtp_user or not smtp_password:
        logger.warning("SMTP credentials missing. Staff email skipped.")
        print(f"[EMAIL SKIPPED] Staff To: {to_email} | Username: {username} | Password: {password}")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Welcome to Vstay – Staff Onboarding Credentials for {name}"
        msg["From"] = f"Vstay <{from_email}>"
        msg["To"] = to_email

        text_body = f"""Hello {name},

Welcome to Vstay! Your staff account ({role}) has been created.

Your Dashboard Login Credentials:
- Username: {username}
- Email: {to_email}
- Password: {password}
- Role: {role}

Dashboard Login URL:
{login_url}

Thank you,
Vstay Property Management
"""

        html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; color: #333; margin: 0; padding: 20px; }}
        .card {{ max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }}
        .header {{ text-align: center; border-bottom: 1px solid #eef2f5; padding-bottom: 20px; margin-bottom: 24px; }}
        .header h2 {{ color: #2563eb; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }}
        .credentials {{ background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0; }}
        .cred-item {{ margin: 10px 0; font-size: 15px; }}
        .cred-label {{ font-weight: 600; color: #64748b; display: inline-block; width: 100px; }}
        .cred-value {{ font-weight: 700; color: #0f172a; font-family: monospace; font-size: 16px; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; }}
        .btn {{ display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; text-align: center; margin-top: 16px; }}
        .footer {{ text-align: center; font-size: 12px; color: #94a3b8; margin-top: 32px; }}
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h2>Vstay Staff Portal</h2>
        </div>
        <p>Hello <strong>{name}</strong>,</p>
        <p>Welcome to the team! Your staff account (<strong>{role}</strong>) has been created successfully. Below are your dashboard credentials to access your staff portal.</p>
        
        <div class="credentials">
            <div class="cred-item"><span class="cred-label">Username:</span> <span class="cred-value">{username}</span></div>
            <div class="cred-item"><span class="cred-label">Email:</span> <span class="cred-value">{to_email}</span></div>
            <div class="cred-item"><span class="cred-label">Password:</span> <span class="cred-value">{password}</span></div>
            <div class="cred-item"><span class="cred-label">Role:</span> <span class="cred-value">{role}</span></div>
        </div>

        {f'<div style="text-align: center;"><a href="{login_url}" class="btn" target="_blank">Login to Staff Dashboard</a></div>' if login_url else ''}

        <div class="footer">
            <p>If you have any questions, please contact your workspace administrator.</p>
            <p>&copy; Vstay Property Management. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
"""

        msg.attach(MIMEText(text_body, "plain"))
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)

        logger.info(f"Successfully sent staff onboarding email to {to_email}")
        print(f"[STAFF EMAIL SENT SUCCESS] To: {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send staff email to {to_email}: {e}")
        print(f"[STAFF EMAIL ERROR] Failed to send email to {to_email}: {e}")
        return False

