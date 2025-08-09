// Global variables
let scene,
  camera,
  renderer,
  globe,
  jobCards = [];
let isDarkMode = false;
let currentView = "home";

// Sample job data
const jobData = [
  {
    id: 1,
    title: "Solar Energy Engineer",
    company: "SolarTech Solutions",
    location: "Remote",
    type: "Full-time",
    tags: ["Remote", "Engineering", "Solar"],
    description:
      "Design and implement solar energy solutions for sustainable communities.",
    salary: "$85,000 - $120,000",
    certification: "B-Corp Certified",
    carbonImpact: "Saves ~50 tons CO2/year",
  },
  {
    id: 2,
    title: "Sustainability Data Analyst",
    company: "GreenMetrics Inc",
    location: "San Francisco, CA",
    type: "Full-time",
    tags: ["Hybrid", "Analytics", "Data"],
    description:
      "Analyze environmental data to help companies reduce their carbon footprint.",
    salary: "$70,000 - $95,000",
    certification: "Carbon Neutral",
    carbonImpact: "Helps reduce 200+ tons CO2/year",
  },
  {
    id: 3,
    title: "Environmental Product Manager",
    company: "EcoInnovate",
    location: "Remote",
    type: "Full-time",
    tags: ["Remote", "Management", "Product"],
    description:
      "Lead the development of eco-friendly products and sustainable solutions.",
    salary: "$100,000 - $140,000",
    certification: "LEED Certified",
    carbonImpact: "Develops products saving 1000+ tons CO2/year",
  },
  {
    id: 4,
    title: "Green Building Architect",
    company: "Sustainable Structures",
    location: "Portland, OR",
    type: "Full-time",
    tags: ["On-site", "Architecture", "Design"],
    description:
      "Design energy-efficient buildings with minimal environmental impact.",
    salary: "$80,000 - $115,000",
    certification: "LEED Certified",
    carbonImpact: "Buildings save 300+ tons CO2/year",
  },
  {
    id: 5,
    title: "Renewable Energy Consultant",
    company: "CleanPower Advisory",
    location: "Remote",
    type: "Contract",
    tags: ["Remote", "Consulting", "Energy"],
    description:
      "Advise businesses on renewable energy adoption and implementation.",
    salary: "$90,000 - $130,000",
    certification: "B-Corp Certified",
    carbonImpact: "Facilitates 500+ tons CO2 reduction/year",
  },
  {
    id: 6,
    title: "Carbon Footprint Analyst",
    company: "CarbonTrack",
    location: "Austin, TX",
    type: "Full-time",
    tags: ["Hybrid", "Analytics", "Climate"],
    description: "Measure and track carbon emissions for enterprise clients.",
    salary: "$65,000 - $85,000",
    certification: "Carbon Neutral",
    carbonImpact: "Tracks reduction of 2000+ tons CO2/year",
  },
];

// Chatbot responses
const chatbotResponses = {
  greeting: [
    "Hello! I'm here to help you find sustainable career opportunities. What interests you?",
    "Hi there! Looking for a green job or want some eco-career tips?",
    "Welcome! I can help you discover environmentally-focused career paths.",
  ],
  jobs: [
    "I can help you find jobs in renewable energy, sustainable tech, green building, and more! What field interests you?",
    "Great choice! We have opportunities in solar energy, environmental consulting, sustainable design, and carbon management. Any preferences?",
    "Our green jobs span many industries. Would you like remote work, or do you prefer on-site positions?",
  ],
  remote: [
    "Remote work is great for reducing carbon emissions! We have many remote positions in environmental consulting, sustainable tech, and green project management.",
    "Perfect! Remote work can reduce your carbon footprint by up to 2.5 tons per year. Check out our remote sustainability roles!",
    "Remote green jobs are growing fast! They're perfect for work-life balance and environmental impact.",
  ],
  tips: [
    "💡 Eco-tip: Remote work can reduce your carbon footprint by 2.5 tons CO2 per year!",
    "🌱 Green career tip: Highlight any sustainability projects or interests on your resume - employers love eco-conscious candidates!",
    "♻️ Sustainability tip: Consider companies with B-Corp certification - they're committed to environmental and social responsibility.",
    "🌍 Career advice: Many traditional roles now have 'green' versions - marketing for sustainable brands, finance for renewable energy, etc.",
  ],
  certifications: [
    "B-Corp certification means a company meets high standards for social and environmental performance!",
    "LEED certification focuses on green building and sustainable construction practices.",
    "Carbon Neutral companies offset 100% of their carbon emissions - great for climate-conscious professionals!",
  ],
  default: [
    "That's interesting! Can you tell me more about what you're looking for?",
    "I'd love to help! Are you interested in job searching, career tips, or learning about sustainable companies?",
    "Great question! Would you like me to suggest some green career paths or eco-friendly companies?",
  ],
};

