var config={
	type:Phaser.AUTO,
	width:400,
	height:300, 
	pixelArt: true,
	physics:{
		default:'arcade',
		arcade:{
			debug: true,
			gravity:{y:0}
		}
	},
	scene:{
		preload:preload,
		create:create,
		update:update,
	},
	scale:{
		zoom: 2
	}
};

var game=new Phaser.Game(config);

var velocityA;
var velocityE;
var map;
var tileset; 
var obstaculos;
var lava;
var score;
var robin;
var suelo;
var decoracion;
var controls;
var Especial;
var KeyA;
var KeyD;
var KeyW;
var KeyS;
var basico;
var muro;
var contador = 0;
var circulo;
var color1;
var color2;
var invisibilidad;
var ok;
var vida;
var objetos;
var muerto;
var enfriamiento = 0;
var count = 0;
var count_boss = 0;
var j = 0;
var accion;
var tiempo = 0;
var angulo;
var contador_fuego = 0;
var keys;
var encontrado;

function preload() {

	this.load.image('tiles','tilemap/terrain.png');
	this.load.tilemapTiledJSON('dessert','tilemap/mapita.json');
	this.load.spritesheet('Robin','assets/animaciones/robin/Robin.png', { frameWidth: 32, frameHeight: 32 });
	this.load.image('escorpion','assets/images/escorpion.png');
	this.load.spritesheet('boss','assets/animaciones/boss/Walk.png', { frameWidth: 32, frameHeight: 32 });
	this.load.spritesheet('fireball','assets/animaciones/fuego.png', { frameWidth: 32, frameHeight: 32 });
	this.load.image('Slime','assets/images/slime_maligno.png');
	this.load.image('attack','assets/animaciones/boss/fireball.png');
	this.load.image('rage','assets/animaciones/boss/Enfado.png');
}

function create() {

	this.anims.create({
  		key: 'idle',
  		frames: this.anims.generateFrameNames('Robin', { start: 0, end: 2 }),
  		frameRate: 4,
  		repeat: -1
	});

	this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('Robin', { start: 3, end: 5 }),
        frameRate: 4
    });

    this.anims.create({
    	key: 'Fuego',
    	frames: this.anims.generateFrameNames('fireball', { start: 0, end: 1 }),
    	frameRate: 8,
    	repeat: -1
 	});
 	this.anims.create({
      key: 'WalkBoss',
      frames: this.anims.generateFrameNames('boss', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
 	});

	// Mapa

	this.add.sprite(0,0,'tiles');

	map = this.make.tilemap({ key: 'dessert',});
	tileset = map.addTilesetImage('terrain', 'tiles');

	suelo = map.createLayer('Ground', tileset);
	oasis = map.createLayer('Agua', tileset);
	decoracion = map.createLayer('Decoracion', tileset);
	dunas = map.createLayer('Dunas', tileset);
	lava = map.createLayer('Lava', tileset);
	muro = map.createLayer('Pared', tileset);
	spawn = map.createFromObjects('SpawnJugador',tileset);

	// Jugador

	//robin = this.physics.add.sprite(285,-2875,'quieto');
	robin = this.physics.add.sprite(285,0,'Robin');
	robin.play('idle')
	robin.vida = 12;
	
	enemyList = this.physics.add.group();
	shootList = this.physics.add.group();
	
	fire = shootList.create(0,0,'fireball');


	enemy1 = enemyList.create(0,0,'escorpion');
	enemy2 = enemyList.create(100,0,'escorpion');
	enemy3 = enemyList.create(-100,0,'escorpion');
	enemy4 = enemyList.create(200,200,'Slime');
	enemy5 = enemyList.create(100,200,'Slime');
	enemy6 = enemyList.create(-100,200,'Slime').setScale(2);

	enemy1.detect = this.add.circle(enemy1.x,enemy1.y,100);
	this.physics.add.existing(enemy1.detect,false);
	enemy1.encontrado = false;

  	this.physics.add.overlap(enemy1.detect, robin, detectar, null, this);
	//this.physics.add.overlap(enemyList, robin, atacar, null, this);

	boss = enemyList.create(285,-2975,'boss').setScale(3);
	boss.play('WalkBoss')
	boss.fase = 1;
	boss.contador2 = 0;

	// Colisiones

	this.physics.add.collider(robin, muro);
	this.physics.add.collider(robin, dunas);
	//this.physics.add.collider(robin, lava);
	this.physics.add.collider(robin, oasis);
	
	this.physics.add.collider(enemyList, muro);
	this.physics.add.collider(enemyList, dunas);
	//this.physics.add.collider(enemyList, lava);
	this.physics.add.collider(enemyList, enemyList);

	this.physics.add.collider(enemyList, muro);
	this.physics.add.collider(enemyList, lava);
	this.physics.add.collider(enemyList, oasis);

	//robin.setCollideWorldBounds(true);

	muro.setCollisionByProperty({collides: true});
	//lava.setCollisionByProperty({collides: true});
	oasis.setCollisionByProperty({collides: true});
	dunas.setCollisionByProperty({collides: true});

	// Camara

	this.cameras.main.startFollow(robin);	

	velocityA = 200;
	velocityE = 75;
	velocidad_fuego = 100;

	// Controles

	KeyA=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);    		
	KeyD=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
	KeyW=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);    		
	KeyS=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
	KeyE=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E); // Interactuar 
	Especial=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

	// Vida

	text=this.add.text(robin.x-190,robin.y-145,'Vida: ',{fontsize:'8px',fill:'#FFF'});
	text.setText('Vida: ' + robin.vida);

    this.physics.add.overlap(enemyList, robin, updateVida, null, this);
    this.physics.add.overlap(shootList, robin, updateVida, null, this);
    this.physics.add.overlap(shootList, robin, destroyFire, null, this);
    this.physics.add.overlap(lava, robin, ponLava, null, this);
}

