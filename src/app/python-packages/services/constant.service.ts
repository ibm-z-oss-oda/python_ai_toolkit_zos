import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {
  INDEX_NAME =  "name";
  INDEX_TAGS =  "tags";
  INDEX_VERSIONS =  "versions";
  // if more tags coming, should be added to ALL_TAGS and ALL_TAGS_TYPE
  ALL_TAGS = [
    "machine_learning", // 0
    "programming_tools", // 1
    "languages", // 2
    "graphics", // 3
    "security", // 4
    "math", // 5
    "utility", // 6
    "web", // 7
    "base" //8
  ];

  ALL_TAGS_TYPE = [
    "blue",
    "purple",
    "green",
    "magenta",
    "red",
    "teal",
    "cyan",
    "warm-gray",
    "cool-gray"
  ]
  
  constructor() { }
}