// Initialize Three.js scene
function initThreeJS() {
  const container = document.getElementById("globe-container");

  // Scene setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Create globe
  const geometry = new THREE.SphereGeometry(2, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: 0x4a7c59,
    transparent: true,
    opacity: 0.8,
    shininess: 100,
  });

  globe = new THREE.Mesh(geometry, material);
  scene.add(globe);

  // Add wireframe
  const wireframe = new THREE.WireframeGeometry(geometry);
  const line = new THREE.LineSegments(
    wireframe,
    new THREE.LineBasicMaterial({
      color: 0x6ab04c,
      transparent: true,
      opacity: 0.3,
    })
  );
  globe.add(line);

  // Add lights
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Position camera
  camera.position.z = 8;

  // Create floating job cards in 3D space
  createFloatingJobCards();

  // Start render loop
  animate();
}

// Create floating 3D job cards
function createFloatingJobCards() {
  jobData.slice(0, 3).forEach((job, index) => {
    const cardGeometry = new THREE.PlaneGeometry(2, 1.2);
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 240;
    const context = canvas.getContext("2d");

    // Draw card background
    context.fillStyle = isDarkMode ? "#2d5a3d" : "#ffffff";
    context.fillRect(0, 0, 400, 240);

    // Add border
    context.strokeStyle = "#6ab04c";
    context.lineWidth = 3;
    context.strokeRect(0, 0, 400, 240);

    // Add text
    context.fillStyle = isDarkMode ? "#ffffff" : "#2d5a3d";
    context.font = "bold 24px Arial";
    context.fillText(job.title, 20, 40);

    context.font = "18px Arial";
    context.fillStyle = "#6ab04c";
    context.fillText(job.company, 20, 70);

    context.fillStyle = isDarkMode ? "#cccccc" : "#666666";
    context.font = "16px Arial";
    context.fillText(job.location, 20, 100);
    context.fillText(`💰 ${job.salary}`, 20, 130);
    context.fillText(`🌱 ${job.carbonImpact}`, 20, 160);

    // Create texture and material
    const texture = new THREE.CanvasTexture(canvas);
    const cardMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);

    // Position cards around the globe
    const angle = (index / 3) * Math.PI * 2;
    cardMesh.position.x = Math.cos(angle) * 5;
    cardMesh.position.y = Math.sin(angle) * 2;
    cardMesh.position.z = Math.sin(angle) * 3;

    cardMesh.rotation.y = -angle;
    cardMesh.userData = {
      job,
      originalY: cardMesh.position.y,
      floatOffset: index * 0.5,
    };

    scene.add(cardMesh);
    jobCards.push(cardMesh);
  });
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate globe
  if (globe) {
    globe.rotation.y += 0.005;
  }

  // Animate floating job cards
  const time = Date.now() * 0.001;
  jobCards.forEach((card, index) => {
    card.position.y =
      card.userData.originalY +
      Math.sin(time + card.userData.floatOffset) * 0.3;
    card.rotation.z = Math.sin(time + card.userData.floatOffset) * 0.1;
  });

  renderer.render(scene, camera);
}

