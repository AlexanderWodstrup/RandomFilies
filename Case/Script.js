#!/usr/bin/env node

const filelocation = process.argv[2];

class Card {
  constructor(name) {
    this.name = name;
  }
}

class NumCard extends Card {
  constructor(name, value) {
    super(name);
    this.value = value;
  }
}

class EquationCard extends Card {
  constructor(name, operator, value1, value2) {
    super(name);
    this.operator = operator;
    this.value = value1;
    this.value2 = value2;
  }
}

const fs = require("fs");
const readline = require("readline");

const Array = [];

async function processLineByLine() {
  const fileStream = fs.createReadStream(filelocation);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    generateCard(line);
  }

  sort();
  const root = binarySearch(Array, "root");
  const value = sum("root", root.value, root.operator, root.value2);
  console.log("root: " + value);
}

const generateCard = (line) => {
  const lineSplit = line.split(" ");
  if (isNaN(lineSplit[1])) {
    Array.push(
      new EquationCard(
        lineSplit[0].replace(":", ""),
        lineSplit[1],
        lineSplit[2],
        lineSplit[3]
      )
    );
  } else {
    Array.push(new NumCard(lineSplit[0].replace(":", ""), lineSplit[1]));
  }
};

const sort = () => {
  Array.sort((a, b) => a.name.localeCompare(b.name));
};

const binarySearch = (items, value) => {
  var startIndex = 0;
  var stopIndex = items.length - 1;
  var middle = Math.floor((stopIndex + startIndex) / 2);

  while (items[middle].name != value && startIndex < stopIndex) {
    if (value < items[middle].name) {
      stopIndex = middle - 1;
    } else if (value > items[middle].name) {
      startIndex = middle + 1;
    }

    middle = Math.floor((stopIndex + startIndex) / 2);
  }

  return items[middle];
};

const sum = (Origin, a, operator, b) => {
  console.log(Origin + ": " + a + " " + operator + " " + b);

  if (isNaN(a)) {
    const tmp = binarySearch(Array, a);
    if (tmp.operator == undefined && tmp.value2 == undefined)
      return sum(a, tmp.value, operator, b);
    return sum(
      Origin,
      sum(a, tmp.value, tmp.operator, tmp.value2),
      operator,
      b
    );
  } else if (isNaN(b)) {
    const tmp = binarySearch(Array, b);
    if (tmp.value2 == undefined && tmp.operator == undefined)
      return sum(b, a, operator, tmp.value);
    return sum(
      Origin,
      a,
      operator,
      sum(b, tmp.value, tmp.operator, tmp.value2)
    );
  } else if (operator == "+") {
    return parseInt(a) + parseInt(b);
  } else if (operator == "-") {
    return parseInt(a) - parseInt(b);
  } else if (operator == "/") {
    return parseInt(a) / parseInt(b);
  } else {
    return parseInt(a) * parseInt(b);
  }
};

processLineByLine();
