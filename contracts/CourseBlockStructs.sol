// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Estructura para almacenar el detalle de los cursos
struct Course {
    string courseTitle;
    uint courseCreationDate;
    uint price;
    CourseUnit[] courseUnits;
}

struct CourseUnit {
  string unitTitle;
  string unitDescription;
  uint unitCreationDate;
  UnitLesson[] courseLessons;
}

struct UnitLesson {
  string lessonTitle;
  string lessonDescription;
  string lessonType;
  string lessonContent; // IPFS link to content
}