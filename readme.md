# 🎓 CollegeManagementSystem
### ASP.NET Core Web API — Week 17 Workshop Notes

> A full-stack student record management system built with **ASP.NET Core Web API** (C#) and a **vanilla JS frontend**. This document explains every concept used in the project in a notes-friendly, easy-to-understand format.

---

## 📸 Screenshots

<div align="center">

### 🖥️ Frontend — Student Dashboard
<img width="800" alt="Student Dashboard" src="https://github.com/user-attachments/assets/fda9c258-181e-46a3-8802-b8631e128d54" />

<br/>

### ➕ Add Student
<img width="800" alt="Add Student" src="https://github.com/user-attachments/assets/19d41230-cc14-446f-aa49-028c87435185" />

<br/>

### 🔍 Search Student
<img width="800" alt="Search Student" src="https://github.com/user-attachments/assets/b2d798b0-c751-4d35-bbfe-6781a671042e" />

<br/>

### ✏️ Update Student
<img width="800" alt="Update Student" src="https://github.com/user-attachments/assets/fb0c7a5d-f487-4b66-a843-bd52924ee8ad" />

<br/>

### 🗑️ Delete Student
<img width="800" alt="Delete Student" src="https://github.com/user-attachments/assets/a86c2b0f-5d96-4d71-a799-7fcb373f2671" />

<br/>

### 📖 Swagger API Docs
<img width="800" alt="Swagger UI" src="https://github.com/user-attachments/assets/0bd1fb3e-49ed-4c3b-acca-d2a20ea56720" />

</div>

---





## 📌 Table of Contents

1. [What is this project?](#what-is-this-project)
2. [Project Structure](#project-structure)
3. [Key Concepts Explained](#key-concepts-explained)
   - [What is an API?](#what-is-an-api)
   - [What is REST?](#what-is-rest)
   - [ASP.NET Core](#aspnet-core)
   - [Controllers](#controllers)
   - [Models](#models)
   - [HTTP Methods](#http-methods)
   - [In-Memory Storage](#in-memory-storage)
   - [CORS](#cors)
   - [Swagger](#swagger)
4. [API Endpoints](#api-endpoints)
5. [Code Walkthrough](#code-walkthrough)
6. [Frontend Explained](#frontend-explained)
7. [How to Run](#how-to-run)
8. [Git Commands Used](#git-commands-used)

---

## 🧠 What is this project?

This project is a **College Management System** that allows you to:

- ➕ Add new students
- 📋 View all students
- 🔍 Search a student by ID
- ✏️ Update student details
- 🗑️ Delete a student

The **backend** is an API built with C# and ASP.NET Core.  
The **frontend** is a modern dark-themed web page built with HTML, CSS, and JavaScript.  
They communicate with each other using **HTTP requests**.

---

## 📁 Project Structure

```
Week16-AD-Workshop/
│
├── 📂 backend-api/                       ← ASP.NET Core Web API Project
│   ├── 📂 Controllers/
│   │   ├── HomeController.cs             ← Handles the root "/" route
│   │   ├── StudentController.cs          ← All student CRUD endpoints
│   │   └── WeatherForecastController.cs  ← Default template (not used)
│   │
│   ├── 📂 model/
│   │   └── student.cs                    ← Student data model/blueprint
│   │
│   ├── Program.cs                        ← App entry point & configuration
│   ├── appsettings.json                  ← App settings (ports, logging etc.)
│   └── WeatherAPI.csproj                 ← Project file (like package.json)
│
├── 📂 frontend/
│   ├── index.html                        ← Main web page
│   ├── style.css                         ← Styling
│   └── app.js                            ← Fetch API calls to backend
│
└── README.md                             ← This file
```

---

## 📚 Key Concepts Explained

---

### 🔌 What is an API?

**API** stands for **Application Programming Interface**.

Think of it like a **waiter in a restaurant**:
- You (the frontend / client) tell the waiter what you want
- The waiter (API) takes your request to the kitchen (server/database)
- The kitchen prepares the data and sends it back through the waiter

```
Frontend (Browser)  →  API Request  →  Backend (ASP.NET)
Frontend (Browser)  ←  API Response ←  Backend (ASP.NET)
```

In our project:
- The **frontend** sends a request like `GET /api/student/getall`
- The **backend** responds with a list of students in **JSON** format

---

### 🌐 What is REST?

**REST** stands for **Representational State Transfer**. It is a set of rules for building APIs.

A REST API uses standard **HTTP methods** to perform operations:

| Operation | HTTP Method | Example              |
|-----------|-------------|----------------------|
| Read      | GET         | Get all students     |
| Create    | POST        | Add a new student    |
| Update    | PUT         | Update student info  |
| Delete    | DELETE      | Remove a student     |

This is called **CRUD** — **C**reate, **R**ead, **U**pdate, **D**elete.

Our API is a **RESTful API** because it follows these rules.

---

### ⚙️ ASP.NET Core

**ASP.NET Core** is a free, open-source **web framework** made by Microsoft for building web applications and APIs using **C#**.

Why use it?
- Fast and lightweight
- Cross-platform (Windows, Mac, Linux)
- Built-in Swagger support
- Easy to create REST APIs

When you run `dotnet run`, ASP.NET starts a **web server** that listens for HTTP requests on a port (in our case, port **5033**).

```
dotnet run  →  Server starts at http://localhost:5033
```

---

### 🎮 Controllers

A **Controller** is a C# class that handles incoming HTTP requests and returns responses.

Think of a controller like a **traffic cop** — it receives requests and directs them to the right place.

In our project, `StudentController.cs` handles all student-related requests.

```csharp
[ApiController]           // Marks this class as an API controller
[Route("api/student")]    // Base URL: http://localhost:5033/api/student
public class StudentController : ControllerBase
{
    // All student endpoints live here
}
```

**Key attributes used:**

| Attribute          | Meaning                                    |
|--------------------|--------------------------------------------|
| `[ApiController]`  | Tells ASP.NET this is an API controller    |
| `[Route("...")]`   | Sets the URL path for this controller      |
| `[HttpGet]`        | This method handles GET requests           |
| `[HttpPost]`       | This method handles POST requests          |
| `[HttpPut]`        | This method handles PUT requests           |
| `[HttpDelete]`     | This method handles DELETE requests        |

---

### 🧩 Models

A **Model** is a C# class that represents the **shape/structure of your data**.

Think of it as a **blueprint** or a **form template** — it defines what fields a student record should have.

```csharp
// student.cs — inside the model/ folder
namespace CollegeManagementSystem.Models;

public class Student
{
    public string? ID     { get; set; }   // Student ID (e.g. NP01MS7A240036)
    public string? Name   { get; set; }   // Full name
    public int     Age    { get; set; }   // Age (integer, no ?)
    public string? Course { get; set; }   // Course name
}
```

> 💡 The `?` after `string` means the field is **nullable** — it can be empty without causing an error.

> 💡 `{ get; set; }` is a C# **property** — it allows reading and writing the value.

When a POST request comes in with JSON like:
```json
{ "id": "NP01MS7A240036", "name": "John", "age": 20, "course": "CS" }
```
ASP.NET automatically **maps** it to a `Student` object. This is called **model binding**.

---

### 📨 HTTP Methods

Here is how each HTTP method works in our project:

#### GET — Read Data
```csharp
[HttpGet("getall")]
public IActionResult GetAll()
{
    return Ok(students);   // Returns 200 OK with list of students
}
```
- No request body needed
- Returns data as JSON

#### POST — Create Data
```csharp
[HttpPost("add")]
public IActionResult Add([FromBody] Student student)
{
    students.Add(student);
    return Ok("Student added successfully");
}
```
- `[FromBody]` — reads the student data from the request body (JSON)
- Adds to the in-memory list

#### PUT — Update Data
```csharp
[HttpPut("update")]
public IActionResult Update([FromBody] Student updated)
{
    var student = students.FirstOrDefault(s => s.ID == updated.ID);
    if (student == null) return NotFound("Student not found");
    student.Name   = updated.Name;
    student.Age    = updated.Age;
    student.Course = updated.Course;
    return Ok("Student updated successfully");
}
```
- Finds the student by ID first
- Updates their details
- Returns `404 Not Found` if the ID doesn't exist

#### DELETE — Remove Data
```csharp
[HttpDelete("delete/{id}")]
public IActionResult Delete(string id)
{
    var student = students.FirstOrDefault(s => s.ID == id);
    if (student == null) return NotFound("Student not found");
    students.Remove(student);
    return Ok("Student deleted successfully");
}
```
- `{id}` is a **route parameter** — passed in the URL itself
- Example: `DELETE /api/student/delete/NP01MS7A240036`

---

### 🗄️ In-Memory Storage

In a real application, data is stored in a **database** (like SQL Server or MongoDB).

In this workshop, we use a **List** in memory to keep things simple:

```csharp
private static List<Student> students = new List<Student>();
```

> ⚠️ The `static` keyword means ALL requests share the same list. Without `static`, each request would get its own empty list!

> ⚠️ Data is **lost** when the server restarts because it only lives in RAM, not on disk.

**Visual:**
```
Server Memory (RAM)
┌──────────────────────────────────┐
│  List<Student>                   │
│  ┌────────────────────────────┐  │
│  │ { ID: "NP01MS7A240036",   │  │
│  │   Name: "John Doe",       │  │
│  │   Age: 20,                │  │
│  │   Course: "CS" }          │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ { ID: "NP01MS7A240037",   │  │
│  │   Name: "Jane Smith", ... │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
         ❌ Lost on server restart
```

---

### 🌍 CORS

**CORS** = **Cross-Origin Resource Sharing**

By default, browsers **block** requests from one origin (like your HTML file) to a different origin (like your API on port 5033). This is a browser security feature.

**Without CORS:**
```
Frontend (file://index.html) → GET http://localhost:5033/api/student/getall
❌ BLOCKED by browser — "Cross-Origin Request Blocked"
```

**With CORS enabled in `Program.cs`:**
```csharp
builder.Services.AddCors();

app.UseCors(x => x
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());
```

```
Frontend (file://index.html) → GET http://localhost:5033/api/student/getall
✅ ALLOWED — response received successfully
```

---

### 📖 Swagger

**Swagger** is an automatic **API documentation and testing tool** built into ASP.NET Core.

When you visit `http://localhost:5033/swagger`, you see a page that:
- Lists all your endpoints automatically
- Lets you test each one with a **"Try it out"** button
- Shows what request body format is expected
- Shows what response looks like

It reads your code and generates docs automatically — no extra work needed!

```
http://localhost:5033/swagger
         ↓
┌──────────────────────────────────┐
│  GET    /api/student/getall      │
│  GET    /api/student/{id}        │
│  POST   /api/student/add         │
│  PUT    /api/student/update      │
│  DELETE /api/student/delete/{id} │
└──────────────────────────────────┘
```

---

## 📡 API Endpoints

Base URL: `http://localhost:5033`

| Method   | Endpoint                      | Description          | Body Required |
|----------|-------------------------------|----------------------|---------------|
| GET      | `/api/student/getall`         | Get all students     | ❌ No         |
| GET      | `/api/student/{id}`           | Get student by ID    | ❌ No         |
| POST     | `/api/student/add`            | Add new student      | ✅ Yes        |
| PUT      | `/api/student/update`         | Update student       | ✅ Yes        |
| DELETE   | `/api/student/delete/{id}`    | Delete by ID         | ❌ No         |

### Sample JSON Body (for POST and PUT):
```json
{
  "id": "NP01MS7A240036",
  "name": "John Doe",
  "age": 20,
  "course": "Computer Science"
}
```

### HTTP Response Codes:

| Code | Meaning   | When used                     |
|------|-----------|-------------------------------|
| 200  | OK        | Request succeeded             |
| 404  | Not Found | Student ID doesn't exist      |

---

## 🧾 Code Walkthrough

### Program.cs — The Entry Point

```csharp
var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddControllers();         // Enable Controllers
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();          // Enable Swagger
builder.Services.AddCors();               // Enable CORS

var app = builder.Build();

// Configure middleware pipeline
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.MapControllers();   // Map all controller routes

app.Run();              // Start the server
```

> 💡 Think of `Program.cs` like the **startup configuration** of your app — it decides what features to turn on before the server starts.

---

## 🖥️ Frontend Explained

The frontend is a single HTML page that communicates with the API using the **Fetch API** (built into JavaScript).

### How it connects to the backend:

```javascript
const BASE = 'http://localhost:5033';

// GET all students
async function loadAll() {
    const res  = await fetch(`${BASE}/api/student/getall`);
    const data = await res.json();
    renderTable(data);
}

// POST — Add a student
async function addStudent() {
    const student = { id: "NP01...", name: "John", age: 20, course: "CS" };
    const res = await fetch(`${BASE}/api/student/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)   // JS object → JSON string
    });
}
```

### Frontend Tabs:

| Tab            | What it does                                      |
|----------------|---------------------------------------------------|
| All Students   | Loads table from API, shows stats (avg age etc.)  |
| Add Student    | Form → POST request → adds to API list            |
| Search         | GET request by ID → shows student detail card     |
| Update         | Form → PUT request → updates existing record      |
| Delete         | DELETE request by ID → removes from list          |

---

## ▶️ How to Run

### Backend

```bash
# Go to the backend folder
cd backend-api

# Restore packages
dotnet restore

# Run the API
dotnet run
```

✅ Visit: `http://localhost:5033/swagger`

### Frontend

```bash
# Go to frontend folder
cd frontend

# Open in browser (Windows PowerShell)
start index.html
```

> ⚠️ Make sure the backend is running before opening the frontend!

---

## 🔀 Git Commands Used

```bash
# Initialize git
git init

# Stage all files
git add .

# Commit with message
git commit -m "feat: College Management System with CRUD API and frontend"

# Link to GitHub
git remote add origin https://github.com/Basantae/CollegeManagementSystem.git

# Push to GitHub
git push --set-upstream origin master
```

### What each command means:

| Command          | What it does                                       |
|------------------|----------------------------------------------------|
| `git init`       | Creates a new local git repo                       |
| `git add .`      | Stages ALL changed files                           |
| `git commit -m`  | Saves a snapshot of your code with a message       |
| `git remote add` | Links local repo to GitHub                         |
| `git push`       | Uploads commits to GitHub                          |
| `git status`     | Shows changed/staged/untracked files               |

---

## 📝 Quick Reference — C# Concepts

| Concept       | Example                                       | Meaning                             |
|---------------|-----------------------------------------------|-------------------------------------|
| Class         | `public class Student`                        | Blueprint for a Student object      |
| Property      | `public string? Name { get; set; }`           | A readable/writable field           |
| List          | `List<Student> students`                      | A collection of Student objects     |
| LINQ          | `students.FirstOrDefault(s => s.ID == id)`    | Find first match in list            |
| Attribute     | `[HttpGet]`, `[ApiController]`                | Metadata that configures behavior   |
| IActionResult | `return Ok(...)` / `return NotFound(...)`     | HTTP response wrapper               |
| static        | `private static List<Student>`                | Shared across all requests          |
| namespace     | `namespace CollegeManagementSystem`           | Groups related classes together     |

---

## 👨‍💻 Author

**Bashanta Rokaha**  
Informatics College · Week 17 Workshop  
Subject: ASP.NET Core Web API Development

---

*Built with ❤️ using ASP.NET Core, C#, HTML, CSS & JavaScript*
