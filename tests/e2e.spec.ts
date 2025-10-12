import { test, expect } from "@playwright/test";

test.describe("InvestIQ Voice E2E Happy Path", () => {
  test("complete onboarding flow from home to success", async ({ page }) => {
    // 1. Visit home page
    await page.goto("http://localhost:3000");

    // Check for compliance banner
    await expect(page.getByText(/Demo Mode/i)).toBeVisible();

    // Check for hero content
    await expect(
      page.getByRole("heading", { name: /Open Your First Investment Account/i })
    ).toBeVisible();

    // 2. Click "Start Voice Onboarding"
    await page.getByRole("link", { name: /Start Voice Onboarding/i }).click();

    // Wait for onboarding page to load
    await expect(page).toHaveURL(/\/onboarding/);
    await expect(page.getByText(/Account Opening Progress/i)).toBeVisible();

    // 3. Step A: Choose account type
    await page.getByText("Stocks & Funds").click();
    await page.getByRole("button", { name: /Next/i }).click();

    // 4. Step B: Fill in basic information
    await page.fill("#firstName", "Test");
    await page.fill("#lastName", "User");
    await page.fill("#email", "test@example.com");
    await page.fill("#mobile", "5551234567");
    await page.getByRole("button", { name: /Next/i }).click();

    // 5. Step C: Security information
    await page.fill("#dob", "01/01/1990");
    await page.getByLabel(/I am a U.S. citizen/i).check();
    await page.fill("#ssn", "123456789");

    // Test "Why SSN?" explain chip
    const ssnExplainButton = page.getByRole("button", { name: /Why SSN/i });
    if (await ssnExplainButton.isVisible()) {
      await ssnExplainButton.click();
      // Wait for AI response (should appear in chat)
      await page.waitForTimeout(2000);
    }

    await page.getByRole("button", { name: /Next/i }).click();

    // 6. Step D: Address
    await page.fill("#street", "123 Main Street");
    await page.fill("#city", "Anytown");
    await page.fill("#state", "CA");
    await page.fill("#zip", "12345");
    await page.getByRole("button", { name: /Next/i }).click();

    // 7. Step E: Employment
    await page.getByRole("combobox").first().click();
    await page.getByText("Employed").click();

    // Make sure NOT to check restricted person
    const restrictedCheckbox = page.getByLabel(
      /director.*10%.*shareholder.*policy-maker/i
    );
    if (await restrictedCheckbox.isChecked()) {
      await restrictedCheckbox.uncheck();
    }

    await page.getByRole("button", { name: /Next/i }).click();

    // 8. Step F: Trusted Contact (skip)
    await page.getByRole("button", { name: /Skip This Step/i }).click();

    // 9. Step G: Review and confirm
    await page.getByLabel(/read and agree to the Terms/i).check();
    await page.getByLabel(/understand that investing involves risk/i).check();
    await page.getByLabel(/certify that all information.*accurate/i).check();
    await page.getByLabel(/read and understood the Privacy Policy/i).check();

    // 10. Submit application
    await page.getByRole("button", { name: /Open My Account/i }).click();

    // 11. Wait for success page
    await expect(
      page.getByRole("heading", { name: /Application Submitted/i })
    ).toBeVisible({ timeout: 10000 });

    // 12. Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Verify dashboard shows the session
    await expect(page.getByText(/Total Sessions/i)).toBeVisible();
  });

  test("home page accessibility", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Check for ARIA labels
    const micButton = page.locator('button[aria-label*="voice"]').first();
    if (await micButton.isVisible()) {
      expect(await micButton.getAttribute("aria-label")).toBeTruthy();
    }

    // Test keyboard navigation
    await page.keyboard.press("Tab");
    const focusedElement = await page.locator(":focus");
    await expect(focusedElement).toBeVisible();

    // Check contrast (basic check - full Lighthouse would be better)
    const backgroundColor = await page
      .locator("body")
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(backgroundColor).toBeTruthy();
  });

  test("learn page has voice-enabled terms", async ({ page }) => {
    await page.goto("http://localhost:3000/learn");

    // Check for glossary terms
    await expect(page.getByText(/Investment Glossary/i)).toBeVisible();

    // Check for search
    await page.fill('input[placeholder*="Search"]', "ETF");

    // Should filter results
    await expect(page.getByText("ETF")).toBeVisible();

    // Click explain button
    const explainButton = page.getByRole("button", { name: /Explain/i }).first();
    if (await explainButton.isVisible()) {
      await explainButton.click();
      // Wait for explanation to load
      await page.waitForTimeout(2000);
    }
  });

  test("dashboard shows analytics", async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard");

    // Check for stats
    await expect(page.getByText(/Total Sessions/i)).toBeVisible();
    await expect(page.getByText(/Completed Applications/i)).toBeVisible();

    // Check for charts
    await expect(page.getByText(/Onboarding Funnel/i)).toBeVisible();
    await expect(page.getByText(/User Experience Level/i)).toBeVisible();

    // Check for sessions table
    await expect(page.getByText(/Recent Sessions/i)).toBeVisible();
  });
});


