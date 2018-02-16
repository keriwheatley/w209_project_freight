# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
from django.test import Client
from restapp.models import Shipment

# Create your tests here.
class ShipmentModelTests(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.client = Client()

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
        Shipment.objects.create(foreign_orig=100,
                                foreign_inbound_mode=2,
                                domestic_mode=2,
                                domestic_dest=411,
                                domestic_state_dest="OR",
                                commodity=10,
                                trade_type=1,
                                value=20,
                                weight=9
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

        resp = self.client.get('/shipment/2/')
        self.assertEqual(len(resp.data), 14)
        self.assertEqual(resp.data['weight'], 9)
        self.assertEqual(resp.data['domestic_mode'], '2')

    def test_list_all_shipments(self):
        resp = self.client.get('/shipments/')
        self.assertEqual(len(resp.data), 2)

    def test_create_shipment(self):
        resp = self.client.post('/shipments/', {'domestic_mode': '1', 'domestic_dest': '111', 'value': '100', 'weight': '200'})
        self.assertEqual(resp.status_code, 201)

        id = resp.data['id']
        resp = self.client.get('/shipment/{}/'.format(id))
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['weight'], 200)

    def test_delete_shipment(self):
        resp = self.client.post('/shipments/', {'domestic_mode': '4', 'domestic_dest': '222', 'value': '101', 'weight': '201'})
        self.assertEqual(resp.status_code, 201)
        id = resp.data['id']
        resp = self.client.delete('/shipment/{}/'.format(id))
        self.assertEqual(resp.status_code, 204)








