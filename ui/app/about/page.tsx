import React from "react";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">About Supernova</h1>
      <p className="text-lg text-white">
        Supernova is a cutting-edge AI project built with Next.js 15, Java
        Spring Boot, and Llama. Designed to push the boundaries of artificial
        intelligence, Supernova seamlessly integrates modern web technologies
        with powerful backend capabilities to deliver high-performance AI-driven
        solutions.
      </p>
      <h2 className="text-2xl font-semibold">Our Technology Stack</h2>
      <ul className="list-disc list-inside text-white space-y-2">
        <li>
          <strong>Next.js 15:</strong> A modern React framework for fast and
          scalable frontend applications.
        </li>
        <li>
          <strong>Java Spring Boot:</strong> A robust backend framework ensuring
          efficiency, security, and scalability.
        </li>
        <li>
          <strong>Llama AI:</strong> A state-of-the-art AI model for natural
          language processing and intelligent automation.
        </li>
      </ul>
      <h2 className="text-2xl font-semibold">Our Vision</h2>
      <p className="text-lg text-white">
        At Supernova, we aim to harness the power of AI to revolutionize how
        businesses interact with data, automate workflows, and enhance user
        experiences. Our goal is to create AI-driven applications that are not
        only powerful but also accessible and intuitive.
      </p>
      <h2 className="text-2xl font-semibold">Get in Touch</h2>
      <p className="text-lg text-white">
        Interested in learning more about Supernova? Reach out to us for
        collaborations, insights, or any inquiries.
      </p>
    </div>
  );
};

export default About;
