package com.optiPath.pathOptimizer.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.LinkedList;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PathObject {
    LinkedList<String> cities;
    int distance;
}
