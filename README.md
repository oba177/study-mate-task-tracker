# StudyMate — Study Task Tracker

A small browser-based study task tracker built with HTML, CSS, JavaScript and Supabase.

## Features

- Email/password account registration and sign-in with Supabase Auth
- Add tasks with a required title and optional subject/course
- View tasks saved to the online database
- Mark tasks complete or incomplete
- Delete tasks
- Tasks remain saved after refresh and are private to each signed-in user
- Helpful empty-list and validation messages
- Extra feature: Low / Normal / High priority labels and task filters

## 1. Create your Supabase project

1. Sign in at https://supabase.com and create a project.
2. Open **SQL Editor** in your project.
3. Open `supabase.sql`, copy all its contents, paste them into SQL Editor, and run the script.
4. Open **Project Settings → API** (or **Connect**) and copy the Project URL and anon/public key.

## 2. Configure the application

1. Open `app.js`.
2. Replace `YOUR_SUPABASE_PROJECT_URL` with your Supabase Project URL.
3. Replace `YOUR_SUPABASE_ANON_KEY` with the anon/public key.
4. Save the file.

Only use the anon/public key in browser code. Never put your `service_role` key in this project or expose it in frontend JavaScript.

## 3. Run the application

For a quick local test, open `index.html` in a browser. If your browser blocks requests from a local file, use a small local web server instead (for example, VS Code Live Server).

You can also deploy the folder to Netlify, GitHub Pages, or another static web host. No Node.js server is required.

## 4. Email confirmation

Supabase may require email confirmation for new accounts. If sign-up succeeds but you cannot sign in immediately, check your inbox and confirm the email. For a classroom demo, you can review this under **Authentication → Providers → Email** in Supabase. Do not disable confirmation for a real production application without considering the security implications.

## Database security

The SQL script enables Row Level Security (RLS) and adds policies so each authenticated user can select, insert, update, and delete only rows whose `user_id` matches their own Supabase user ID.

## Project files

- `index.html` — page structure and login/task interface
- `styles.css` — responsive dark theme styling
- `app.js` — authentication and task CRUD logic
- `supabase.sql` — database table, index, and RLS policies
