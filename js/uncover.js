/**
 * uncover.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2018, Codrops
 * http://www.codrops.com
 */
{
    class Uncover {
        constructor(el, options) {
            this.DOM = { el: el };
            this.options = {
                covered: true,
                slicesTotal: 3,
                slicesColor: '#fff',
                orientation: 'vertical',
                slicesOrigin: {
                    show: 'bottom',
                    hide: 'bottom'
                }
            };
            Object.assign(this.options, options);
            this.isCovered = this.options.covered;
            this.layout();
            if (!this.isCovered) {
                this.show();
            }
        }

        layout() {
            this.DOM.el.classList.add('uncover');

            const bgImage = this.DOM.el.style.backgroundImage;
            const orientation = this.options.orientation;
            const slicesTotal = this.options.slicesTotal;

            let inner = `
                <div class="uncover__img" style="background-image: ${bgImage};"></div>
                <div class="uncover__slices uncover__slices--${orientation}">
            `;

            for (let i = 0; i < slicesTotal; ++i) {
                const pos = 100 / (slicesTotal - 1) * i;
                const backgroundPosition = orientation === 'vertical' ?
                    `${pos}% 50%` :
                    `50% ${pos}%`;

                inner += `
                    <div class="uncover__slice" style="
                        background-image: ${bgImage};
                        background-position: ${backgroundPosition};
                        background-size: cover;
                        background-repeat: no-repeat;
                    "></div>
                `;
            }

            inner += `</div>`;
            this.DOM.el.innerHTML = inner;
            this.DOM.img = this.DOM.el.querySelector('.uncover__img');
            this.DOM.slices = Array.from(this.DOM.el.querySelectorAll('.uncover__slice'));
            this.slicesTotal = this.DOM.slices.length;
        }

        show(animation = false, animationSettings = {}) {
            if (!this.isCovered) return;
            return this.toggle(animation, animationSettings);
        }

        hide(animation = false, animationSettings = {}) {
            if (this.isCovered) return;
            return this.toggle(animation, animationSettings);
        }

        toggle(animation, animationSettings) {
            this.isCovered = !this.isCovered;

            if (!animation) {
                this.DOM.slices.forEach((slice) => {
                    slice.style.transform = !this.isCovered ?
                        (this.options.orientation === 'vertical' ? 'translateY(100%)' : 'translateX(100%)') :
                        'none';
                });
            } else {
                const settings = {
                    slices: {
                        targets: this.DOM.slices,
                        duration: 800,
                        delay: (_, i) => i * 80,
                        easing: 'easeInOutQuart',
                        translateX: this.options.orientation === 'vertical' ? '0%' :
                            !this.isCovered ?
                                this.options.slicesOrigin.show === 'right' ? '100%' : '-100%' :
                                this.options.slicesOrigin.hide === 'right' ? ['100%', '0%'] : ['-100%', '0%'],
                        translateY: this.options.orientation === 'vertical' ?
                            !this.isCovered ?
                                this.options.slicesOrigin.show === 'bottom' ? '100%' : '-100%' :
                                this.options.slicesOrigin.hide === 'bottom' ? ['100%', '0%'] : ['-100%', '0%']
                            : '0%'
                    },
                    image: {
                        targets: this.DOM.img
                    }
                };

                Object.assign(settings.slices, animationSettings.slices);
                Object.assign(settings.image, animationSettings.image);

                anime.remove(this.DOM.slices);
                anime.remove(this.DOM.img);

                const promises = [anime(settings.slices).finished];
                if (settings.image.duration) {
                    promises.push(anime(settings.image).finished);
                }
                return Promise.all(promises);
            }
        }
    }

    window.Uncover = Uncover;
}
