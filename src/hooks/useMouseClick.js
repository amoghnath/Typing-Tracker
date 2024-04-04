// Get arbitrary element with id "my-element"
var myElementToCheckIfClicksAreInsideOf = document.getElementById('#scrollAble');
// Listen for click events on body
document.body.addEventListener('click', function (event) {
    if (myElementToCheckIfClicksAreInsideOf.contains(event.target)) {
        console.log('clicked inside');
    } else {
        console.log('clicked outside');
    }
});