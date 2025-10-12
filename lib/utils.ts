import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function maskSensitiveData(text: string): string {
  // Mask SSN patterns (XXX-XX-XXXX)
  text = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "***-**-****");
  
  // Mask credit card patterns (XXXX-XXXX-XXXX-XXXX)
  text = text.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, "****-****-****-****");
  
  // Mask email addresses
  text = text.replace(/\b[\w\.-]+@[\w\.-]+\.\w+\b/g, (email) => {
    const [name, domain] = email.split("@");
    return `${name.charAt(0)}***@${domain}`;
  });
  
  // Mask phone numbers
  text = text.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, "***-***-****");
  
  return text;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}


