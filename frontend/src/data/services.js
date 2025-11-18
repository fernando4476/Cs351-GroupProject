import barber from "../assets/barber.jpeg";
import tutoring from "../assets/tutoring.jpeg";
import salsa from "../assets/salsa.jpeg";

export const servicesData = [
  {
    id: "cutz-by-jay",
    displayName: "Cutz by Jay",
    category: "Hair",
    description:
      "UIC-based barber specializing in fades, braids, and protective styles for all hair types.",
    about:
      "I am Jay, a third-year student keeping the campus fresh with modern cuts and protective styles. My suite is five minutes from SCE and I only take one client per slot so you never feel rushed.",
    phone: "(312) 555-0198",
    image: barber,
    rating: 4.9,
    reviews: 124,
    nextAvailable: "Mon 17 · 1:00 PM",
    price: 40,
    tags: [
      "hair",
      "haircut",
      "barber",
      "fades",
      "braids",
      "locs",
      "styling",
      "grooming",
    ],
    timeSlots: ["1:00 PM", "1:40 PM", "2:20 PM", "3:00 PM", "3:40 PM"],
    hours: {
      Monday: "10:00 AM – 6:00 PM",
      Tuesday: "10:00 AM – 6:00 PM",
      Wednesday: "10:00 AM – 6:00 PM",
      Thursday: "10:00 AM – 6:00 PM",
      Friday: "10:00 AM – 8:00 PM",
      Saturday: "9:00 AM – 2:00 PM",
      Sunday: "Closed",
    },
    services: [
      {
        name: "Student Fade",
        description: "Skin, taper, or burst fades finished with beard line up.",
        price: 40,
        duration: 45,
      },
      {
        name: "Protective Style Refresh",
        description: "Braids, retwists, or cornrows up to shoulder length.",
        price: 55,
        duration: 75,
      },
      {
        name: "Line Up & Beard",
        description: "Quick clean up for in-between cuts.",
        price: 25,
        duration: 25,
      },
    ],
  },
  {
    id: "tutoring-with-sarah",
    displayName: "Tutoring with Sarah",
    category: "Tutoring",
    description:
      "CS and math tutoring for freshmen and sophomores—calc, python, and discrete homework help.",
    about:
      "Sarah is a senior CS major who runs weekly study halls for CS 111/141 and Calculus. Sessions are 1:1 with shared notes after every booking.",
    phone: "(312) 555-2298",
    image: tutoring,
    rating: 4.8,
    reviews: 98,
    nextAvailable: "Tue 18 · 3:30 PM",
    price: 30,
    tags: ["tutoring", "homework", "math", "cs", "python", "calc", "study"],
    timeSlots: ["12:00 PM", "1:30 PM", "3:30 PM", "5:00 PM"],
    hours: {
      Monday: "12:00 PM – 6:00 PM",
      Tuesday: "12:00 PM – 6:00 PM",
      Wednesday: "12:00 PM – 6:00 PM",
      Thursday: "12:00 PM – 6:00 PM",
      Friday: "12:00 PM – 4:00 PM",
      Saturday: "Closed",
      Sunday: "Closed",
    },
    services: [
      {
        name: "Calc / Precalc Session",
        description: "Bring problem sets for Calc I/II or precalc refreshers.",
        price: 30,
        duration: 60,
      },
      {
        name: "Python / CS 111 Lab Prep",
        description: "Debug labs, learn testing, and prep for lab check-offs.",
        price: 35,
        duration: 60,
      },
    ],
  },
  {
    id: "uic-salsa",
    displayName: "UIC Salsa Collective",
    category: "Events",
    description:
      "Student-led salsa & bachata lessons every Thursday in the ARC studio.",
    about:
      "Join our collective for beginner-friendly latin dance instruction. We host weekly practice sessions plus pop-up socials.",
    phone: "(773) 555-8842",
    image: salsa,
    rating: 4.7,
    reviews: 63,
    nextAvailable: "Thu 20 · 7:00 PM",
    price: 15,
    tags: ["dance", "events", "salsa", "bachata", "community"],
    timeSlots: ["6:00 PM", "7:00 PM", "8:00 PM"],
    hours: {
      Monday: "Closed",
      Tuesday: "6:00 PM – 9:00 PM",
      Wednesday: "Closed",
      Thursday: "6:00 PM – 10:00 PM",
      Friday: "Closed",
      Saturday: "Workshops by request",
      Sunday: "Closed",
    },
    services: [
      {
        name: "Weekly Lesson",
        description: "60-min group class with rotating partners.",
        price: 15,
        duration: 60,
      },
      {
        name: "Private Lesson",
        description: "Two instructors for up to 4 friends.",
        price: 45,
        duration: 60,
      },
    ],
  },
];

export default servicesData;
