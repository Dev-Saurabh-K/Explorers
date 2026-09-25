// Realistic sample data matching the Commitology UI mockup
// Contains Developers, Repositories, Features, Telemetry, and Architecture Docs

export const MOCK_DEVELOPERS = [
  {
    id: "rahul",
    name: "Rahul",
    role: "Senior Developer",
    email: "rahul@company.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    isDominant: true,
    status: "online",
    riskLevel: "HIGH",
    riskTitle: "High Knowledge Concentration",
    riskDescription: "Primary contributor in 3 key features",
    commitsCount: 142,
    primaryAreas: [
      { name: "Payment", icon: "CreditCard", percentage: 42, color: "#facc15" },
      { name: "Authentication", icon: "Lock", percentage: 28, color: "#22d3ee" },
      { name: "Order Processing", icon: "Package", percentage: 18, color: "#c084fc" },
      { name: "Others", icon: "Code", percentage: 12, color: "#94a3b8" }
    ],
    affectedStats: {
      files: 17,
      services: 4,
      integrations: 3
    },
    documentationGaps: 12,
    suggestedActions: [
      { id: 1, text: "Document payment architecture", done: true },
      { id: 2, text: "Assign secondary reviewer", done: true },
      { id: 3, text: "Add integration tests", done: true },
      { id: 4, text: "Conduct knowledge-transfer session", done: true }
    ],
    recentCommits: [
      { sha: "7fd1a60", message: "feat(auth): integrate OAuth2 token refresh & session revocation", date: "2 hours ago" },
      { sha: "4bc912a", message: "fix(payment): stripe webhook idempotency retry mechanism", date: "1 day ago" },
      { sha: "8821dfe", message: "refactor(order): transition state machine to event-driven queue", date: "3 days ago" }
    ]
  },
  {
    id: "priya",
    name: "Priya",
    role: "Backend Engineer",
    email: "priya@company.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    isDominant: false,
    status: "online",
    riskLevel: "MEDIUM",
    riskTitle: "Secondary Maintainer",
    riskDescription: "Contributor across Authentication & Payments",
    commitsCount: 68,
    primaryAreas: [
      { name: "Authentication", icon: "Lock", percentage: 45, color: "#22d3ee" },
      { name: "User Management", icon: "Users", percentage: 35, color: "#10b981" },
      { name: "Payment", icon: "CreditCard", percentage: 20, color: "#facc15" }
    ],
    affectedStats: { files: 9, services: 2, integrations: 2 },
    documentationGaps: 4,
    suggestedActions: [
      { id: 1, text: "Pair-program on payment edge cases", done: true },
      { id: 2, text: "Review JWT session storage security", done: false }
    ]
  },
  {
    id: "aman",
    name: "Aman",
    role: "Frontend Engineer",
    email: "aman@company.com",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    isDominant: false,
    status: "busy",
    riskLevel: "LOW",
    riskTitle: "Balanced Contributor",
    riskDescription: "Frontend views & design system",
    commitsCount: 54,
    primaryAreas: [
      { name: "UI/Frontend", icon: "Layout", percentage: 60, color: "#38bdf8" },
      { name: "Authentication", icon: "Lock", percentage: 25, color: "#22d3ee" },
      { name: "Cart & Checkout", icon: "ShoppingCart", percentage: 15, color: "#f59e0b" }
    ],
    affectedStats: { files: 12, services: 1, integrations: 1 },
    documentationGaps: 2,
    suggestedActions: [
      { id: 1, text: "Update component library storybook", done: true }
    ]
  },
  {
    id: "swati",
    name: "Swati",
    role: "Fullstack Engineer",
    email: "swati@company.com",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    isDominant: false,
    status: "online",
    riskLevel: "LOW",
    riskTitle: "Cross-Functional",
    riskDescription: "Fullstack APIs & Client integration",
    commitsCount: 42,
    primaryAreas: [
      { name: "Cart & Checkout", icon: "ShoppingCart", percentage: 50, color: "#f59e0b" },
      { name: "Notifications", icon: "Bell", percentage: 30, color: "#ec4899" },
      { name: "Authentication", icon: "Lock", percentage: 20, color: "#22d3ee" }
    ],
    affectedStats: { files: 8, services: 2, integrations: 2 },
    documentationGaps: 3,
    suggestedActions: [
      { id: 1, text: "Document cart abandonment webhook flow", done: false }
    ]
  },
  {
    id: "arup",
    name: "Arup",
    role: "DevOps Specialist",
    email: "arup@company.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    isDominant: false,
    status: "offline",
    riskLevel: "MEDIUM",
    riskTitle: "Infra Concentration",
    riskDescription: "CI/CD & container orchestration",
    commitsCount: 38,
    primaryAreas: [
      { name: "Admin Panel", icon: "ShieldCheck", percentage: 55, color: "#10b981" },
      { name: "Notifications", icon: "Bell", percentage: 45, color: "#ec4899" }
    ],
    affectedStats: { files: 6, services: 3, integrations: 2 },
    documentationGaps: 5,
    suggestedActions: [
      { id: 1, text: "Add Docker Compose staging recipe", done: true }
    ]
  },
  {
    id: "santosh",
    name: "Santosh",
    role: "Database Architect",
    email: "santosh@company.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    isDominant: false,
    status: "online",
    riskLevel: "MEDIUM",
    riskTitle: "Data Layer Specialist",
    riskDescription: "Schema migrations & PostgreSQL indexing",
    commitsCount: 49,
    primaryAreas: [
      { name: "Order Processing", icon: "Package", percentage: 60, color: "#c084fc" },
      { name: "Product Catalog", icon: "Box", percentage: 40, color: "#38bdf8" }
    ],
    affectedStats: { files: 11, services: 2, integrations: 1 },
    documentationGaps: 2,
    suggestedActions: [
      { id: 1, text: "Review order partitioning schema", done: true }
    ]
  },
  {
    id: "neha",
    name: "Neha",
    role: "Security Engineer",
    email: "neha@company.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    isDominant: false,
    status: "busy",
    riskLevel: "LOW",
    riskTitle: "Security Auditor",
    riskDescription: "Token verification & RBAC audits",
    commitsCount: 31,
    primaryAreas: [
      { name: "Authentication", icon: "Lock", percentage: 70, color: "#22d3ee" },
      { name: "Admin Panel", icon: "ShieldCheck", percentage: 30, color: "#10b981" }
    ],
    affectedStats: { files: 5, services: 2, integrations: 2 },
    documentationGaps: 1,
    suggestedActions: [
      { id: 1, text: "Conduct OAuth scope rotation test", done: true }
    ]
  },
  {
    id: "vikram",
    name: "Vikram",
    role: "Data Platform",
    email: "vikram@company.com",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    isDominant: false,
    status: "online",
    riskLevel: "LOW",
    riskTitle: "Telemetry Contributor",
    riskDescription: "Metrics collection & aggregation",
    commitsCount: 26,
    primaryAreas: [
      { name: "Product Catalog", icon: "Box", percentage: 65, color: "#38bdf8" },
      { name: "Order Processing", icon: "Package", percentage: 35, color: "#c084fc" }
    ],
    affectedStats: { files: 7, services: 2, integrations: 1 },
    documentationGaps: 3,
    suggestedActions: [
      { id: 1, text: "Verify real-time stock sync latency", done: false }
    ]
  },
  {
    id: "karan",
    name: "Karan",
    role: "Systems Engineer",
    email: "karan@company.com",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    isDominant: false,
    status: "offline",
    riskLevel: "LOW",
    riskTitle: "Backend Infrastructure",
    riskDescription: "Caching & queue workers",
    commitsCount: 22,
    primaryAreas: [
      { name: "Notifications", icon: "Bell", percentage: 60, color: "#ec4899" },
      { name: "Order Processing", icon: "Package", percentage: 40, color: "#c084fc" }
    ],
    affectedStats: { files: 4, services: 2, integrations: 1 },
    documentationGaps: 2,
    suggestedActions: [
      { id: 1, text: "Scale Redis pub/sub queue workers", done: true }
    ]
  },
  {
    id: "divya",
    name: "Divya",
    role: "QA & Automation",
    email: "divya@company.com",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    isDominant: false,
    status: "online",
    riskLevel: "LOW",
    riskTitle: "Test Coverage",
    riskDescription: "End-to-end integration test suites",
    commitsCount: 29,
    primaryAreas: [
      { name: "Payment", icon: "CreditCard", percentage: 50, color: "#facc15" },
      { name: "Cart & Checkout", icon: "ShoppingCart", percentage: 50, color: "#f59e0b" }
    ],
    affectedStats: { files: 8, services: 2, integrations: 2 },
    documentationGaps: 0,
    suggestedActions: [
      { id: 1, text: "Automate checkout regression suite", done: true }
    ]
  },
  {
    id: "rohit",
    name: "Rohit",
    role: "Cloud Infrastructure",
    email: "rohit@company.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    isDominant: false,
    status: "online",
    riskLevel: "LOW",
    riskTitle: "SRE Engineer",
    riskDescription: "Kubernetes configs and monitoring",
    commitsCount: 19,
    primaryAreas: [
      { name: "Admin Panel", icon: "ShieldCheck", percentage: 70, color: "#10b981" },
      { name: "Product Catalog", icon: "Box", percentage: 30, color: "#38bdf8" }
    ],
    affectedStats: { files: 5, services: 2, integrations: 1 },
    documentationGaps: 2,
    suggestedActions: [
      { id: 1, text: "Set up auto-scaling thresholds", done: true }
    ]
  },
  {
    id: "meena",
    name: "Meena",
    role: "AI & ML Engineer",
    email: "meena@company.com",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    isDominant: false,
    status: "online",
    riskLevel: "LOW",
    riskTitle: "AI Specialist",
    riskDescription: "Product recommendations & embeddings",
    commitsCount: 25,
    primaryAreas: [
      { name: "Product Catalog", icon: "Box", percentage: 80, color: "#38bdf8" },
      { name: "UI/Frontend", icon: "Layout", percentage: 20, color: "#facc15" }
    ],
    affectedStats: { files: 6, services: 2, integrations: 2 },
    documentationGaps: 1,
    suggestedActions: [
      { id: 1, text: "Document vector indexing pipeline", done: true }
    ]
  }
];

