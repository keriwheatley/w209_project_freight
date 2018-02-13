# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-02-13 18:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Shipment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('foreign_orig', models.CharField(blank=True, max_length=100)),
                ('domestic_orig', models.CharField(blank=True, max_length=100)),
                ('domestic_state_orig', models.CharField(blank=True, max_length=100)),
                ('domestic_region_dest', models.CharField(blank=True, max_length=100)),
                ('domestic_state_dest', models.CharField(blank=True, max_length=100)),
                ('foreign_region_dest', models.CharField(blank=True, max_length=100)),
                ('foreign_inbound_mode', models.CharField(blank=True, max_length=100)),
                ('domestic_mode', models.CharField(blank=True, max_length=100)),
                ('foreign_outbound_mode', models.CharField(blank=True, max_length=100)),
                ('commodity', models.CharField(blank=True, max_length=100)),
                ('trade_type', models.CharField(blank=True, max_length=100)),
                ('value', models.IntegerField()),
                ('weight', models.IntegerField()),
            ],
            options={
                'ordering': ('value',),
            },
        ),
    ]
