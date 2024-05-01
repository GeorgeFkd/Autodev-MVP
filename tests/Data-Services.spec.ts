import { test, expect } from "@playwright/test";

test("Generate Requirements Document", async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Data Services' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Verify Url' }).click();
    await page.locator('.chakra-checkbox__control').first().click();
    await page.locator('div:nth-child(2) > .chakra-checkbox > .chakra-checkbox__control').click();
    await page.locator('div:nth-child(3) > .chakra-checkbox > .chakra-checkbox__control').click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.locator('[data-test-id="frequency-menu"]').first().click();
    await page.getByRole('menuitem', { name: 'Daily' }).click();
    await page.locator('input').first().fill('2024-04-15');
    await page.locator('input:nth-child(6)').first().fill('2024-04-30');
    await page.locator('[data-test-id="frequency-menu"]').nth(1).click();
    await page.getByRole('menuitem', { name: 'Yearly' }).click();
    await page.locator('div:nth-child(2) > input').first().fill('2024-04-01');
    await page.locator('div:nth-child(2) > input:nth-child(6)').fill('2024-04-30');
    await page.getByRole('button', { name: 'Frequency' }).click();
    await page.getByRole('menuitem', { name: 'Monthly' }).click();
    await page.locator('div:nth-child(3) > input').first().fill('2024-04-01');
    await page.locator('div:nth-child(3) > input:nth-child(6)').fill('2024-04-28');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByText('Page 1').click();
    await page.getByRole('textbox').click({
        clickCount: 3
    });
    await page.getByRole('textbox').fill('Financial Data');
    await page.getByText('Label').click();
    await page.getByRole('textbox').dblclick();
    await page.getByRole('textbox').fill('Futures');
    await page.getByRole('button', { name: 'Choose Data Source' }).click();
    await page.getByRole('button', { name: 'Choose Data Source' }).click();
    await page.getByRole('menuitem', { name: 'Fetch submitted contracts for' }).click();
    await page.getByLabel('Add Box in Row').click();
    await page.getByText('Label').click();
    await page.getByRole('textbox').fill('Options');
    await page.getByRole('button', { name: 'Choose Data Source' }).click();
    await page.getByRole('button', { name: 'Choose Data Source' }).click();
    await page.getByRole('menuitem', { name: 'Upload CSV file' }).click();
    await page.getByLabel('Add Box in Row').click();
    await page.locator('div').filter({ hasText: 'LabelBargraphScatterPlotPieChartBarGraphHistogramChoose Data SourceValidate CSV' }).nth(2).click();
    await page.locator('div').filter({ hasText: 'LabelBargraphScatterPlotPieChartBarGraphHistogramChoose Data SourceValidate CSV' }).nth(2).click();
    await page.locator('div').filter({ hasText: 'LabelBargraphScatterPlotPieChartBarGraphHistogramChoose Data SourceValidate CSV' }).nth(2).click();
    await page.getByRole('button', { name: 'Choose Data Source' }).click();
    await page.getByRole('menuitem', { name: 'Validate CSV file' }).click();
    await page.getByRole('button', { name: 'Save Page' }).click();
    await page.getByRole('button', { name: 'Submit All' }).click();

    await page.getByRole('button', { name: 'Send Email' }).click();
    const download = await page.waitForEvent('download');
    const stream = await download.createReadStream();
    const contentsArr = await stream.toArray();
    expect(contentsArr.length > 0, "The file downloaded by the user should not be empty").toBeTruthy();
    //i can do more assertions here


});

test("Generate Code", async ({ page }) => {
    // await page.goto('about:blank');
    // await page.goto('chrome-error://chromewebdata/');
    // await page.goto('http://localhost:3000/');
    // await page.getByText('Pick the type of software you want to createData ServicesE-Commerce Site').click();
    // const stream = await download.createReadStream();
    // const contentsArr = await stream.toArray();
    // expect(download.suggestedFilename().includes(selectedLanguage), "The file downloaded by the user should have the selected language in the name").toBeTruthy();
    // expect(contentsArr.length > 0, "The file downloaded by the user should not be empty").toBeTruthy();
})

