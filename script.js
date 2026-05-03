const cards = document.querySelectorAll('.card');
const google = document.getElementById('Google');
const microsoft = document.getElementById('Microsoft');

cards.forEach(card => {
    card.addEventListener('click', () => {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    });
});

if (window.location.pathname.endsWith("/google.html")) {
  google.style.backgroundColor = "#dbdbdb3a";
  google.style.borderRadius = "20px";
};

if(window.location.pathname.endsWith("/microsoft.html")) {
    microsoft.style.backgroundColor = "#dbdbdb3a";
    microsoft.style.borderRadius = "20px";
}