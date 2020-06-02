from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from account.models import User
from rest_framework_jwt.settings import api_settings
from rest_framework_jwt.serializers import JSONWebTokenSerializer
from movieinfo.models import User as mmUser

# User Serializer
class UserSerializer(serializers.ModelSerializer):

    User_iduser = serializers.PrimaryKeyRelatedField(queryset=mmUser.objects.all())

    class Meta:
        model = User
        fields = (
            'User_iduser', 
            'username', 
            'email', 
            'sex', 
            'birthdate'
        )


class RegistrationSerializer(serializers.ModelSerializer):
    """Serializers registration requests and creates a new user."""

    password = serializers.CharField(
        style={'input_type': 'password'},
        write_only=True
    )

    password2 = serializers.CharField(
        style={'input_type': 'password'},
        write_only=True
    )
    
    token = serializers.SerializerMethodField()

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)

        return token

    def create(self, validated_data):
        
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords must match.'})
        
        user = User.objects.create(
            User_iduser = mmUser.objects.create(),
            email = validated_data['email'],
            username = validated_data['username'],
            # sex = validated_data['sex'],
            # birthdate = validated_data['birthdate'],
        )

        user.set_password(validated_data['password'])
        user.save()

        return user

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2', 'sex', 'birthdate', 'token']



# custmized jwt serializer for login
class CustomJWTSerializer(JSONWebTokenSerializer):
    username_field = 'username_or_email'

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)

        return token

    def validate(self, obj):
        password = obj.get("password")
        user_obj = User.objects.filter(email=obj.get("username_or_email")).first() or \
                   User.objects.filter(username=obj.get("username_or_email")).first()

        if user_obj is not None:
            credentials = {
                'username': user_obj.username,
                'password': password
            }

            if all(credentials.values()):
                user = authenticate(**credentials)

                if user:
                    if not user.is_active:
                        msg = ('User account is disabled.')
                        raise serializers.ValidationError(msg)

                    return {
                        'token': self.get_token(user),
                        'user': user
                    }
                else:
                    msg = ('Unable to log in with provided credentials.')
                    raise serializers.ValidationError(msg)

            else:
                msg = ('Must include "{username_field}" and "password".')
                msg = msg.format(username_field=self.username_field)
                raise serializers.ValidationError(msg)

        else:
            msg = ('Account with this email/username does not exists')
            raise serializers.ValidationError(msg)
