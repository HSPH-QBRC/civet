from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail
from django.dispatch import receiver

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, **kwargs):
    reset_url = f"https:dev-civet.tm4.org.s3-website.us-east-2.amazonaws.com/reset-password?token={reset_password_token.key}"

    send_mail(
        subject="Civet Password Reset",
        message=f"Reset your password here: {reset_url}",
        from_email="noreply@yourdomain.com",
        recipient_list=[reset_password_token.user.email]
    )