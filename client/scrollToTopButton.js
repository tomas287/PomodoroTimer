// Get the button
const scrollToTopButton = document.getElementById("scrollToTopButton");

// Show the button when the user scrolls down
window.onscroll = function () {
  if (document.body.scrollTop > 70 || document.documentElement.scrollTop > 70) {
    scrollToTopButton.style.display = "flex"; // Show the button
  } else {
    scrollToTopButton.style.display = "none"; // Hide the button when at the top
  }
};

// Scroll to the top when the button is clicked
scrollToTopButton.addEventListener('click' ,function (e) {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Smooth scrolling to top
      });
});