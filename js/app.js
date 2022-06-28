(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class Audio {
        constructor(audio, options) {
            let config = {
                onend: function() {}
            };
            this.options = Object.assign(config, options);
            this.audio = audio;
            this.audioElement = this.audio.querySelector("audio");
            this.audioSlide = this.audio.querySelector(".audio__slide");
            this.track = this.audio.querySelector(".audio__track");
            this.button = this.audio.querySelector(".audio__button");
            this.progress = this.audioElement.currentTime;
            this.duration = this.audioElement.duration;
            this.init();
        }
        init() {
            this.times = {
                current: this.audio.querySelector(".audio__current"),
                total: this.audio.querySelector(".audio__total")
            };
            this.eventsFunction();
            window.requestAnimationFrame(this.events.checkProgress);
            this.setTime();
        }
        setTime() {
            this.totalTime = this.audioElement.duration;
            this.times.current.innerHTML = this.convertTime(this.progress);
            this.times.total.innerHTML = this.convertTime(this.totalTime);
        }
        resetTrack() {
            this.audioElement.currentTime = 0;
            this.setVarProgress();
            this.stop();
        }
        stop() {
            this.setStateButton(this.button, "play");
            this.audioElement.pause();
        }
        play() {
            this.setStateButton(this.button, "paused");
            this.audioElement.play();
        }
        eventsFunction() {
            this.events = {
                checkProgress: this.checkProgress.bind(this),
                start: this.eventDown.bind(this),
                end: this.eventUp.bind(this),
                move: this.eventMove.bind(this)
            };
            this.audio.addEventListener("pointerdown", this.events.start);
        }
        eventDown(e) {
            const target = e.target;
            const button = target.closest(".audio__button");
            const track = target.closest(".audio__track");
            if (button) {
                let stateButton = button.dataset.type;
                switch (stateButton) {
                  case "play":
                    this.play();
                    break;

                  case "paused":
                    this.stop();
                    break;

                  default:
                    break;
                }
            } else if (track) {
                window.requestAnimationFrame(this.events.checkProgress);
                let delta = this.setDelta(e.pageX);
                this.progress = this.audioElement.currentTime = delta * this.totalTime / this.track.offsetWidth;
                this.setVarProgress();
                this.audio.addEventListener("pointermove", this.events.move);
                this.audio.addEventListener("pointerup", this.events.end);
            }
        }
        eventUp() {
            this.audio.removeEventListener("pointerup", this.events.end);
            this.audio.removeEventListener("pointermove", this.events.move);
        }
        eventMove(e) {
            let delta = this.setDelta(e.pageX);
            this.audioElement.currentTime = delta * this.totalTime / this.track.offsetWidth;
            this.setVarProgress();
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
        setDelta(pageX) {
            let delta = pageX - this.track.getBoundingClientRect().left < 0 ? 0 : pageX > this.track.offsetWidth + this.track.getBoundingClientRect().left ? this.track.offsetWidth : pageX - this.track.getBoundingClientRect().left;
            return delta;
        }
        setStateButton(button, state) {
            button.setAttribute("data-type", state);
        }
        checkProgress() {
            this.progress = this.audioElement.currentTime;
            this.setVarProgress();
            this.setTime();
            console.log(this.audioElement.paused);
            if (this.audioElement.paused) this.stop(); else this.play();
            if (this.audioElement.currentTime >= this.audioElement.duration) {
                this.options.onend(this);
                document.dispatchEvent(new CustomEvent("onend", {
                    detail: {
                        audio: this
                    }
                }));
                this.stop();
                window.cancelAnimationFrame(this.events.checkProgress);
            } else window.requestAnimationFrame(this.events.checkProgress);
        }
        setVarProgress() {
            let progress = this.progress / this.totalTime * 100;
            console.log(this.progress);
            this.audio.style.setProperty("--progress", `${Math.trunc(progress)}%`);
            let width = 100 * this.audioSlide.offsetWidth / this.track.offsetWidth;
            this.audioSlide.style.left = `${Math.trunc(progress) - width * Math.trunc(progress) / 100}%`;
        }
        convertTime(time) {
            const hours = Math.floor(time / 60 / 60) > 0 ? `${Math.floor(time / 60 / 60)}.` : "";
            const minutes = Math.floor(time / 60) - 60 * hours > 0 ? `${Math.floor(time / 60) - 60 * hours}.` : "0.";
            const seconds = Math.trunc(time % 60) > 0 ? `${Math.trunc(time % 60)}` : 0;
            return `${hours}${minutes}${seconds}`;
        }
    }
    const audios = document.querySelector(".audio");
    audios.querySelector("audio");
    new Audio(audios, {
        onend: e => {
            console.log("end");
        }
    });
    function initSliders() {
        if (document.querySelector(".swiper")) new Swiper(".swiper", {
            slidesPerView: 3,
            spaceBetween: 0,
            autoHeight: true,
            speed: 800,
            loop: true,
            navigation: {
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next"
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 10
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30
                },
                1268: {
                    slidesPerView: 3
                }
            },
            on: {}
        });
    }
    window.addEventListener("load", (function(e) {
        initSliders();
    }));
    window["FLS"] = true;
    isWebp();
})();