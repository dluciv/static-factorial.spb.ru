(function () {
  const galleries = document.querySelectorAll('[data-gallery]');

  galleries.forEach((gallery) => {
    const track = gallery.querySelector('.gallery__track');
    const slides = Array.from(gallery.querySelectorAll('.gallery__slide'));
    const dotsWrap = gallery.querySelector('.gallery__dots');
    const prevBtn = gallery.querySelector('.gallery__prev');
    const nextBtn = gallery.querySelector('.gallery__next');
    const count = gallery.querySelector('.gallery__count');
    const viewport = gallery.querySelector('.gallery__viewport');

    let index = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let deltaX = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'gallery__dot';
      dot.setAttribute('aria-label', `Перейти к фотографии ${i + 1}`);
      dot.addEventListener('click', () => {
        index = i;
        update();
      });
      dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.querySelectorAll('.gallery__dot'));

    function update() {
      track.style.transition = 'transform 0.35s ease';
      track.style.transform = `translateX(-${index * 100}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
      });

      if (count) {
        count.textContent = `${index + 1} / ${slides.length}`;
      }

      if (prevBtn) {
        prevBtn.disabled = index === 0;
      }

      if (nextBtn) {
        nextBtn.disabled = index === slides.length - 1;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (index > 0) {
          index -= 1;
          update();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (index < slides.length - 1) {
          index += 1;
          update();
        }
      });
    }

    gallery.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && index > 0) {
        index -= 1;
        update();
      }

      if (e.key === 'ArrowRight' && index < slides.length - 1) {
        index += 1;
        update();
      }
    });

    function onStart(clientX) {
      isDragging = true;
      startX = clientX;
      currentX = clientX;
      deltaX = 0;
      track.style.transition = 'none';
    }

    function onMove(clientX) {
      if (!isDragging || !viewport) return;
      currentX = clientX;
      deltaX = currentX - startX;
      const offsetPercent = (deltaX / viewport.offsetWidth) * 100;
      track.style.transform = `translateX(calc(-${index * 100}% + ${offsetPercent}%))`;
    }

    function onEnd() {
      if (!isDragging || !viewport) return;
      isDragging = false;

      const threshold = viewport.offsetWidth * 0.12;

      if (deltaX < -threshold && index < slides.length - 1) {
        index += 1;
      } else if (deltaX > threshold && index > 0) {
        index -= 1;
      }

      update();
    }

    if (viewport) {
      viewport.addEventListener('touchstart', (e) => {
        onStart(e.touches[0].clientX);
      }, { passive: true });

      viewport.addEventListener('touchmove', (e) => {
        onMove(e.touches[0].clientX);
      }, { passive: true });

      viewport.addEventListener('touchend', onEnd);

      viewport.addEventListener('mousedown', (e) => {
        onStart(e.clientX);
      });

      viewport.addEventListener('mouseleave', onEnd);
    }

    window.addEventListener('mousemove', (e) => {
      onMove(e.clientX);
    });

    window.addEventListener('mouseup', onEnd);

    update();
  });
})();