function update() {

	if (boss.contador2 > 1000) {
		boss.fase = 2;
	}
	else {
		boss.contador2++;
	}
	
	// Movimiento

	if (KeyA.isDown) {
		robin.setVelocityX(-velocityA);
		robin.play('walk')
	}
	else if (KeyD.isDown) {
		robin.setVelocityX(velocityA);
		robin.play('walk')
	}
	else {
		robin.setVelocityX(0);
		robin.play('idle')
	}
	if (KeyS.isDown) {
		robin.setVelocityY(velocityA);
		robin.play('walk')
	}
	else if (KeyW.isDown) {
		robin.setVelocityY(-velocityA);
		robin.play('walk')
	}
	else {
		robin.setVelocityY(0);
		robin.play('idle')
	}
	if (Especial.isDown && contador == 0) {
		contador++;
		invisibilidad = 1;
	}	
	if (contador <= 300 && invisibilidad == 1) {
		contador++;
		robin.alpha=0.4;
	}
	if (contador >= 300) {
		contador++;
		invisibilidad = 0;
		robin.alpha = 1;
	}
	if (contador == 600) {
		contador = 0;
	}
	text.x = robin.x-190;
	text.y = robin.y-145;

	if (enfriamiento > 0) {
		enfriamiento++;
	}
	if (!invisibilidad && enemy1.encontrado) {
		for (i = 0; i < enemyList.getChildren()[i].length; i++) {
			this.physics.moveTo(enemyList.getChildren()[i],robin.x,robin.y,velocityE);
		}
	}

	updateBoss();
}

var tiempo2 = 20;


function detectar(e,h) {
	e.encontrado = true;
  	//e.stop('Stand');
}

function atacar(e,h) {
 	//e.play('golpe');
}

