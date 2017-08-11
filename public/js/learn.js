var animals = new Array("dog","cat","walrus","lion","cat");

// var deletew = animals.splice(animals.splice(animals.indexOf("walrus"),1));
// console.log(deletew);

var insertw =  animals.splice(animals.lastIndexOf("cat"),1,"monkey");
console.log(insertw);