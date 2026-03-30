import { test, expect } from '@playwright/test';

test.describe('手册页面测试', () => {
  test('首页应该正常加载', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Casting UI Framework/);
    await expect(page.locator('.layout-top-left-right')).toBeVisible();
  });

  test('应该没有控制台错误', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => {
      errors.push(error);
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(errors.length).toBe(0);
  });

  test('初始化指南页面应该正常加载', async ({ page }) => {
    await page.goto('/');
    await page.click('li[data-id="init-guide"] a');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#content-container')).toBeVisible();
  });

  test('基础布局页面应该正常加载', async ({ page }) => {
    await page.goto('/');
    await page.click('li[data-id="basic-layout"] a');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#content-container')).toBeVisible();
  });

  test('交互控件页面应该正常加载', async ({ page }) => {
    await page.goto('/');
    await page.click('li[data-id="interaction-controls"] a');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#content-container')).toBeVisible();
  });

  test('反馈组件页面应该正常加载', async ({ page }) => {
    await page.goto('/');
    await page.click('li[data-id="feedback-components"] a');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#content-container')).toBeVisible();
  });

  test('数据展示页面应该正常加载', async ({ page }) => {
    await page.goto('/');
    await page.click('li[data-id="data-display"] a');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#content-container')).toBeVisible();
  });

  test('通用UI页面应该正常加载', async ({ page }) => {
    await page.goto('/');
    await page.click('li[data-id="general-ui"] a');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#content-container')).toBeVisible();
  });

  test('搜索功能应该正常工作', async ({ page }) => {
    await page.goto('/');
    await page.fill('#menuSearch', '按钮');
    await page.waitForTimeout(100);
    await expect(page.locator('li[data-id="button-container"]')).not.toHaveCSS('display', 'none');
  });

  test('所有CSS和JS资源应该正常加载', async ({ page }) => {
    const response = await page.goto('/');
    expect(response.status()).toBe(200);
    
    const links = await page.$$eval('link[rel="stylesheet"]', (els) => 
      els.map(el => el.getAttribute('href')).filter(href => href && !href.startsWith('http'))
    );
    
    for (const href of links) {
      const res = await page.goto(href);
      expect(res.status()).toBeLessThan(400);
    }
    
    await page.goto('/');
    const scripts = await page.$$eval('script[src]', (els) => 
      els.map(el => el.getAttribute('src')).filter(src => src && !src.startsWith('http'))
    );
    
    for (const src of scripts) {
      const res = await page.goto(src);
      expect(res.status()).toBeLessThan(400);
    }
  });
});
