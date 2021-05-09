from django.conf import settings
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
import os

from .serializers import AudioFileSerializer, AudioMsgSerializer, PodcastSerializer, PodcastUserSerializer
from .models import audioEntry, podcastuser, Podcast, AudioMsg
from .managers import CustomUserManager


def index(request):
    context = {}
    return render(request, 'index.html', context)

def login(request):
    context = {}
    return render(request, 'login.html', context)

def podcast_list(request):
    context = {}
    return render(request, 'audiolist.html', context)
    
def change_password(request):
    context = {}
    return render(request, 'password_change.html', context)

class AudioFileUpload(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        serializer = AudioFileSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST', 'DELETE'])
def PodcastList(request):
    if request.method == 'GET':
        podcasts = Podcast.objects.all()
        podcast_serialized = PodcastSerializer(podcasts, many = True)
        return JsonResponse(podcast_serialized.data, safe=False)
    if request.method == 'POST':
        #audioMsg_data = JSONParser().parse(request)
        podcast = PodcastSerializer(data = request.data)
        if podcast.is_valid():
            podcast.save()
            return Response(podcast.data, status=status.HTTP_201_CREATED)
        else:
            return Response(podcast.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def AudioMsgList(request):
    if request.method == 'GET':
        audioMsgs = AudioMsg.objects.all()
        user = request.user
        audioMsgList = []
        if user.is_owner:
            audioMsg_serialized = AudioMsgSerializer(audioMsgs, many = True)
        else:
            for pod in user.podcast.all():
                for audioM in audioMsgs:
                    if pod.id == audioM.podcast.id:
                        audioMsgList.append(audioM)
            audioMsg_serialized = AudioMsgSerializer(audioMsgList, many = True)
        return JsonResponse(audioMsg_serialized.data, safe=False)
    

@api_view(['POST'])
def AudioMsgPost(request):
    if request.method == 'POST':
        #audioMsg_data = JSONParser().parse(request)
        audioMsg = AudioMsgSerializer(data = request.data)
        if audioMsg.is_valid():
            audioMsg.save()
            return Response(audioMsg.data, status=status.HTTP_201_CREATED)
        else:
            return Response(audioMsg.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def UserCreate(request):
    if request.method == 'POST':
        get_user_model().objects.create_user(username = request.username, email = request.email, password = request.password)
        return Response("User created", status=status.HTTP_201_CREATED)
    else:
        return Response("Error", status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetUser(request):
    if request.method == 'GET':
        user = request.user
        userSerialized = PodcastUserSerializer(user)
        return Response(userSerialized.data, status=status.HTTP_201_CREATED)
    else:
        return Response(userSerialized.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def AudioMsgDelete(request, pk):
    if request.method == 'DELETE':
        msg = AudioMsg.objects.get(id = pk)
        audio_url = msg.audio_url
        audio_name = "audios/" + audio_url.split('/')[-1]
        os.remove(os.path.join(settings.MEDIA_ROOT, audio_name))
        msg.delete()
        return JsonResponse({'message': 'Entry deleted'}, status=status.HTTP_204_NO_CONTENT)






