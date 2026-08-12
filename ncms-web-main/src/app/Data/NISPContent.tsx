export const placementInfo = {
    title: "VISION AND MISSION",
    description: [
        "The ‘National Student and Faculty Startup Policy-2019’ is initiated by MHRD’s Innovation Cell and AICTE. It is a guiding framework to envision an educational system oriented towards start-ups and entrepreneurship opportunities for student and faculties.",
        "The guidelines provide ways for developing entrepreneurial agenda, managing Intellectual Property Rights (IPR) ownership, technology licensing and equity sharing in Start-ups or enterprises established by faculty and student and encourage them to actively pursue path of innovation and entrepreneurship",
        "Our vision is to develop high quality technical human resource capable of doing cutting edge research and innovation and deep-tech entrepreneurship.",
        "To enable the institute to actively engage students, faculties, and staff in innovation and entrepreneurship-related activities.",
        "To create a space for Collaboration, Co-creation, Business Relationships, and Knowledge Exchange.",
        "To facilitate the institute in terms of Intellectual Property (IP) ownership management, technology licensing, and equity sharing."
    ]
};

export const sections = [
    {
        title: "Thrust Areas of NISP",
        content: [
            "Strategies and Governance for Promoting Innovation & Entrepreneurship:",
            "Creating Innovation Pipeline and Pathways for Entrepreneurs.",
            "Building Organizational Capacity, Human Resources, and Incentives.",
            "Collaboration, Co-creation, and Business Relationships and Knowledge Exchange.",
            "",
            "Norms for Faculty and Students Driven Innovations and Startups:",
            "Incentivizing Students for Innovation and Entrepreneurship.",
            "Incentivizing Faculties & Staff for Innovation and Entrepreneurship.",
            "Norms for Faculty Startups.",
            "",
            "Incubation & Pre-Incubation Support Facility Creation and Access:",
            "IP Ownership Rights for Technologies Developed at Higher Educational Institutions.",
            "Pedagogy and Learning Interventions for Entrepreneurship Development.",
            "Entrepreneurial Performance Impact Assessment."
        ]
    }
];

export const NCETPolicy = {
    title: "NCET Policy",
    description: "The National Innovation and Startup Policy 2022 for students and faculty - NCET.",
    buttonText: "View Details",
    pdf: "/pdfs/nisp-policy/policy.pdf",
    imageUrl: "/images/NISP/policy.png"
};

export type ActivityType = string | { title: string; content: string[] };

export const KnowMore = {
    tabs: ["Objectives", "Goals", "Deliverables & Promotion"],
    activitiesData: {
        "Objectives": [
            "Innovation Development",
            "Entrepreneurship Exposure and Skills Development",
            "Support Facilities for Start-up Services",
            "Inter-Institutional Partnership",
            "Network with Regional and National Start-up Ecosystem",
            "Industry Support, Corporate & Private Partnership Linkage",
            "Technology Commercialization"
        ] as ActivityType[], // Explicitly define type
        "Goals": [
            { title: "Short-term Goals", content: [
                "Developing critical thinking skills to motivate students and faculties with entrepreneurial abilities.",
                "Building Innovation and Incubation ecosystem by providing resources available at the Institute.",
                "In-house competency development to serve potentiality to the incubators.",
                "Strengthen the intra and inter-institutional linkage with ecosystem enablers at different levels.",
                "Defining Key Performance Indicators (KPIs) for Entrepreneurial Performance Impact Assessment."
            ]},
            { title: "Long-term Goals", content: [
                "Innovation, Pre-incubation, Incubation and startup facilities on the campus.",
                "Academic courses offered by the institute on Innovation, IPR, and Start-ups.",
                "Obtaining scientific and technical patents by Incubators and Startups.",
                "Collaboration, Co-Creation and Technology Exchange and Commercialization.",
                "Emerging successful Innovation and Start-ups from the Institute.",
                "Increase technical employment rate through self-employment by Startups.",
                "Developing Key Performance Indicators (KPIs) for Entrepreneurial Performance Impact Assessment.",
                "Creating societal, ethical, and technological entrepreneurs through National Innovation and Start-up Policy."
            ]}
        ] as ActivityType[], // Explicitly define type
        "Deliverables & Promotion": [
            { title: "Deliverables", content: [
                "Inculcating awareness on Innovation and Start-ups among students and faculties.",
                "Imparting education on Innovation and Entrepreneurship development.",
                "Providing State-of-art facilities.",
                "Enterprise Support from Corporate Social Responsibility (CSR).",
                "Arena with skilled professionals to make Industry ready.",
                "Constituting Advisory Services Committee to address grievances.",
                "Promoting active Research & Advocacy.",
                "Inter-Department linkages and Inter-Institutional Linkages."
            ]},
            { title: "Promotion", content: [
                "Organize Workshops /Lectures/Seminars/eTalk/Boot Camp etc.",
                "Conduct Online and Classroom Education, Training & Mentoring.",
                "Integration of Experiential Learning.",
                "Establishment of Start-up Cell.",
                "Scout, Recognize, Support Ideas, Innovation, and Startups.",
                "Innovation and Start-up Repository Build-up.",
                "Setup Advisory Service Expert Pool.",
                "Training-FDPs and EDPs.",
                "Incentives for experts from Industry.",
                "Research Studies and Advocacy Programs.",
                "Mentor, Start-up Cell Network, Business & Referral Service.",
                "Convergence and Leverage for Govt. Schemes and Programs.",
                "Organize National and Regional Level Events."
            ]}
        ] as ActivityType[] // Explicitly define type
    }
};

