import { expect } from "chai";
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('data/test.json').toString());

describe("Testing of https://www.douglas.de application", () => {
    it("Launch app", async()=>{
        await browser.maximizeWindow();
        await browser.url('https://www.douglas.de/de');

        expect(await browser.getTitle()).to.equal("Online-Parfümerie ✔️ Parfum & Kosmetik kaufen | DOUGLAS");
        await browser.takeScreenshot();

        let shadowRoot = await browser.$(`//div[@id='usercentrics-root']`);
        let agreeButton = await shadowRoot.shadow$(`.eIFzaz`);
        await agreeButton.click();
    })
    for (const datum of data) {
        it(datum.name, async () => {

            await browser.$(`//li/a[normalize-space(text()) = "${datum.Navigation_Link}"]`).click();
            await sleep(5000);
            try {
                await browser.$('//div[@class="navigation-backdrop__content"]').moveTo(100, 100);
            } catch (_) { }
            for (const filterParam of Object.keys(datum.data)) {
                let filterData = datum.data[filterParam];
                if (!Array.isArray(filterData)) {
                    filterData = [filterData];
                }
                for (const fd of filterData) {
                    await browser.$(`//div[contains(@class,"facet-wrapper")]//div[@class="facet__title" and normalize-space(text()) = "${filterParam}"]`).click();
                    await browser.$(`//div[contains(@class,"facet-wrapper")]//div[normalize-space(text()) = "${filterParam}" and @class="facet__title"]/parent::div[@class="facet facet--open"]//div[@class="facet-option__label"]/div[normalize-space(text()) = '${fd}']/ancestor::a[@role="checkbox"]`).click();
                    await sleep(1500);
                    
                }
            }

            await sleep(7000);
            var count :string = await browser.$("//div[@class='product-overview__headline-wrapper']").getText();
            console.log(count);
            await sleep(1000);
            await browser.takeScreenshot();
        });

    }
});


function sleep(n: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            return resolve(true);
        }, n);
    })
}

function clickOnElement(locator: string, timeoutInms: number) {
    it("click on the object", async()=>{
        try {
            console.log(locator);
            await browser.$(locator).waitForClickable({ timeout: $(timeoutInms) });
            await browser.$(locator).click();
        } catch (error) {
            console.log("click step failed with error" + error)
        }
        
    })
}
