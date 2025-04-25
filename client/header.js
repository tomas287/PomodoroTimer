const logoButton = document.getElementById('logo');

logoButton.addEventListener('click', () => {
    goToMainPage();
});

function goToMainPage() {
    window.location = '/';   
}