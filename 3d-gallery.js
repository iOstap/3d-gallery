$("[carousel='component']").each(function () {
  let componentEl = $(this);
  let wrapEl = componentEl.find("[carousel='wrap']");

  let itemEl = wrapEl.children().children();
  let panelEl = componentEl.find("[carousel='panel']");
  let nextEl = componentEl.find("[carousel='next']");
  let prevEl = componentEl.find("[carousel='prev']");
  let rotateAmount = 360 / itemEl.length;
  let zTranslate = 2 * Math.tan((rotateAmount / 2) * (Math.PI / 180));
  let negTranslate = `calc(var(--3d-carousel-item-width) / -${zTranslate} - var(--3d-carousel-gap))`;
  let posTranslate = `calc(var(--3d-carousel-item-width) / ${zTranslate} + var(--3d-carousel-gap))`;

  wrapEl.css("--3d-carousel-z", negTranslate);
  wrapEl.css("perspective", posTranslate);
  gsap.to(wrapEl, { opacity: 1 });
  itemEl.each(function (index) {
    $(this).css("transform", `rotateY(${rotateAmount * index}deg) translateZ(${posTranslate})`);
  });

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: componentEl,
      start: "top top",
      end: "bottom bottom",
      scrub: true
    }
  });
  tl.fromTo(wrapEl, { "--3d-carousel-rotate": 0 }, { "--3d-carousel-rotate": -(360 - rotateAmount), duration: 30, ease: "none" });

  let activePanel;
  let animating = false;
  function makePanelActive(activeItem) {
    activePanel = activeItem;
    if (!activePanel.next().length) {
      nextEl.addClass("is-disabled");
    } else {
      nextEl.removeClass("is-disabled");
    }
    if (!activePanel.prev().length) {
      prevEl.addClass("is-disabled");
    } else {
      prevEl.removeClass("is-disabled");
    }
  }
  makePanelActive(panelEl.first());

  function scrollToActive() {
    animating = true;
    $("html, body").animate({ scrollTop: activePanel.offset().top }, 600, function () {
      animating = false;
    });
  }

  panelEl.each(function (index) {
    ScrollTrigger.create({
      trigger: $(this),
      start: "top center",
      end: "bottom center",
      onToggle: ({ self, isActive }) => {
        if (isActive) {
          makePanelActive($(this));
        }
      }
    });
  });
  nextEl.on("click", function () {
    if (activePanel.next().length && animating === false) {
      makePanelActive(activePanel.next());
      scrollToActive();
    }
  });
  prevEl.on("click", function () {
    if (activePanel.prev().length && animating === false) {
      makePanelActive(activePanel.prev());
      scrollToActive();
    }
  });
});
