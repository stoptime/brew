const toggleFeatured = document.querySelector('.switch input')

toggleFeatured.addEventListener('change', function () {
  if (this.checked) {
    document
      .querySelectorAll('.regular')
      .forEach((item) => item.classList.add('hide'))
  } else {
    document
      .querySelectorAll('.regular')
      .forEach((item) => item.classList.remove('hide'))
  }
})
