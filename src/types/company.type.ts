
// Company er detail er jonno alada interface
export type Company = {
    id: string;
    userId: string;
    companyName: string;
    companyEmail: string;
    companyAddress: string;
    companyVatId: string;
    createdAt: string; 
    updatedAt: string; 
}

// Main User object-er interface
export type CompanyUser = {
    id: string;
    fullName: string;
    email: string;
    dateOfBirth: string; 
    role: "STUDENT" 
    status: "ACTIVE" | "BLOCKED" | "PENDING"; 
    createdAt: string; 
    company: Company; 
}