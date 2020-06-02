from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from datetime import datetime, timedelta
from django.conf import settings
from django.db.models.signals import post_save
from movieinfo.models import User as mmUser

class UserManager(BaseUserManager):
	def create_user(self, email, username, password=None):
		if not email:
			raise ValueError('Users must have an email address')

		if not username:
			raise ValueError('Users must have a username')

		user = self.model(
			username = username,
			email = self.normalize_email(email),
		)

		user.set_password(password)
		user.save(using=self._db)

		return user

	def create_superuser(self, email, username, password):
		"""
        Create and return a `User` with superuser (admin) permissions.
        """

		if not password:
			raise TypeError('Superusers must have a password.')
		
		user = self.create_user(
			email = self.normalize_email(email),
			password = password,
			username = username,
		)

		user.is_admin = True
		user.is_staff = True
		user.is_superuser = True
		user.save(using = self._db)

		return user


class User(AbstractBaseUser, PermissionsMixin):
    
	gender = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('unisex','Unisex'),
        ('transgender','Transgender')
    )
	User_iduser     =   models.ForeignKey(mmUser, db_column='User_iduser', primary_key= True, on_delete=models.CASCADE)
	email 			= 	models.EmailField(verbose_name="email", max_length=60, unique=True)
	username 		= 	models.CharField(max_length=30, unique=True)
	date_joined		= 	models.DateTimeField(verbose_name='date joined', auto_now_add=True)
	last_login		= 	models.DateTimeField(verbose_name='last login', auto_now=True)
	sex 			= 	models.CharField(db_column='gender', max_length=32, choices=gender, default='')
	birthdate 		= 	models.DateField(db_column='birth_date', null=True)
	is_admin		= 	models.BooleanField(default=False)
	is_active		= 	models.BooleanField(default=True)
	is_staff		= 	models.BooleanField(default=False)
	is_superuser	= 	models.BooleanField(default=False)


	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email']

	objects = UserManager()

	def __str__(self):
		return self.email

	# For checking permissions. to keep it simple all admin have ALL permissons
	def has_perm(self, perm, obj=None):
		return self.is_admin

	# Does this user have permission to view this app? (ALWAYS YES FOR SIMPLICITY)
	def has_module_perms(self, app_label):
		return True