// Handle mouse movement for 3D effects
function handleMouseMove(event) {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  // Rotate globe based on mouse position
  if (globe) {
    globe.rotation.x = mouseY * 0.1;
    globe.rotation.y += mouseX * 0.01;
  }

  // Animate job cards on hover
  document.querySelectorAll(".job-card").forEach((card) => {
    const rect = card.getBoundingClientRect();
    const cardX = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
    const cardY = -((rect.top + rect.height / 2) / window.innerHeight) * 2 + 1;

    const distance = Math.sqrt((mouseX - cardX) ** 2 + (mouseY - cardY) ** 2);
    if (distance < 0.3) {
      card.style.transform = `rotateY(${(mouseX - cardX) * 20}deg) rotateX(${
        (mouseY - cardY) * 20
      }deg) translateZ(20px)`;
    } else {
      card.style.transform = "rotateY(0deg) rotateX(0deg) translateZ(0px)";
    }
  });
}

// Create job listing elements
function createJobListings() {
  const jobListings = document.getElementById("jobs");
  jobListings.innerHTML = "";

  jobData.forEach((job) => {
    const jobElement = document.createElement("article");
    jobElement.className = "job-listing";
    jobElement.innerHTML = `
                    <div class="job-listing-content">
                        <h3 style="color: var(--primary-green); margin-bottom: 0.5rem; font-size: 1.3rem;">${
                          job.title
                        }</h3>
                        <div class="job-company" style="color: var(--accent-green); font-weight: 600; margin-bottom: 1rem;">${
                          job.company
                        }</div>
                        <div style="margin-bottom: 1rem;">
                            <span style="margin-right: 1rem;">📍 ${
                              job.location
                            }</span>
                            <span style="margin-right: 1rem;">💼 ${
                              job.type
                            }</span>
                            <span>🎯 ${job.certification}</span>
                        </div>
                        <p style="margin-bottom: 1rem; opacity: 0.8;">${
                          job.description
                        }</p>
                        <div style="margin-bottom: 1rem;">
                            <strong style="color: var(--bright-green);">💰 ${
                              job.salary
                            }</strong>
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <span style="color: var(--accent-green); font-size: 0.9rem;">🌱 Impact: ${
                              job.carbonImpact
                            }</span>
                        </div>
                        <div class="job-tags" style="margin-bottom: 1rem;">
                            ${job.tags
                              .map((tag) => `<span class="tag">${tag}</span>`)
                              .join("")}
                        </div>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <button class="btn btn-primary" onclick="openJobModal(${
                              job.id
                            })" style="font-size: 0.9rem; padding: 0.75rem 1.5rem;">
                                View Details
                            </button>
                            <button class="btn btn-secondary" onclick="saveJob(${
                              job.id
                            })" style="font-size: 0.9rem; padding: 0.75rem 1.5rem;">
                                💾 Save Job
                            </button>
                        </div>
                    </div>
                `;
    jobListings.appendChild(jobElement);
  });
}

// Open job modal with 3D effects
function openJobModal(jobId) {
  const job = jobData.find((j) => j.id === jobId);
  if (!job) return;

  const modal = document.getElementById("job-modal");
  const modalBody = document.getElementById("modal-body");

  modalBody.innerHTML = `
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--bright-green), var(--accent-green)); border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; animation: float 3s ease-in-out infinite;">
                        🏢
                    </div>
                    <h2 id="modal-title" style="color: var(--primary-green); margin-bottom: 0.5rem;">${
                      job.title
                    }</h2>
                    <h3 style="color: var(--accent-green); margin-bottom: 1rem;">${
                      job.company
                    }</h3>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">📍</div>
                        <div style="font-weight: 600;">Location</div>
                        <div>${job.location}</div>
                    </div>
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">💰</div>
                        <div style="font-weight: 600;">Salary</div>
                        <div>${job.salary}</div>
                    </div>
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🎯</div>
                        <div style="font-weight: 600;">Certification</div>
                        <div>${job.certification}</div>
                    </div>
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🌱</div>
                        <div style="font-weight: 600;">Impact</div>
                        <div>${job.carbonImpact}</div>
                    </div>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h4 style="color: var(--primary-green); margin-bottom: 1rem;">Job Description</h4>
                    <p style="line-height: 1.8;">${job.description}</p>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h4 style="color: var(--primary-green); margin-bottom: 1rem;">Skills & Tags</h4>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${job.tags
                          .map((tag) => `<span class="tag">${tag}</span>`)
                          .join("")}
                    </div>
                </div>
                
                <div style="margin-bottom: 2rem; padding: 1rem; background: linear-gradient(135deg, #e8f5e8, #f0f8f0); border-radius: 15px; border-left: 4px solid var(--bright-green);">
                    <h4 style="color: var(--primary-green); margin-bottom: 0.5rem;">🌍 Environmental Impact</h4>
                    <p>This role contributes to sustainable practices and helps reduce environmental impact. ${
                      job.carbonImpact
                    }</p>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-primary" onclick="applyForJob(${
                      job.id
                    })" style="font-size: 1.1rem; padding: 1rem 2rem;">
                        🚀 Apply Now
                    </button>
                    <button class="btn btn-secondary" onclick="saveJob(${
                      job.id
                    })" style="font-size: 1.1rem; padding: 1rem 2rem;">
                        💾 Save to Dashboard
                    </button>
                </div>
            `;

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");

  // Focus management for accessibility
  const firstButton = modal.querySelector("button");
  if (firstButton) firstButton.focus();
}

