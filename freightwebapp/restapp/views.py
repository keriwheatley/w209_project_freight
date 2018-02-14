# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from restapp.serializers import UserSerializer, GroupSerializer, ShipmentSerializer
from rest_framework.views import APIView
from restapp.models import Shipment
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from django.http import Http404

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
   """API endpoint to allow users to be edited"""
   queryset = User.objects.all().order_by('-date_joined')
   serializer_class = UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
   """API endpoint to edit groups"""
   queryset = Group.objects.all()
   serializer_class = GroupSerializer

class ShipmentList(generics.ListCreateAPIView):
   queryset = Shipment.objects.all()
   serializer_class = ShipmentSerializer

class ShipmentDetail(generics.RetrieveUpdateDestroyAPIView):
   queryset = Shipment.objects.all()
   serializer_class = ShipmentSerializer
