import AboutMeIcon from "/images/AboutMeIcon.png"
import AboutWebsiteIcon from "/images/AboutWebIcon.png"
import FeatureListIcon from "/images/FeatureListIcon.png"
import InspirationIcon from "/images/InspirationIcon.png"
import StackIcon from "/images/StackIcon.png"
import AlertIcon from "/images/AlertIcon.png"

export const infoCardData = [
    {
        title : "About me" ,
        titleImage : AboutMeIcon,
        desc: ["Greetings, I am a third year computer science student who is trying to make his first mark in the field of fullstack development."]
    } ,
    {
        title : "About the website" ,
        titleImage : AboutWebsiteIcon ,
        desc: ["This site contains a Comment Section with which people can communicate with each other in real time, with all information entered into this site being saved in a dedicated database."]
    } ,
    {
        title : "Design Inspiration",
        titleImage : InspirationIcon ,
        desc: ["The interactive comment section design is inspired by the challenges on Frontend Mentor.",
               "Frontend Mentor is an online platform that provides real-world projects for front-end developers to practice and improve their skills.", 
               "It offers a variety of challenges with design mockups and encourages developers to build solutions, fostering a community of learning and collaboration."]
    }
]

export const selectCardData = [
    {
        title : "Feature List" ,
        titleImage : FeatureListIcon ,
        optionsPlaceholder : "Choose a feature...",
        options : [
            {
                title : "User Authentication" ,
                answers : ["Users can register for an account or log in using existing credentials.",
                          "Upon successful login, users receive a JWT access token and a refresh token for secure and authenticated communication with the server."]
            },
            {
                title : "Real Time Commenting" ,
                answers : ["Users can post comments in real-time.",
                          "WebSocket facilitates instant communication between the server and all online clients, ensuring that new comments are promptly delivered and displayed to users."]
            },
            {
                title : "Like and Dislike Functionality",
                answers : ["Users can express their opinions on comments by liking or disliking them.",
                          "The number of likes and dislikes is updated in real time for all users viewing the comment."]
            },
            {
                title : "Comment Replies" ,
                answers : ["Users have the ability to reply to specific comments, fostering threaded conversations.",
                          "Replies are displayed in a nested format, enhancing the readability of discussions."]
            },
            {
                title : "Profile Details and Comment History",
                answers : ["Users can visit profile pages to view account details",
                           "Users can visit profile pages to browse comment history and statistics"]
            },
            {
                title : "Contact Page & Email Communication" ,
                answers : ["A dedicated contact page allows users to reach out for technical support or provide feedback.",
                          "Users can fill out a form specifying their concerns or feedback and submit it.",
                          "Users receive an email response to their contact form submissions.",
                          "The email includes relevant information, such as a summary of the user's inquiry and instructions for further assistance."]
            },
            {
                title : "Moderation Tools" ,
                answers : ["Administrators have the ability to moderate and manage comments."]
            },
            {
                title : "Token Refresh Mechanism",
                answers : ["The refresh token is utilized to obtain a new access token when the original one expires, providing a seamless and secure user experience."]
            }
        ],
        optionsImagesURL : null
    },
    {
        title : "Tech Stack",
        titleImage : StackIcon ,
        optionsPlaceholder : "Choose tech...",
        options : [
            {
                title : "Frontend Tech & Libraries",
                answers : ["A JavaScript library for building user interfaces",
                           "A standard library for routing in React applications",
                           "A promise-based HTTP client for making requests and handling responses in JavaScript applications.",
                           "A popular CSS preprocessor that adds features like variables, nesting, and mixins to make stylesheets more maintainable.",
                           "A library for real-time web applications, enabling bidirectional communication between clients and servers.",
                           "Moments: A library for parsing, validating, manipulating, and formatting dates in JavaScript."]
            },
            {
                title : "Backend Tech & Libraries",
                answers : ["A JavaScript runtime for executing server-side code, allowing the development of scalable network applications.",
                           "A fast, unopinionated, minimalist web framework for Node.js.",
                           "A NoSQL database that provides high performance, high availability, and easy scalability for modern applications.",
                           "An ODM library for MongoDB and Node.js, providing a schema-based solution to model application data.",
                           "A library for real-time web applications, enabling bidirectional communication between clients and servers.",
                           "A compact, URL-safe means of representing claims to be transferred between two parties, used for authentication.",
                           "Bcrypt: A library for securely hashing passwords, used for user authentication.",
                           "NodeMailer: A module for Node.js applications that enables sending emails.",
                           "Cookie-Parser: A middleware for parsing cookies in Express applications."]
            }
        ],
        optionsImagesURL : [
            [
                "https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white",
                "https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=react-router&logoColor=white",
                "https://img.shields.io/badge/Axios-5C2D91?style=flat-square&logo=axios&logoColor=white",
                "https://img.shields.io/badge/SCSS-CC6699?style=flat-square&logo=sass&logoColor=white" ,
                "https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white"
            ],
            [
                "https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white",
                "https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white",
                "https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white",
                "https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white",
                "https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white",
                "https://img.shields.io/badge/Json_Web_Token-000000?style=flat-square&logo=json-web-tokens&logoColor=white"
            ]

        ]
    },
    {
        title : "QnA",
        titleImage : AlertIcon ,
        optionsPlaceholder: "Choose a question...",
        options : [
            {
                title : "How do I register for an account?",
                answers : ["- Simply click on the login button on the top right corner of the page" ,
                           "- Click on SIGNUP and fill the form with the required information, and you'll be all set to start engaging in discussions!"]
            },
            {
                title : "How do I contact technical support or provide feedback?",
                answers : ["- Navigate to the CONTACT page where you'll find a dedicated form for technical support and feedback." ,
                           "- Fill in the required details, submit the form, and our team will promptly address your inquiries." , 
                           "- Additionally, you'll receive an email response with further instructions or assistance."]
            }
        ],
        optionsImagesURL: null
    }
]