export const MOCK_REPOSITORIES = [
  {
    id: "ecommerce-platform",
    name: "ecommerce-platform",
    visibility: "Private",
    updated: "Updated 2 days ago",
    stars: 124,
    commits: 184,
    featuresCount: 9,
    language: "TypeScript",
    branch: "main"
  },
  {
    id: "disaster-relief",
    name: "disaster-relief",
    visibility: "Public",
    updated: "Updated 5 days ago",
    stars: 86,
    commits: 62,
    featuresCount: 5,
    language: "Python",
    branch: "master"
  },
  {
    id: "portfolio-website",
    name: "portfolio-website",
    visibility: "Public",
    updated: "Updated 1 week ago",
    stars: 19,
    commits: 28,
    featuresCount: 3,
    language: "React",
    branch: "main"
  },
  {
    id: "ml-experiments",
    name: "ml-experiments",
    visibility: "Private",
    updated: "Updated 2 weeks ago",
    stars: 45,
    commits: 94,
    featuresCount: 6,
    language: "Python",
    branch: "main"
  },
  {
    id: "college-projects",
    name: "college-projects",
    visibility: "Public",
    updated: "Updated 1 month ago",
    stars: 12,
    commits: 45,
    featuresCount: 4,
    language: "C++",
    branch: "main"
  },
  {
    id: "chat-app",
    name: "chat-app",
    visibility: "Public",
    updated: "Updated 1 month ago",
    stars: 77,
    commits: 53,
    featuresCount: 5,
    language: "Go",
    branch: "main"
  },
  {
    id: "task-manager",
    name: "task-manager",
    visibility: "Public",
    updated: "Updated 2 months ago",
    stars: 33,
    commits: 37,
    featuresCount: 4,
    language: "TypeScript",
    branch: "main"
  }
];

