#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <queue>
#include <fstream>
#include <algorithm>

using namespace std;

const int INF = 1e9;

// Structure for one edge
struct Edge {
    int to;
    int time;  // in minutes
};

// Our Metro System class
class MetroSystem {
private:
    unordered_map<string, int> stationId;     // station name -> index
    vector<string> stationNames;              // index -> station name
    vector<vector<Edge>> graph;               // adjacency list

    // Dijkstra to find shortest path + time
    pair<vector<int>, int> dijkstra(int src, int dest) {
        int n = graph.size();
        vector<int> dist(n, INF);
        vector<int> parent(n, -1);

        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;

        dist[src] = 0;
        pq.push(make_pair(0, src));

        while (!pq.empty()) {
            pair<int, int> top = pq.top();
            pq.pop();

            int cost = top.first;
            int u = top.second;

            if (cost > dist[u]) continue;

            for (int i = 0; i < graph[u].size(); i++) {
                Edge e = graph[u][i];

                if (dist[u] + e.time < dist[e.to]) {
                    dist[e.to] = dist[u] + e.time;
                    parent[e.to] = u;
                    pq.push(make_pair(dist[e.to], e.to));
                }
            }
        }

        if (dist[dest] == INF) return make_pair(vector<int>(), -1);

        vector<int> path;
        for (int at = dest; at != -1; at = parent[at]) {
            path.push_back(at);
        }
        reverse(path.begin(), path.end());

        return make_pair(path, dist[dest]);
    } 

public:
    // Add new station
    void addStation(string name) {
        if (stationId.count(name)) {
            cout << "Station already exists!\n";
            return;
        }
        int id = stationNames.size();
        stationId[name] = id;
        stationNames.push_back(name);
        graph.resize(id + 1);
        cout << "Station '" << name << "' added successfully!\n";
    }

    // Add connection between two stations
    void addConnection(string from, string to, int time) {
        if (!stationId.count(from) || !stationId.count(to)) {
            cout << "One or both stations not found!\n";
            return;
        }
        int u = stationId[from];
        int v = stationId[to];
        graph[u].push_back({v, time});
        graph[v].push_back({u, time});  // undirected
        cout << "Connection added: " << from << " <-> " << to << " (" << time << " min)\n";
    }

    // Find shortest path
    void findPath(string start, string end) {
        if (!stationId.count(start) || !stationId.count(end)) {
            cout << "Station not found!\n";
            return;
        }

        pair<vector<int>, int> result = dijkstra(stationId[start], stationId[end]);

        vector<int> path = result.first;
        int totalTime = result.second;

        if (totalTime == -1) {
            cout << "No path exists!\n";
            return;
        }

        cout << "\n=== SHORTEST PATH ===\n";
        cout << "Time: " << totalTime << " minutes\n";
        cout << "Path: ";

        for (int i = 0; i < path.size(); i++) {
            cout << stationNames[path[i]];
            if (i != path.size() - 1) cout << " -> ";
        }
        cout << "\n";
    }

    // Save to file
    void saveToFile(string filename = "metro_data.txt") {
        ofstream file(filename);
        file << stationNames.size() << "\n";
        for (string &s : stationNames) file << s << "\n";

        for (int u = 0; u < graph.size(); u++) {
            for (auto &e : graph[u]) {
                if (u < e.to) {  // save only once
                    file << stationNames[u] << " " << stationNames[e.to] << " " << e.time << "\n";
                }
            }
        }
    }

    // Load from file (Silent loading for initialization)
    void loadFromFile(string filename = "metro_data.txt") {
        ifstream file(filename);
        if (!file.is_open()) {
            return;
        }
        int n;
        file >> n;
        stationNames.clear();
        stationId.clear();
        graph.clear();

        string name;
        getline(file, name); // consume newline
        for (int i = 0; i < n; i++) {
            getline(file, name);
            if (stationId.count(name)) continue;
            int id = stationNames.size();
            stationId[name] = id;
            stationNames.push_back(name);
            graph.resize(id + 1);
        }

        string from, to;
        int time;
        while (file >> from >> to >> time) {
            if (!stationId.count(from) || !stationId.count(to)) continue;
            int u = stationId[from];
            int v = stationId[to];
            graph[u].push_back({v, time});
            graph[v].push_back({u, time}); 
        }
    }

    // Return stations as plain text
    void showAllStations() {
        cout << "All Stations (" << stationNames.size() << "):\n";
        for (string &s : stationNames) cout << "- " << s << "\n";
    }
};

int main(int argc, char* argv[]) {
    if (argc < 2) return 0;
    string cmd = argv[1];

    MetroSystem metro;
    metro.loadFromFile("metro_data.txt");  

    if (cmd == "addStation" && argc == 3) {
        metro.addStation(argv[2]);
        metro.saveToFile("metro_data.txt");
    } else if (cmd == "addConnection" && argc == 5) {
        metro.addConnection(argv[2], argv[3], stoi(argv[4]));
        metro.saveToFile("metro_data.txt");
    } else if (cmd == "findPath" && argc == 4) {
        metro.findPath(argv[2], argv[3]);
    } else if (cmd == "showAll") {
        metro.showAllStations();
    } else {
        cout << "Invalid arguments/command.\n";
    }
    return 0;
}
