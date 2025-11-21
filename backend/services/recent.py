import time
from django.core.cache import cache
from .skiplist import SkipList

CACHE_KEY = "recent_sl_user_%s"
CAPACITY = 50
TTL = 60*60*6  # 6 hours

def _load_or_build(user):
    key = CACHE_KEY % user.id
    sl = cache.get(key)
    if sl is None:
        sl = SkipList(capacity=CAPACITY)
    return sl

def push_view(user, service, ts=None):
    ts = ts or time.time()
    sl = _load_or_build(user)
    sl.insert(ts, service.id)
    cache.set(CACHE_KEY % user.id, sl, TTL)

def get_recent_list(user, limit=20):
    sl = _load_or_build(user)
    return sl.to_list(limit=limit)
