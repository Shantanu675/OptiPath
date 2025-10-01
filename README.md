# 🌐 OptiPath – Pathfinding Visualization System

OptiPath is an **interactive pathfinding visualization system** that demonstrates **shortest-path algorithms** through a web interface.  
It allows users to select two cities on a graph and visualizes the **optimal route** calculated using **Dijkstra’s algorithm**.  

![OptiPath Demo](docs/demo.gif) <!-- Replace with actual demo gif/screenshot -->

---

## ✨ Features
- 🖱️ **Interactive Graph Visualization**  
  - Clickable city nodes with state indicators (start, end, visited).  
  - Real-time path highlighting using animated SVG edges.  
  - Responsive UI with hover effects and zoom/pan.  

- 🛤️ **Pathfinding Algorithm**  
  - Backend implementation of **Dijkstra’s algorithm**.  
  - RESTful API endpoint pattern:  
    ```
    GET /{fromCity}-{toCity}
    ```
  - JSON response format with cities array and total distance.  

- ⚡ **Modern Tech Stack**  
  - **Frontend:** React + TailwindCSS + D3.js (for visualization).  
  - **Backend:** Spring Boot (Java) REST API.  
  - **Database:** In-memory (can extend to MySQL/Neo4j).  

---

## 📖 Documentation
- [System Architecture](https://deepwiki.com/Shantanu675/OptiPath)

