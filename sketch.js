// Roger Paredes i Aleix Torres

// array de camins
let paths = [];
// variable per saber si pintem o no
let painting = false;
// temps que passa abans del segÜent cercle
let next = 0;
// per saber on som i on hem estat dins del canvas
let current;
let previous;
// color
var col;


function setup() {
  // preparem el canvas
  createCanvas(displayWidth, displayHeight);
  current = createVector(0,0);
  previous = createVector(0,0);
};

function draw() {
  background(255);

  // si es tiemps de fer un nou punt
  if (millis() > next && painting) {

    // obtenir posició del ratoli
    current.x = mouseX;
    current.y = mouseY;

    // La força de la nova particula depen del moviment del mouse
    let force = p5.Vector.sub(current, previous);
    force.mult(0.05);

    // afegir nova partícula
    paths[paths.length - 1].add(current, force);

    // programar el seguent cercle
    next = millis() + random(100);

    // Guardar posicions del mouse
    previous.x = current.x;
    previous.y = current.y;
  }

  // dibuixar camins
  for( let i = 0; i < paths.length; i++) {
    paths[i].update();
    paths[i].display();
  }
}

// començar a dibuixar al premer al mouse
function mousePressed() {
  next = 0;
  painting = true;
  previous.x = mouseX;
  previous.y = mouseY;
  paths.push(new Path());
  col = color(random(255), random(255), random(255), random(100));
}

function deviceShaken(){
  
  background(255);
}
// parar
function mouseReleased() {
  painting = false;
}

// un cami Path es una llista de partícules
class Path {
  constructor() {
    this.particles = [];
    this.hue = random(100);
  }

  add(position, force) {
    // agregar una nueva partícula con una posición, fuerza y tinte
    this.particles.push(new Particle(position, force, this.hue));
  }
  
  // mostrar cami
  update() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
    }
  }
  
  // mostrar camino
  display() {
  
    // iterar sobre el cami anterior fins davant
    for (let i = this.particles.length - 1; i >= 0; i--) {
      // si debemos removerlo
      if (this.particles[i].lifespan <= 0) {
        this.particles.splice(i, 1);
      // si no, mostrarlo en pantalla
      } else {
        this.particles[i].display(this.particles[i+1]);
      }
    }  
  }
}

// Classe Particula
// particules del camí
class Particle {
  // necessitem 3 paràmetres: posicio, força i color
  constructor(position, force, hue) {
    // els cercles es creen on sigui el cursor.
    // com més lent movem el cursor, més cercles generarem.
    this.position = createVector(position.x, position.y);
    this.velocity = createVector(force.x, force.y);
    this.drag = 0.95;
    this.lifespan = 400;
    this.hue = col;
  }

  update() {
    // moure
    this.position.add(this.velocity);
    // disminueix la velocitat
    this.velocity.mult(this.drag);
    // duracio visual de cada linia/particula que generem
    this.lifespan--;
  }
  
  // dibuixar una particula i unir-la a una linia
  // dibuixar una linia a l'altre
  display(other) {
    
    stroke(0, this.lifespan);
    fill(col, this.lifespan/2);
    
    ellipse(this.position.x,this.position.y, 15, 15);
    // utilitzem un "if" per si volem dibuixar més linies
    if (other) {
      line(this.position.x, this.position.y, other.position.x, other.position.y);
    }
  }  
}