// Apply for job
function applyForJob(jobId) {
  const job = jobData.find((j) => j.id === jobId);
  alert(
    `🎉 Application submitted for ${job.title} at ${job.company}! \n\nYou'll receive a confirmation email shortly. Good luck with your sustainable career journey!`
  );
  closeModal();
}

// Save job to dashboard
function saveJob(jobId) {
  const job = jobData.find((j) => j.id === jobId);
  alert(`💾 ${job.title} at ${job.company} has been saved to your dashboard!`);
}

// Close modal
function closeModal() {
  const modal = document.getElementById("job-modal");
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
}

// Theme toggle functionality
function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle("dark");

  const themeToggle = document.querySelector(".theme-toggle");
  const switchElement = themeToggle;

  if (isDarkMode) {
    themeToggle.textContent = "☀️ Light Mode";
    switchElement.setAttribute("aria-checked", "true");

    // Update Three.js lighting for dark mode
    if (scene) {
      scene.children.forEach((child) => {
        if (child.type === "AmbientLight") {
          child.intensity = 0.3;
        }
        if (child.type === "DirectionalLight") {
          child.intensity = 0.5;
        }
      });
    }
  } else {
    themeToggle.textContent = "🌙 Dark Mode";
    switchElement.setAttribute("aria-checked", "false");

    // Update Three.js lighting for light mode
    if (scene) {
      scene.children.forEach((child) => {
        if (child.type === "AmbientLight") {
          child.intensity = 0.6;
        }
        if (child.type === "DirectionalLight") {
          child.intensity = 0.8;
        }
      });
    }
  }

  // Recreate floating job cards with updated theme
  jobCards.forEach((card) => scene.remove(card));
  jobCards = [];
  createFloatingJobCards();
}

// Chatbot functionality
function toggleChatbot() {
  const chatbotWindow = document.getElementById("chatbot-window");
  const isActive = chatbotWindow.classList.contains("active");

  if (isActive) {
    chatbotWindow.classList.remove("active");
    chatbotWindow.setAttribute("aria-hidden", "true");
  } else {
    chatbotWindow.classList.add("active");
    chatbotWindow.setAttribute("aria-hidden", "false");

    // Focus the input field
    const input = document.getElementById("chatbot-input");
    if (input) input.focus();
  }
}

