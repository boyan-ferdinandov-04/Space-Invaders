document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.querySelector('#game-container');
    const timerDisplay = document.querySelector('#timerDisplay');
    const pointsDisplay = document.querySelector('#pointsDisplay');
    const canvas = document.querySelector('#gameCanvas');
    const c = canvas.getContext('2d');
    const music = new Audio();
    music.src = 'sounds/gameplay.mp3';
    music.play();
    let points = 0;
    let canFire = true;
    let canMove = true;

    const ufoCount = parseInt(localStorage.getItem('ufoCount')) || 1;
    const gameTime = parseInt(localStorage.getItem('gameTime')) || 60;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Player {
        constructor() {
            this.position = { x: canvas.width / 2 - 50, y: canvas.height - 120 };
            this.velocity = { x: 0, y: 0 };
            this.width = 120;
            this.height = 120;
            this.image = new Image();
            this.image.src = 'img/spaceship.png';
            this.speed = 3;
        }

        draw() {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }

        update() {
            if (canMove) {
                this.position.x += this.velocity.x;
                if (this.position.x < 0) this.position.x = 0;
                if (this.position.x + this.width > canvas.width) this.position.x = canvas.width - this.width;
            }
            this.draw();
        }
    }

    class Projectile {
        constructor(x, y) {
            this.position = { x: x, y: y };
            this.velocity = { x: 0, y: -10 };
            this.width = 20;
            this.height = 30;
            this.image = new Image();
            this.image.src = 'img/missile.png';
            this.sound = new Audio();
            this.sound.src = 'sounds/laser.wav'
        }

        draw() {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }

        update() {
            this.position.y += this.velocity.y;
            this.draw();
        }
    }
    function detectUFOCollision(ufo1, ufo2) {
        return (
            ufo1.position.x < ufo2.position.x + ufo2.width &&
            ufo1.position.x + ufo1.width > ufo2.position.x &&
            ufo1.position.y < ufo2.position.y + ufo2.height &&
            ufo1.position.y + ufo1.height > ufo2.position.y
        );
    } 

    class EnemyProjectile {
        constructor(x, y) {
            this.position = { x: x, y: y };
            this.velocity = { x: 5, y: 0 };
            this.width = 65;
            this.height = 65;
            this.range = 170;
            this.destroyed = false;
            this.initialX = this.position.x;
            this.image = new Image();
            this.image.src = 'img/ufo.png';
        }
    
        draw() {
            if (!this.destroyed) {
                c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
            }
        }
    
        update() {
            if (!this.destroyed) {
                this.position.x += this.velocity.x;

                if (this.position.x <= 0 || this.position.x + this.width >= canvas.width) {
                    this.velocity.x = -this.velocity.x;
                }

                if (this.position.x > this.initialX + this.range || this.position.x < this.initialX - this.range) {
                    this.velocity.x = -this.velocity.x;
                }
            }
            this.draw();
        }
    
        triggerExplosion() {
            this.destroyed = true;
            destroyObject(this);
        }
    }

    const player = new Player();
    const projectiles = [];
    let enemyProjectiles = [];
    let remainingTime = gameTime;
    timerDisplay.textContent = remainingTime;

    function spawnUFO() {
        const borderOffset = 100; 
        const ufoX = borderOffset + Math.random() * (canvas.width - 2 * borderOffset);
        const ufoY = 100 + Math.random() * (canvas.height / 2 - borderOffset);
        const ufo = new EnemyProjectile(ufoX, ufoY);
        enemyProjectiles.push(ufo);
    }
    

    const timerInterval = setInterval(() => {
        remainingTime -= 1;
        timerDisplay.textContent = remainingTime;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            calculateScore();
        }
    }, 1000);

    player.image.onload = () => {
        animate();
    };

    window.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' && canMove) {
            player.velocity.x = player.speed;
        } else if (event.key === 'ArrowLeft' && canMove) {
            player.velocity.x = -player.speed;
        } else if (event.key === ' ' && canFire) {
            const projectile = new Projectile(player.position.x + player.width / 2, player.position.y);
            projectiles.push(projectile);
            projectile.sound.play();
            canFire = false;
            canMove = false; 
        }
    });

    window.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            player.velocity.x = 0;
        } else if (event.key === ' ') {
            canFire = true;
        }
    });

    function detectCollision(projectile, enemy) {
        return (
            projectile.position.x < enemy.position.x + enemy.width &&
            projectile.position.x + projectile.width > enemy.position.x &&
            projectile.position.y < enemy.position.y + enemy.height &&
            projectile.position.y + projectile.height > enemy.position.y
        );
    }

    function calculateScore() {
        const divisionFactor = gameTime / 60;
        let finalScore = points / divisionFactor;
        let substractPoint = 50 * (ufoCount - 1);
        finalScore = Math.max(0, finalScore - substractPoint);
        pointsDisplay.textContent = finalScore;
        alert(`Game Over! Your final score is: ${finalScore}. You'll be redirected to the homepage where you can start again.`);
        window.location.href = 'homepage.html';
    }

    function destroyObject(object) {
        let { x, y } = object.position;
        const canvasRect = canvas.getBoundingClientRect();
        const gif = document.createElement('img');
        gif.src = 'img/explosion.gif'; 
        gif.style.position = 'absolute';
        gif.style.left = `${canvasRect.left + x}px`;
        gif.style.top = `${canvasRect.top + y}px`;
        gif.style.width = '100px';  
        gif.style.height = '100px';
        gif.style.pointerEvents = 'none';
        document.body.appendChild(gif);
        setTimeout(() => {gif.remove();}, 1000); 
    }
    
    function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);
        player.update();
        enemyProjectiles = enemyProjectiles.filter(enemy => !enemy.destroyed);
    
        while (enemyProjectiles.length < ufoCount) {
            spawnUFO();
        }
    
        enemyProjectiles.forEach((enemy, enemyIndex) => {
            enemy.update();

            for (let i = 0; i < enemyProjectiles.length; i++) {
                const otherUFO = enemyProjectiles[i];
                if (enemy !== otherUFO && detectUFOCollision(enemy, otherUFO)) {
                    enemy.velocity.x = -enemy.velocity.x;
                    otherUFO.velocity.x = -otherUFO.velocity.x;
                }
            }

            projectiles.forEach((projectile, projectileIndex) => {
                projectile.update();
    
                if (detectCollision(projectile, enemy) && !enemy.destroyed) {
                    enemy.triggerExplosion(); 
                    points += 100;
                    pointsDisplay.textContent = points;
                    projectiles.splice(projectileIndex, 1);
                    canMove = true; 
                }
            });
        });

        projectiles.forEach((projectile, index) => {
            if (projectile.position.y + projectile.height < 0) {
                projectiles.splice(index, 1);
                points = Math.max(0, points - 25);
                pointsDisplay.textContent = points;
                canMove = true; 
            }
        });
    }
});
