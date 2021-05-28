import * as robin from '../personajes/robin.js';
import * as escorpion from '../enemigos/escorpion.js';
import * as slime from '../enemigos/slime.js';
import * as boss_desierto from '../enemigos/boss_desierto.js';
import * as keys from '../keys.js';
import * as heroes from '../grupoHeroes.js';

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

var llave = false;
var puerta = true;

import function preload() {

	this.load.image('tiles','tilemap/terrain.png');
	this.load.tilemapTiledJSON('dessert','tilemap/mapita.json');

	robin.preload.call(this);
	escorpion.preload.call(this);
	slime.preload.call(this);
	boss_desierto.preload.call(this);
}

import function create() {

	this.add.sprite(0,0,'tiles');

	var map = this.make.tilemap({ key: 'dessert',});
	var tileset = map.addTilesetImage('terrain', 'tiles');

	var suelo = map.createLayer('Ground', tileset);
	var oasis = map.createLayer('Agua', tileset);
	var decoracion = map.createLayer('Decoracion', tileset);
	var dunas = map.createLayer('Dunas', tileset);
	var segundo_suelo = map.createLayer('Second_Ground', tileset);
	var lava = map.createLayer('Lava', tileset);
	var muro = map.createLayer('Pared', tileset);
	var spawn = map.createFromObjects('SpawnJugador',tileset);

	segundo_suelo.alpha = 0;

	boss_desierto.createFireBossGroup.call();
	slime.createFireGroup.call();

	escorpion.createGroup.call();
	
	for (i = 0; i < 40; i++) {
		escorpion.createEscorpion.call();
	}

	slime.createSlimeGroup.call()
	
	for (i = 0; i < 40; i++) {
		slime.createSlime.call();
	}

	slime.createSuperSlimeGroup.call();

	for (i = 0; i < 40; i++) {
		slime.createSuperSlime.call();
	}

	this.physics.add.collider(heroes.heroes, muro);
	this.physics.add.collider(heroes.heroes, oasis);

	muro.setCollisionByProperty({collides: true});
	oasis.setCollisionByProperty({collides: true});

	// Camara

	this.cameras.main.startFollow(heroes.heroes);	

	// Texto

	text=this.add.text(heroes.heroes.x-190,heroes.heroes.y-145,'Score: ',{fontsize:'8px',fill:'#FFF'});
	const list = ['Vida:', 'life' ];
	robin.setDataEnabled();
	robin.data.set('life','12');

	text.setText([
        'Vida: ' + robin.data.get('life')
    ]);

    // Overlap

    this.physics.add.overlap(escorpionList, heroes.heroes, updateVida, null, this);
    this.physics.add.overlap(slimeList, heroes.heroes, updateVida, null, this);
    this.physics.add.overlap(superSlimeList, heroes.heroes, updateVida, null, this);
    this.physics.add.overlap(boss, heroes.heroes, updateVida, null, this);
    this.physics.add.overlap(dunas, heroes.heroes, updateDunas, null, this);
    this.physics.add.overlap(llave, heroes.heroes, cogerLlave, null, this);
    this.physics.add.overlap(lava, hielo, lavaFria, null, this);
    this.physics.add.overlap(lava, heroes.heroes, heroeFundido, null, this);
}

import function update() {

	robin.updateRobin.call();
	escorpion.update.call();
	slime.updateSlime.call();
	slime.updateSuperSlime.call();

	slime.updateVidaSlime.call();
	slime.updateVidasuperSlime.call();
	escorpion.updateVidaEscorpion.call();
	// robin.updateVidaRobin.call();

	// Puerta

	if (llave) {
		puerta = false;
	}

	// Boss

	if (batalla) {
		if (!creado) {
			boss_desierto.create.call();
			creado = true;
		}
		else {
			boss_desierto.update.call();
		}
	}
	
	text.x = robin.x-190;
	text.y = robin.y-145;
}

import function updateDunas(d,h) {
	if (keyE.isDown) {
		d.alpha = 0;
	}
}

import function cogerLlave(l,h) {
	if (keyE.isDown && !l) {
		l = true;
	}
}

import function lavaFria(l,h) {
	l.alpha = 0;
	segundo_suelo.alpha = 1;
}

import function heroeFundido(l,h) {
	if (l.alpha == 1) {
		heroes.heroes.muerto = true;
	}
}