from docx import Document
from datetime import date, timedelta

# --- Configuration ---
START_DATE = date(2026, 1, 1)
END_DATE = date(2026, 2, 10)
TEAM_MEMBERS = [
    {"name": "B S Niranjan", "role": "Backend Developer (Spring Boot)", "file": "Logbook_Niranjan.docx"},
    {"name": "Subrahmanya I Patgar", "role": "Frontend Developer (React)", "file": "Logbook_Subrahmanya.docx"},
    {"name": "Rahul Shanbhag", "role": "Frontend Developer (React)", "file": "Logbook_Rahul.docx"},
    {"name": "Vishwas Barker", "role": "Database Administrator (MongoDB)", "file": "Logbook_Vishwas.docx"},
    {"name": "Farhan Faras", "role": "Testing & Documentation", "file": "Logbook_Farhan.docx"},
]

# --- Activity Pools (Role Specific) ---

# Common startup activities (Jan 1 - Jan 10)
COMMON_PHASE_1 = [
    "Discussion on Capstone Project themes and domain selection.",
    "Literature survey: Analyzing existing apps like RedBus and AbhiBus.",
    "Drafting the project abstract and problem statement.",
    "Meeting with Guide to approve the project title 'TravelEase'.",
    "Finalizing the Tech Stack: React, Spring Boot, MongoDB.",
    "Preparing the Project Synopsis for submission.",
    "Team discussion on module division and role assignment.",
    "Requirement gathering: Listing Functional vs Non-Functional requirements.",
]

# Role Specific Activities (Jan 11 onwards)
ACTIVITIES = {
    "Backend Developer (Spring Boot)": [
        "System Architecture Design: MVC pattern planning.",
        "Designing API Endpoints for User Module.",
        "Setting up Java Development Kit (JDK) and IntelliJ IDEA.",
        "Initializing Spring Boot project via Spring Initializr.",
        "Adding dependencies: Spring Web, Data MongoDB, Lombok.",
        "Configuring application.properties for MongoDB connection.",
        "Creating Java Class 'User' model/entity.",
        "Developing Repository interface for User entity.",
        "Implementing Service layer logic for User Registration.",
        "Developing Controller methods for User Sign-up.",
        "Testing API endpoints using Postman (GET/POST).",
        "Implementing JWT (JSON Web Token) dependencies.",
        "Configuring Spring Security for password hashing (BCrypt).",
        "Debugging CORS issues between React and Spring Boot.",
        "Designing the Bus entity class and attributes.",
        "Implementing 'Add Bus' API for Admin role.",
        "Unit testing Service layer using JUnit.",
        "Code review with Frontend team for JSON structure alignment.",
        "Refactoring code for better exception handling.",
    ],
    "Frontend Developer (React)": [
        "UI/UX Design: Sketching wireframes for Home and Login screens.",
        "Setting up Node.js environment and VS Code.",
        "Initializing React project using Vite/Create-React-App.",
        "Installing UI libraries (Bootstrap/Tailwind CSS).",
        "Creating folder structure (Components, Pages, Assets).",
        "Developing the Navigation Bar (Navbar) component.",
        "Designing the Footer and Layout wrapper.",
        "Creating the 'Home' page with hero section.",
        "Developing the Login User Interface form.",
        "Developing the Registration/Sign-up form.",
        "Implementing Form Validation (Regex for email/phone).",
        "Setting up Axios for API HTTP requests.",
        "Connecting Login Form to Backend API.",
        "Handling JWT token storage in LocalStorage.",
        "Designing the 'Search Bus' results component.",
        "Responsive design testing for mobile view.",
        "Debugging CSS alignment issues on different screens.",
        "Team meeting: Integrating Backend APIs with Frontend.",
        "Optimizing React state management (useState/useEffect).",
    ],
    "Database Administrator (MongoDB)": [
        "Study of NoSQL vs SQL for booking systems.",
        "Designing the Entity Relationship (ER) Diagram.",
        "Defining Schema for 'Users' collection.",
        "Defining Schema for 'Buses' and 'Routes' collection.",
        "Installing MongoDB and MongoDB Compass locally.",
        "Setting up MongoDB Atlas (Cloud) cluster.",
        "Creating Database user roles and permissions.",
        "Testing connection strings with Backend team.",
        "Populating dummy data for 'Buses' to test retrieval.",
        "Indexing key fields (Source, Destination) for faster search.",
        "Designing the 'Booking' collection structure.",
        "Normalization checks to reduce data redundancy.",
        "Backup and Restore testing for database.",
        "Assisting Backend team with complex MongoDB queries.",
        "Monitoring database performance and latency.",
        "Reviewing data consistency across collections.",
        "Documenting the Database Schema for the report.",
        "Refining the 'Seat Layout' array structure in DB.",
        "Data validation rule implementation.",
    ],
    "Testing & Documentation": [
        "Detailed requirement analysis (SRS preparation).",
        "Drafting the Introduction and Literature Survey chapters.",
        "Creating Data Flow Diagrams (DFD) Level 0 and Level 1.",
        "Defining Use Case Diagrams for User and Admin.",
        "Preparing the Software Requirement Specification (SRS) doc.",
        "Setting up the GitHub Repository for the team.",
        "Defining Branching strategy (Main, Dev, Feature branches).",
        "Researching Testing tools (Selenium/Jest).",
        "Writing Test Cases for User Registration (Positive/Negative).",
        "Writing Test Cases for Login Module.",
        "Manual Testing of the Login UI components.",
        "Verifying API responses using Postman.",
        "Documenting API endpoints (Swagger/Manual).",
        "Tracking bugs found during initial integration.",
        "Updating the Logbook format for the team.",
        "Preparing the 'System Design' chapter content.",
        "Reviewing code comments for documentation standards.",
        "Meeting with Guide to show SRS progress.",
        "Creating Sequence Diagrams for Booking Flow.",
    ]
}

