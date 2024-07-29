document.addEventListener('DOMContentLoaded', function () {
  const photo = document.getElementById('file1-photo');
  const contentArea = document.querySelector('.file1-content-area');
  const infoOverlay = document.querySelector('.file1-info-overlay');

  // Function to open the first div and photo on load
  function openFirstDiv() {
    const firstToggleDiv = document.querySelector('.file1-toggle-div');
    const firstContent = firstToggleDiv.querySelector('.file1-content');
    const firstToggleIcon = firstToggleDiv.querySelector('.file1-toggle-icon');
    const firstPhotoUrl = firstToggleDiv.getAttribute('data-img');
    const firstOverlayInfo = firstToggleDiv.getAttribute('data-overlay-info').split('|');

    firstContent.classList.add('open');
    firstContent.style.display = 'block';
    firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
    firstToggleIcon.src = 'frame0.svg'; // Change to frame0.svg
    photo.src = firstPhotoUrl;
    photo.style.opacity = '1';
    animateInfoOverlay(firstOverlayInfo[0], firstOverlayInfo[1]); // Animate info overlay
  }

  // Function to animate the info overlay
  function animateInfoOverlay(percentage, description) {
    infoOverlay.querySelector('h2').textContent = percentage;
    infoOverlay.querySelector('p').textContent = description;
    infoOverlay.style.opacity = '1'; // Set opacity to 1
  }

  // Function to highlight other divs when photo is clicked
  function highlightOtherDivs() {
    document.querySelectorAll('.file1-toggle-div').forEach(div => {
      if (div.getAttribute('data-img') !== photo.getAttribute('src')) {
        div.classList.add('file1-div-highlight');
        setTimeout(() => div.classList.remove('file1-div-highlight'), 600);
      }
    });
  }

  // Fetch data from JSON file
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      // Create toggle divs based on JSON data
      data.forEach(item => {
        const toggleDiv = document.createElement('div');
        toggleDiv.classList.add('file1-toggle-div');
        toggleDiv.setAttribute('data-img', item.image);
        toggleDiv.setAttribute('data-overlay-info', `${item.overlay_info.percentage}|${item.overlay_info.description}`); // Add overlay info

        const toggle = document.createElement('div');
        toggle.classList.add('file1-toggle');
        toggle.innerHTML = `<span class="file1-toggle-title">${item.content_title}</span>`;
        
        const toggleIcon = document.createElement('img');
        toggleIcon.classList.add('file1-toggle-icon');
        toggleIcon.src = 'frame1.svg';
        toggleIcon.alt = 'Toggle Icon';

        toggle.appendChild(toggleIcon);

        const content = document.createElement('div');
        content.classList.add('file1-content');
        const contentList = document.createElement('ul');
        item.content_list.forEach(contentItem => {
          const listItem = document.createElement('li');
          listItem.textContent = contentItem;
          contentList.appendChild(listItem);
        });
        content.appendChild(contentList);

        toggleDiv.appendChild(toggle);
        toggleDiv.appendChild(content);

        // Add click event listener to each toggle div
        toggleDiv.addEventListener('click', function () {
          const content = this.querySelector('.file1-content');
          const toggleIcon = this.querySelector('.file1-toggle-icon');
          const photoUrl = this.getAttribute('data-img');
          const overlayInfo = this.getAttribute('data-overlay-info').split('|'); // Get overlay info

          if (!content.classList.contains('open')) {
            // Open clicked div, close and reset others
            document.querySelectorAll('.file1-toggle-div').forEach(div => {
              div.querySelector('.file1-content').classList.remove('open');
              div.querySelector('.file1-content').style.maxHeight = '0';
              div.querySelector('.file1-toggle-icon').src = 'frame1.svg';
            });
            content.classList.add('open');
            content.style.display = 'block';
            setTimeout(() => content.style.maxHeight = content.scrollHeight + 'px', 10);
            toggleIcon.src = 'frame0.svg';
            photo.style.opacity = '0';
            setTimeout(() => {
              photo.src = photoUrl;
              photo.style.opacity = '1';
              animateInfoOverlay(overlayInfo[0], overlayInfo[1]); // Animate info overlay
            }, 500); // Delay animation for photo
          } else {
            // Highlight other divs (on reclick of the same div)
            document.querySelectorAll('.file1-toggle-div').forEach(div => {
              if (div !== this) {
                div.classList.add('file1-div-highlight');
                setTimeout(() => div.classList.remove('file1-div-highlight'), 600);
              }
            });
          }
        });

        contentArea.appendChild(toggleDiv);
      });

      // Open the first div and photo on load
      openFirstDiv();

      // Add event listener to the photo to highlight other divs
      photo.addEventListener('click', highlightOtherDivs);
    })
    .catch(error => console.error('Error fetching data:', error));
});
