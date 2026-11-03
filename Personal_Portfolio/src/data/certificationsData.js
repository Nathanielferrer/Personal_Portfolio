import pythonCertImg from '../assets/Images/Certification/Python_Essentials_1.png';
import itSupportCertImg from '../assets/Images/Certification/IT_Customer_Support_Basics.png';
import pythonCertPdf from '../assets/Certificates/Python_Essentials_1_certificate_nathanielferrer691-gmail-com_cc833263-8dbf-4f32-bcbf-4d6963762c58.pdf';
import itSupportCertPdf from '../assets/Certificates/IT_Customer_Support_Basics_certificate_nathanielferrer691-gmail-com_b5008c98-0db2-42cf-bb9e-aa98bb6a5848 (1).pdf';

export const CERTIFICATIONS_DATA = [
  {
    id: 'python-essentials-1',
    title: 'Python Essentials 1',
    issuer: 'Cisco Networking Academy',
    credentialId: 'cc833263-8dbf-4f32-bcbf-4d6963762c58',
    issueDate: 'October 10, 2024',
    year: '2024',
    recipient: 'Nathaniel Ferrer',
    role: 'Python Programming',
    status: 'Verified Certificate',
    previewImage: pythonCertImg,
    pdfUrl: pythonCertPdf,
    shortDescription:
      'Professional credential validating core Python programming competence, data structures, algorithm logic, and functional programming.',
    about:
      'The Python Essentials 1 certification, awarded by the Cisco Networking Academy, verifies foundational proficiency in computer programming and software development using Python 3. The curriculum emphasizes clean coding standards, mathematical and logical computation, data manipulation, modular functions, and robust error handling techniques—aligning with the industry-recognized PCEP (Certified Entry-Level Python Programmer) standard.',
    knowledgeGained: [
      'Mastered core Python syntax, data types (integers, floats, strings, booleans), variables, and arithmetic operators.',
      'Constructed algorithmic logic using conditional branching (if/elif/else) and repetitive control loops (while, for, break, continue).',
      'Engineered structured data management utilizing Python lists, multi-dimensional lists, tuples, and key-value dictionaries.',
      'Designed modular, reusable programs through custom functions, positional/keyword arguments, return statements, and variable scoping.',
      'Implemented defensive programming techniques using structured exception handling (try-except blocks) to prevent runtime crashes.'
    ],
    skills: {
      'Programming Fundamentals': ['Python 3', 'Algorithm Design', 'Variables & Typing', 'Control Flow'],
      'Data Structures': ['Lists', 'Tuples', 'Dictionaries', 'String Slicing'],
      'Engineering Practices': ['Modular Functions', 'Debugging', 'Exception Handling', 'PCEP Exam Ready']
    }
  },
  {
    id: 'it-customer-support-basics',
    title: 'IT Customer Support Basics',
    issuer: 'Cisco Networking Academy',
    credentialId: 'b5008c98-0db2-42cf-bb9e-aa98bb6a5848',
    issueDate: 'October 25, 2026',
    year: '2026',
    recipient: 'Nathaniel Ferrer',
    role: 'IT Technical Support',
    status: 'Verified Certificate',
    previewImage: itSupportCertImg,
    pdfUrl: itSupportCertPdf,
    shortDescription:
      'Professional IT support credential focused on client communication, remote screen-sharing troubleshooting via Quick Assist, and helpdesk ticket lifecycle management under SLA targets.',
    about:
      'This course from the Cisco Networking Academy focuses on professional client communication and technical troubleshooting in IT helpdesk environments. The training places strong emphasis on client-facing support—teaching technicians how to speak properly and empathetically with users, actively listen, and use strategic open-ended and closed-ended questions to identify technical problems. It also covers hands-on remote screen sharing (such as Microsoft Quick Assist and Windows Remote Desktop) to assist clients live while transparently narrating troubleshooting steps, alongside full helpdesk ticketing workflows, queue prioritization, and meeting Service Level Agreement (SLA) response and resolution targets.',
    knowledgeGained: [
      'Mastered professional client communication techniques, using open-ended questions to let users explain problems freely and closed-ended questions to isolate exact technical facts.',
      'Conducted live remote desktop and screen-sharing sessions (using tools like Microsoft Quick Assist and Windows Remote Desktop) while narrating troubleshooting steps to keep clients informed and reassured.',
      'Managed the complete helpdesk trouble ticket lifecycle—from multi-channel request intake (chat, email, phone) to validation, ticket logging, queue prioritization (High/Medium/Low), and resolution.',
      'Adhered to Service Level Agreements (SLAs) by meeting initial acknowledgment response times and target resolution windows, while tracking Key Performance Indicators (KPIs) to ensure customer satisfaction.',
      'Handled recurring technical incidents by identifying common root causes, grouping related tickets, and updating each client individually to ensure they feel valued and informed.',
      'Documented verified fixes into a centralized knowledge base to accelerate recurring solutions and executed structured escalation protocols when issues required higher-tier technical intervention.'
    ],
    skills: {
      'Client Communication': ['Active Listening', 'Open & Closed-Ended Questions', 'User De-escalation', 'Transparent Narration'],
      'Remote Assistance': ['Screen Sharing', 'Microsoft Quick Assist', 'Windows Remote Desktop', 'Remote Diagnosis'],
      'Helpdesk & Ticketing': ['Ticket Management', 'SLA & KPI Tracking', 'Queue Prioritization', 'Knowledge Base & Escalation']
    }
  }
];
