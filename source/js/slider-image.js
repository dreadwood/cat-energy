if (window.innerWidth < 768) {
  var buttonBefore = document.querySelector('.control__button--before');
  var buttonAfter = document.querySelector('.control__button--after');
  var imageBefore = document.querySelector('.slider-image__item--before');
  var imageAfter = document.querySelector('.slider-image__item--after');
  var control = document.querySelector('.control__bar');

  buttonBefore.addEventListener('click', function () {
    imageAfter.style.display = 'none';
    imageBefore.style.display = 'block';
    control.style.paddingLeft = '6px';
  });
  buttonAfter.addEventListener('click', function () {
    imageBefore.style.display = 'none';
    imageAfter.style.display = 'block';
    control.style.paddingLeft = '42px';
  });
}