function updateBoss() {
	count_boss++;

	if (tiempo2 > 40) {
		boss.play('WalkBoss')
	}
	if (count_boss <= 100) {
		boss.setVelocityX(150);
	}
	else if (count_boss > 100 && count_boss <= 285) {
		boss.setVelocityX(-150);
	}
	else if (count_boss > 285 && count_boss <= 470) {
		boss.setVelocityX(150);
	}
	else if (count_boss > 470) {
		boss.setVelocityX(-150);
		count_boss = 100;
	}

	if (boss.fase == 1) {
		accion = Phaser.Math.Between(1,2);
	}
	else if (boss.fase == 2) {
		accion = Phaser.Math.Between(3,4);
	}
	switch(accion) {
		case 1: 
			if (tiempo > 60) {
				boss.setTexture('attack');
				createFire(boss.x,boss.y,1,0,0);
				tiempo = 0;
				tiempo2 = 0;
			}
			else {
				tiempo++;
				tiempo2++;
			}
		
		break;
		case 2:
			if (tiempo > 60) {
				boss.setTexture('attack');
				createFire(boss.x,boss.y,3,0,1); 		
				createFire(boss.x,boss.y,3,0.5,0.87);		// ( 1/2, -(raiz de 3)/2 )
				createFire(boss.x,boss.y,3,-0.5,0.87);	// ( -1/2, -(raiz de 3)/2 ) 
				tiempo = 0;
				tiempo2 = 0;
			}
			else {
				tiempo++;
				tiempo2++;
			}
		break;
		case 3:
			if (tiempo > 60) {
				boss.setTexture('attack');
				createFire(boss.x,boss.y,5,0,1); 		
				createFire(boss.x,boss.y,5,0.5,0.87);		// ( 1/2, -(raiz de 3)/2 )
				createFire(boss.x,boss.y,5,-0.5,0.87);	// ( -1/2, -(raiz de 3)/2 ) 
				createFire(boss.x,boss.y,5,1,1);			
				createFire(boss.x,boss.y,5,-1,1);

				tiempo = 0;
				tiempo2 = 0;
			}
			else {
				tiempo++;
				tiempo2++;
			}
		break;
			default:
			if (tiempo > 60) {
				boss.setTexture('rage');
				createFire(robin.x,robin.y,4,0,0);
				tiempo = 0;
				tiempo2 = 0;
			}
			else {
				tiempo++;
				tiempo2++;
			}
		break;
	}
	for (i=0;i<shootList.getChildren().length;i++) {
		shootList.getChildren()[i].tiempo++;
		var fuego = shootList.getChildren()[i];
		updateFire(fuego);
	}
}

function updateVida() {
	if (!invisibilidad && robin.vida > 0 && enfriamiento == 0) {
		robin.vida--;
		enfriamiento++;
		if (robin.vida <= 0) { 
			robin.muerto = true;
		}
	}
	text.setText('Vida: ' + robin.vida);
	if (enfriamiento >= 60) {
		enfriamiento = 0;
	}
}

function PersonajeMuerto() {
	alert('Has muerto');
	//robin.disableBody(true,true);
	//robin.destroy
}

function createFire(x,y,c,b,h) {

	if (c == 1) {
		fire = shootList.create(x,y,'fireball');
		fire.setVelocity(0,100);
		fire.tiempo = 0;
		fire.play('Fuego');
	}
	else if (c == 3) {
		fire = shootList.create(x,y,'fireball');
		fire.setVelocity(b * velocidad_fuego, h * velocidad_fuego);
		fire.tiempo = 0;
		fire.play('Fuego');
	}
	else if (c == 4) {
		boss.y += 50;
		for (i = 0; i < c; i++) {
			if (i == 0) {
				fire = shootList.create(x,y + 150,'fireball');
				fire.setVelocity(0,-100);
				fire.tiempo = 0;
				fire.play('Fuego');
			}
			if (i == 1) {
				fire = shootList.create(x + 150,y,'fireball');
				fire.setVelocity(-100,0);
				fire.tiempo = 0;
				fire.play('Fuego');
			}
			else if (i == 2) {
				fire = shootList.create(x - 150,y,'fireball');
				fire.setVelocity(100,0);
				fire.tiempo = 0;
				fire.play('Fuego');
			}
			else if (i == 3) {
				fire = shootList.create(x,y - 150,'fireball');
				fire.setVelocity(0,100);
				fire.tiempo = 0;
				fire.play('Fuego');
			}
		}
		boss.y -= 50;
	}
	else if (c == 5) {
			fire = shootList.create(x,y,'fireball');
			fire.setVelocity(b * velocidad_fuego, h * velocidad_fuego);
			fire.tiempo = 0;
			fire.play('Fuego');
	}
}

function updateFire(f) {	
	if (f.tiempo >= 250) {
		shootList.remove(f);
		f.stop();
		f.destroy();
	}
	
}

function destroyFire(f,r) {
	if (!invisibilidad) {
		r.disableBody(true,true);
		shootList.remove(f);
	}
}