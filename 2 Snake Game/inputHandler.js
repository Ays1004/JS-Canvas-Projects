addEventListener('keydown', function(event) {
    if (event.code == 'KeyW') s.direction(0,-1);
    if (event.code == 'KeyS') s.direction(0,1);
    if (event.code == 'KeyA') s.direction(-1,0);
    if (event.code == 'KeyD') s.direction(1,0);
});