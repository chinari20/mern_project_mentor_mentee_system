import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import MentorProfile from "../models/MentorProfile.js";
import MenteeProfile from "../models/MenteeProfile.js";
import MentorshipRequest from "../models/MentorshipRequest.js";
import Session from "../models/Session.js";
import Goal from "../models/Goal.js";
import Review from "../models/Review.js";
import Notification from "../models/Notification.js";

const seedData = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    MentorProfile.deleteMany({}),
    MenteeProfile.deleteMany({}),
    MentorshipRequest.deleteMany({}),
    Session.deleteMany({}),
    Goal.deleteMany({}),
    Review.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const categories = await Category.insertMany([
    { name: "Web Development", description: "Frontend, backend, and full-stack guidance" },
    { name: "Data Science", description: "Analytics, ML, and AI mentoring" },
    { name: "Career Growth", description: "Interviews, resumes, and career strategy" },
  ]);

  const [admin, mentorOne, mentorTwo, menteeOne, menteeTwo] = await User.create([
    {
      name: "Admin User",
      email: "admin@mentorapp.com",
      password: "password123",
      role: "admin",
    },
    {
      name: "Aarav Sharma",
      email: "aarav@mentorapp.com",
      password: "password123",
      role: "mentor",
    },
    {
      name: "Priya Nair",
      email: "priya@mentorapp.com",
      password: "password123",
      role: "mentor",
    },
    {
      name: "Riya Gupta",
      email: "riya@mentorapp.com",
      password: "password123",
      role: "mentee",
    },
    {
      name: "Dev Patel",
      email: "dev@mentorapp.com",
      password: "password123",
      role: "mentee",
    },
  ]);

  await MentorProfile.insertMany([
    {
      userId: mentorOne._id,
      bio: "Senior MERN engineer helping students ship portfolio-ready products.",
      expertise: ["React", "Node.js", "MongoDB", "System Design"],
      experience: 7,
      category: categories[0]._id,
      headline: "Full-Stack Product Mentor",
      languages: ["English", "Hindi"],
      fee: 799,
      ratingAverage: 4.8,
      totalReviews: 12,
      totalMenteesGuided: 34,
      availability: [
        { day: "Monday", startTime: "18:00", endTime: "21:00" },
        { day: "Saturday", startTime: "10:00", endTime: "14:00" },
      ],
      portfolioLinks: {
        linkedin: "https://linkedin.com/in/aarav",
        github: "https://github.com/aarav",
        portfolio: "https://aarav.dev",
      },
    },
    {
      userId: mentorTwo._id,
      bio: "Data and AI mentor focused on practical projects and interview preparation.",
      expertise: ["Python", "Machine Learning", "SQL", "Power BI"],
      experience: 5,
      category: categories[1]._id,
      headline: "Data Science Mentor",
      languages: ["English", "Malayalam"],
      fee: 999,
      ratingAverage: 4.9,
      totalReviews: 18,
      totalMenteesGuided: 28,
      availability: [{ day: "Wednesday", startTime: "19:00", endTime: "22:00" }],
      portfolioLinks: {
        linkedin: "https://linkedin.com/in/priya",
        github: "https://github.com/priya",
      },
    },
  ]);

  await MenteeProfile.insertMany([
    {
      userId: menteeOne._id,
      education: "B.Tech Computer Science",
      interests: ["Full Stack", "Open Source"],
      careerGoals: ["Frontend internship", "Strong React projects"],
      skillsToLearn: ["TypeScript", "Next.js"],
      preferredDomains: ["Web Development"],
      bio: "Third-year student building a strong frontend portfolio.",
    },
    {
      userId: menteeTwo._id,
      education: "MCA",
      interests: ["Data Analytics", "Business Intelligence"],
      careerGoals: ["Data analyst role"],
      skillsToLearn: ["Python", "Tableau"],
      preferredDomains: ["Data Science"],
      bio: "Career switcher learning analytics with structured guidance.",
    },
  ]);

  await MentorshipRequest.create({
    mentorId: mentorOne._id,
    menteeId: menteeOne._id,
    message: "I want mentorship to build production-ready full-stack projects.",
    goals: ["Build 2 projects", "Improve problem solving"],
    preferredTime: "Weekends evenings",
    status: "accepted",
  });

  const session = await Session.create({
    mentorId: mentorOne._id,
    menteeId: menteeOne._id,
    date: "2026-04-15",
    startTime: "18:00",
    endTime: "19:00",
    topic: "Portfolio Roadmap",
    meetLink: "https://meet.google.com/example",
    status: "confirmed",
    notes: "Discuss stack choices and timeline.",
  });

  await Goal.create({
    mentorId: mentorOne._id,
    menteeId: menteeOne._id,
    title: "Build and deploy a MERN app",
    description: "Ship a mentor booking app with auth and dashboard flows.",
    progress: 60,
    status: "in-progress",
    mentorFeedback: "Strong pace. Focus next on testing and deployment.",
  });

  await Review.create({
    mentorId: mentorOne._id,
    menteeId: menteeOne._id,
    sessionId: session._id,
    rating: 5,
    comment: "Very structured and practical guidance.",
  });

  await Notification.insertMany([
    {
      userId: mentorOne._id,
      title: "New mentee onboarded",
      message: "Riya Gupta is now an active mentee.",
      type: "system",
    },
    {
      userId: menteeOne._id,
      title: "Upcoming session",
      message: "Your session with Aarav Sharma is confirmed.",
      type: "session",
    },
  ]);

  console.log("Seed data inserted");
  await mongoose.connection.close();
};

seedData().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
