

from django.forms.models import model_to_dict

def jwt_response_payload_handler(token, user=None, request=None):
    """
    customized response type
    """

    return {
        'token': token,
        'user_id': model_to_dict(user)['User_iduser'],
        'username': user.username
    }