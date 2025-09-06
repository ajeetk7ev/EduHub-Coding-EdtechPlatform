// ----------------- User / Instructor -----------------
export interface User {
  _id: string;            
  firstname: string;
  lastname: string;
  email?: string;       
  about?: string;
  image: string;
  contactNo?: string;
  role?: string;
  gender?: string;
  dob?: string;
}

// ----------------- Category -----------------
export interface Category {
  _id: string;
  name: string;
  description?: string;   // may not be always populated
  createdAt?: string;
  updatedAt?: string;
}

// ----------------- SubSection -----------------
export interface Subsection {
  _id: string;
  title: string;
  timeDuration: string;   // "119.986533"
  description: string;
  videoUrl: string;
}

// ----------------- Section -----------------
export interface Section {
  _id: string;
  title: string;
  subSections: Subsection[];
}

// ----------------- RatingAndReviews -----------------
export interface RatingAndReviews{
  _id:string;
  rating:number;
  review:string;
}


// Instructor (lightweight version from getAllCourses)
export interface InstructorSummary {
  _id: string;
  firstname: string;
  lastname: string;
  image: string;
}

// Category (summary from getAllCourses)
export interface CategorySummary {
  _id: string;
  name: string;
  description?: string;
}

// ----------------- Course summary (getAllCourses) -----------------
export interface CourseSummary {
  _id: string;
  courseName: string;
  price: number;
  thumbnail: string;
  language: string;
  instructor: InstructorSummary;
  category: CategorySummary;
  ratingAndReviews: RatingAndReviews[];     // refine later if needed
  studentsEnrolled: string[];  // just IDs in summary
}

// ----------------- Full Course Details (getCourseFullDetails) -----------------
export interface CourseDetails {
  _id: string;
  courseName: string;
  courseDescription: string;
  language: string;
  instructor: InstructorSummary;  // backend populates only name + image, not full user
  whatYouWillLearn: string[];
  courseContent: Section[];
  ratingAndReviews: any[];
  price: number;
  thumbnail: string;
  tags: string[];
  category: Category;
  studentsEnrolled: User[] | string[]; // could be populated or just IDs
  instructions: string[];
  status: "Draft" | "Published";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ----------------- Extra: Course with Duration -----------------
export interface CourseWithDuration extends CourseDetails {
  totalDuration: string; // e.g. "6m 12s"
}
