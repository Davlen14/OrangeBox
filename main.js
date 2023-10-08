// Get elements from the DOM
const links = document.querySelectorAll(".sidebar .navigation li a");
const tooltip = document.querySelector(".cursor-tooltip");

// PDF.js setup
let pdfDocument = null;
let pageNumber = 1;

function renderPage(num) {
    pdfDocument.getPage(num).then(function(page) {
        let viewport = page.getViewport({ scale: 1.5 });  // Scale can be adjusted as needed
        let canvas = document.getElementById('pdf-canvas');
        let context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        let renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        page.render(renderContext);
    });
}

// Setup for PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/Users/davlenswain/OrangeBox Code/pdfjs-3/build/pdf.worker.js';

// Rest of your existing code ...

pdfjsLib.getDocument('/Users/davlenswain/OrangeBox Code/static/images/donuts.pdf').promise.then(function(pdfDoc_) {
    pdfDocument = pdfDoc_;
    renderPage(pageNumber);
}).catch(function(error) {
    console.error("Error loading PDF: ", error.message);
});

// Rest of your existing code ...


function nextPage() {
    if (pageNumber < pdfDocument.numPages) {
        pageNumber++;
        renderPage(pageNumber);
    }
}

function previousPage() {
    if (pageNumber > 1) {
        pageNumber--;
        renderPage(pageNumber);
    }
}

// loop through list elements
links.forEach(link => {
  // Get last span from each link
  const linkText = link.querySelectorAll("span")[1];
  
  // Add mouseover event to list element
  link.addEventListener("mouseover", e => {
    const x = e.clientX;
    const y = e.clientY;
    tooltip.style.display = "block";
    tooltip.innerHTML = linkText.innerHTML;
    tooltip.style.left = x + 20 + "px";
    tooltip.style.top = y + "px";

    // If this link relates to the PDF navigation, you can add the behavior here.
    // For example:
    if (linkText.innerHTML === "Next") {
        nextPage();
    } else if (linkText.innerHTML === "Previous") {
        previousPage();
    }
  });

  // Add a mouseout event
  link.addEventListener("mouseout", () => {
    tooltip.style.display = "none";
  });
});


