'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";

const Features = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Consider mobile if width is less than 768px
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const sections = ["AI Wizardry", "Chat Without Borders", "Verify Me Not", "Ship Happens", "The AI that Cares", "Small World, Big Promises"];
  const [selectedSection, setSelectedSection] = useState(sections[0]);

  const handleSectionClick = (section: string) => {
    if (!isMobile) {
      setSelectedSection(section);
    }
  };

  return (
    <div className="flex flex-col mt-3">
      <div className="section-container px-8 flex items-center justify-center">
        <div className="text-container flex flex-col lg:p-[2rem] lg:max-w-[40%]">
          {sections.map((section) => (
            <div
              key={section}
              onClick={() => handleSectionClick(section)}
              className={`cursor-pointer mb-8 ${selectedSection === section
                ? "text-blue-theme border-blue-theme"
                : "text-white opacity-30 border-gray-500 transition duration-200 ease-in-out hover:text-blue-theme"
                }`}
            >
              <div className="section-content pl-5 border-l-4">
                <h2 className="font-bold text-lg">{section}</h2>
                <p className="text-white">
                  {section === "AI Wizardry"
                    ? "Harnesses the magical powers of NLP and Generative AI to decode human interactions, making global selling as easy as sending a text... or so it seems."
                    : section === "Chat Without Borders"
                      ? "Powered by AWS translation services, this multilingual chat system lets you talk across time zones in real time. Too bad it can't fix time-zone math for you."
                      : section === "Verify Me Not"
                        ? "VerifyBOT automates cross-verification of documents for compliance. Because who doesn&apos;t love leaving their international trade in the hands of a bot?"
                        : section === "Ship Happens"
                          ? "Dynamic shipment management keeps tabs on real-time tracking and negotiation tools for logistics. If only it could actually stop shipments from getting delayed."
                          : section === "The AI that Cares"
                            ? "An AWS chatbot lovingly named 'May I Help You' offers instant assistance. It&apos;s like having a customer service rep... who never calls in sick or goes on break!"
                            : section === "Small World, Big Promises"
                              ? "ParSeLL promises scalable and reliable international trade solutions for sellers in two countries. Just don&apos;t ask why the whole 'worldwide selling' only covers two nations."
                              : ""
                  }
                </p>
              </div>
            </div>
          ))}
        </div>

        {!isMobile && (
          <div className="image-container ml-10">
            {selectedSection === "AI Wizardry" && (
              <Image
                src="/Feature1.jpg"
                alt="AI Wizardry"
                width={500}
                height={300}
                className="rounded-md m-20 drop-shadow-md shadow-lg shadow-blue-theme"
              />
            )}
            {selectedSection === "Chat Without Borders" && (
              <Image
                src="/Feature2.jpg"
                alt="Chat Without Borders"
                width={500}
                height={300}
                className="rounded-md m-24 drop-shadow-md shadow-lg shadow-blue-theme"
              />
            )}
            {selectedSection === "Verify Me Not" && (
              <Image
                src="/Feature3.jpg"
                alt="Verify Me Not"
                width={500}
                height={300}
                className="rounded-md m-24 drop-shadow-md shadow-lg shadow-blue-theme"
              />
            )}
            {selectedSection === "Ship Happens" && (
              <Image
                src="/Feature4.jpg"
                alt="Ship Happens"
                width={500}
                height={300}
                className="rounded-md m-24 drop-shadow-md shadow-lg shadow-blue-theme"
              />
            )}
            {selectedSection === "The AI that Cares" && (
              <Image
                src="/Feature5.jpg"
                alt="The AI that Cares"
                width={500}
                height={300}
                className="rounded-md m-32 drop-shadow-md shadow-lg shadow-blue-theme"
              />
            )}
            {selectedSection === "Small World, Big Promises" && (
              <Image
                src="/Feature5.jpg"
                alt="Small World, Big Promises"
                width={500}
                height={300}
                className="rounded-md m-32 drop-shadow-md shadow-lg shadow-blue-theme"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Features;