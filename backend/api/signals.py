from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail
from django.dispatch import receiver

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, **kwargs):
    reset_url = f"https://copd.civet.tm4.org/reset-password?token={reset_password_token.key}"

    send_mail(
        subject="Reset Your Civet Account Password",
        message=(
        f"Hello,\n\n"
        "We received a request to reset the password for your Civet account. "
        "If you made this request, please click the link below to reset your password:\n\n"
        f"{reset_url}\n\n"
        "If you did not request a password reset, please ignore this email. "
        "This link will expire after a short period for your security.\n\n"
        "If you need further assistance, feel free to contact us.\n\n"
        "Best regards,\n"
        "The Civet Team"
    ),
        from_email="snhong@hsph.harvard.edu",
        recipient_list=[reset_password_token.user.email]
    )