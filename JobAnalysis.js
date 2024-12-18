// Job class definition
class Job {
    constructor(jobNo, title, jobPageLink, posted, type, level, estimatedTime, skill, detail) {
        this.jobNo = jobNo;
        this.title = title;
        this.jobPageLink = jobPageLink;
        this.posted = posted;
        this.type = type;
        this.level = level;
        this.estimatedTime = estimatedTime;
        this.skill = skill;
        this.detail = detail;
    }

    getFormattedPostedTime() {
        // Assuming "Posted" is in the form of "x minutes ago" or similar, return as is for now
        return this.posted;
    }

    getDetails() {
        return `
            Job No: ${this.jobNo}
            Title: ${this.title}
            Type: ${this.type}
            Level: ${this.level}
            Estimated Time: ${this.estimatedTime}
            Skill: ${this.skill}
            Detail: ${this.detail}
            [Link to Job](${this.jobPageLink})
        `;
    }
}

// Global variables to hold job data and filtered jobs
let allJobs = [];
let filteredJobs = [];

// DOM elements
const fileInput = document.getElementById('fileInput');
const jobList = document.getElementById('jobList');
const levelFilter = document.getElementById('levelFilter');
const typeFilter = document.getElementById('typeFilter');
const skillFilter = document.getElementById('skillFilter');
const resetFilters = document.getElementById('resetFilters');
const sortByTitleButton = document.getElementById('sortByTitle');
const sortByTimeButton = document.getElementById('sortByTime');

// Event listeners
fileInput.addEventListener('change', (event) => {
    console.log('File input changed'); // Debug log
    loadJobData(event);
});
resetFilters.addEventListener('click', resetFiltersHandler);
sortByTitleButton.addEventListener('click', () => sortJobs('title'));
sortByTimeButton.addEventListener('click', () => sortJobs('posted'));

// Load job data from the selected JSON file
function loadJobData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            console.log('Loaded job data:', data); // Debug log
            if (!Array.isArray(data)) {
                throw new Error("JSON data should be an array.");
            }

            allJobs = data.map(job => new Job(
                job["Job No"], 
                job["Title"], 
                job["Job Page Link"], 
                job["Posted"], 
                job["Type"], 
                job["Level"], 
                job["Estimated Time"], 
                job["Skill"], 
                job["Detail"]
            ));
            
            filteredJobs = [...allJobs];
            updateFilters();
            renderJobList(filteredJobs);
        } catch (error) {
            console.error("Error loading or parsing job data:", error);
            alert("Error loading job data. Please check the format of the JSON file.");
        }
    };
    reader.readAsText(file);
}

// Update filter options based on available job data
function updateFilters() {
    const levels = new Set(allJobs.map(job => job.level));
    const types = new Set(allJobs.map(job => job.type));
    const skills = new Set(allJobs.map(job => job.skill));

    console.log('Available filter options:', { levels, types, skills }); // Debug log
    populateFilter(levelFilter, levels);
    populateFilter(typeFilter, types);
    populateFilter(skillFilter, skills);
}

// Populate filter dropdowns with unique options
function populateFilter(selectElement, options) {
    selectElement.innerHTML = `<option value="">All</option>`;
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });
}

// Render job list
function renderJobList(jobs) {
    console.log('Rendering jobs:', jobs); // Debug log
    jobList.innerHTML = "";
    jobs.forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.classList.add('job-item');
        jobElement.innerHTML = `<strong>${job.title}</strong><br><small>${job.getFormattedPostedTime()}</small>`;
        jobElement.addEventListener('click', () => showJobDetails(job));
        jobList.appendChild(jobElement);
    });
}

// Show job details in alert (can be expanded for a better UI)
function showJobDetails(job) {
    alert(job.getDetails());
}

// Filter jobs based on selected criteria
function filterJobs() {
    filteredJobs = allJobs.filter(job => {
        const levelMatch = !levelFilter.value || job.level === levelFilter.value;
        const typeMatch = !typeFilter.value || job.type === typeFilter.value;
        const skillMatch = !skillFilter.value || job.skill === skillFilter.value;
        return levelMatch && typeMatch && skillMatch;
    });
    renderJobList(filteredJobs);
}

// Reset filters
function resetFiltersHandler() {
    levelFilter.value = "";
    typeFilter.value = "";
    skillFilter.value = "";
    filterJobs();
}

// Sort jobs by a given attribute
function sortJobs(attribute) {
    filteredJobs.sort((a, b) => {
        if (attribute === 'title') {
            return a.title.localeCompare(b.title);
        } else if (attribute === 'posted') {
            return a.posted.localeCompare(b.posted);
        }
    });
    renderJobList(filteredJobs);
}

// Update filtered job list when filter criteria change
levelFilter.addEventListener('change', filterJobs);
typeFilter.addEventListener('change', filterJobs);
skillFilter.addEventListener('change', filterJobs);
