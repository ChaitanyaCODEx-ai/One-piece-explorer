const openButton = document.querySelector("#open-gallery");
const gallery = document.querySelector("#gallery");
const soundToggle = document.querySelector("#sound-toggle");
const soundStatus = document.querySelector("#sound-status");
const warningDialog = document.querySelector("#scare-warning");
const confirmEntry = document.querySelector("#confirm-entry");
const cancelEntry = document.querySelector("#cancel-entry");
const scareOverlay = document.querySelector("#scare-overlay");
const scareVideo = document.querySelector("#scare-video");
const skipScare = document.querySelector("#skip-scare");
const scareVideos = ["scare1.mp4", "scare2.mp4"];
let scareActive = false;

async function finishScare() {
  if (!scareActive) {
    return;
  }
  scareActive = false;
  scareVideo.pause();
  if (document.fullscreenElement === scareOverlay) {
    try {
      await document.exitFullscreen();
    } catch {
      soundStatus.textContent = "Couldn't exit fullscreen automatically. Press Escape to return.";
    }
  }
  scareOverlay.hidden = true;
  scareOverlay.classList.remove("video-fallback");
  gallery.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showVideoFallback() {
  scareOverlay.classList.add("video-fallback");
  window.setTimeout(finishScare, 900);
}

openButton.addEventListener("click", () => {
  gallery.hidden = false;

  openButton.disabled = true;
  openButton.querySelector("span:first-child").textContent = "Gallery opened";

  scareOverlay.hidden = false;
  scareActive = true;

  scareVideo.src = scareVideos[Math.floor(Math.random() * scareVideos.length)];
  scareVideo.muted = !soundToggle.checked;
  scareVideo.volume = 0.15;
  scareVideo.currentTime = 0;

  scareVideo.addEventListener("ended", finishScare, { once: true });

  if (scareOverlay.requestFullscreen) {
    scareOverlay.requestFullscreen().catch(() => {
      soundStatus.textContent = "Fullscreen was blocked; showing the video across the page instead.";
    });
  }

  scareVideo.play().catch(showVideoFallback);
});

cancelEntry.addEventListener("click", () => {
  warningDialog.close();
});

confirmEntry.addEventListener("click", () => {
  warningDialog.close();
  gallery.hidden = false;
  openButton.disabled = true;
  openButton.querySelector("span:first-child").textContent = "Gallery opened";
  scareOverlay.hidden = false;
  scareActive = true;
  scareVideo.src = scareVideos[Math.floor(Math.random() * scareVideos.length)];
  scareVideo.muted = !soundToggle.checked;
  scareVideo.volume = 0.15;
  scareVideo.currentTime = 0;
  scareVideo.addEventListener("ended", finishScare, { once: true });
  if (scareOverlay.requestFullscreen) {
    scareOverlay.requestFullscreen().catch(() => {
      soundStatus.textContent = "Fullscreen was blocked; showing the scare across the page instead.";
    });
  } else {
    soundStatus.textContent = "Fullscreen isn't supported here; showing the scare across the page instead.";
  }
  scareVideo.play().catch(showVideoFallback);
});

skipScare.addEventListener("click", finishScare);

soundToggle.addEventListener("change", () => {
  scareVideo.muted = !soundToggle.checked;
  soundStatus.textContent = soundToggle.checked
    ? "Video sound enabled at limited volume."
    : "Video sound is off.";
});