export const IncubationSupportData = {
    title: "INCUBATION STUDENT & FACULTY SUPPORT",
    sections: [
        {
            heading: "Incubation Support",
            content: [
                "Setting up a start-up and allowing students, faculty, and research staff to work part-time for the start-ups while studying/working.",
                "Creating facilities within the institution for supporting pre-incubation (e.g., IICs as per the guidelines by MHRD’s Innovation Cell, EDC, IEDC, New-Gen IEDC, Innovation Cell, Startup Cell, Student Clubs, etc.) and Incubation/acceleration by mobilizing resources from internal and external sources.",
                "Provide business incubation facilities:",
                "- Premises at subsidized cost.",
                "- Laboratories.",
                "- Research facilities.",
                "- IT services.",
                "- Training and Mentoring Services, etc.",
                "- Licensing of IPR from institute to start-up."
            ]
        },
        {
            heading: "Student Support",
            content: [
                "Induction program about the importance of I&E to be conducted for first-year students. Freshly inducted students should be made aware of the entrepreneurial agenda of the institute and available support systems.",
                "Supporting the students in terms of providing addresses for their Incubation cell, Semester break, attendance, and accommodation.",
                "Student clubs/bodies/departments must be created for organizing competitions, boot camps, workshops, awards, etc.",
                "‘Innovation & Entrepreneurship Award’ to recognize outstanding ideas, successful enterprises, and contributors.",
                "Innovation champions would be nominated within the students/faculty/staff for each department/stream of study."
            ]
        },
        {
            heading: "Faculty Support",
            content: [
                "Institute should recruit staff that have a strong innovation and entrepreneurial/industrial experience, behavior, and attitude. This will help in fostering Innovation and Entrepreneurship culture.",
                "Faculty and departments of the institutes have to work in coherence and cross-departmental linkages.",
                "Faculty and staff should be encouraged to do courses on innovation, entrepreneurship management, and venture development.",
                "Guest Lectures by Subject Matter Experts (SME)."
            ]
        },
        {
            heading: "Course Design in MBA",
            content: [
                "For creating awareness among the students, the teaching methods should include case studies on business failure and real-life experience reports by start-ups.",
                "Pedagogical changes need to be done to ensure that a maximum number of student projects and innovations are based around real-life challenges.",
                "Short-term/six-month/one-year part-time entrepreneurship training.",
                "Designing courses in a variety of areas including technology development, ideation, creativity, design thinking, fundraising, financial management, cash-flow management, new venture planning, business development, product development, social entrepreneurship, product costing, marketing, brand development, human resource management as well as law and regulations impacting a business."
            ]
        },
        {
            heading: "Networking or Collaborating Support",
            content: [
                "Institute may also link the startups to other seed-fund providers/angel funds/venture funds or itself may set up a seed fund once the incubation activities mature.",
                "Providing support to students who show potential in the pre-startup phase to link their start-ups and companies with a wider entrepreneurial ecosystem.",
                "Networking events to be organized to create a platform for the budding entrepreneurs to meet investors and pitch their ideas.",
                "Establishing a Start-up and Entrepreneur ecosystem with Collaboration, Co-creation, Business Relationships, and Knowledge Exchange."
            ]
        }
    ]
};

