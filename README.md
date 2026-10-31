# StudyMate – Study Task Tracker

## 1. Project Overview

StudyMate is a simple web-based application designed to help students organise, manage, and keep track of their academic assignments and study activities. It provides an easy-to-use platform where students can record tasks, monitor their progress, and manage their workload efficiently.

## 2. Features

- **User Authentication:** Allows students to create accounts and securely sign in.
- **Add Tasks:** Students can add study tasks by providing a task title and subject or course name.
- **View Tasks:** Displays saved tasks in an organised list.
- **Mark Tasks as Complete:** Students can mark tasks as completed when finished.
- **Reopen Tasks:** Completed tasks can be changed back to incomplete.
- **Delete Tasks:** Allows students to remove tasks they no longer need.
- **Online Database:** Uses Supabase to store tasks online.
- **Persistent Storage:** Tasks remain saved even after the application is refreshed.
- **Empty Task Message:** Displays a helpful message when there are no tasks available.
- **Input Validation:** Prevents users from submitting tasks without a title.

## 3. How to Use the Application

1. **Create an Account:** Register using your email address and password.
2. **Sign In:** Log in to access your personal study dashboard.
3. **Add a Task:** Enter a task title, subject or course name, and select a priority level.
4. **View Tasks:** Your saved tasks will appear in the task list.
5. **Update Progress:** Use the checkbox to mark a task as complete or incomplete.
6. **Filter Tasks:** Choose to view all tasks, incomplete tasks, or completed tasks.
7. **Delete Tasks:** Remove tasks that are no longer needed.
8. **Sign Out:** Log out securely when you have finished using the application.

## 4. Additional Feature

**Task Priority and Filtering**

StudyMate includes an additional task management feature that allows students to assign priority levels to their tasks:

- High Priority
- Normal Priority
- Low Priority

Students can also filter their tasks to display all tasks, incomplete tasks, or completed tasks.

## 5. Technologies Used

- **HTML5:** Structures the application's content.
- **CSS3:** Provides styling and responsive user interface design.
- **JavaScript:** Handles application functionality and user interactions.
- **Supabase:** Provides online database storage and user authentication.

## 6. Project Structure

```text
study-task-tracker/
│
├── index.html
│   └── Application structure and interface
│
├── styles.css
│   └── Application styling and layout
│
├── app.js
│   └── Application logic and functionality
│
├── supabase.sql
│   └── Database table and security policies
│
└── README.md
    └── Project documentation
```

## 7. Purpose of the Application

The main purpose of StudyMate is to help students improve their organisation, time management, and academic productivity by providing a central place to record and monitor their study tasks.

## 8. Conclusion

StudyMate offers a simple and effective solution for managing academic responsibilities. By combining task management, progress tracking, and online data storage, the application helps students stay organised, monitor completed assignments, and keep track of their remaining academic activities.
