/**
 * SmartNavigator Class
 * An AI-driven, self-healing browser automation controller.
 * Designed by Senior Staff AI Architects for robust, human-like interaction.
 */

import fs from 'fs';
import logger from '../../utils/logger.js';
import * as aiProviderService from '../aiProviderService.js';

class SmartNavigator {
    constructor(page) {
        this.page = page;
        this.errorSnapshotPath = './logs/automation_errors/';

        // Ensure log directory exists
        if (!fs.existsSync(this.errorSnapshotPath)) {
            fs.mkdirSync(this.errorSnapshotPath, { recursive: true });
        }
    }

    /**
     * Find and click an element semantically
     * @param {string} description - Natural language description of the target (e.g., "The main Apply Now button")
     */
    async findAndClick(description) {
        logger.info(`🔍 SmartNavigator: Searching for "${description}"...`);

        try {
            // 1. Get simplified accessibility tree
            const accessibilityTree = await this.getSimplifiedAccessibilityTree();

            // 2. Use LLM to identify the best selector/element
            const target = await this.identifyElementWithAI(accessibilityTree, description);

            if (!target || !target.selector) {
                throw new Error(`Could not find element matching: ${description}`);
            }

            logger.info(`🎯 SmartNavigator: Target identified using AI: ${target.selector}`);

            // 3. Human-like interaction
            await this.humanClick(target.selector);

            return true;
        } catch (error) {
            return await this.handleError(error, description);
        }
    }

    /**
     * Extract a simplified version of the accessibility tree for LLM processing
     */
    async getSimplifiedAccessibilityTree() {
        // We dump the snapshot of the page focusing on interactive elements
        const snapshot = await this.page.accessibility.snapshot();

        const simplify = (node) => {
            const result = {
                role: node.role,
                name: node.name,
                children: []
            };

            if (node.children) {
                result.children = node.children
                    .map(simplify)
                    .filter(c => c.role !== 'text' || (c.name && c.name.length > 2));
            }

            return result;
        };

        return JSON.stringify(simplify(snapshot), null, 2);
    }

    /**
     * Use LLM to find the selector in the tree
     */
    async identifyElementWithAI(tree, description) {
        const prompt = `
        Acting as a Senior Staff Engineer, identify the specific element in this Accessibility Tree that represents: "${description}"
        
        ACCCESSIBILITY TREE:
        ${tree.substring(0, 4000)}

        Return a JSON object with:
        1. selector: A CSS selector or XPath that uniquely identifies this element.
        2. confidence: 0-1 score.
        3. reasoning: Why this element was chosen.
        `;

        const response = await aiProviderService.generateCompletion(prompt, {
            response_format: { type: "json_object" }
        });

        try {
            return JSON.parse(response);
        } catch (e) {
            logger.error('AI Selector Generation Failed', e);
            return null;
        }
    }

    /**
     * Click with human-like stealth
     */
    async humanClick(selector) {
        const element = await this.page.waitForSelector(selector);
        const box = await element.boundingBox();

        if (box) {
            // Bezier curve mouse movement
            const targetX = box.x + box.width / 2;
            const targetY = box.y + box.height / 2;

            await this.moveMouseIntelligently(targetX, targetY);

            // Gaussian click delay
            await this.sleep(this.gaussianRandom(200, 500));
            await this.page.click(selector);
        }
    }

    /**
     * Simulate random movement curves
     */
    async moveMouseIntelligently(x, y) {
        // Simple linear movement for now, can be upgraded to Bezier
        await this.page.mouse.move(x, y, { steps: 25 });
    }

    /**
     * Self-healing logic for failures
     */
    async handleError(error, context) {
        logger.error(`⚠️ Self-Healing Triggered: Automation failed during "${context}"`, error);

        const timestamp = new Date().getTime();
        await this.page.screenshot({ path: `${this.errorSnapshotPath}error_${timestamp}.png` });

        logger.info('🔄 Attempting recovery strategy (Refresh & Retry)...');
        await this.page.reload({ waitUntil: 'networkidle' });

        // Wait and see if we can try again or if the state changed
        await this.sleep(2000);

        return false; // Let the controller decide whether to final exit or try something else
    }

    /**
     * Utilities
     */
    gaussianRandom(min, max) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        num = num / 10.0 + 0.5;
        if (num > 1 || num < 0) return this.gaussianRandom(min, max);
        return num * (max - min) + min;
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default SmartNavigator;
