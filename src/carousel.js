// import "./carousel.css";

export const carouselWheel = (id,images,w) => {
    const carouselElement = document.getElementById(id);
    let width = w;
    const frame = document.createElement('div');
    frame.classList.add('frame');
    carouselElement.appendChild(frame);
    frame.style.position = 'relative'
    const reel = document.createElement('div');
    reel.classList.add('reel');
    reel.style.position = 'absolute';
    reel.style.left = 0;
    frame.appendChild(reel);
    let cycle;
    let paused = false;
    let currentFrame = 0;

    
    const changeWidth = () => {
        width = carouselElement.offsetWidth;
        const reelElements = reel.querySelectorAll('.reel-element');
        reelElements.forEach((element) => element.setAttribute('style',`width:${width}px`))
        correctPosition();
    }

    const correctPosition = () => {
        reel.transition = 'none';
        reel.style.left = `${currentFrame*width*-1}px`;
        reel.transition = '2s';
    }

    const addButtons = () => {
        const buttonLeft = document.createElement('button');
        buttonLeft.classList.add('carousel-button');
        const leftImg = document.createElement('img');
        buttonLeft.appendChild(leftImg)
        leftImg.src = './src/images/left.png';
        buttonLeft.id = "button-left";
        carouselElement.insertBefore(buttonLeft,frame);
        const buttonRight = document.createElement('button');
        const rightImg = document.createElement('img');
        buttonRight.classList.add('carousel-button');
        buttonRight.appendChild(rightImg)
        rightImg.src = './src/images/right.png';
        buttonRight.id = "button-right";
        carouselElement.appendChild(buttonRight);
        buttonRight.addEventListener('click',(e) => {
            next();
            pauseCycle();
        })
        buttonLeft.addEventListener('click',previous)
    }

    const changeNav = () => {
        const curImg = (Number(reel.style.left.slice(0,reel.style.left.length - 2)) / width) * -1;
        for (let i = 0 ; i < images.length ; i++) {
            const but = document.getElementById(`${id}button${i}`)
            but.classList.remove('current')
        }
        const curBut = document.getElementById(`${id}button${curImg}`)
        currentFrame = curBut.id.slice(-1);
        curBut.classList.add('current');
    }
    
    const navigation = () => {
        const navFrame = document.createElement('div');
        navFrame.setAttribute('style','position:absolute;left:0;right:0;bottom:-2rem;display:flex;margin: 0 auto;justify-content:center;');
        for (let i = 0 ; i < images.length ; i++) {
            const newBut = createNavButton(i);
            navFrame.appendChild(newBut);
            newBut.classList.add('carousel-navigation')
        }
        carouselElement.appendChild(navFrame)
    }
    
    const createNavButton = (i) => {
        const but = document.createElement('button');
        but.classList.add('carousel-navigation');
        but.id =`${id}button${i}`
        if (i === 0) but.classList.add('current');
        but.addEventListener('click',(e) => goTo(i));
        return but
    }
    
    const initImages = (images) => {
        images.forEach((image) => {
            const element = document.createElement('div')
            element.id = (image);
            element.classList.add('reel-element');
            reel.appendChild(element);
            element.setAttribute('style',`width:${width}px;`)
        })
    }
    
    const goTo = (imageRef) => {
        reel.style.left = `${imageRef*width*-1}px`;
        changeNav();
        pauseCycle();
    }
    
    const next = () => {
        const leftPos = Number(reel.style.left.slice(0,reel.style.left.length - 2)) - width;
        if (leftPos <= (width*images.length)*-1) {
            reel.style.left = '0px';
            changeNav();
            return;
        }
        reel.style.left = `${leftPos}px`;
        changeNav();
    }
    const previous = () => {
        const leftPos = Number(reel.style.left.slice(0,reel.style.left.length - 2)) + width;
        if (leftPos > 0) {
            reel.style.left = `-${(width*images.length-width)}px`;
            changeNav();
            pauseCycle();
            return;
        }
        reel.style.left = `${leftPos}px`;
        changeNav();
        pauseCycle();
    }

    const pauseCycle = () => {
        if (!paused) {
            paused = true;
            clearInterval(cycle);
            setTimeout(startCycle,8000);
        }
    }
    const startCycle = () => {
        paused = false;
        cycle = setInterval(next,8000);
    }
    
    window.onresize = changeWidth;
    initImages(images);
    addButtons();
    navigation();
    startCycle();
}