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

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
   """API endpoint to allow users to be edited"""
   queryset = User.objects.all().order_by('-date_joined')
   serializer_class = UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
   """API endpoint to edit groups"""
   queryset = Group.objects.all()
   serializer_class = GroupSerializer

class ShipmentList(APIView):
   def get(self, request, format=None):
      shipments = Shipment.objects.all()
      serializer = ShipmentSerializer(shipments, many=True)
      return Response(serializer.data)

   def post(self, request, format=None):
      serializer = ShipmentSerializer(data=request.data)
      if serializer.is_valid():
         serializer.save()
         return Response(serializer.data, status=status.HTTP_201_CREATED)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


