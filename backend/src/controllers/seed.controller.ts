import { Request, Response } from "express";
import User from "../models/User";
import Course from "../models/Course";
import Category from "../models/Category";
import Section from "../models/Section";
import SubSection from "../models/SubSection";
import bcrypt from "bcryptjs";

export const seedMockData = async (req: Request, res: Response) => {
    try {
        // 1. Clear existing data (optional - safer to just add)
        // For this demo, we'll just add new data

        // 2. Create mock categories if they don't exist
        const categories = [
            "Web Development",
            "Programming Languages",
            "DSA",
            "Databases",
            "DevOps"
        ];

        const categoryIds = [];
        for (const name of categories) {
            let cat = await Category.findOne({ name });
            if (!cat) {
                cat = await Category.create({ name, description: `Master the art of ${name}` });
            }
            categoryIds.push(cat._id);
        }

        // 3. Create a mock instructor if no instructors exist
        let instructor = await User.findOne({ role: "instructor" });
        if (!instructor) {
            const hashedPassword = await bcrypt.hash("password123", 10);
            instructor = await User.create({
                firstname: "John",
                lastname: "Doe",
                email: "instructor@example.com",
                password: hashedPassword,
                role: "instructor",
                about: "Expert Developer with 10+ years of experience.",
                image: `https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe`
            });
        }

        // 4. Create Mock Courses (about 10)
        const mockCourses = [
            { name: "Complete React Mastery", price: 2999, category: "Web Development" },
            { name: "Node.js Backend Bootcamp", price: 3499, category: "Web Development" },
            { name: "Python for Data Science", price: 1999, category: "Programming Languages" },
            { name: "Java DSA Professional", price: 4999, category: "DSA" },
            { name: "MongoDB Advanced Guide", price: 1599, category: "Databases" },
            { name: "Docker & Kubernetes Unleashed", price: 4500, category: "DevOps" },
            { name: "Modern C++ Programming", price: 1200, category: "Programming Languages" },
            { name: "Next.js 14 Fullstack Mastery", price: 3999, category: "Web Development" },
            { name: "System Design for Interviews", price: 5999, category: "DSA" },
            { name: "PostgreSQL Optimizer Secrets", price: 2500, category: "Databases" },
        ];

        const thumbnails = [
            "https://res.cloudinary.com/dqr66m9jr/image/upload/v1714206584/course-image/react_thumbnail.jpg",
            "https://res.cloudinary.com/dqr66m9jr/image/upload/v1714206584/course-image/node_thumbnail.jpg",
            "https://res.cloudinary.com/dqr66m9jr/image/upload/v1714206584/course-image/python_thumbnail.jpg",
            "https://res.cloudinary.com/dqr66m9jr/image/upload/v1714206584/course-image/dsa_thumbnail.jpg"
        ];

        const mockVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4"; // Sample public video

        for (let i = 0; i < mockCourses.length; i++) {
            const courseData = mockCourses[i];
            const cat = await Category.findOne({ name: courseData.category });

            const newCourse = await Course.create({
                courseName: courseData.name,
                courseDescription: `This is a comprehensive course on ${courseData.name}. Perfect for students wanting to master their skills from scratch to advanced level.`,
                instructor: instructor?._id,
                whatYouWillLearn: ["Foundations", "Intermediate concepts", "Advanced projects", "Industry best practices"],
                price: courseData.price,
                language: "English",
                tags: [courseData.category, "Coding", "Tech"],
                category: cat?._id,
                thumbnail: thumbnails[i % thumbnails.length] || thumbnails[0],
                status: "Published",
                instructions: ["Follow sequential modules", "Complete all assignments", "Participate in discussions"]
            });

            // Add mock section and subsection
            const section = await Section.create({
                title: "Introduction",
                subSections: []
            });

            const subSection = await SubSection.create({
                title: "Welcome to the Course",
                description: "Getting started with your first lesson.",
                timeDuration: "300",
                videoUrl: mockVideoUrl
            });

            section.subSections.push(subSection._id as any);
            await section.save();

            newCourse.courseContent.push(section._id as any);
            await newCourse.save();

            // Update user and category
            await User.findByIdAndUpdate((instructor as any)._id, { $push: { coursesCreated: (newCourse as any)._id } });
            await Category.findByIdAndUpdate((cat as any)._id, { $push: { courses: (newCourse as any)._id } });
        }

        return res.status(200).json({
            success: true,
            message: "Mock data seeded successfully"
        });
    } catch (error: any) {
        console.error("Seed error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to seed mock data",
        });
    }
};
