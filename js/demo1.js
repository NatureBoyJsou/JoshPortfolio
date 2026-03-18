/**
 * demo1.js
 * simple slideshow transition: fade only
 */
{
    class Slideshow {
        constructor(el) {
            this.DOM = { el: el };
            this.DOM.slides = Array.from(this.DOM.el.querySelectorAll('.slide'));
            this.slidesTotal = this.DOM.slides.length;
            this.current = 0;
            this.isAnimating = false;
            this.init();
        }

        init() {
            if (!this.DOM.slides.length) return;
            this.DOM.slides[this.current].classList.add('slide--current');
        }

        navigate(pos) {
            if (this.isAnimating || this.current === pos || pos < 0 || pos > this.slidesTotal - 1) return;
            this.isAnimating = true;

            const prev = this.current;
            const prevSlide = this.DOM.slides[prev];

            this.current = pos;
            const nextSlide = this.DOM.slides[this.current];

            nextSlide.classList.add('slide--current');
            prevSlide.classList.add('slide--fading');

            setTimeout(() => {
                prevSlide.classList.remove('slide--current', 'slide--fading');
                this.isAnimating = false;
            }, 700);
        }
    }

    imagesLoaded(document.querySelectorAll('.slide'), { background: true }, () => {
        document.body.classList.remove('loading');

        const slideshow = new Slideshow(document.querySelector('.slides'));
        const pagination = document.querySelector('.pagination');
        const triggers = Array.from(pagination.querySelectorAll('.pagination__item'));

        triggers.forEach((trigger, pos) => {
            if (pos === 0) {
                trigger.classList.add('pagination__item--current');
            }
            trigger.addEventListener('click', () => {
                if (slideshow.isAnimating) return;
                slideshow.navigate(pos);
                pagination.querySelector('.pagination__item--current').classList.remove('pagination__item--current');
                trigger.classList.add('pagination__item--current');
            });
        });

        document.addEventListener('keydown', (ev) => {
            if (slideshow.isAnimating) return;
            const keyCode = ev.keyCode || ev.which;
            let newpos;
            if (keyCode === 37) {
                newpos = slideshow.current > 0 ? slideshow.current - 1 : slideshow.slidesTotal - 1;
                slideshow.navigate(newpos);
            } else if (keyCode === 39) {
                newpos = slideshow.current < slideshow.slidesTotal - 1 ? slideshow.current + 1 : 0;
                slideshow.navigate(newpos);
            } else {
                return;
            }
            pagination.querySelector('.pagination__item--current').classList.remove('pagination__item--current');
            triggers[newpos].classList.add('pagination__item--current');
        });
    });
}





