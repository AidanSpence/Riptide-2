from django.db import migrations


class Migration(migrations.Migration):
    """join the deployment and chat-attachment migration branches."""

    dependencies = [
        ("Riptide2", "0012_generationbudget_spotifyoauthstate"),
        ("Riptide2", "0013_chatmessage_playlist_data"),
    ]

    operations = []
