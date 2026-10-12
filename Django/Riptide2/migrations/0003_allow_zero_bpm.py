from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ("Riptide2", "0002_music_schema"),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                ALTER TABLE music.songs DROP CONSTRAINT IF EXISTS songs_bpm_check;
                ALTER TABLE music.songs ADD CONSTRAINT songs_bpm_check CHECK (bpm >= 0);
                ALTER TABLE music.songs DROP CONSTRAINT IF EXISTS songs_time_signature_check;
                ALTER TABLE music.songs ADD CONSTRAINT songs_time_signature_check
                    CHECK (time_signature BETWEEN 0 AND 7);
            """,
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]