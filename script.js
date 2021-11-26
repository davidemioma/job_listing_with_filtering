const jobList = document.querySelector(".jobs");

const tagsContainer = document.querySelector(".filters");

const filterBox = document.querySelector(".fiters_container");

const btnClear = document.querySelector(".clear");

let tagInFilter = [];

const renderJobs = function (data) {
  data.map((el) => {
    const markup = `
        <div class="job">
          <img src="${el.logo}" alt="${el.company} Logo" class="job_logo" />

          <div class="job-top">
            <div class="job-info">
              <p class="company">${el.company}</p>
              <span class="${el.new ? "new" : "hidden"}">new!</span>
              <span class="${
                el.featured ? "featured" : "hidden"
              }">featured!</span>
            </div>

            <p class="position">${el.position}</p>

            <div class="position_info">
              <p class="posted-at">${el.postedAt}</p>
              <p class="contract">${el.contract}</p>
              <p class="location">${el.location}</p>
            </div>
          </div>

          <div class="job_filters">
            <span class="job_filter" data-role=${el.role}>${el.role}</span>
            <span class="job_filter" data-level=${el.level}>${el.level}</span>
            <div class="languages">
              ${el.languages
                .map((language) => {
                  return `
                   <span class="job_filter" data-languages=${language}>${language}</span>
                `;
                })
                .join("")}
            </div>
             <div class="tools">
              ${el.tools
                .map((tool) => {
                  return `
                   <span class="job_filter" data-tools=${tool}>${tool}</span>
                `;
                })
                .join("")}
            </div>
          </div>
        </div>`;

    jobList.insertAdjacentHTML("beforeend", markup);
  });
};

const loadALlJobs = async function () {
  try {
    const res = await fetch("data.json");

    const data = await res.json();

    renderJobs(data);
  } catch (err) {
    console.error(err);
  }
};

const updateFilterVisibility = function () {
  if (tagInFilter.length === 0) {
    filterBox.classList.add("hidden");
  } else {
    filterBox.classList.remove("hidden");
  }
};

const addFilterTags = function (title) {
  const markup = `
        <div class="filter">
            <span class="filter-name">${title}</span>

            <span class="filter-remove">
              <img src="./images/icon-remove.svg" alt="" />
            </span>
        </div> 
  `;

  tagsContainer.insertAdjacentHTML("afterbegin", markup);

  tagInFilter.push(title);

  updateFilterVisibility();

  updateJob();
};

const removeFilterTags = function (tagNode) {
  const parentEl = tagNode.parentElement;

  parentEl.remove();

  const index = tagInFilter.indexOf(tagNode.textContent);

  tagInFilter.splice(index, 1);

  updateFilterVisibility();

  updateJob();
};

const getTagsNameListFromJob = function (job) {
  const tags = job.querySelectorAll(".job_filter");

  const tagsNameList = [...tags].map((tag) => tag.textContent);

  return tagsNameList;
};

const checkJob = function (job) {
  const tagsNameinJob = getTagsNameListFromJob(job);

  const included = tagInFilter.every((tag) => tagsNameinJob.includes(tag));

  return included;
};

const getFilteredJob = function () {
  const jobs = document.querySelectorAll(".job");

  const jobsArr = [...jobs];

  const jobFiltered = jobsArr.filter((job) => checkJob(job));

  return jobFiltered;
};

const updateJob = function () {
  const jobsFiltered = getFilteredJob();

  const namesJobFilterd = jobsFiltered.map(
    (job) => job.querySelector(".company").textContent
  );

  const allJobs = document.querySelectorAll(".job");

  const allJobsArr = [...allJobs];

  allJobsArr.forEach((job) => {
    const companyName = job.querySelector(".company").textContent;

    if (namesJobFilterd.includes(companyName)) {
      job.style.display = "grid";
    } else {
      job.style.display = "none";
    }
  });
};

loadALlJobs();

updateFilterVisibility();

jobList.addEventListener("click", function (e) {
  if (
    e.target.closest(".job_filter") &&
    !tagInFilter.includes(e.target.textContent)
  ) {
    addFilterTags(e.target.textContent);
  }
});

tagsContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("filter-remove")) {
    removeFilterTags(e.target);
  }
});

btnClear.addEventListener("click", function (e) {
  while (tagsContainer.firstChild) {
    tagsContainer.removeChild(tagsContainer.firstChild);
  }

  tagInFilter = [];

  updateFilterVisibility();

  updateJob();
});
