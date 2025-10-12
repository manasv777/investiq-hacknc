"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { ExplainChip } from "./ExplainChip";
import { PrivacyToggle } from "./PrivacyToggle";
import { useSessionStore } from "@/store/session";
import { OnboardingStep } from "@/lib/schemas";
import { maskSensitiveData } from "@/lib/utils";

interface OnboardingStepsProps {
  onExplainClick: (topic: string) => void;
  onScanDocument: (type: "id" | "utility-bill") => void;
}

export function OnboardingSteps({
  onExplainClick,
  onScanDocument,
}: OnboardingStepsProps) {
  const { onboardingData, updateOnboardingData, showPrivateInput } =
    useSessionStore();

  console.log("OnboardingSteps - Current step:", onboardingData.currentStep);

  const [localValues, setLocalValues] = useState<Record<string, string>>({});

  // Ensure we have a current step, default to "A"
  const currentStep = onboardingData.currentStep || "A";

  const handleInputChange = (field: string, value: string) => {
    setLocalValues((prev) => ({ ...prev, [field]: value }));
    updateOnboardingData({ [field]: value });
  };

  const renderMaskedInput = (field: string, label: string, type: string = "text") => {
    const value = localValues[field] || "";
    const displayValue = showPrivateInput ? value : maskSensitiveData(value);

    return (
      <div>
        <Label htmlFor={field}>{label}</Label>
        <Input
          id={field}
          type={type}
          value={displayValue}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
    );
  };

  // Step A: Account Type
  if (currentStep === "A") {
    return (
      <div className="space-y-6" role="region" aria-labelledby="step-a-heading">
        <div>
          <h2 id="step-a-heading" className="text-2xl font-bold text-[#0B1F3B] mb-2">
            Choose Your Account Type
          </h2>
          <p className="text-gray-600">
            Select the type of investments you'd like to make.
          </p>
        </div>

        <div className="grid gap-4">
          <button
            type="button"
            onClick={() => handleInputChange("accountType", "stocks-funds")}
            className={`p-6 rounded-lg border-2 text-left transition-all ${
              onboardingData.accountType === "stocks-funds"
                ? "border-[#0B1F3B] bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <h3 className="font-semibold text-lg mb-2">Stocks & Funds</h3>
            <p className="text-sm text-gray-600">
              Invest in individual stocks and mutual funds. Perfect for beginners.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleInputChange("accountType", "stocks-funds-crypto")}
            className={`p-6 rounded-lg border-2 text-left transition-all ${
              onboardingData.accountType === "stocks-funds-crypto"
                ? "border-[#0B1F3B] bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <h3 className="font-semibold text-lg mb-2">
              Stocks, Funds & Crypto
            </h3>
            <p className="text-sm text-gray-600">
              All investment types including cryptocurrency like Bitcoin and Ethereum.
            </p>
          </button>
        </div>

        <ExplainChip
          topic="account types"
          onClick={() => onExplainClick("accountType")}
        />
      </div>
    );
  }

  // Step B: Basics
  if (currentStep === "B") {
    return (
      <div className="space-y-6" role="region" aria-labelledby="step-b-heading">
        <div>
          <h2 id="step-b-heading" className="text-2xl font-bold text-[#0B1F3B] mb-2">
            Basic Information
          </h2>
          <p className="text-gray-600">
            Tell us a bit about yourself. We'll use this to verify your identity.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={onboardingData.firstName || ""}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="First name"
              required
            />
          </div>

          <div>
            <Label htmlFor="middleName">Middle Name</Label>
            <Input
              id="middleName"
              value={onboardingData.middleName || ""}
              onChange={(e) => handleInputChange("middleName", e.target.value)}
              placeholder="Middle name"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={onboardingData.lastName || ""}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Last name"
              required
            />
          </div>

          <div>
            <Label htmlFor="preferredName">Preferred Name</Label>
            <Input
              id="preferredName"
              value={onboardingData.preferredName || ""}
              onChange={(e) => handleInputChange("preferredName", e.target.value)}
              placeholder="What should we call you?"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={onboardingData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="your.email@example.com"
            required
            aria-describedby="email-help"
          />
          <p id="email-help" className="text-xs text-gray-500 mt-1">We'll send important account information to this address.</p>
        </div>

        <div>
          <Label htmlFor="mobile">Mobile Phone *</Label>
          <Input
            id="mobile"
            type="tel"
            value={onboardingData.mobile || ""}
            onChange={(e) => handleInputChange("mobile", e.target.value)}
            placeholder="(555) 123-4567"
            required
            aria-describedby="mobile-help"
          />
          <p id="mobile-help" className="text-xs text-gray-500 mt-1">Used for security alerts and verification codes.</p>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <Checkbox
              id="hasMilitaryExperience"
              checked={onboardingData.hasMilitaryExperience === true}
              onCheckedChange={(checked) =>
                updateOnboardingData({ hasMilitaryExperience: checked === true })
              }
            />
            <Label htmlFor="hasMilitaryExperience" className="cursor-pointer">
              I have U.S. military experience
            </Label>
          </div>

          {onboardingData.hasMilitaryExperience && (
            <div className="space-y-4 ml-7">
              <div>
                <Label htmlFor="militaryStatus">Status *</Label>
                <Select
                  value={onboardingData.militaryStatus}
                  onValueChange={(value) =>
                    handleInputChange("militaryStatus", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="currently-serving">
                      Currently Serving
                    </SelectItem>
                    <SelectItem value="transitioning">Transitioning</SelectItem>
                    <SelectItem value="post-service">Post-Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="militaryService">Branch *</Label>
                <Select
                  value={onboardingData.militaryService}
                  onValueChange={(value) =>
                    handleInputChange("militaryService", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="army">Army</SelectItem>
                    <SelectItem value="marine-corps">Marine Corps</SelectItem>
                    <SelectItem value="navy">Navy</SelectItem>
                    <SelectItem value="air-force">Air Force</SelectItem>
                    <SelectItem value="space-force">Space Force</SelectItem>
                    <SelectItem value="coast-guard">Coast Guard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="militaryRank">Rank</Label>
                <Input
                  id="militaryRank"
                  value={onboardingData.militaryRank || ""}
                  onChange={(e) => handleInputChange("militaryRank", e.target.value)}
                  placeholder="E.g., Sergeant, Captain"
                />
              </div>

              <ExplainChip
                topic="military benefits"
                onClick={() => onExplainClick("military")}
              />
            </div>
          )}
        </div>

        <ExplainChip topic="basics" onClick={() => onExplainClick("basics")} />
      </div>
    );
  }

  // Step C: Security
  if (currentStep === "C") {
    return (
      <div className="space-y-6" role="region" aria-labelledby="step-c-heading">
        <div>
          <h2 id="step-c-heading" className="text-2xl font-bold text-[#0B1F3B] mb-2">
            Security & Verification
          </h2>
          <p className="text-gray-600">
            This information helps us verify your identity and comply with federal
            regulations.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-900">
            <strong>Privacy Note:</strong> Sensitive fields are masked. Your raw data
            is not stored or transmitted in plain text.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="dob">Date of Birth *</Label>
            <ExplainChip topic="DOB" onClick={() => onExplainClick("dob")} />
          </div>
          {renderMaskedInput("dob", "MM/DD/YYYY", "text")}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <Checkbox
              id="isUsCitizen"
              checked={onboardingData.isUsCitizen === true}
              onCheckedChange={(checked) =>
                updateOnboardingData({ isUsCitizen: checked === true })
              }
            />
            <Label htmlFor="isUsCitizen" className="cursor-pointer">
              I am a U.S. citizen
            </Label>
            <ExplainChip
              topic="citizenship"
              onClick={() => onExplainClick("citizenship")}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="ssn">Social Security Number *</Label>
            <ExplainChip topic="SSN" onClick={() => onExplainClick("ssn")} />
          </div>
          {renderMaskedInput("ssn", "XXX-XX-XXXX", "text")}
          <p id="ssn-help" className="text-xs text-gray-500 mt-1">
            Required by federal law. This is never shown in full.
          </p>
        </div>

        <div className="pt-4 border-t">
          <div className="mb-4">
            <PrivacyToggle />
          </div>
          <h3 className="font-semibold mb-3">Document Verification (Optional - Fast Approval)</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onScanDocument("id")}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Scan ID
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => onScanDocument("utility-bill")}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Scan Utility Bill
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Provide an ID or utility bill and complete KYC to get your application approved faster.
            Scanning happens locally; KYC is handled securely by Veriff.
          </p>

          <div className="mt-4">
            <Button
              type="button"
              onClick={async () => {
                try {
                  const res = await fetch('/api/kyc/veriff/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId: onboardingData.sessionId, person: { givenName: onboardingData.firstName, lastName: onboardingData.lastName, idNumber: onboardingData.ssn } }),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data?.error || 'KYC error');
                  // Open Veriff flow in new tab
                  if (data?.kycUrl) window.open(data.kycUrl, '_blank');
                } catch (e) {
                  console.error('KYC start error', e);
                }
              }}
            >
              Start Fast Approval (Veriff)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step D: Address
  if (currentStep === "D") {
    return (
      <div className="space-y-6" role="region" aria-labelledby="step-d-heading">
        <div>
          <h2 id="step-d-heading" className="text-2xl font-bold text-[#0B1F3B] mb-2">
            Residential Address
          </h2>
          <p className="text-gray-600">
            Your address is used for identity verification and legal correspondence.
          </p>
        </div>

        <div>
          <Label htmlFor="street">Street Address *</Label>
          <AddressAutocomplete
            value={onboardingData.street || ""}
            onSelect={(addr) => {
              handleInputChange("street", addr.street);
              handleInputChange("city", addr.city);
              handleInputChange("state", addr.state);
              handleInputChange("zip", addr.zip);
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={onboardingData.city || ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="City"
              required
            />
          </div>

          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={onboardingData.state || ""}
              onChange={(e) => handleInputChange("state", e.target.value)}
              placeholder="CA"
              maxLength={2}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="zip">ZIP Code *</Label>
          <Input
            id="zip"
            value={onboardingData.zip || ""}
            onChange={(e) => handleInputChange("zip", e.target.value)}
            placeholder="12345"
            maxLength={5}
            required
          />
        </div>

        <ExplainChip topic="address" onClick={() => onExplainClick("address")} />
      </div>
    );
  }

  // Step E: Employment
  if (currentStep === "E") {
    return (
      <div className="space-y-6" role="region" aria-labelledby="step-e-heading">
        <div>
          <h2 id="step-e-heading" className="text-2xl font-bold text-[#0B1F3B] mb-2">
            Employment & Investor Info
          </h2>
          <p className="text-gray-600">
            Federal regulations require us to collect this information.
          </p>
        </div>

        <div>
          <Label htmlFor="employmentStatus">Employment Status *</Label>
          <Select
            value={onboardingData.employmentStatus}
            onValueChange={(value) => handleInputChange("employmentStatus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employed">Employed</SelectItem>
              <SelectItem value="self-employed">Self-Employed</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
              <SelectItem value="unemployed">Unemployed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(onboardingData.employmentStatus === "employed" ||
          onboardingData.employmentStatus === "self-employed") && (
          <>
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={onboardingData.jobTitle || ""}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                placeholder="Software Engineer, Teacher, etc."
              />
            </div>

            <div>
              <Label htmlFor="employerName">Employer Name</Label>
              <Input
                id="employerName"
                value={onboardingData.employerName || ""}
                onChange={(e) => handleInputChange("employerName", e.target.value)}
                placeholder="Company name"
              />
            </div>
          </>
        )}

        <div className="pt-4 border-t">
          <div className="flex items-center gap-3 mb-2">
            <Checkbox
              id="financialInstitutionEmployment"
              checked={onboardingData.financialInstitutionEmployment === true}
              onCheckedChange={(checked) =>
                updateOnboardingData({ financialInstitutionEmployment: checked === true })
              }
            />
            <Label
              htmlFor="financialInstitutionEmployment"
              className="cursor-pointer"
            >
              I or someone in my household works for a financial institution
            </Label>
            <ExplainChip
              topic="financial institution employment"
              onClick={() => onExplainClick("employment")}
            />
          </div>

          {onboardingData.financialInstitutionEmployment && (
            <div className="ml-7 mt-3">
              <Label htmlFor="financialInstitutionName">Institution Name *</Label>
              <Input
                id="financialInstitutionName"
                value={onboardingData.financialInstitutionName || ""}
                onChange={(e) =>
                  handleInputChange("financialInstitutionName", e.target.value)
                }
                placeholder="E.g., Fidelity Investments"
                required
              />
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-3 mb-2">
            <Checkbox
              id="isRestrictedPerson"
              checked={onboardingData.isRestrictedPerson === true}
              onCheckedChange={(checked) =>
                updateOnboardingData({ isRestrictedPerson: checked === true })
              }
            />
            <Label htmlFor="isRestrictedPerson" className="cursor-pointer">
              I am a director, 10% shareholder, or policy-maker of a publicly traded
              company
            </Label>
            <ExplainChip
              topic="restricted person"
              onClick={() => onExplainClick("restrictedPerson")}
            />
          </div>

          {onboardingData.isRestrictedPerson && (
            <div className="ml-7 mt-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-900 font-medium">
                We're sorry, but we cannot open an account for you at this time due
                to regulatory restrictions.
              </p>
              <p className="text-sm text-red-700 mt-2">
                Per federal regulations, individuals in policy-making positions,
                board members, or significant shareholders of publicly traded
                companies may have restrictions.
              </p>
              <Button variant="outline" className="mt-3" size="sm">
                Learn Why
              </Button>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-3">
            <Checkbox
              id="backupWithholding"
              checked={onboardingData.backupWithholding === true}
              onCheckedChange={(checked) =>
                updateOnboardingData({ backupWithholding: checked === true })
              }
            />
            <Label htmlFor="backupWithholding" className="cursor-pointer">
              I am subject to backup withholding
            </Label>
          </div>
          <p className="text-xs text-gray-500 ml-7 mt-1">
            Check this if the IRS has notified you that you're subject to backup
            withholding.
          </p>
        </div>
      </div>
    );
  }

  // Step F: Trusted Contact
  if (currentStep === "F") {
    return (
      <div className="space-y-6" role="region" aria-labelledby="step-f-heading">
        <div>
          <h2 id="step-f-heading" className="text-2xl font-bold text-[#0B1F3B] mb-2">
            Trusted Contact (Optional)
          </h2>
          <p className="text-gray-600">
            Designate someone we can contact if we're unable to reach you or detect
            unusual activity.
          </p>
          <div className="flex items-start gap-2 mt-3">
            <ExplainChip
              topic="trusted contact"
              onClick={() => onExplainClick("trustedContact")}
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            Your trusted contact <strong>cannot</strong> access your account or make
            transactions. They're simply an emergency contact point.
          </p>
        </div>

        <div>
          <Label htmlFor="trustedContactName">Full Name</Label>
          <Input
            id="trustedContactName"
            value={onboardingData.trustedContactName || ""}
            onChange={(e) =>
              handleInputChange("trustedContactName", e.target.value)
            }
            placeholder="Contact's full name"
          />
        </div>

        <div>
          <Label htmlFor="trustedContactEmail">Email Address</Label>
          <Input
            id="trustedContactEmail"
            type="email"
            value={onboardingData.trustedContactEmail || ""}
            onChange={(e) =>
              handleInputChange("trustedContactEmail", e.target.value)
            }
            placeholder="contact@example.com"
          />
        </div>

        <div>
          <Label htmlFor="trustedContactPhone">Phone Number</Label>
          <Input
            id="trustedContactPhone"
            type="tel"
            value={onboardingData.trustedContactPhone || ""}
            onChange={(e) =>
              handleInputChange("trustedContactPhone", e.target.value)
            }
            placeholder="(555) 123-4567"
          />
        </div>

        <Button type="button" variant="outline" className="w-full">
          Skip This Step
        </Button>
      </div>
    );
  }

  // Step G: Review & Confirm
  if (currentStep === "G") {
    return (
      <div className="space-y-6" role="region" aria-labelledby="step-g-heading">
        <div>
          <h2 id="step-g-heading" className="text-2xl font-bold text-[#0B1F3B] mb-2">
            Review & Confirm
          </h2>
          <p className="text-gray-600">
            Please review your information and confirm the acknowledgments below.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
          <div>
            <span className="font-medium">Name:</span>{" "}
            {onboardingData.firstName} {onboardingData.lastName}
          </div>
          <div>
            <span className="font-medium">Email:</span> {onboardingData.email}
          </div>
          <div>
            <span className="font-medium">Mobile:</span> {onboardingData.mobile}
          </div>
          <div>
            <span className="font-medium">Address:</span> {onboardingData.street},{" "}
            {onboardingData.city}, {onboardingData.state} {onboardingData.zip}
          </div>
          <div>
            <span className="font-medium">SSN:</span>{" "}
            {maskSensitiveData(onboardingData.ssn || "", 4)}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-start gap-3">
            <Checkbox
              id="acknowledgedTerms"
              checked={onboardingData.acknowledgedTerms === true}
              onCheckedChange={(checked) =>
                updateOnboardingData({ acknowledgedTerms: checked === true })
              }
              required
            />
            <Label htmlFor="acknowledgedTerms" className="cursor-pointer text-sm">
              I have read and agree to the Terms of Service and Customer Agreement
            </Label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="acknowledgedRisks"
              checked={onboardingData.acknowledgedRisks === true}
              onCheckedChange={(checked) =>
                updateOnboardingData({ acknowledgedRisks: checked === true })
              }
              required
            />
            <Label htmlFor="acknowledgedRisks" className="cursor-pointer text-sm">
              I understand that investing involves risk and I may lose money
            </Label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="acknowledgedAccuracy"
              checked={onboardingData.acknowledgedAccuracy === true}
              onCheckedChange={(checked) =>
                updateOnboardingData({ acknowledgedAccuracy: checked === true })
              }
              required
            />
            <Label htmlFor="acknowledgedAccuracy" className="cursor-pointer text-sm">
              I certify that all information provided is accurate and complete
            </Label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="acknowledgedPrivacy"
              checked={onboardingData.acknowledgedPrivacy === true}
              onCheckedChange={(checked) =>
                updateOnboardingData({ acknowledgedPrivacy: checked === true })
              }
              required
            />
            <Label htmlFor="acknowledgedPrivacy" className="cursor-pointer text-sm">
              I have read and understood the Privacy Policy
            </Label>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-900">
            Once you submit, we'll review your application. Most applications are
            approved within 1-2 business days.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

