package com.optiPath.pathOptimizer.controller;

import com.optiPath.pathOptimizer.model.PathObject;
import com.optiPath.pathOptimizer.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin()
@RestController
@RequestMapping("/")
public class RouteController {

    private final RouteService routeService;

    @Autowired
    public RouteController(RouteService routeService){
        this.routeService = routeService;
    }

    @GetMapping("/greet")
    public String greet(){
        return "hello";
    }

    @GetMapping("/City {from}-City {to}")
    public ResponseEntity<PathObject> getShortestRoute(
            @PathVariable Character from,
            @PathVariable Character to
    ){
        return routeService.getShortestRoute(from, to);
    }
}
