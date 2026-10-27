from rest_framework import serializers


class NullableFloat(serializers.FloatField):
    def __init__(self, **kwargs):
        kwargs.setdefault("required", False)
        kwargs.setdefault("allow_null", True)
        super().__init__(**kwargs)


def _feature_serializer(name, lo=None, hi=None):
    """Build a serializer for one feature with the given target/min/max bounds."""
    bounds = {"min_value": lo, "max_value": hi}
    return type(name, (serializers.Serializer,), {
        "target": NullableFloat(**bounds),
        "min": NullableFloat(**bounds),
        "max": NullableFloat(**bounds),
        "weight": NullableFloat(min_value=0),
        "confidence": NullableFloat(min_value=0, max_value=1),
    })


UnitFeatureSerializer = _feature_serializer("UnitFeatureSerializer", 0, 1)
BpmFeatureSerializer = _feature_serializer("BpmFeatureSerializer", 30, 300)
LoudnessFeatureSerializer = _feature_serializer("LoudnessFeatureSerializer", -60, 5)


class AudioFeaturesSerializer(serializers.Serializer):
    energy = UnitFeatureSerializer(required=False)
    danceability = UnitFeatureSerializer(required=False)
    acousticness = UnitFeatureSerializer(required=False)
    instrumentalness = UnitFeatureSerializer(required=False)
    valence = UnitFeatureSerializer(required=False)
    speechiness = UnitFeatureSerializer(required=False)
    liveness = UnitFeatureSerializer(required=False)
    bpm = BpmFeatureSerializer(required=False)
    loudness_db = LoudnessFeatureSerializer(required=False)


class SearchSerializer(serializers.Serializer):
    audio_features = serializers.DictField(
        child=AudioFeaturesSerializer(),
        required=False,
    )

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
        default=True,
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