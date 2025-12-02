import re
from collections import defaultdict


def tokenize_service(service):
    text_parts = [
        getattr(service, "title", ""),
        getattr(service, "description", ""),
        getattr(service, "location", ""),
    ]
    provider = getattr(service, "provider", None)
    if provider:
        text_parts.extend(
            [
                getattr(provider, "business_name", ""),
                getattr(provider, "description", ""),
            ]
        )
    text = " ".join(part for part in text_parts if part)
    tokens = re.findall(r"[a-z0-9]+", text.lower())
    return set(tokens)


def build_similarity_graph(services):
    keyword_map = defaultdict(set)
    service_tokens = {}

    for service in services:
        tokens = tokenize_service(service)
        service_tokens[service.id] = tokens
        for token in tokens:
            if token:
                keyword_map[token].add(service.id)

    graph = defaultdict(set)
    for service_id, tokens in service_tokens.items():
        neighbors = set()
        for token in tokens:
            neighbors.update(keyword_map[token])
        neighbors.discard(service_id)
        graph[service_id] = neighbors

    return graph


def iddfs(graph, start, max_depth=3):
    results = {}
    for depth in range(1, max_depth + 1):
        visited = set()
        layer = depth_limited_dfs(graph, start, depth, visited)
        results[depth] = layer
    return results


def depth_limited_dfs(graph, node, depth, visited):
    if depth == 0:
        return []

    visited.add(node)
    results = []

    for neighbor in graph.get(node, []):
        if neighbor not in visited:
            if depth == 1:
                results.append(neighbor)
            else:
                results.extend(
                    depth_limited_dfs(graph, neighbor, depth - 1, visited)
                )

    # remove duplicates while preserving order
    seen = set()
    unique_results = []
    for value in results:
        if value not in seen:
            seen.add(value)
            unique_results.append(value)
    return unique_results
