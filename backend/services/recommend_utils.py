from .models import Service

def build_similarity_graph():
    """
    Build a graph of services based on:
    - same provider
    - same location
    - overlapping words in title
    """
    graph = {}
    services = Service.objects.all()

    # Initialize graph
    for s in services:
        graph[s.id] = set()

    # Compare all pairs
    for s1 in services:
        for s2 in services:
            if s1.id == s2.id:
                continue

            # Same provider
            if s1.provider_id == s2.provider_id:
                graph[s1.id].add(s2.id)
                continue

            # Same location
            if s1.location.strip().lower() == s2.location.strip().lower():
                graph[s1.id].add(s2.id)
                continue

            # Title word overlap
            t1 = set(s1.title.lower().split())
            t2 = set(s2.title.lower().split())
            if len(t1.intersection(t2)) > 0:
                graph[s1.id].add(s2.id)

    # Convert sets → lists for JSON
    return {k: list(v) for k, v in graph.items()}