function sendChatMessage() {
  const input = document.getElementById("chatbot-input");
  const messagesContainer = document.getElementById("chatbot-messages");
  const message = input.value.trim();

  if (!message) return;

  // Add user message
  const userMessage = document.createElement("div");
  userMessage.style.cssText = "text-align: right; margin-bottom: 1rem;";
  userMessage.innerHTML = `<div style="display: inline-block; background: var(--bright-green); color: white; padding: 0.75rem; border-radius: 15px; max-width: 80%;">${message}</div>`;
  messagesContainer.appendChild(userMessage);

  // Clear input
  input.value = "";

  // Generate bot response
  setTimeout(() => {
    const botResponse = generateChatbotResponse(message.toLowerCase());
    const botMessage = document.createElement("div");
    botMessage.style.cssText = "margin-bottom: 1rem;";
    botMessage.innerHTML = `<div style="display: inline-block; background: #f0f8ff; padding: 0.75rem; border-radius: 15px; max-width: 80%;">${botResponse}</div>`;
    messagesContainer.appendChild(botMessage);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 1000);

  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateChatbotResponse(message) {
  if (
    message.includes("hello") ||
    message.includes("hi") ||
    message.includes("hey")
  ) {
    return getRandomResponse("greeting");
  } else if (
    message.includes("job") ||
    message.includes("career") ||
    message.includes("work")
  ) {
    return getRandomResponse("jobs");
  } else if (message.includes("remote") || message.includes("work from home")) {
    return getRandomResponse("remote");
  } else if (
    message.includes("tip") ||
    message.includes("advice") ||
    message.includes("help")
  ) {
    return getRandomResponse("tips");
  } else if (
    message.includes("certification") ||
    message.includes("b-corp") ||
    message.includes("leed")
  ) {
    return getRandomResponse("certifications");
  } else {
    return getRandomResponse("default");
  }
}

function getRandomResponse(category) {
  const responses = chatbotResponses[category];
  return responses[Math.floor(Math.random() * responses.length)];
}

// Scroll-triggered animations
function handleScroll() {
  const filtersSection = document.querySelector(".filters-section");
  const rect = filtersSection.getBoundingClientRect();

  if (rect.top < window.innerHeight * 0.8) {
    filtersSection.classList.add("visible");
  }
}

// Navigation functionality
function navigateToSection(sectionId) {
  // Hide all sections
  document.querySelectorAll("main > section").forEach((section) => {
    section.style.display = section.id === sectionId ? "block" : "none";
  });

  // Update current view
  currentView = sectionId;

  // Update active nav link
  document.querySelectorAll(".nav a").forEach((link) => {
    link.removeAttribute("aria-current");
    if (link.getAttribute("href") === `#${sectionId}`) {
      link.setAttribute("aria-current", "page");
    }
  });
}

// Drag and drop for Kanban board
function setupKanbanDragDrop() {
  const cards = document.querySelectorAll(".kanban-card");
  const columns = document.querySelectorAll(".kanban-column");

  cards.forEach((card) => {
    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", card.outerHTML);
      card.style.opacity = "0.5";
    });

    card.addEventListener("dragend", (e) => {
      card.style.opacity = "1";
    });
  });

  columns.forEach((column) => {
    column.addEventListener("dragover", (e) => {
      e.preventDefault();
      column.style.backgroundColor = "rgba(106, 176, 76, 0.1)";
    });

    column.addEventListener("dragleave", (e) => {
      column.style.backgroundColor = "";
    });

    column.addEventListener("drop", (e) => {
      e.preventDefault();
      column.style.backgroundColor = "";

      const cardHTML = e.dataTransfer.getData("text/plain");
      const newCard = document.createElement("div");
      newCard.innerHTML = cardHTML;
      newCard.firstChild.style.transform = "rotateY(180deg)";

      column.appendChild(newCard.firstChild);

      // Add flip animation
      setTimeout(() => {
        newCard.firstChild.style.transform = "rotateY(0deg)";
      }, 100);
    });
  });
}

