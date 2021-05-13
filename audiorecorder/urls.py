from django.urls import path, include
from django.conf.urls import url
from rest_framework.authtoken.views import obtain_auth_token

from . import views

urlpatterns = [ 
    path('', views.index, name='index'),
    path('podcaster/login', views.login, name='login'),
    path('podcaster/podcasts/', views.podcast_list, name='podcasts'),
    path('podcaster/getpodcaster/', views.GetUser),
    path('podcaster/changepassword/', views.change_password, name='change password'),
    path("api/audio-post/", views.AudioFileUpload.as_view(), name="rest_audio_upload"),
    path("api/entry-post/", views.AudioMsgPost),
    path("api/entry-get/", views.AudioMsgList),
    path("api/entry-delete/<pk>", views.AudioMsgDelete),
    path("api/podcast-get/", views.PodcastList),
    path("api/podcast-post/", views.PodcastPost),
    path("api/audio-get/<audio-name>", views.GetAudio),
    path("api/auth-token/", obtain_auth_token),
    path("api/user-post/", views.UserCreate),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^account/', include('allauth.urls')),
]