export const MOCK_FEATURES = [
  {
    id: "authentication",
    name: "Authentication",
    category: "Security & Access",
    icon: "Lock",
    commitsCount: 32,
    filesCount: 5,
    servicesCount: 4,
    integrationsCount: 3,
    riskLevel: "HIGH",
    riskBadge: "High concentration",
    summary: "Handles user login, registration, JWT authentication, and session management.",
    lastGenerated: "25 Sep 2026, 11:42 AM",
    contributors: [
      { name: "Rahul", percentage: 68, commits: 22, color: "#facc15", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" },
      { name: "Priya", percentage: 18, commits: 6, color: "#c084fc", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
      { name: "Aman", percentage: 8, commits: 3, color: "#22d3ee", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80" },
      { name: "Swati", percentage: 6, commits: 1, color: "#10b981", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80" }
    ],
    files: [
      { name: "Auth Controller", path: "/src/controllers/auth.js", changes: "+180 / -12", lines: 192 },
      { name: "JWT Service", path: "/src/services/jwt.js", changes: "+95 / -4", lines: 99 },
      { name: "User Model", path: "/src/models/user.js", changes: "+140 / -8", lines: 148 },
      { name: "Auth Middleware", path: "/src/middleware/auth.js", changes: "+65 / -2", lines: 67 },
      { name: "Session Config", path: "/src/config/session.js", changes: "+42 / -0", lines: 42 }
    ],
    commits: [
      { sha: "7fd1a60", author: "Rahul", message: "feat(auth): add OAuth2 GitHub & Google login providers", date: "2 days ago" },
      { sha: "6dcb09b", author: "Rahul", message: "fix(jwt): implement sliding session expiration with redis refresh", date: "4 days ago" },
      { sha: "3a8f921", author: "Priya", message: "feat(security): bcrypt password hashing salt rounds calibration", date: "1 week ago" },
      { sha: "1bc8392", author: "Aman", message: "ui(auth): responsive login & multi-factor authentication modal", date: "2 weeks ago" }
    ],
    integrations: [
      { name: "GitHub OAuth", status: "Active", type: "External Identity", latency: "120ms" },
      { name: "Redis Cache", status: "Active", type: "Session Token Store", latency: "2ms" },
      { name: "SendGrid API", status: "Active", type: "Email Verification & OTP", latency: "85ms" }
    ],
    documentation: {
      sections: [
        { id: "overview", label: "1. Overview" },
        { id: "system-design", label: "2. System Design" },
        { id: "flow-diagrams", label: "3. Flow Diagrams" },
        { id: "key-components", label: "4. Key Components" },
        { id: "code-walkthrough", label: "5. Code Walkthrough" },
        { id: "external-integrations", label: "6. External Integrations" },
        { id: "api-endpoints", label: "7. API Endpoints" },
        { id: "deployment-notes", label: "8. Deployment Notes" },
        { id: "known-issues", label: "9. Known Issues" },
        { id: "future-improvements", label: "10. Future Improvements" }
      ],
      overviewText: "The authentication module handles user registration, login, JWT authentication, token refresh, and session management for the e-commerce platform.",
      componentsTable: [
        { component: "Auth Controller", description: "Handles login, signup, token refresh", path: "/src/controllers/auth.js" },
        { component: "JWT Service", description: "Generates and verifies tokens", path: "/src/services/jwt.js" },
        { component: "User Model", description: "User schema and DB operations", path: "/src/models/user.js" },
        { component: "Auth Middleware", description: "Validates JWT for protected routes", path: "/src/middleware/auth.js" }
      ],
      architectureDiagram: {
        client: "Client\n(Web/Mobile)",
        service: "Auth Service",
        database: "Database\n(Users, Sessions)",
        external: "External\n(JWT, Email)"
      },
      markdown: `# Authentication Module Specification

## 1. Overview
The authentication module handles user registration, login, JWT authentication, token refresh, and session management for the e-commerce platform.

## 2. Architecture & Service Topology
The Auth Service bridges incoming client requests with persistent data layers and external verification pipelines:

\`\`\`
[ Client (Web/Mobile) ] ──▶ [ Auth Service ] ──┬──▶ [ Database (Users, Sessions) ]
                                              └──▶ [ External (JWT, Email) ]
\`\`\`

## 3. Key Components
| Component | Description | File Path |
| :--- | :--- | :--- |
| **Auth Controller** | Handles login, signup, token refresh | \`/src/controllers/auth.js\` |
| **JWT Service** | Generates and verifies tokens | \`/src/services/jwt.js\` |
| **User Model** | User schema and DB operations | \`/src/models/user.js\` |
| **Auth Middleware** | Validates JWT for protected routes | \`/src/middleware/auth.js\` |

## 4. API Endpoints
- \`POST /api/auth/login\` - User authentication via email & password or OAuth code.
- \`POST /api/auth/register\` - User registration with email verification dispatch.
- \`POST /api/auth/refresh\` - Exchange refresh token for new access JWT.
- \`GET /api/auth/me\` - Verify session and return authenticated user metadata.
`
    }
  },
  {
    id: "payment",
    name: "Payment",
    category: "Financial & Billing",
    icon: "CreditCard",
    commitsCount: 28,
    filesCount: 7,
    servicesCount: 4,
    integrationsCount: 2,
    riskLevel: "HIGH",
    riskBadge: "High concentration",
    summary: "Processes credit card transactions, webhook events, and Stripe / Razorpay tokenization.",
    lastGenerated: "24 Sep 2026, 04:15 PM",
    contributors: [
      { name: "Rahul", percentage: 72, commits: 20, color: "#facc15", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" },
      { name: "Priya", percentage: 18, commits: 5, color: "#c084fc", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
      { name: "Divya", percentage: 10, commits: 3, color: "#10b981", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80" }
    ],
    files: [
      { name: "Payment Processor", path: "/src/services/stripe.js", changes: "+240 / -18", lines: 258 },
      { name: "Webhook Handler", path: "/src/controllers/webhooks.js", changes: "+110 / -5", lines: 115 },
      { name: "Transaction Model", path: "/src/models/transaction.js", changes: "+160 / -10", lines: 170 }
    ],
    commits: [
      { sha: "8921dfe", author: "Rahul", message: "feat(payment): idempotent Stripe webhook event ingestion", date: "3 days ago" },
      { sha: "110ae94", author: "Rahul", message: "feat(billing): 3D Secure 2 authentication fallback flow", date: "5 days ago" }
    ],
    integrations: [
      { name: "Stripe API v2024", status: "Active", type: "Payment Gateway", latency: "140ms" },
      { name: "Razorpay Connect", status: "Active", type: "Regional Provider", latency: "160ms" }
    ],
    documentation: {
      sections: [
        { id: "overview", label: "1. Overview" },
        { id: "system-design", label: "2. System Design" },
        { id: "flow-diagrams", label: "3. Flow Diagrams" },
        { id: "key-components", label: "4. Key Components" },
        { id: "code-walkthrough", label: "5. Code Walkthrough" }
      ],
      overviewText: "Handles automated transaction authorizations, refund pipelines, PCI-compliant tokenization, and multi-gateway webhooks.",
      componentsTable: [
        { component: "Stripe Gateway Service", description: "Direct communication with Stripe PaymentIntents", path: "/src/services/stripe.js" },
        { component: "Webhook Dispatcher", description: "Verifies HMAC signatures and queues events", path: "/src/controllers/webhooks.js" },
        { component: "Transaction Model", description: "Stores immutable transaction state logs", path: "/src/models/transaction.js" }
      ],
      architectureDiagram: {
        client: "Client Checkout UI",
        service: "Payment Gateway Service",
        database: "Transactions Ledger DB",
        external: "Stripe / Banking APIs"
      },
      markdown: `# Payment Processing Subsystem\n\nHandles card tokenization, webhook verification, and settlement events.`
    }
  },
  {
    id: "order-processing",
    name: "Order Processing",
    category: "Commerce Engine",
    icon: "Package",
    commitsCount: 20,
    filesCount: 6,
    servicesCount: 3,
    integrationsCount: 1,
    riskLevel: "MEDIUM",
    riskBadge: "Moderate concentration",
    summary: "State machine managing order lifecycle from cart submission to fulfillment and tracking.",
    lastGenerated: "22 Sep 2026, 02:20 PM",
    contributors: [
      { name: "Rahul", percentage: 55, commits: 11, color: "#facc15", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" },
      { name: "Santosh", percentage: 30, commits: 6, color: "#c084fc", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
      { name: "Karan", percentage: 15, commits: 3, color: "#22d3ee", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80" }
    ],
    files: [
      { name: "Order State Machine", path: "/src/engine/orderStateMachine.js", changes: "+310 / -22", lines: 332 },
      { name: "Inventory Allocator", path: "/src/services/inventory.js", changes: "+130 / -8", lines: 138 }
    ],
    commits: [
      { sha: "3fa9121", author: "Rahul", message: "feat(order): optimistic lock for concurrent stock deduction", date: "4 days ago" }
    ],
    integrations: [
      { name: "Logistics API", status: "Active", type: "Fulfillment Provider", latency: "180ms" }
    ],
    documentation: {
      sections: [
        { id: "overview", label: "1. Overview" },
        { id: "system-design", label: "2. System Design" },
        { id: "key-components", label: "4. Key Components" }
      ],
      overviewText: "Implements distributed saga pattern for reliable checkout fulfillment and inventory locking.",
      componentsTable: [
        { component: "Order State Machine", description: "State transitions from Placed to Delivered", path: "/src/engine/orderStateMachine.js" },
        { component: "Stock Locker", description: "Handles atomic inventory reservation", path: "/src/services/inventory.js" }
      ],
      architectureDiagram: {
        client: "Checkout Page",
        service: "Order Orchestrator",
        database: "Postgres Orders Table",
        external: "Fulfillment Logistics"
      },
      markdown: `# Order Processing Engine\n\nState transitions and inventory synchronization pipeline.`
    }
  },
  {
    id: "user-management",
    name: "User Management",
    category: "Profiles & Permissions",
    icon: "Users",
    commitsCount: 15,
    filesCount: 4,
    servicesCount: 2,
    integrationsCount: 1,
    riskLevel: "LOW",
    riskBadge: "Well distributed",
    summary: "Profiles, role-based permissions, shipping addresses, and account preferences.",
    lastGenerated: "20 Sep 2026, 09:10 AM",
    contributors: [
      { name: "Priya", percentage: 50, commits: 8, color: "#c084fc", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
      { name: "Neha", percentage: 35, commits: 5, color: "#facc15", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" },
      { name: "Swati", percentage: 15, commits: 2, color: "#10b981", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80" }
    ],
    files: [
      { name: "Profile Controller", path: "/src/controllers/profile.js", changes: "+120 / -10", lines: 130 },
      { name: "Address Book", path: "/src/models/address.js", changes: "+75 / -2", lines: 77 }
    ],
    commits: [
      { sha: "42a9b31", author: "Priya", message: "feat(user): add multi-address shipping book validation", date: "6 days ago" }
    ],
    integrations: [
      { name: "Google Places API", status: "Active", type: "Address Autocomplete", latency: "90ms" }
    ],
    documentation: {
      sections: [{ id: "overview", label: "1. Overview" }],
      overviewText: "Customer directory management, RBAC access control, and GDPR data export utilities.",
      componentsTable: [
        { component: "Profile Controller", description: "Personal details and preference management", path: "/src/controllers/profile.js" }
      ],
      architectureDiagram: {
        client: "User Profile Settings",
        service: "User Service",
        database: "Users Table",
        external: "Places API"
      },
      markdown: `# User Management Service`
    }
  },
  {
    id: "product-catalog",
    name: "Product Catalog",
    category: "Storefront & Merchandising",
    icon: "Box",
    commitsCount: 12,
    filesCount: 5,
    servicesCount: 2,
    integrationsCount: 1,
    riskLevel: "LOW",
    riskBadge: "Well distributed",
    summary: "Category hierarchies, inventory indexes, search filters, and pricing tables.",
    lastGenerated: "18 Sep 2026, 06:40 PM",
    contributors: [
      { name: "Meena", percentage: 55, commits: 7, color: "#facc15", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" },
      { name: "Santosh", percentage: 30, commits: 3, color: "#c084fc", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
      { name: "Vikram", percentage: 15, commits: 2, color: "#22d3ee", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80" }
    ],
    files: [
      { name: "Catalog Service", path: "/src/services/catalog.js", changes: "+190 / -15", lines: 205 },
      { name: "Search Indexer", path: "/src/search/elastic.js", changes: "+85 / -4", lines: 89 }
    ],
    commits: [
      { sha: "991bce4", author: "Meena", message: "feat(catalog): full-text search with typo tolerance and category facets", date: "1 week ago" }
    ],
    integrations: [
      { name: "Elasticsearch Cluster", status: "Active", type: "Search Engine", latency: "15ms" }
    ],
    documentation: {
      sections: [{ id: "overview", label: "1. Overview" }],
      overviewText: "High-performance merchandising catalog with multi-variant SKU trees and elastic caching.",
      componentsTable: [
        { component: "Catalog Service", description: "Product tree indexing and cache warmer", path: "/src/services/catalog.js" }
      ],
      architectureDiagram: {
        client: "Search & Storefront",
        service: "Catalog Service",
        database: "Product DB & Cache",
        external: "Elasticsearch"
      },
      markdown: `# Product Catalog Subsystem`
    }
  },
  {
    id: "notifications",
    name: "Notifications",
    category: "Messaging & Alerts",
    icon: "Bell",
    commitsCount: 11,
    filesCount: 3,
    servicesCount: 2,
    integrationsCount: 2,
    riskLevel: "MEDIUM",
    riskBadge: "Moderate concentration",
    summary: "Transactional emails, SMS alerts, and web push notifications for dispatch events.",
    lastGenerated: "17 Sep 2026, 03:00 PM",
    contributors: [
      { name: "Karan", percentage: 55, commits: 6, color: "#facc15", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80" },
      { name: "Swati", percentage: 30, commits: 3, color: "#c084fc", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80" },
      { name: "Arup", percentage: 15, commits: 2, color: "#10b981", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" }
    ],
    files: [
      { name: "Notification Broker", path: "/src/services/notifications.js", changes: "+145 / -12", lines: 157 }
    ],
    commits: [
      { sha: "5b7a124", author: "Karan", message: "feat(notifications): batch email templates with MJML compiler", date: "1 week ago" }
    ],
    integrations: [
      { name: "SendGrid Webhook", status: "Active", type: "Email Gateway", latency: "75ms" },
      { name: "Twilio SMS", status: "Active", type: "SMS Dispatcher", latency: "110ms" }
    ],
    documentation: {
      sections: [{ id: "overview", label: "1. Overview" }],
      overviewText: "Multi-channel notification dispatcher supporting templated transactional messages.",
      componentsTable: [
        { component: "Notification Service", description: "Enqueues alerts to Kafka/RabbitMQ", path: "/src/services/notifications.js" }
      ],
      architectureDiagram: {
        client: "Event Triggers",
        service: "Notification Broker",
        database: "Message Logs",
        external: "SendGrid & Twilio"
      },
      markdown: `# Notifications Engine`
    }
  },
  {
    id: "cart-checkout",
    name: "Cart & Checkout",
    category: "Shopping & Conversion",
    icon: "ShoppingCart",
    commitsCount: 9,
    filesCount: 4,
    servicesCount: 2,
    integrationsCount: 1,
    riskLevel: "LOW",
    riskBadge: "Well distributed",
    summary: "Session shopping basket, coupon discounts calculation, and stock reservation.",
    lastGenerated: "15 Sep 2026, 11:15 AM",
    contributors: [
      { name: "Swati", percentage: 50, commits: 5, color: "#facc15", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80" },
      { name: "Aman", percentage: 30, commits: 3, color: "#22d3ee", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80" },
      { name: "Divya", percentage: 20, commits: 1, color: "#c084fc", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80" }
    ],
    files: [
      { name: "Cart Store", path: "/src/stores/cart.js", changes: "+130 / -8", lines: 138 }
    ],
    commits: [
      { sha: "8914bca", author: "Swati", message: "feat(cart): persistent guest basket synchronization on login", date: "2 weeks ago" }
    ],
    integrations: [
      { name: "Coupon Engine", status: "Active", type: "Discount Validator", latency: "18ms" }
    ],
    documentation: {
      sections: [{ id: "overview", label: "1. Overview" }],
      overviewText: "Client-side and Redis-backed cart session engine with coupon calculation pipeline.",
      componentsTable: [
        { component: "Cart Store", description: "Manages basket state and tax calculations", path: "/src/stores/cart.js" }
      ],
      architectureDiagram: {
        client: "Cart Modal",
        service: "Cart API",
        database: "Redis Session DB",
        external: "Coupon Engine"
      },
      markdown: `# Cart & Checkout Pipeline`
    }
  },
  {
    id: "admin-panel",
    name: "Admin Panel",
    category: "Operations & Auditing",
    icon: "ShieldCheck",
    commitsCount: 8,
    filesCount: 6,
    servicesCount: 3,
    integrationsCount: 0,
    riskLevel: "MEDIUM",
    riskBadge: "Moderate concentration",
    summary: "Back-office inventory controls, audit trails, and manual transaction resolution.",
    lastGenerated: "12 Sep 2026, 05:45 PM",
    contributors: [
      { name: "Arup", percentage: 55, commits: 4, color: "#facc15", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
      { name: "Rohit", percentage: 30, commits: 3, color: "#10b981", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" },
      { name: "Neha", percentage: 15, commits: 1, color: "#c084fc", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" }
    ],
    files: [
      { name: "Admin Dashboard", path: "/src/admin/dashboard.js", changes: "+175 / -12", lines: 187 }
    ],
    commits: [
      { sha: "33190cb", author: "Arup", message: "feat(admin): audit logging for manual refund approvals", date: "2 weeks ago" }
    ],
    integrations: [],
    documentation: {
      sections: [{ id: "overview", label: "1. Overview" }],
      overviewText: "Internal staff portal with fine-grained access control and compliance logging.",
      componentsTable: [
        { component: "Admin Router", description: "Protected management routes", path: "/src/admin/dashboard.js" }
      ],
      architectureDiagram: {
        client: "Admin Web Console",
        service: "Admin Gateway",
        database: "Audit Logs DB",
        external: "Internal Vault"
      },
      markdown: `# Admin Operations Panel`
    }
  },
  {
    id: "ui-frontend",
    name: "UI/Frontend",
    category: "Design System & Shell",
    icon: "Layout",
    commitsCount: 6,
    filesCount: 8,
    servicesCount: 1,
    integrationsCount: 0,
    riskLevel: "LOW",
    riskBadge: "Well distributed",
    summary: "Design system components, responsive navigation shell, and theme context.",
    lastGenerated: "10 Sep 2026, 01:20 PM",
    contributors: [
      { name: "Aman", percentage: 65, commits: 4, color: "#facc15", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80" },
      { name: "Meena", percentage: 35, commits: 2, color: "#38bdf8", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" }
    ],
    files: [
      { name: "Design System", path: "/src/ui/tokens.css", changes: "+88 / -5", lines: 93 }
    ],
    commits: [
      { sha: "119842a", author: "Aman", message: "refactor(ui): dark mode glassmorphism token alignment", date: "3 weeks ago" }
    ],
    integrations: [],
    documentation: {
      sections: [{ id: "overview", label: "1. Overview" }],
      overviewText: "Component primitives, dark/light theme switching tokens, and typography system.",
      componentsTable: [
        { component: "Design Tokens", description: "CSS custom properties for colors & typography", path: "/src/ui/tokens.css" }
      ],
      architectureDiagram: {
        client: "Browser Viewport",
        service: "React / Vite Bundle",
        database: "Local Storage / Cookies",
        external: "CDN Static Assets"
      },
      markdown: `# UI & Design System Tokens`
    }
  }
];

// Preserving legacy mock exports for backward compatibility with live endpoints
export const MOCK_USER = {
  id: 1,
  github_id: "583231",
  username: "rahul",
  name: "Rahul",
  email: "rahul@company.com",
  avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
};

export const MOCK_REPOS = MOCK_REPOSITORIES.map(r => r.name);

export const MOCK_COMMITS = [
  {
    sha: "7fd1a60b01f91b314f59955a4e4d4e80d8edf11d",
    message: "feat(auth): integrate github oauth login with jwt session support",
    author: "Rahul",
    date: "2026-09-24T18:30:00Z"
  },
  {
    sha: "6dcb09b5b57875f334f61aebed695e2e4193db5e",
    message: "fix(db): add missing github_access_token column in users table",
    author: "Rahul",
    date: "2026-09-24T17:15:00Z"
  },
  {
    sha: "3a8f921cc410a7b4512e9b015d86241a79f04128",
    message: "feat(ai): integrate Gemini 1.5 flash for feature clustering and extraction",
    author: "Priya",
    date: "2026-09-23T14:40:00Z"
  }
];

export const MOCK_CONTRIBUTORS = MOCK_DEVELOPERS.map(d => ({
  username: d.name.toLowerCase(),
  avatar_url: d.avatar
}));

export const MOCK_CATEGORIZE_RESPONSE = {
  repo: "ecommerce-platform",
  total_commits: 184,
  features: MOCK_FEATURES.map(f => ({
    feature_id: f.id,
    feature_name: f.name,
    summary: f.summary,
    category: f.category,
    commit_shas: f.commits.map(c => c.sha),
    commit_count: f.commitsCount,
    primary_files_hint: f.files.map(file => file.path),
    knowledge_graph: {
      feature_id: f.id,
      feature_name: f.name,
      total_commits: f.commitsCount,
      bus_factor: f.riskLevel === "HIGH" ? 1 : f.riskLevel === "MEDIUM" ? 2 : 3,
      risk_level: f.riskLevel,
      risk_summary: f.riskBadge,
      dominant_developer: f.contributors[0]?.name || "Rahul",
      developers: f.contributors.map(c => ({
        developer: c.name,
        avatar_url: c.avatar,
        commit_count: c.commits,
        commit_percentage: c.percentage,
        knowledge_percentage: c.percentage,
        risk_level: c.percentage > 50 ? "HIGH" : "LOW",
        color: c.color
      }))
    }
  }))
};

export const MOCK_KNOWLEDGE_GRAPH = {
  repository: "ecommerce-platform",
  total_commits_analyzed: 184,
  total_contributors: 12,
  repo_bus_factor: 1,
  repo_risk_level: "HIGH",
  repo_summary: "Rahul controls > 65% of critical systems including Authentication and Payments.",
  dominant_contributor: "Rahul",
  high_risk_features_count: 2,
  overall_developers: MOCK_DEVELOPERS.map(d => ({
    developer: d.name,
    avatar_url: d.avatar,
    commit_count: d.commitsCount,
    commit_percentage: Math.round((d.commitsCount / 500) * 100),
    knowledge_percentage: Math.round((d.commitsCount / 500) * 100),
    risk_level: d.riskLevel,
    is_dominant: d.isDominant,
    color: d.primaryAreas[0]?.color || "#facc15"
  })),
  feature_breakdown: MOCK_FEATURES.map(f => ({
    feature_name: f.name,
    bus_factor: f.riskLevel === "HIGH" ? 1 : 2,
    risk_level: f.riskLevel,
    dominant_developer: f.contributors[0]?.name
  }))
};

export const MOCK_GENERATE_DOC_RESPONSE = {
  repo: "ecommerce-platform",
  feature_id: "authentication",
  feature_name: "Authentication",
  filename: "authentication.md",
  markdown_content: MOCK_FEATURES[0].documentation.markdown
};