// Handle window resize
function handleResize() {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

// Keyboard navigation for accessibility
function handleKeyDown(event) {
  // ESC key to close modal
  if (event.key === "Escape") {
    closeModal();
    const chatbotWindow = document.getElementById("chatbot-window");
    if (chatbotWindow.classList.contains("active")) {
      toggleChatbot();
    }
  }

  // Enter key in chatbot
  if (event.key === "Enter" && event.target.id === "chatbot-input") {
    sendChatMessage();
  }

  // Space/Enter to activate chatbot
  if (
    (event.key === "Enter" || event.key === " ") &&
    event.target.classList.contains("chatbot")
  ) {
    event.preventDefault();
    toggleChatbot();
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Three.js
  initThreeJS();

  // Create job listings
  createJobListings();

  // Setup Kanban drag and drop
  setupKanbanDragDrop();

  // Event listeners
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("scroll", handleScroll);
  document.addEventListener("keydown", handleKeyDown);
  window.addEventListener("resize", handleResize);

  // Theme toggle
  document
    .querySelector(".theme-toggle")
    .addEventListener("click", toggleTheme);

  // Navigation
  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute("href").substring(1);

      if (sectionId === "employers") {
        document.getElementById("employer-dashboard").classList.add("active");
        document
          .querySelectorAll("main > section:not(#employer-dashboard)")
          .forEach((section) => {
            section.style.display = "none";
          });
      } else {
        document
          .getElementById("employer-dashboard")
          .classList.remove("active");
        document.querySelectorAll("main > section").forEach((section) => {
          section.style.display = "";
        });

        // Smooth scroll to section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  // Modal close
  document.querySelector(".modal-close").addEventListener("click", closeModal);
  document.getElementById("job-modal").addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      closeModal();
    }
  });

  // Chatbot
  document.querySelector(".chatbot").addEventListener("click", toggleChatbot);
  document
    .querySelector(".chatbot-input button")
    .addEventListener("click", sendChatMessage);

  // Filter functionality
  setupFilters();

  // Initial animations
  setTimeout(() => {
    document.querySelector(".hero-content").style.opacity = "1";
  }, 500);

  // Preload and optimize performance
  optimizePerformance();
});

// Filter functionality
function setupFilters() {
  const filterInputs = document.querySelectorAll(".filter-input");

  filterInputs.forEach((input) => {
    input.addEventListener("change", applyFilters);
    input.addEventListener("input", debounce(applyFilters, 300));
  });
}

function applyFilters() {
  const filters = {
    industry: document.getElementById("industry").value,
    location: document.getElementById("location").value.toLowerCase(),
    workType: document.getElementById("work-type").value,
    certification: document.getElementById("certification").value,
    salaryMin: parseInt(document.getElementById("salary-min").value) || 0,
    experience: document.getElementById("experience").value,
  };

  const filteredJobs = jobData.filter((job) => {
    // Industry filter
    if (
      filters.industry &&
      !job.title.toLowerCase().includes(filters.industry.replace("-", " "))
    ) {
      return false;
    }

    // Location filter
    if (
      filters.location &&
      !job.location.toLowerCase().includes(filters.location)
    ) {
      return false;
    }

    // Work type filter
    if (filters.workType) {
      const isRemote = job.location.toLowerCase().includes("remote");
      const isHybrid = job.tags.some((tag) =>
        tag.toLowerCase().includes("hybrid")
      );
      const isOnsite = !isRemote && !isHybrid;

      if (filters.workType === "remote" && !isRemote) return false;
      if (filters.workType === "hybrid" && !isHybrid) return false;
      if (filters.workType === "on-site" && !isOnsite) return false;
    }

    // Certification filter
    if (filters.certification && job.certification !== filters.certification) {
      return false;
    }

    // Salary filter (simplified - would need proper salary parsing in real app)
    const jobSalaryMin = parseInt(
      job.salary.match(/\$(\d+,?\d*)/)?.[1]?.replace(",", "") || 0
    );
    if (filters.salaryMin && jobSalaryMin < filters.salaryMin) {
      return false;
    }

    return true;
  });

  updateJobListings(filteredJobs);
  updateJobCount(filteredJobs.length, jobData.length);
}

