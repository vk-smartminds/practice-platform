// lib/data.ts
import { AppData } from './types';

export const appData: AppData = {
  subjects: {
    mathematics: {
      name: "Mathematics",
      class: "10th",
      icon: "📐",
      description: "Master mathematical concepts and problem-solving",
      chapters: {
        real_numbers: {
          name: "Real Numbers",
          topics: {
            rational_numbers: {
              name: "Rational Numbers",
              questions: [
                { id: "q1", question: "Which of the following is a rational number?", options: ["√2", "π", "3/4", "√3"], correct: 2, explanation: "3/4 can be expressed as a ratio of integers, making it rational." },
                { id: "q2", question: "What is the decimal expansion of 1/3?", options: ["0.33", "0.333...", "0.3", "0.34"], correct: 1, explanation: "1/3 has a non-terminating, repeating decimal expansion." }
              ]
            },
            irrational_numbers: { name: "Irrational Numbers", questions: [{ id: "q3", question: "Which of these is irrational?", options: ["0.5", "√9", "√2", "7/8"], correct: 2, explanation: "√2 cannot be expressed as a ratio of integers." }] }
          }
        },
        polynomials: {
          name: "Polynomials",
          topics: {
            linear_polynomials: { name: "Linear Polynomials", questions: [{ id: "q4", question: "What is the degree of polynomial 3x + 5?", options: ["0", "1", "2", "3"], correct: 1, explanation: "The highest power of x is 1, so degree is 1." }] },
            quadratic_polynomials: { name: "Quadratic Polynomials", questions: [{ id: "q5", question: "The standard form of quadratic polynomial is:", options: ["ax + b", "ax² + bx + c", "ax³ + bx² + c", "ax + b + c"], correct: 1, explanation: "Quadratic polynomial has degree 2, so highest power is x²." }] }
          }
        }
      }
    },
    physics: {
        name: "Physics",
        class: "10th",
        icon: "⚛️",
        description: "Explore the fundamental laws of nature",
        chapters: {
            light: {
                name: "Light - Reflection and Refraction",
                topics: {
                    reflection: { name: "Reflection of Light", questions: [{ id: "p1", question: "The angle of incidence is equal to:", options: ["Angle of refraction", "Angle of reflection", "90 degrees", "45 degrees"], correct: 1, explanation: "According to the law of reflection, angle of incidence equals angle of reflection." }] },
                    refraction: { name: "Refraction of Light", questions: [{ id: "p2", question: "When light passes from air to water, it:", options: ["Speeds up", "Slows down", "Maintains speed", "Stops"], correct: 1, explanation: "Light slows down when moving from a less dense to a more dense medium." }] }
                }
            }
        }
    }
    // ... other subjects
  }
};