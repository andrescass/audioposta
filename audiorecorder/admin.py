from django.contrib import admin
from .models import audioEntry, podcastuser, Podcast, AudioMsg

# Register your models here.
admin.site.register(audioEntry)
admin.site.register(AudioMsg)
admin.site.register(podcastuser)
admin.site.register(Podcast)
