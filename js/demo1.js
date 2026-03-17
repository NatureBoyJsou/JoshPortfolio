/**
 * demo1.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2018, Codrops
 * http://www.codrops.com
 */
{
    // the settings for each one of the slides uncover instances.
    const uncoverOpts = [
        {
            // total number of slices.
            slicesTotal: 4,
            // slices color.
            slicesColor: 'transparent',
            // 'vertical' || 'horizontal'.
            orientation: 'vertical',
            // 'bottom' || 'top' for vertical orientation and 'right' || 'left' for horizontal orientation.
            slicesOrigin: {show: 'top', hide: 'bottom'}
        },
        {
            slicesTotal: 7, 
            slicesColor: 'transparent', 
            orientation: 'horizontal', 
            slicesOrigin:  {show: 'right', hide: 'right'}
        },
        {
            slicesTotal: 9,
            slicesColor: 'transparent',
            orientation: 'vertical',
            slicesOrigin:  {show: 'bottom', hide: 'bottom'}
        },
        {
            slicesTotal: 5,
            slicesColor: 'transparent',
            orientation: 'horizontal',
            slicesOrigin:  {show: 'left', hide: 'left'}
        },
        {
            slicesTotal: 6,
            slicesColor: 'transparent',
            orientation: 'vertical',
            slicesOrigin:  {show: 'bottom', hide: 'bottom'}
        }
    ];

    class Slideshow {
        constructor(el) {
            this.DOM = {el: el};
            this.DOM.slides = Array.from(this.DOM.el.querySelectorAll('.slide'));
            this.slidesTotal = this.DOM.slides.length;
            this.current = 0;
            this.uncoverItems = [];
            this.DOM.slides.forEach((slide,pos) => this.uncoverItems.push(new Uncover(slide.querySelector('.slide__img'), uncoverOpts[pos])));
            this.init();
        }
        init() {
            this.isAnimating = true;
            this.DOM.slides[this.current].classList.add('slide--current');
                        this.uncoverItems[this.current].show(true, {
                image: {
                    duration: 800,
                    delay: 350,
                    easing: 'easeOutCubic',
                    scale: [1.3,1]
                }
            }).then(() => this.isAnimating = false);
        }
        navigate(pos) {
            if ( this.isAnimating || this.current === pos || pos < 0 || pos > this.slidesTotal - 1 ) return;
            this.isAnimating = true;

            const prev = this.current;
            this.DOM.slides[prev].classList.add('slide--pixelate-out');
            this.DOM.slides[prev].classList.remove('slide--current');

            this.current = pos;
            this.DOM.slides[this.current].classList.add('slide--current');
            
            setTimeout(() => {
                this.DOM.slides[prev].classList.remove('slide--pixelate-out');
                this.isAnimating = false;
            }, 900);
        }
    }

    function setupNodeBurst() {
        const canvas = document.querySelector('.node-burst-canvas');
        if (!canvas) return null;
        const ctx = canvas.getContext('2d');
        const resize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = Math.floor(width * window.devicePixelRatio);
            canvas.height = Math.floor(height * window.devicePixelRatio);
            ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize);
        return { canvas, ctx, resize };
    }

    function triggerNodeBurst(ctx, canvas) {
        if (!ctx || !canvas) return;
        const { width, height } = canvas.getBoundingClientRect();
        const centerX = width * 0.5;
        const centerY = height * 0.5;
        const nodes = Array.from({length: 28}, () => {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.4 + Math.random() * 0.9;
            return {
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                r: 1 + Math.random() * 2.2,
                hue: Math.random() > 0.5 ? 180 : 320
            };
        });
        const duration = 900;
        const start = performance.now();
        function draw(now) {
            const elapsed = now - start;
            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'lighter';
            nodes.forEach(n => {
                n.x += n.vx * 4;
                n.y += n.vy * 4;
                ctx.beginPath();
                ctx.fillStyle = `hsla(${n.hue}, 100%, 70%, ${Math.max(0, 1 - elapsed / duration)})`;
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fill();
            });
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 70) {
                        ctx.strokeStyle = `rgba(0, 255, 255, ${0.25 * (1 - dist / 70)})`;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }
            ctx.globalCompositeOperation = 'source-over';
            if (elapsed < duration) {
                requestAnimationFrame(draw);
            } else {
                ctx.clearRect(0, 0, width, height);
            }
        }
        requestAnimationFrame(draw);
    }    // Preload all the images in the page.. all the images in the page..
    imagesLoaded(document.querySelectorAll('.slide__img'), {background: true}, () => {
        document.body.classList.remove('loading');
        
        const slideshow = new Slideshow(document.querySelector('.slides'));
        const nodeBurst = setupNodeBurst();
        const burstCtx = nodeBurst ? nodeBurst.ctx : null;
        const burstCanvas = nodeBurst ? nodeBurst.canvas : null;
        
        const pagination = document.querySelector('.pagination');
        const triggers = Array.from(pagination.querySelectorAll('.pagination__item'));
        triggers.forEach((trigger,pos) => {
            if ( pos === 0 ) {
                trigger.classList.add('pagination__item--current');
            }
            trigger.addEventListener('click', () => {
                if ( slideshow.isAnimating ) return;
                slideshow.navigate(pos);
                triggerNodeBurst(burstCtx, burstCanvas);
                pagination.querySelector('.pagination__item--current').classList.remove('pagination__item--current');
                trigger.classList.add('pagination__item--current');
            })
        });
    
        document.addEventListener('keydown', (ev) => {
            if ( slideshow.isAnimating ) return;
            const keyCode = ev.keyCode || ev.which;
            let newpos;
            if ( keyCode === 37 ) {
                newpos = slideshow.current > 0 ? slideshow.current-1 : slideshow.slidesTotal-1;
                slideshow.navigate(newpos);
                triggerNodeBurst(burstCtx, burstCanvas);
            }
            else if ( keyCode === 39 ) {
                newpos = slideshow.current < slideshow.slidesTotal-1 ? slideshow.current+1 : 0;
                slideshow.navigate(newpos);
                triggerNodeBurst(burstCtx, burstCanvas);
            }
            else return;
            pagination.querySelector('.pagination__item--current').classList.remove('pagination__item--current');
            triggers[newpos].classList.add('pagination__item--current');
        });

        // ** Auto-slide every 5 seconds **
        setInterval(() => {
            if (slideshow.isAnimating) return;
            let nextIndex = slideshow.current + 1;
            if(nextIndex >= slideshow.slidesTotal) nextIndex = 0;
            slideshow.navigate(nextIndex);
            triggerNodeBurst(burstCtx, burstCanvas);
            pagination.querySelector('.pagination__item--current').classList.remove('pagination__item--current');
            triggers[nextIndex].classList.add('pagination__item--current');
        }, 6000);
    });
}








