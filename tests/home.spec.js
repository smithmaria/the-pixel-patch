import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display greeting without player name initially', async ({ page }) => {
    const greeting = page.locator('.greeting');
    await expect(greeting).toHaveText('Hello!');
  });

  test('should display first four game cards', async ({ page }) => {
    const gameCards = page.locator('.game-card');
    await expect(gameCards).toHaveCount(4);
    
    await expect(page.getByText('Rock, Paper, Scissors')).toBeVisible();
    await expect(page.getByText('Tic Tac Toe')).toBeVisible();
    await expect(page.getByText('Wordle')).toBeVisible();
    await expect(page.getByText('Hangman')).toBeVisible();
  });

  test('should show player name modal when clicking game without name set', async ({ page }) => {
    await page.getByText('Rock, Paper, Scissors').click();
    
    await expect(page.locator('.modal-header h3')).toHaveText('User Settings');
    await expect(page.getByText('Enter your player name to begin playing.')).toBeVisible();
  });

  test('should show error when trying to save empty player name', async ({ page }) => {
    await page.getByText('Wordle').click();
    await page.getByText('Save').click();
    
    await expect(page.locator('.error-message')).toHaveText('Please enter a value to save.');
  });

  test('should save player name and navigate to game', async ({ page }) => {
    await page.getByText('Rock, Paper, Scissors').click();
    await page.locator('#playerName').fill('TestPlayer');
    await page.getByText('Save').click();
    
    await expect(page).toHaveURL(/\/rps/);
  });

  test('should display player name after saving', async ({ page }) => {
    await page.goto('/#/?showModal=true');
    await page.locator('#playerName').fill('John');
    await page.getByText('Save').click();
    
    await page.goto('/');
    const greeting = page.locator('.greeting');
    await expect(greeting).toHaveText('Hello John!');
  });

  test('should enforce max length of 15 characters for player name', async ({ page }) => {
    await page.getByText('Hangman').click();
    const input = page.locator('#playerName');
    
    await expect(input).toHaveAttribute('maxLength', '15');
  });
});
