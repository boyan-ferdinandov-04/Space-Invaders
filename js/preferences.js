document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#preferences-form');
    const musicSelect = new Audio();
    musicSelect.src = 'sounds/preferences.mp3';
    musicSelect.play();
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const ufoCount = parseInt(document.querySelector('#ufo').value);
        const gameTime = parseInt(document.querySelector('#time').value);

        localStorage.setItem('ufoCount', ufoCount);
        localStorage.setItem('gameTime', gameTime);
         
        alert(`Settings saved!`);
    });
});
