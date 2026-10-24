from rest_framework import serializers


class AudioFeatureSerializer(serializers.Serializer):
    target = serializers.FloatField(
        required=False,
        min_value=0,
        max_value=1,
    )
    min = serializers.FloatField(
        required=False,
        min_value=0,
        max_value=1,
    )
    max = serializers.FloatField(
        required=False,
        min_value=0,
        max_value=1,
    )
    weight = serializers.FloatField(
        required=False,
        min_value=0,
    )
    confidence = serializers.FloatField(
        required=False,
        min_value=0,
        max_value=1,
    )

class LoudnessSerializer(serializers.Serializer):
    target = serializers.FloatField(required=False)
    min = serializers.FloatField(required=False)
    max = serializers.FloatField(required=False)
    weight = serializers.FloatField(required=False, min_value=0)
    confidence = serializers.FloatField(
        required=False, min_value=0, max_value=1
    )


class SearchSerializer(serializers.Serializer):
    audio_features = serializers.DictField(
        child=AudioFeatureSerializer(),
        required=False,
    )

    loudness_db = LoudnessSerializer(required=False)

    genres = serializers.ListField(
        child=serializers.CharField(),
        required=False,
    )
    include_artists = serializers.ListField(
        child=serializers.CharField(),
        required=False,
    )
    exclude_artists = serializers.ListField(
        child=serializers.CharField(),
        required=False,
    )
    popularity = serializers.DictField(required=False)
    release_years = serializers.DictField(required=False)


class ConstraintsSerializer(serializers.Serializer):
    explicit_content = serializers.BooleanField(
        required=False,
        default=False,
        allow_null=True,
    )
    excluded_genres = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list,
    )
    language = serializers.ListField(
    child=serializers.CharField(),
    required=False,
    default=list,
    )


class PlaylistSerializer(serializers.Serializer):
    track_count = serializers.IntegerField(
        required=False,
        default=30,
        min_value=1,
        max_value=100,
    )
    strategy = serializers.CharField(required=False)
    diversity = serializers.FloatField(
        required=False,
        min_value=0,
        max_value=1,
    )
    artist_repetition_limit = serializers.IntegerField(
        required=False,
        min_value=1,
    )


class RecommendationRequestSerializer(serializers.Serializer):
    intent = serializers.DictField()
    search = SearchSerializer()
    constraints = ConstraintsSerializer(required=False, default=dict)
    playlist = PlaylistSerializer(required=False, default=dict)