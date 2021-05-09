from rest_framework.serializers import ModelSerializer
from .models import audioEntry, podcastuser, Podcast, AudioMsg

class AudioFileSerializer(ModelSerializer):
    class Meta:
        model = audioEntry
        fields = ['audioFile']

    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)

class PodcastSerializer(ModelSerializer):
    class Meta:
        model = Podcast
        fields = '__all__'

class AudioMsgSerializer(ModelSerializer):
    class Meta:
        model = AudioMsg
        fields = '__all__'
    
    def to_representation(self, instance):
        self.fields['podcast'] = PodcastSerializer(read_only = True)
        return super(AudioMsgSerializer, self).to_representation(instance)

class PodcastUserSerializer(ModelSerializer):
    class Meta:
        model = podcastuser
        fields = ['username', 'is_owner']