def generate_logbook(member):
    doc = Document()
    
    # Title Page Info
    doc.add_heading('DAILY LOG BOOK', 0)
    doc.add_paragraph(f"Student Name: {member['name']}")
    doc.add_paragraph(f"Role: {member['role']}")
    doc.add_paragraph(f"Project: TravelEase (Bus Booking System)")
    doc.add_paragraph("-" * 50)

    current_date = START_DATE
    role_activities = ACTIVITIES.get(member['role'], ACTIVITIES["Frontend Developer (React)"]) # Default to Frontend if role mismatch
    
    # Indices to track progress through the activity lists
    common_idx = 0
    role_idx = 0
    
    while current_date <= END_DATE:
        # Skip Sundays
        if current_date.weekday() == 6: 
            current_date += timedelta(days=1)
            continue
            
        # Format Date
        date_str = current_date.strftime("%d-%m-%Y")
        
        # Determine Activity Content
        activity_text = ""
        
        # Special Date: Republic Day
        if current_date.month == 1 and current_date.day == 26:
             activity_text = "Republic Day Holiday. Self-study on upcoming modules."
        
        # Phase 1: First 10 days are common
        elif common_idx < len(COMMON_PHASE_1):
            activity_text = COMMON_PHASE_1[common_idx]
            common_idx += 1
            # If we run out of common tasks early, start role tasks
            if common_idx >= len(COMMON_PHASE_1): 
                common_idx = 100 # force exit
                
        # Phase 2+: Role specific
        else:
            if role_idx < len(role_activities):
                activity_text = role_activities[role_idx]
                role_idx += 1
            else:
                activity_text = "Refining previous code, debugging, and documentation updates."

        # Add entry to table or paragraph
        p = doc.add_paragraph()
        p.add_run(f"Date: {date_str}").bold = True
        p.add_run(f"\nActivity: {activity_text}")
        p.add_run("\n" + "_"*30)
        
        current_date += timedelta(days=1)

    doc.save(member['file'])
    print(f"Generated {member['file']}")

# --- Execution ---
if __name__ == "__main__":
    for member in TEAM_MEMBERS:
        generate_logbook(member)
    print("\nAll logbooks generated successfully!")