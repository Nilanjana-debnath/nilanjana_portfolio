import React from "react";

const FAQs = [
  {
    question: "Do you have any internship experience?",
    answer: "I haven't done a formal internship, but my M.S. (Research) was hands-on and involved deep learning, GNNs, and large-scale dynamic graphs. It was similar to an R&D role where I tackled real-world challenges in graph learning."
  },
  {
    question: "What are your major contributions in past roles?",
    answer: "At TCS, I improved feature engagement by 20% through data-driven UI changes and automated Azure VM management, reducing manual effort by 90%. In my research, I developed a dynamic graph learning model that improved training speed by 46.3% while also enhancing predictive accuracy."
  },
  {
    question: "Have you worked with cross-functional teams?",
    answer: "Yes, I worked with product and engineering teams at TCS to analyze user behavior and optimize applications. In research, I collaborated with faculty and peers to develop GNN-based models."
  },
  {
    question: "Have you led any teams or mentored juniors?",
    answer: "While I haven't formally led a team, I have mentored peers in deep learning, GNNs, and MLOps, helping them understand complex concepts."
  },
  {
    question: "Do you have startup experience?",
    answer: "Not directly, but I thrive in fast-paced, research-driven environments that require self-learning and problem-solving."
  },
  {
    question: "Have you presented your work at conferences or meetings?",
    answer: "My research paper is currently under review, and I have presented my work in internal research discussions and technical reviews."
  },
  {
    question: "How proficient are you in SQL?",
    answer: "I’m very comfortable with SQL, including query optimization, indexing, and handling large datasets for analytics and ML workflows."
  },
  {
    question: "Do you have experience with DevOps or cloud infrastructure?",
    answer: "Yes, I have worked with AWS (S3, SageMaker, Lambda) for ML model deployment and used MLOps tools like MLflow and Docker."
  },
  {
    question: "Have you deployed ML models into production?",
    answer: "Yes. For example, I built a real-time human activity recognition system that processes webcam video feeds. I’ve also deployed models using ONNX and MLflow."
  },
  {
    question: "Have you worked on large-scale distributed systems?",
    answer: "Yes, I have experience with multi-GPU training in PyTorch and optimizing large dynamic graph learning models for efficiency."
  },
  {
    question: "Do you have experience with reinforcement learning or advanced AI?",
    answer: "My focus has been on deep learning, NLP, and GNNs, but I can pick up RL if needed for a role."
  },
  {
    question: "What programming languages do you know apart from Python?",
    answer: "Python is my primary language, but I can quickly adapt to others if needed."
  },
  {
    question: "Are you comfortable with production-level coding?",
    answer: "Yes, I follow best coding practices, write clean, modular code, and use Git for version control."
  },
  {
    question: "Any research publications?",
    answer: "My research paper is under review and will be published soon."
  },
  {
    question: "Have you collaborated with external researchers or industry?",
    answer: "Yes, I worked with faculty and researchers at IIT Palakkad on dynamic graph learning projects."
  },
  {
    question: "Have you been involved in teaching or TA roles?",
    answer: "Yes, I was a Teaching Assistant at IIT Palakkad, where I taught Compiler and Parallel Programming courses. I helped students understand core concepts, assisted with assignments, and guided them through practical implementations."
  },
  {
    question: "What kind of job roles are you looking for?",
    answer: "I’m looking for roles as a Machine Learning Engineer, Research Scientist, AI Engineer, or Data Scientist where I can apply my deep learning and graph learning expertise."
  },
  {
    question: "Do you prefer industry or academia?",
    answer: "I prefer industry, but I’m open to research-driven roles that allow me to work on cutting-edge AI problems."
  },
  {
    question: "Are you open to hybrid or remote work?",
    answer: "I prefer on-site roles in metro cities, but I’m open to hybrid work as well."
  },
  {
    question: "Would you consider international job opportunities?",
    answer: "I’m primarily looking for opportunities in India, but I’m open to the right global opportunity."
  },
  {
    question: "How do you handle tight deadlines?",
    answer: "I break tasks into milestones, prioritize efficiently, and focus on critical components first to ensure timely delivery."
  },
  {
    question: "Have you worked in agile environments?",
    answer: "Yes, I’ve worked with agile workflows, iterative model development, and quick feedback loops."
  },
  {
    question: "What’s your approach to debugging technical issues?",
    answer: "I take a structured approach—checking logs, visualizing data, and isolating errors step by step until I find the root cause."
  },
  {
    question: "Do you prefer working independently or in a team?",
    answer: "I enjoy collaborating on research, but I can also work independently and take ownership of tasks."
  },
  {
    question: "What motivates you professionally?",
    answer: "I love solving challenging problems in AI, optimizing models for efficiency, and continuously learning new technologies."
  }
];

const FAQPage: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {FAQs.map((faq, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{faq.question}</h2>
            <p className="text-gray-700 mt-2">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
