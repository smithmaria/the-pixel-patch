import { test, expect } from '@playwright/test';

test.describe('Wordle', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.goto('/#/?showModal=true');
    await page.locator('#playerName').fill('TestPlayer');
    await page.getByText('Save').click();
    
    // Mock the random word API to return a consistent word for testing
    await page.route('**/random-word-api.herokuapp.com/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(['hello'])
      });
    });
    
    // Mock the dictionary API for word validation
    await page.route('**/api.dictionaryapi.dev/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ word: 'test' }])
      });
    });
    
    await page.goto('#/wordle');
  });

  test('should display player name', async ({ page }) => {
    await expect(page.getByText('Player: TestPlayer')).toBeVisible();
  });

  test('should display 6x5 grid', async ({ page }) => {
    const grid = page.locator('#wordle-grid');
    const cells = grid.locator('.letter');
    
    await expect(cells).toHaveCount(30); 
  });

  test('should add letter to current cell when typing', async ({ page }) => {
    await page.keyboard.press('H');
    
    const firstCell = page.locator('.letter[data-row="0"]').first();
    await expect(firstCell).toHaveText('H');
  });

  test('should fill multiple letters in sequence', async ({ page }) => {
    await page.keyboard.type('HELLO');
    
    const firstRow = page.locator('.letter[data-row="0"]');
    await expect(firstRow.nth(0)).toHaveText('H');
    await expect(firstRow.nth(1)).toHaveText('E');
    await expect(firstRow.nth(2)).toHaveText('L');
    await expect(firstRow.nth(3)).toHaveText('L');
    await expect(firstRow.nth(4)).toHaveText('O');
  });

  test('should remove letter when pressing Backspace', async ({ page }) => {
    await page.keyboard.type('HE');
    await page.keyboard.press('Backspace');
    
    const firstRow = page.locator('.letter[data-row="0"]');
    await expect(firstRow.nth(0)).toHaveText('H');
    await expect(firstRow.nth(1)).toHaveText('');
  });

  test('should not add more than 5 letters per row', async ({ page }) => {
    await page.keyboard.type('HELLOWORLD');
    
    const firstRow = page.locator('.letter[data-row="0"]');
    await expect(firstRow.nth(4)).toHaveText('O');
    // The extra letters should not be added
  });

  test('should show alert for incomplete word on Enter', async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());
    
    await page.keyboard.type('HEL');
    await page.keyboard.press('Enter');
    
    // Word should still be in first row (not moved to next row)
    const firstRow = page.locator('.letter[data-row="0"]');
    await expect(firstRow.nth(2)).toHaveText('L');
  });

  test('should submit complete word on Enter', async ({ page }) => {
    await page.keyboard.type('HELLO');
    await page.keyboard.press('Enter');
    
    // Wait for the word validation and results
    await page.waitForTimeout(2000);
    
    // Check if cells have result classes applied
    const firstRow = page.locator('.letter[data-row="0"]');
    const firstCell = firstRow.first();
    const cellClass = await firstCell.getAttribute('class');
    
    expect(cellClass).toMatch(/correct|misplaced|incorrect/);
  });

  test('should move to next row after valid submission', async ({ page }) => {
    await page.keyboard.type('WORLD');
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(2000);
    
    // Type in second row
    await page.keyboard.press('T');
    const secondRow = page.locator('.letter[data-row="1"]');
    await expect(secondRow.first()).toHaveText('T');
  });

  test('should show win modal when guessing correctly', async ({ page }) => {
    await page.keyboard.type('HELLO'); // Target word is 'hello'
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(2000);
    
    await expect(page.getByText('You win!')).toBeVisible();
  });

  test('should show game over modal after 6 failed attempts', async ({ page }) => {
    const guesses = ['WORLD', 'TESTS', 'ABCDE', 'FGHIJ', 'KLMNO', 'PQRST'];
    
    for (const guess of guesses) {
      await page.keyboard.type(guess);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
    }
    
    await expect(page.getByText('Game Over!')).toBeVisible();
  });

  test('should disable keyboard input after game ends', async ({ page }) => {
    await page.keyboard.type('HELLO');
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(2000);
    
    // Try to type after winning
    await page.keyboard.type('TEST');
    
    // Second row should be empty
    const secondRow = page.locator('.letter[data-row="1"]');
    await expect(secondRow.first()).toHaveText('');
  });

  test('should reset game when clicking Play Again', async ({ page }) => {
    await page.keyboard.type('HELLO');
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(2000);
    
    await page.getByText('Play Again').click();
    
    // Grid should be cleared
    const firstCell = page.locator('.letter[data-row="0"]').first();
    await expect(firstCell).toHaveText('');
  });

  test('should navigate home when clicking Quit', async ({ page }) => {
    await page.keyboard.type('HELLO');
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(2000);
    
    await page.getByText('Quit').click();
    
    await expect(page).toHaveURL('#/');
  });

  test('should apply bounce animation when typing letter', async ({ page }) => {
    await page.keyboard.press('H');
    
    const firstCell = page.locator('.letter[data-row="0"]').first();
    await expect(firstCell).toHaveClass(/animate__bounceIn/);
  });

  test('should apply shake animation for invalid word', async ({ page }) => {
    // Mock invalid word response
    await page.route('**/api.dictionaryapi.dev/**', async route => {
      await route.fulfill({ status: 404 });
    });
    
    await page.keyboard.type('ZZZZZ');
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(500);
    
    const firstRow = page.locator('.letter[data-row="0"]');
    const cellClass = await firstRow.first().getAttribute('class');
    expect(cellClass).toMatch(/animate__shakeX/);
  });

  test('should only accept letter keys', async ({ page }) => {
    await page.keyboard.press('1');
    await page.keyboard.press('!');
    await page.keyboard.press('Space');
    
    const firstCell = page.locator('.letter[data-row="0"]').first();
    await expect(firstCell).toHaveText('');
    
    await page.keyboard.press('A');
    await expect(firstCell).toHaveText('A');
  });
});
