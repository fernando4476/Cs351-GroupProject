# IDDFS implementation

def iddfs(graph, start, max_depth=3):
    """
    Runs IDDFS from `start` up to `max_depth`.
    Returns a dictionary: depth -> list of IDs
    """
    results = {}

    for depth in range(1, max_depth + 1):
        visited = set()
        layer = depth_limited_dfs(graph, start, depth, visited)
        results[depth] = layer

    return results


def depth_limited_dfs(graph, node, depth, visited):
    """
    Returns all nodes reachable exactly at *this* depth.
    """
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

    return list(set(results))
