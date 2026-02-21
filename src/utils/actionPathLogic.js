export const generateActionPath = (career) => {
    const { id, title, domain } = career;

    let roadmap = [];
    let skills = { core: [], supporting: [], bonus: [] };
    let certifications = [];

    // Generic defaults
    roadmap = [
        { phase: "Phase 1 - Foundation", action: `Learn the fundamentals and core concepts of ${title}.` },
        { phase: "Phase 2 - Skill Development", action: "Engage in practical projects, internships, or specialized training." },
        { phase: "Phase 3 - Entry Preparation", action: "Build a strong portfolio, network within the industry, and prepare for interviews/exams." },
        { phase: "Phase 4 - Early Career", action: `Secure an entry-level position as a ${title} and focus on continuous learning.` }
    ];
    skills.core = ["Industry Knowledge", "Analytical Thinking"];
    skills.supporting = ["Communication", "Project Management"];
    skills.bonus = ["Leadership", "Technical Proficiency"];
    certifications = ["Relevant Industry Accredited Certification", "Advanced Workshop Completion"];

    // Domain / Career specific mappings
    if (domain === "Technology") {
        roadmap[0].action = "Learn core programming, data structures, and computer science fundamentals.";
        roadmap[1].action = "Build personal projects, master necessary frameworks, and understand algorithms.";
        roadmap[2].action = "Contribute to open source, practice Leetcode, and build a strong GitHub profile.";
        roadmap[3].action = "Join as a junior engineer, learn enterprise CI/CD, and scalable systems.";
        skills.core = ["Programming", "System Design", "Problem Solving"];
        skills.supporting = ["Version Control", "Agile/Scrum", "Testing frameworks"];
        skills.bonus = ["Cloud Architecture", "DevOps", "AI Integration"];
        certifications = ["AWS/GCP Professional Certification", "Certified Kubernetes Administrator (CKA)"];

        if (id === "c_cybersecurity") {
            certifications = ["CEH (Certified Ethical Hacker)", "CompTIA Security+", "CISSP"];
        } else if (id === "c_cloud_engineer") {
            certifications = ["AWS Certified Solutions Architect", "Microsoft Certified: Azure Administrator", "Google Cloud Associate"];
        }
    } else if (domain === "Creative Arts, Film & Media" || id.includes('film') || id === 'c_animator' || id === 'c_screenwriter') {
        roadmap[0].action = "Study cinema/media history, learn basic editing software, and narrative structures. (Skill building)";
        roadmap[1].action = "Create short projects, assist professionals, and build a demo reel. (Portfolio)";
        roadmap[2].action = "Network at festivals, pitch scripts, and seek representation. (Industry entry)";
        roadmap[3].action = "Take on independent projects and climb the production ladder.";
        skills.core = ["Visual Storytelling", "Creative Vision", "Editing Software"];
        skills.supporting = ["Networking", "Budgeting", "Project Management"];
        skills.bonus = ["VFX", "Marketing", "Advanced Color Grading"];
        certifications = ["Adobe Certified Professional", "Film School Diploma", "Avid Media Composer Certification"];
    } else if (domain === "Government & Civil Services" || id === 'c_ias' || id === 'c_ips' || id === 'c_ifs') {
        roadmap[0].action = "Understand syllabus, gather resources, and study foundation subjects (NCERTs).";
        roadmap[1].action = "UPSC prep, subject specialization, current affairs, and mock tests.";
        roadmap[2].action = "First serious attempt, intense revision, and interview prep.";
        roadmap[3].action = "Academy training (LBSNAA/SVPNPA) and probationary field postings.";
        skills.core = ["Public Administration", "Constitutional Law", "Decision Making"];
        skills.supporting = ["Economics", "History", "International Relations"];
        skills.bonus = ["Data Analysis", "Public Speaking", "Crisis Management"];
        certifications = ["Public Policy Courses", "Governance & Administration Certifications", "Language Proficiency"];
    } else if (domain === "Healthcare") {
        roadmap[0].action = "Pre-med studies, foundational biology, chemistry, and anatomy.";
        roadmap[1].action = "Medical school/advanced degree, clinical rotations, patient interaction.";
        roadmap[2].action = "Residency matches, internships, and board exams.";
        roadmap[3].action = "Specialization fellowships or attending physician roles.";
        skills.core = ["Clinical Knowledge", "Patient Care", "Diagnostic Reasoning"];
        skills.supporting = ["Empathy", "Research", "Medical Technology"];
        skills.bonus = ["Healthcare Administration", "Specialized Surgery"];
        certifications = ["Medical License / Board Certification", "Advanced Life Support (ALS)"];

        if (id === 'c_psychologist') {
            skills.core = ["Counseling", "Human Behavior", "Psychological Assessment"];
            skills.supporting = ["Research Methods", "Data Analysis", "Effective Communication"];
            skills.bonus = ["Neuropsychology", "Cognitive Behavioral Therapy (CBT)", "Crisis Intervention"];
            certifications = ["State Psychologist License", "APA Accreditation", "Board Certified Behavior Analyst (BCBA)"];
        }
    } else if (domain === "Law & Judiciary") {
        roadmap[0].action = "Complete law degree (LLB/JD), focus on constitutional and corporate law.";
        roadmap[1].action = "Intern with senior advocates or law firms, participate in moot courts.";
        roadmap[2].action = "Clear bar exam, register with the bar council, secure junior roles.";
        roadmap[3].action = "Build independent practice or transition to corporate legal advisory.";
        skills.core = ["Legal Research", "Drafting", "Argumentation"];
        skills.supporting = ["Negotiation", "Client Management", "Analytical Thinking"];
        skills.bonus = ["International Law", "Intellectual Property Rights (IPR)", "Arbitration"];
        certifications = ["Bar Council Registration", "LLM specialization", "Arbitration & Mediation Certificate"];
    } else if (domain === "Business & Finance") {
        roadmap[0].action = "Learn fundamentals of economics, finance, accounting, and market analysis.";
        roadmap[1].action = "Pursue MBA or specific certifications, secure analyst internships.";
        roadmap[2].action = "Prepare for intensive interviews, build a network in tier-1 firms.";
        roadmap[3].action = "Join as an analyst/associate, handle high-stakes portfolios.";
        skills.core = ["Financial Modeling", "Strategic Planning", "Data Analysis"];
        skills.supporting = ["Presentation Skills", "Market Research", "Networking"];
        skills.bonus = ["Venture Capital analysis", "Advanced Excel/Macros", "Mergers & Acquisitions (M&A)"];
        certifications = ["CFA (Chartered Financial Analyst)", "FRM (Financial Risk Manager)", "Project Management Professional (PMP)"];
    } else if (domain === "Defence & Police") {
        roadmap[0].action = "Maintain peak physical fitness, study for entrance exams (NDA/CDS).";
        roadmap[1].action = "Clear SSB interviews/physical tests and enter the training academy.";
        roadmap[2].action = "Rigorous academy training, learning weapons, strategy, and leadership.";
        roadmap[3].action = "Commissioned into service, border postings or operational command.";
        skills.core = ["Physical Endurance", "Tactical Strategy", "Extreme Discipline"];
        skills.supporting = ["Weapons Handling", "Survival Skills", "Logistics"];
        skills.bonus = ["Intelligence Gathering", "Cyber Warfare", "Paratrooping/Special Ops"];
        certifications = ["Academy Commission", "Specialized Combat Training", "Counter-Terrorism Ops"];
    }

    return { roadmap, skills, certifications };
};
