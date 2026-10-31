const SUPABASE_URL = "https://qwafwarmitikatuppgsi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_LFCg6N_bvpC-9mzlTP994A_pWyTw-74";


const authView = document.getElementById("authView");
const appView = document.getElementById("appView");
const authForm = document.getElementById("authForm");
const authHeading = document.getElementById("authHeading");
const authDescription = document.getElementById("authDescription");
const authSubmit = document.getElementById("authSubmit");
const authSwitchText = document.getElementById("authSwitchText");
const switchAuthButton = document.getElementById("switchAuth");
const authMessage = document.getElementById("authMessage");
const taskForm = document.getElementById("taskForm");
const taskMessage = document.getElementById("taskMessage");
const taskList = document.getElementById("taskList");
const taskFilter = document.getElementById("taskFilter");

let supabaseClient;
let isSignUpMode = false;
let currentTasks = [];

function showMessage(element, message, success = false) {
  element.textContent = message;
  element.classList.toggle("success", success);
}

function configurationIsReady() {
  return SUPABASE_URL.startsWith("https://") &&
    SUPABASE_ANON_KEY.length > 20 &&
    !SUPABASE_URL.includes("YOUR_") &&
    !SUPABASE_ANON_KEY.includes("YOUR_");
}

function showSignedOut() {
  appView.classList.add("hidden");
  authView.classList.remove("hidden");
}

function showSignedIn(user) {
  authView.classList.add("hidden");
  appView.classList.remove("hidden");
  document.getElementById("userEmail").textContent = user.email || "Signed in";
  loadTasks();
}

function setAuthMode(signUp) {
  isSignUpMode = signUp;
  authHeading.textContent = signUp ? "Create your account" : "Welcome back";
  authDescription.textContent = signUp
    ? "Create an account to save your study tasks online."
    : "Sign in to keep your study tasks organised.";
  authSubmit.textContent = signUp ? "Create account" : "Sign in";
  authSwitchText.innerHTML = signUp
    ? 'Already have an account? <button id="switchAuth" class="text-button" type="button">Sign in</button>'
    : 'New to StudyMate? <button id="switchAuth" class="text-button" type="button">Create an account</button>';
  document.getElementById("switchAuth").addEventListener("click", () => setAuthMode(!isSignUpMode));
  document.getElementById("password").autocomplete = signUp ? "new-password" : "current-password";
  showMessage(authMessage, "");
}

switchAuthButton.addEventListener("click", () => setAuthMode(!isSignUpMode));

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabaseClient) return;
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  authSubmit.disabled = true;
  authSubmit.textContent = "Please wait…";
  showMessage(authMessage, "");

  try {
    if (isSignUpMode) {
      const { data, error } = await supabaseClient.auth.signUp({ email, password });
      if (error) throw error;
      if (data.session) {
        showMessage(authMessage, "Account created successfully.", true);
      } else {
        showMessage(authMessage, "Account created. Check your email to confirm it, then sign in.", true);
        setAuthMode(false);
      }
    } else {
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
    }
  } catch (error) {
    showMessage(authMessage, error.message || "Authentication failed.");
  } finally {
    authSubmit.disabled = false;
    authSubmit.textContent = isSignUpMode ? "Create account" : "Sign in";
  }
});

document.getElementById("signOutButton").addEventListener("click", async () => {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    alert(error.message);
    return;
  }
  currentTasks = [];
  showSignedOut();
});

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.getElementById("taskTitle").value.trim();
  const subject = document.getElementById("taskSubject").value.trim();
  const priority = document.getElementById("taskPriority").value;

  if (!title) {
    showMessage(taskMessage, "Please enter a task title.");
    document.getElementById("taskTitle").focus();
    return;
  }

  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) {
    showMessage(taskMessage, "Your session has expired. Please sign in again.");
    showSignedOut();
    return;
  }

  const { error } = await supabaseClient.from("study_tasks").insert({
    user_id: user.id,
    title,
    subject: subject || null,
    priority
  });

  if (error) {
    showMessage(taskMessage, error.message);
    return;
  }

  taskForm.reset();
  showMessage(taskMessage, "Task added.", true);
  await loadTasks();
});

taskFilter.addEventListener("change", renderTasks);

async function loadTasks() {
  taskList.innerHTML = '<p class="empty-state">Loading your tasks…</p>';
  const { data, error } = await supabaseClient
    .from("study_tasks")
    .select("id, title, subject, is_completed, priority, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    taskList.innerHTML = "";
    showMessage(taskMessage, error.message);
    return;
  }

  currentTasks = data || [];
  renderTasks();
  updateSummary();
}

function renderTasks() {
  const filter = taskFilter.value;
  const filteredTasks = currentTasks.filter(task => {
    if (filter === "active") return !task.is_completed;
    if (filter === "completed") return task.is_completed;
    return true;
  });

  taskList.innerHTML = "";
  if (filteredTasks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = currentTasks.length === 0
      ? "No tasks yet. Add your first study task to get started."
      : "There are no tasks in this filter.";
    taskList.appendChild(empty);
    return;
  }

  filteredTasks.forEach(task => {
    const item = document.createElement("article");
    item.className = `task-item${task.is_completed ? " is-complete" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.is_completed;
    checkbox.setAttribute("aria-label", `Mark ${task.title} ${task.is_completed ? "incomplete" : "complete"}`);
    checkbox.addEventListener("change", () => updateTaskStatus(task.id, checkbox.checked));

    const main = document.createElement("div");
    main.className = "task-main";
    const title = document.createElement("div");
    title.className = "task-title";
    title.textContent = task.title;
    const subject = document.createElement("div");
    subject.className = "task-subject";
    subject.textContent = task.subject || "No subject added";
    main.append(title, subject);

    const actions = document.createElement("div");
    actions.className = "task-actions";
    const priority = document.createElement("span");
    priority.className = `priority ${task.priority || "normal"}`;
    priority.textContent = task.priority || "normal";
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.title = "Delete task";
    deleteButton.setAttribute("aria-label", `Delete ${task.title}`);
    deleteButton.addEventListener("click", () => deleteTask(task.id));
    actions.append(priority, deleteButton);

    item.append(checkbox, main, actions);
    taskList.appendChild(item);
  });
}

async function updateTaskStatus(taskId, isCompleted) {
  const { error } = await supabaseClient
    .from("study_tasks")
    .update({ is_completed: isCompleted })
    .eq("id", taskId);
  if (error) {
    showMessage(taskMessage, error.message);
    await loadTasks();
    return;
  }
  await loadTasks();
}

async function deleteTask(taskId) {
  const { error } = await supabaseClient
    .from("study_tasks")
    .delete()
    .eq("id", taskId);
  if (error) {
    showMessage(taskMessage, error.message);
    return;
  }
  await loadTasks();
}

function updateSummary() {
  const completed = currentTasks.filter(task => task.is_completed).length;
  document.getElementById("totalCount").textContent = currentTasks.length;
  document.getElementById("completedCount").textContent = completed;
  document.getElementById("remainingCount").textContent = currentTasks.length - completed;
}

async function startApp() {
  if (!configurationIsReady()) {
    showSignedOut();
    showMessage(authMessage, "Setup needed: add your Supabase Project URL and anon key in app.js.");
    return;
  }

  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session?.user) showSignedIn(session.user);
  else showSignedOut();

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    if (session?.user) showSignedIn(session.user);
    else showSignedOut();
  });
}

startApp();
