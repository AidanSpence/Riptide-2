from rest_framework import serializers


# ---------------------------------------------------------------------
# Small helpers: every field is optional and accepts null, because the
# model often sends {"min": null, "max": null, ...}
# ---------------------------------------------------------------------
class NullableFloat(serializers.FloatField):
    def __init__(self, **kwargs):
        kwargs.setdefault("required", False)
        kwargs.setdefault("allow_null", True)
        super().__init__(**kwargs)


class NullableInt(serializers.IntegerField):
    def __init__(self, **kwargs):
        kwargs.setdefault("required", False)
        kwargs.setdefault("allow_null", True)
        super().__init__(**kwargs)


def string_list():
    return serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list,
    )


# ---------------------------------------------------------------------
# Audio features
# ---------------------------------------------------------------------
class BaseFeatureSerializer(serializers.Serializer):
    weight = NullableFloat(min_value=0)
    confidence = NullableFloat(min_value=0, max_value=1)


class UnitFeatureSerializer(BaseFeatureSerializer):
    """energy, danceability, acousticness, ... (0-1)"""
    target = NullableFloat(min_value=0, max_value=1)
    min = NullableFloat(min_value=0, max_value=1)
    max = NullableFloat(min_value=0, max_value=1)


class BpmFeatureSerializer(BaseFeatureSerializer):
    target = NullableFloat(min_value=30, max_value=300)
    min = NullableFloat(min_value=30, max_value=300)
    max = NullableFloat(min_value=30, max_value=300)


class LoudnessFeatureSerializer(BaseFeatureSerializer):
    target = NullableFloat(min_value=-60, max_value=5)
    min = NullableFloat(min_value=-60, max_value=5)
    max = NullableFloat(min_value=-60, max_value=5)


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


# ---------------------------------------------------------------------
# Search
# ---------------------------------------------------------------------
class PopularitySerializer(serializers.Serializer):
    target = NullableFloat(min_value=0, max_value=1)
    min = NullableFloat(min_value=0, max_value=1)
    max = NullableFloat(min_value=0, max_value=1)
    weight = NullableFloat(min_value=0)


class ReleaseYearsSerializer(serializers.Serializer):
    min = NullableInt(min_value=1000, max_value=2200)
    max = NullableInt(min_value=1000, max_value=2200)


class SearchSerializer(serializers.Serializer):
    audio_features = AudioFeaturesSerializer(required=False, default=dict)
    genres = string_list()
    include_artists = string_list()
    exclude_artists = string_list()
    reference_tracks = string_list()
    popularity = PopularitySerializer(required=False, default=dict)
    release_years = ReleaseYearsSerializer(required=False, default=dict)


# ---------------------------------------------------------------------
# Constraints / playlist settings
# ---------------------------------------------------------------------
class ConstraintsSerializer(serializers.Serializer):
    # allowed unless the AI explicitly sends false
    explicit_content = serializers.BooleanField(
        required=False,
        default=True,
        allow_null=True,
    )
    excluded_genres = string_list()
    language = string_list()
    required_features = string_list()
    other = string_list()


class PlaylistSerializer(serializers.Serializer):
    track_count = NullableInt(default=30, min_value=1, max_value=100)
    strategy = serializers.CharField(
        required=False, allow_null=True, allow_blank=True
    )
    diversity = NullableFloat(min_value=0, max_value=1)
    discovery = NullableFloat(min_value=0, max_value=1)
    # free text: "none", "ascending", "build", "steady", ...
    # playlist_builder.energy_progression() normalises it
    energy_progression = serializers.CharField(
        required=False, allow_null=True, allow_blank=True
    )
    artist_repetition_limit = NullableInt(default=2, min_value=1)
    harmonic_compatibility = serializers.BooleanField(
        required=False, allow_null=True
    )
    title = serializers.CharField(
        required=False, allow_null=True, allow_blank=True, max_length=100
    )
    message = serializers.CharField(
        required=False, allow_null=True, allow_blank=True
    )


class RecommendationRequestSerializer(serializers.Serializer):
    intent = serializers.DictField(required=False, default=dict)
    search = SearchSerializer()
    constraints = ConstraintsSerializer(required=False, default=dict)
    playlist = PlaylistSerializer(required=False, default=dict)
    clarification = serializers.DictField(required=False, default=dict)