# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from rest_framework import serializers
# Create your models here.

FOREIGN_REGIONS = ()

class Shipment(models.Model):
    id = serializers.IntegerField(read_only=True)
    foreign_orig = models.CharField(max_length=100, blank=True)
    domestic_orig = models.CharField(max_length=100, blank=True)
    domestic_state_orig = models.CharField(max_length=100, blank=True)
    domestic_region_dest = models.CharField(max_length=100, blank=True)
    domestic_state_dest = models.CharField(max_length=100, blank=True)
    foreign_region_dest = models.CharField(max_length=100, blank=True)
    foreign_inbound_mode = models.CharField(max_length=100, blank=True)
    domestic_mode = models.CharField(max_length=100, blank=True)
    foreign_outbound_mode = models.CharField(max_length=100, blank=True)
    commodity = models.CharField(max_length=100, blank=True)
    trade_type = models.CharField(max_length=100, blank=True)
    value = models.IntegerField()
    weight = models.IntegerField()

    class Meta:
        ordering = ('value',)
