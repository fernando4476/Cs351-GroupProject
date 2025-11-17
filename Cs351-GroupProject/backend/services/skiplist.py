import random, math, time

class SkipNode:
    __slots__ = ("key","val","forwards")
    def __init__(self, key, val, level):
        self.key = key  # larger = more recent
        self.val = val  # service_id
        self.forwards = [None]*(level+1)

class SkipList:
    def __init__(self, p=0.5, max_level=16, capacity=50):
        self.p = p
        self.max_level = max_level
        self.level = 0
        self.head = SkipNode(float("inf"), None, max_level)  # sentinel high key
        self.size = 0
        self.capacity = capacity
        self._seen = set()  # avoid duplicates (latest view wins)

    def _random_level(self):
        lvl = 0
        while random.random() < self.p and lvl < self.max_level:
            lvl += 1
        return lvl

    def insert(self, key, val):
        # if same service appears again, we remove old and re-insert with newer key
        if val in self._seen:
            self.remove_val(val)
        update = [None]*(self.max_level+1)
        cur = self.head
        for i in range(self.level, -1, -1):
            while cur.forwards[i] and cur.forwards[i].key > key:
                cur = cur.forwards[i]
            update[i] = cur
        lvl = self._random_level()
        if lvl > self.level:
            for i in range(self.level+1, lvl+1):
                update[i] = self.head
            self.level = lvl
        node = SkipNode(key, val, lvl)
        for i in range(lvl+1):
            node.forwards[i] = update[i].forwards[i]
            update[i].forwards[i] = node
        self.size += 1
        self._seen.add(val)
        # trim over capacity (drop oldest at tail)
        while self.size > self.capacity:
            self.pop_oldest()

    def pop_oldest(self):
        # traverse from head down to tail oldest (end of level 0)
        cur = self.head
        while cur.forwards[0] and cur.forwards[0].forwards[0]:
            cur = cur.forwards[0]
        # cur.forwards[0] is last. Actually list is descending; oldest is the tail.
        # Walk once to gather all nodes in level 0 and pop last.
        arr = []
        n = self.head.forwards[0]
        while n:
            arr.append(n)
            n = n.forwards[0]
        if not arr: return
        oldest = arr[-1]
        self.remove_val(oldest.val)

    def remove_val(self, val):
        # remove node by value by searching via key order on level 0
        prevs = [None]*(self.max_level+1)
        cur = self.head
        for i in range(self.level, -1, -1):
            while cur.forwards[i] and cur.forwards[i].val != val and cur.forwards[i].key > -math.inf:
                # skip forward while next val isn't ours (keys are descending)
                # we can’t efficiently find by val do linear on each level
                nxt = cur.forwards[i]
                if nxt.val == val:
                    break
                cur = nxt
            prevs[i] = cur
        # final check at level 0
        target = None
        if prevs[0].forwards[0] and prevs[0].forwards[0].val == val:
            target = prevs[0].forwards[0]
        else:
            # fallback linear scan level 0
            n = self.head
            while n.forwards[0] and n.forwards[0].val != val:
                n = n.forwards[0]
            target = n.forwards[0]
        if not target: return
        for i in range(self.level+1):
            if prevs[i].forwards[i] == target:
                prevs[i].forwards[i] = target.forwards[i]
        while self.level > 0 and not self.head.forwards[self.level]:
            self.level -= 1
        self.size -= 1
        self._seen.discard(val)

    def to_list(self, limit=None):
        # return vals from most recent (highest key) to oldest
        res = []
        n = self.head.forwards[0]
        while n and (limit is None or len(res) < limit):
            res.append(n.val)
            n = n.forwards[0]
        return res
