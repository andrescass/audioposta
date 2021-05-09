import os
import sys
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager

# Create your models here.
def upload_to(instance, filename):
    #now = timezone.now()
    #base, extension = os.path.splitext(filename.lower())
    #milliseconds = now.microsecond // 1000
    audioName = filename.split('-')
    return f"audios/{audioName[0]}+'.'+{audioName[1]}"

class audioEntry(models.Model):
    audioFile = models.FileField(upload_to=upload_to, blank=False, null=True)

class Podcast(models.Model):
    id = models.TextField(max_length=5, primary_key=True, null=False, blank=False)
    name = models.TextField(max_length=50, blank=False, null=False)

class podcastuser(AbstractUser):
    podcast = models.ManyToManyField(Podcast)
    is_owner = models.BooleanField(blank=True, null=False, default=False)

    objects = CustomUserManager()

    def __str__(self):
        return self.username

class AudioMsg(models.Model):
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE)
    author_name = models.TextField(max_length=50, blank=False, null=False)
    author_email = models.TextField(max_length=50, blank=False, null=False)
    date = models.TextField(max_length=50, blank=False, null=False)
    hour = models.TextField(max_length=50, blank=False, null=False)
    audio_url = models.TextField(max_length=100, blank=False, null=False)


