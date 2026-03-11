using Microsoft.AspNetCore.Mvc;
using CollegeManagementSystem.Models;

namespace CollegeManagementSystem.Controllers;

[ApiController]
[Route("api/student")]
public class StudentController : ControllerBase
{
    private static List<Student> students = new List<Student>();

    // GET all students
    [HttpGet("getall")]
    public IActionResult GetAll()
    {
        return Ok(students);
    }

    //  GET student by ID
    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var student = students.FirstOrDefault(s => s.ID == id);
        if (student == null)
            return NotFound("Student not found");
        return Ok(student);
    }

    //  POST - Add new student
    [HttpPost("add")]
    public IActionResult Add([FromBody] Student student)
    {
        students.Add(student);
        return Ok("Student added successfully");
    }

    //    Update student
    [HttpPut("update")]
    public IActionResult Update([FromBody] Student updated)
    {
        var student = students.FirstOrDefault(s => s.ID == updated.ID);
        if (student == null)
            return NotFound("Student not found");

        student.Name = updated.Name;
        student.Age = updated.Age;
        student.Course = updated.Course;
        return Ok("Student updated successfully");
    }

    //  DELETE student
    [HttpDelete("delete/{id}")]
    public IActionResult Delete(string id)
    {
        var student = students.FirstOrDefault(s => s.ID == id);
        if (student == null)
            return NotFound("Student not found");

        students.Remove(student);
        return Ok("Student deleted successfully");
    }
}