// TODO: OOPify the code,
// add controls and collision detection.
// then add sprites
const DOWN = -1;
const UP = 1;
const OUTSIDE_THE_MAP = -1;
class Player {
constructor() {
  this.x = 1;
  this.y = 10;
  this.rot = 90;
  this.speed = 0;
  this.map = new Grid([
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,0,0,1,0,0,0,0,1],
    [1,0,1,0,0,1,0,0,0,0,1],
    [1,1,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,1]
  ]);
  this.render();
}
setRot(rot) {
  this.rot = rot;
  $("a-camera").attr("rotation", `0 ${this.rot} 0`);
}
move() {
var moveStep = this.speed * this.moveSpeed;
this.rot += this.dir * this.rotSpeed;
var newX = this.x + Math.cos(player.rot) * moveStep;
var newY = this.y + Math.sin(player.rot) * moveStep;
var currentMapBlock = this.map.get(newX|0, newY|0);
if (currentMapBlock === ...on whileDragging(e) {
var event;
e.preventDefault();
if (e.touches) {
event = e.touches[0];
} else {
event = e;
}
pmouseX = mouseX;
pmouseY = mouseY;
mouseX = event.pageX - scene.offsetLeft;
mouseY = event.pageY - scene.offsetTop;
if (isDragging) {
	player.setRot(player.rot + (mouseX - pmouseX) / scene.clientWidth * 2 * 50);
	var moveDistance = -(mouseY - pmouseY) / scene.clientHeight * 15;
	var fractionalPart = moveDistance % 1;
	var integerPart = moveDistance | 0;
	player.speed = integerPart < 0 ? DOWN : UP;
	for (var i = 0; i < Math.abs(integerPart); i++) {
		var result = player.move();
		if (!result) {
			return;
		}
	}
	player.speed = fractionalPart;
	player.move();
	}
}
function startDragging(e) {
	var event;
	e.preventDefault();
	if (e.touches) {
	event = e.touches[0];
	} else {
	event = e;
	}
	mouseX = event.pageX - scene.offsetLeft;
	mouseY = event.pageY - scene.offsetTop;
	isDragging = true;
}
function endDragging(e) {
	e.preventDefault();
	isDragging = false;
}