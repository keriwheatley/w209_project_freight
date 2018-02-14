# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
from django.test import Client
from restapp.models import Shipment

# Create your tests here.
class ShipmentModelTests(TestCase):

    @classmethod
    def setUpTestData(cls):
        print("Hi")
        pass

    def setUp(self):
        Shipment.objects.create(foreign_orig=806,
                                foreign_inbound_mode=3,
                                domestic_mode=2,
                                domestic_dest=411,
                                domestic_state_dest="OR",
                                commodity=30,
                                trade_type=2,
                                value=11,
                                weight=5
                                )

    def test_shipments_url_exists(self):
        resp = self.client.get("/shipments/")
        self.assertEqual(resp.status_code, 200)


    def test_create_shipment(self):
        pass

    def test_get_shipment_details(self):
        resp = self.client.get('/shipment/1/')
        self.assertEqual(len(resp.data), 14)
        self.assertEqual(resp.data['foreign_orig'], 806)

    def test_list_all_shipments(self):
        resp = self.client.get('/shipments/')
        self.assertEqual(len(resp.data), 1)

