package com.optiPath.pathOptimizer.service;

import com.optiPath.pathOptimizer.model.PathObject;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RouteService {

    int[][] edges = {
            {1,2,157},{1,3,79},{1,4,58},{1,5,85},
            {2,6,176},{3,6,76},{3,5,52},{4,7,93},{5,7,81},{5,10,70},
            {5,8,71},{5,9,192},{5,6,72},{7,11,54},{7,14,207},{7,10,45},
            {8,10,88},{8,13,59},{8,12,64},{8,9,63},{9,16,223},{10,14,103},
            {10,13,44},{12,13,75},{13,14,12},{13,15,62},{13,16,72},
            {14,15,47},{14,17,43},{15,17,31},{15,16,57}
    };

    public ResponseEntity<PathObject> getShortestRoute(Character from, Character to){
        int n = 17; // total nodes
        int m = edges.length;

        int src = from - 'A' + 1;
        int dest = to - 'A' + 1;

        int[] parent = new int[n + 1];
        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);

        List<List<List<Integer>>> adj = new ArrayList<>();
        for (int i = 0; i <= n; i++) {
            adj.add(new ArrayList<>());
        }

        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], wt = edge[2];
            adj.get(u).add(Arrays.asList(v, wt));
            adj.get(v).add(Arrays.asList(u, wt));
        }

        PriorityQueue<N> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a.d));
        pq.offer(new N(src, 0));
        dist[src] = 0;
        parent[src] = src;

        while (!pq.isEmpty()) {
            N cur = pq.poll();
            int node = cur.n;
            int d = cur.d;

            for (List<Integer> neighbor : adj.get(node)) {
                int adjNode = neighbor.get(0);
                int weight = neighbor.get(1);

                if (dist[node] + weight < dist[adjNode]) {
                    dist[adjNode] = dist[node] + weight;
                    parent[adjNode] = node;
                    pq.offer(new N(adjNode, dist[adjNode]));
                }
            }
        }

        LinkedList<String> path = new LinkedList<>();
        int node = dest;
        while (node != src) {
            path.addFirst("City " + (char)(node + 64));
            node = parent[node];
        }
        path.addFirst("City " + (char)(src + 64));

        return ResponseEntity.ok(new PathObject(path, dist[dest]));
    }
}