function updateJobListings(jobs) {
  const jobListings = document.getElementById("jobs");
  jobListings.innerHTML = "";

  if (jobs.length === 0) {
    jobListings.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: white; border-radius: 20px; box-shadow: 0 10px 30px var(--shadow);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                        <h3 style="color: var(--primary-green); margin-bottom: 1rem;">No jobs match your criteria</h3>
                        <p style="opacity: 0.8; margin-bottom: 2rem;">Try adjusting your filters to find more opportunities</p>
                        <button class="btn btn-primary" onclick="clearFilters()">Clear All Filters</button>
                    </div>
                `;
    return;
  }

  jobs.forEach((job) => {
    const jobElement = document.createElement("article");
    jobElement.className = "job-listing";
    jobElement.style.animation = "fadeInUp 0.5s ease-out";
    jobElement.innerHTML = `
                    <div class="job-listing-content">
                        <h3 style="color: var(--primary-green); margin-bottom: 0.5rem; font-size: 1.3rem;">${
                          job.title
                        }</h3>
                        <div class="job-company" style="color: var(--accent-green); font-weight: 600; margin-bottom: 1rem;">${
                          job.company
                        }</div>
                        <div style="margin-bottom: 1rem;">
                            <span style="margin-right: 1rem;">📍 ${
                              job.location
                            }</span>
                            <span style="margin-right: 1rem;">💼 ${
                              job.type
                            }</span>
                            <span>🎯 ${job.certification}</span>
                        </div>
                        <p style="margin-bottom: 1rem; opacity: 0.8;">${
                          job.description
                        }</p>
                        <div style="margin-bottom: 1rem;">
                            <strong style="color: var(--bright-green);">💰 ${
                              job.salary
                            }</strong>
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <span style="color: var(--accent-green); font-size: 0.9rem;">🌱 Impact: ${
                              job.carbonImpact
                            }</span>
                        </div>
                        <div class="job-tags" style="margin-bottom: 1rem;">
                            ${job.tags
                              .map((tag) => `<span class="tag">${tag}</span>`)
                              .join("")}
                        </div>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <button class="btn btn-primary" onclick="openJobModal(${
                              job.id
                            })" style="font-size: 0.9rem; padding: 0.75rem 1.5rem;">
                                View Details
                            </button>
                            <button class="btn btn-secondary" onclick="saveJob(${
                              job.id
                            })" style="font-size: 0.9rem; padding: 0.75rem 1.5rem;">
                                💾 Save Job
                            </button>
                        </div>
                    </div>
                `;
    jobListings.appendChild(jobElement);
  });
}

function updateJobCount(filtered, total) {
  let countElement = document.getElementById("job-count");
  if (!countElement) {
    countElement = document.createElement("div");
    countElement.id = "job-count";
    countElement.style.cssText =
      "text-align: center; margin: 2rem 0; font-size: 1.1rem; color: var(--accent-green); font-weight: 600;";
    document.querySelector(".filters-section").appendChild(countElement);
  }

  countElement.innerHTML = `
                <span>Showing ${filtered} of ${total} sustainable job opportunities</span>
                ${
                  filtered < total
                    ? `<button onclick="clearFilters()" style="margin-left: 1rem; background: none; border: 1px solid var(--accent-green); color: var(--accent-green); padding: 0.25rem 0.75rem; border-radius: 15px; cursor: pointer; font-size: 0.9rem;">Clear Filters</button>`
                    : ""
                }
            `;
}

function clearFilters() {
  document.querySelectorAll(".filter-input").forEach((input) => {
    if (input.type === "select-one") {
      input.selectedIndex = 0;
    } else {
      input.value = "";
    }
  });
  applyFilters();
}

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Performance optimization
function optimizePerformance() {
  // Lazy load Three.js animations when not in viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
      } else {
        entry.target.style.animationPlayState = "paused";
      }
    });
  });

  // Observe animated elements
  document.querySelectorAll('[style*="animation"]').forEach((el) => {
    observer.observe(el);
  });

  // Optimize Three.js rendering
  if (renderer) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Use lower quality on mobile devices
    if (window.innerWidth < 768) {
      renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
    }
  }

  // Preload critical fonts
  const link = document.createElement("link");
  link.rel = "preload";
  link.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
  link.as = "style";
  document.head.appendChild(link);
}

// Advanced chatbot responses with context
function enhanceChatbotResponse(message) {
  const context = {
    userName: "there", // Could be personalized
    currentFilters: getCurrentFilters(),
    viewedJobs: [], // Could track user interactions
    savedJobs: [], // Could track saved jobs
  };

  // Context-aware responses
  if (message.includes("filter") || message.includes("search")) {
    if (context.currentFilters.length > 0) {
      return `I see you're currently filtering for ${context.currentFilters.join(
        ", "
      )}. Would you like me to suggest similar opportunities or help you refine your search?`;
    } else {
      return "I can help you filter jobs! Try searching by industry (renewable energy, sustainable tech), location (remote work is great for the environment!), or green certifications. What interests you most?";
    }
  }

  if (
    message.includes("carbon") ||
    message.includes("environment") ||
    message.includes("impact")
  ) {
    return `🌍 Great question! All our listed positions contribute to environmental sustainability. For example, remote work alone can reduce carbon emissions by 2.5 tons per person per year. Would you like to see our highest-impact roles?`;
  }

  if (
    message.includes("salary") ||
    message.includes("pay") ||
    message.includes("money")
  ) {
    return `💰 Sustainable careers are increasingly competitive! Our green jobs range from $65K to $140K+. Many companies offer additional benefits like carbon offset programs, bike-to-work incentives, and green commuting allowances. Want to see salary ranges for specific roles?`;
  }

  return generateChatbotResponse(message);
}

function getCurrentFilters() {
  const activeFilters = [];
  const industry = document.getElementById("industry").value;
  const location = document.getElementById("location").value;
  const workType = document.getElementById("work-type").value;

  if (industry) activeFilters.push(industry.replace("-", " "));
  if (location) activeFilters.push(location);
  if (workType) activeFilters.push(workType);

  return activeFilters;
}

// Advanced 3D interactions
function setupAdvanced3DInteractions() {
  let mouseX = 0,
    mouseY = 0;
  let targetX = 0,
    targetY = 0;

  document.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // Smooth camera movement
  function updateCameraPosition() {
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    if (camera) {
      camera.position.x += (targetX * 2 - camera.position.x) * 0.05;
      camera.position.y += (targetY * 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
    }

    requestAnimationFrame(updateCameraPosition);
  }
  updateCameraPosition();
}

// Accessibility enhancements
function enhanceAccessibility() {
  // Add ARIA live region for dynamic content
  const liveRegion = document.createElement("div");
  liveRegion.id = "live-region";
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.className = "sr-only";
  document.body.appendChild(liveRegion);

  // Announce filter results
  const originalApplyFilters = applyFilters;
  window.applyFilters = function () {
    originalApplyFilters.call(this);
    setTimeout(() => {
      const jobCount = document.querySelectorAll(".job-listing").length;
      liveRegion.textContent = `Filter applied. ${jobCount} jobs found.`;
    }, 100);
  };

  // Enhanced keyboard navigation for job cards
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      const focusedElement = document.activeElement;
      if (focusedElement.classList.contains("job-listing")) {
        event.preventDefault();
        const allJobs = Array.from(document.querySelectorAll(".job-listing"));
        const currentIndex = allJobs.indexOf(focusedElement);

        let nextIndex;
        if (event.key === "ArrowRight") {
          nextIndex = (currentIndex + 1) % allJobs.length;
        } else {
          nextIndex =
            currentIndex === 0 ? allJobs.length - 1 : currentIndex - 1;
        }

        allJobs[nextIndex].focus();
      }
    }
  });

  // Make job listings focusable
  document.querySelectorAll(".job-listing").forEach((job, index) => {
    job.setAttribute("tabindex", index === 0 ? "0" : "-1");
    job.setAttribute("role", "article");
    job.setAttribute("aria-label", `Job listing ${index + 1}`);
  });
}

// Initialize advanced features
setTimeout(() => {
  setupAdvanced3DInteractions();
  enhanceAccessibility();
  updateJobCount(jobData.length, jobData.length);
}, 1000);

// Export functions for global access
window.openJobModal = openJobModal;
window.applyForJob = applyForJob;
window.saveJob = saveJob;
window.closeModal = closeModal;
window.clearFilters = clearFilters;
window.applyFilters = applyFilters;
