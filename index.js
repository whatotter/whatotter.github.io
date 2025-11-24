var ableToScroll = true
var scrollTimeout = 500

const pages = ["description", "accolades", "products"]
var amountOfProducts = 999
var currentProductIndex = 0
var currentPageIndex = 0

const descriptionMinimumVH = 0
var descriptionCurrentVH = 0
var descriptionMaximumVH = 17

var amountOfAccolades = 999
var currentAccolade = 0

function getFeatureHeight() {
    const domrect = document.getElementById("product-features").firstElementChild.getBoundingClientRect()
    return domrect.height
}

function getDescriptionHeight() {
    const domrect = document.getElementById("product-descriptions").firstElementChild.getBoundingClientRect()
    return domrect.height
}

function getPageHeight() {
    const domrect = document.getElementById("overlay-pages").firstElementChild.getBoundingClientRect()
    return domrect.height
}

function easeInOutQuad(t) {
  return t < 0.5
    ? 2 * t * t
    : -1 + (4 - 2 * t) * t;
}

async function customScrollBy(el, distance, maxDuration = 100) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const startLeft = el.scrollLeft;
    const startTop = el.scrollTop;

    const dx = 0 || 0;
    const dy = distance || 0;

    var duration = el.getBoundingClientRect().height
    if (duration >= maxDuration) {
        duration = maxDuration
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      el.scrollLeft = startLeft + (dx * progress);
      el.scrollTop = startTop + (dy * progress);

      if (progress >= 1) {
        clearInterval(interval);
        resolve();
      }
    }, 16); // 60fps boi
  });
}

function updateImage(imgIndex) {
    for (let i=0; i<pages.length+amountOfProducts-1; i++) {
        const element = document.getElementById("screen-body").children[i];
        element.style.opacity = 0
    }
    
    const img = document.getElementById("screen-body").children[imgIndex]
    img.style.opacity = 1
}

function scrollPage(direction) {
    if (direction == "down") {
        if (currentPageIndex != pages.length-1) {
            //document.getElementById("overlay-pages").scrollBy({
            //    top: getPageHeight(), left: 0, behavior: "smooth"
            //})

            customScrollBy(
                document.getElementById("overlay-pages"),
                getPageHeight()
            )

            currentPageIndex++
        
            updateImage(currentPageIndex+currentProductIndex)
        }
    } else if (direction == "up") {

        if (currentPageIndex != 0) {
            //document.getElementById("overlay-pages").scrollBy({
            //    top: -getPageHeight(), left: 0, behavior: "smooth"
            //})
            //document.getElementById("screen-body").scrollBy({
            //    top: -getPageHeight(), left: 0, behavior: "smooth"
            //})

            customScrollBy(
                document.getElementById("overlay-pages"),
                -getPageHeight()
            ),
            customScrollBy(
                document.getElementById("screen-body"),
                -getPageHeight()
            )

            currentPageIndex--
            updateImage(currentPageIndex+currentProductIndex)
        }
    }
}

function scrollUp(){
    if (ableToScroll) {
        if (pages[currentPageIndex] == "products") {

            if (currentProductIndex > 0) {
                //document.getElementById("product-features").scrollBy({
                //    top: -getFeatureHeight(), left: 0, behavior: "smooth"
                //})
                //document.getElementById("product-descriptions").scrollBy({
                //    top: -getDescriptionHeight(), left: 0, behavior: "smooth"
                //})

                customScrollBy(
                    document.getElementById("product-features"),
                    -getFeatureHeight()
                )
                customScrollBy(
                    document.getElementById("product-descriptions"),
                    -getDescriptionHeight()
                )

                currentProductIndex--
                updateImage(currentPageIndex+currentProductIndex)
            } else {
                scrollPage("up")
            }

        } else if (pages[currentPageIndex] == "accolades") {
            if (currentAccolade > 0) {
                currentAccolade -= 1
                highlightAccolade(currentAccolade)
            } else {
                scrollPage("up")
            }
        } else {
            scrollPage("up")
        }

        document.getElementById("product-descriptions").style.marginTop = `calc(${calculateDescriptVH()}vh + var(--island-top-margin))`

        ableToScroll = false
        setTimeout(function(){ableToScroll = true}, scrollTimeout)
    }
}

function calculateDescriptVH() {
    return (descriptionMaximumVH / amountOfProducts) * (currentProductIndex+1)
}

