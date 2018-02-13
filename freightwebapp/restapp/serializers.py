from django.contrib.auth.models import User, Group
from rest_framework import serializers
from restapp.models import Shipment

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class ShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment

        fields = ('id',
                  'foreign_orig',
                  'domestic_orig',
                  'domestic_state_orig',
                  'domestic_region_dest',
                  'domestic_state_dest',
                  'foreign_region_dest',
                  'foreign_inbound_mode',
                  'domestic_mode',
                  'foreign_outbound_mode',
                  'commodity',
                  'trade_type',
                  'value' ,
                  'weight')