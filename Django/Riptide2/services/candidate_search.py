from django.db import connection
from .target_vector import build_target_vector

def retrieve_candidates(ai_result, candidate_limit=500):
    search = ai_result["search"]