function scrollDown(){    
    if (ableToScroll) {
        if (pages[currentPageIndex] == "products") {
            if (amountOfProducts-1 > currentProductIndex) { // scroll products only if there's some left
                //document.getElementById("product-features").scrollBy({
                //    top: getFeatureHeight(), left: 0, behavior: "smooth"
                //})
                //document.getElementById("product-descriptions").scrollBy({
                //    top: getDescriptionHeight(), left: 0, behavior: "smooth"
                //})

                customScrollBy(
                    document.getElementById("product-features"),
                    getFeatureHeight()
                )
                customScrollBy(
                    document.getElementById("product-descriptions"),
                    getDescriptionHeight()
                )


                currentProductIndex++
                descriptionCurrentVH++
                updateImage(currentPageIndex+currentProductIndex)
            } else {
                scrollPage("down")
            }
            
        } else if (pages[currentPageIndex] == "accolades") {
            if (amountOfAccolades > currentAccolade) {
                highlightAccolade(currentAccolade)
                currentAccolade += 1
            } else {
                scrollPage("down")
            }
        } else {
            scrollPage("down")
        }

        document.getElementById("down-chevron").setAttribute("bounce", true)
        document.getElementById("product-descriptions").style.marginTop = `calc(${calculateDescriptVH()}vh + var(--island-top-margin))`

        ableToScroll = false
        setTimeout(function(){ableToScroll = true}, scrollTimeout)
    }
}

function highlightAccolade(index) {
    const accoladeElements = document.getElementById("accolades").querySelectorAll("[class='accolade']")

    if (accoladeElements.length >= index) {
        for (let i = 0; i < accoladeElements.length; i++) {
            const element = accoladeElements[i];
            if (i == index) {
                 element.querySelector("[class='accolade-button']").setAttribute("huge", true)
            } else {
                 element.querySelector("[class='accolade-button']").removeAttribute("huge")
            }
        }
    }
}

function toProject(page) {
    if (page > currentProductIndex) {
        projectInterval = setInterval(function() {
            if (currentProductIndex != page) {
                scrollDown()
            } else {
                clearInterval(projectInterval)
            }
        }, 100)
    } else if (currentProductIndex > page) {
        projectInterval = setInterval(function() {
            if (currentProductIndex != page) {
                scrollUp()
            } else {
                clearInterval(projectInterval)
            }
        }, 100)
    }
}

function toPage(page) {
    if (page > currentPageIndex) {
        interval = setInterval(function() {
            if (currentPageIndex != page) {
                scrollDown()
            } else {
                clearInterval(interval)
            }
        }, 100)
    } else if (currentPageIndex > page) {
        interval = setInterval(function() {
            if (currentPageIndex != page) {
                scrollUp()
            } else {
                clearInterval(interval)
            }
        }, 100)
    }
}

function updateBubble(pos) {
    const buttonRect = document.querySelectorAll("[class='button-stack-individual']")[pos].getBoundingClientRect()
    const fullRect = document.getElementById("button-stack").getBoundingClientRect()

    document.getElementById("button-bubble").style.width = `${buttonRect.width}px`
    document.getElementById("button-bubble").style.transform = `translateX(${(buttonRect.left-fullRect.left)}px)`
}

document.addEventListener("DOMContentLoaded", function(){
    document.addEventListener("scroll", e=>{
        e.preventDefault();

    }, { passive: false })

    var touchStart
    document.addEventListener('touchstart', function (e){
        e.preventDefault();

        console.log(e.touches)
        touchStart = e.touches[0].clientY;
        console.log(`touch started at ${touchStart}`)

    }, { passive: false });
    document.addEventListener("touchmove", e=>{
        e.preventDefault();

        console.log(e.touches)
        const touchEnd = e.touches[0].clientY

        if (touchStart > touchEnd) {
            scrollDown()
        } else if (touchStart < touchEnd) {
            scrollUp();
        }

    }, { passive: false })

    document.addEventListener("wheel", e=>{
        e.preventDefault();

        if (e.deltaY < 0) {
            // scrolled up
            scrollUp()
        } else {
            scrollDown()
        }
        updateBubble(currentPageIndex)

    }, { passive: false })

    const debug = false
    if (debug) {
        const targetPage = localStorage.getItem("debug-page")
        toPage(targetPage)

        setInterval(function(){
            localStorage.setItem("debug-page", currentPageIndex+currentProductIndex)
        }, 3000)
    }

    amountOfProducts = 0
    document.getElementById("product-features").childNodes.forEach(element => {
        if (element.nodeName == "DIV") {
            amountOfProducts++
        }
    });

    amountOfAccolades = document.getElementById("accolades").querySelectorAll("[class='accolade']").length

    // chevron
    document.getElementById("down-chevron").addEventListener("transitionend", e=>{
        document.getElementById("down-chevron").removeAttribute("bounce")
    })
    document.getElementById("down-chevron").addEventListener("click", e=>{
        scrollDown()
    })

    // header buttons
    document.getElementById("fast-main").addEventListener("click", function(){
        updateBubble(0)
        toPage(0)
    })
    document.getElementById("fast-accolades").addEventListener("click", function(){
        updateBubble(1)
        toPage(1)
    })
    document.getElementById("fast-projects").addEventListener("click", function(){
        updateBubble(2)
        toProject(0)
        toPage(2)
    })
    //document.getElementById("fast-footer").addEventListener("click", function(){
    //    updateBubble(2)
    //    toPage(2)
    //})

    descriptionMaximumVH = parseInt(window.getComputedStyle(document.body).getPropertyValue("--description-max-vh"))
    console.log(descriptionMaximumVH)

    updateBubble(0)

    console.log(`total products: ${amountOfProducts}`)
    console.log(`total accolades: ${amountOfAccolades}`)
})