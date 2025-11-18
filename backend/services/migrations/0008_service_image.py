from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("services", "0007_booking"),
    ]

    operations = [
        migrations.AddField(
            model_name="service",
            name="image",
            field=models.TextField(blank=True),
        ),
    ]
