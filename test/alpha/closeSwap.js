const truffleAssert = require('truffle-assertions');
const core = artifacts.require("alpha_core");
const metrics = artifacts.require("alpha_metrics");
const daiABI = require('../../interfaces/dai');
const daiAddress = '0xC4375B7De8af5a38a93548eb8453a498222C4fF2';
const daiContract = new web3.eth.Contract(daiABI, daiAddress);
const bigUint = '100000000000000000000000000'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

contract('Greenwood Alpha - closeSwap', async accounts => {
    it('should close a pay fixed swap', async () => {
        const coreInstance = await core.deployed();
        const metricInstance = await metrics.deployed();

        await daiContract.methods.approve(coreInstance.address, bigUint).send({from: accounts[0]});
        await coreInstance.addLiquidity('10000000000000000');
        await metricInstance.setContract(coreInstance.address);

        await coreInstance.openSwap('100000000000000000000', 'pFix');
        const preSwap = await coreInstance.getSwap.call('0x39baecaf5bd17f64134b2a16e006f0bd6cdc0cc65fc4a62f97cde8db03bc44b2');

        await sleep(120000);

        await coreInstance.closeSwap('0x39baecaf5bd17f64134b2a16e006f0bd6cdc0cc65fc4a62f97cde8db03bc44b2');
        const postSwap = await coreInstance.getSwap.call('0x39baecaf5bd17f64134b2a16e006f0bd6cdc0cc65fc4a62f97cde8db03bc44b2');

        assert.equal(preSwap.isClosed, false, 'isClosed before should be false');
        assert.equal(postSwap.isClosed, true, 'isClosed after should be true');
        assert.notEqual(preSwap.isClosed, postSwap.isClosed, 'isClosed before should not equal to isClosed after');
    });

    it("should not close a pay fixed swap because the swap has not expired", async () => {
        const coreInstance = await core.deployed();

        await daiContract.methods.approve(coreInstance.address, bigUint).send({from: accounts[0]});
        await coreInstance.addLiquidity('10000000000000000');

        await coreInstance.openSwap('100000000000000000000', 'pFix');
        await truffleAssert.fails(coreInstance.closeSwap('0x024385817f82f2ec91ad4de6df86bc8c6d733f00539b76d0bab8bb577ee28db0'), truffleAssert.ErrorType.REVERT);
    });

    it("should close a pay fixed swap and return the user collateral because the admin override is activated", async () => {
        const coreInstance = await core.deployed();

        await daiContract.methods.approve(coreInstance.address, bigUint).send({from: accounts[0]});
        await coreInstance.addLiquidity('10000000000000000');
        let preBalance = await daiContract.methods.balanceOf(accounts[0]).call();

        await coreInstance.openSwap('100000000000000000000', 'pFix');

        await coreInstance.updateModel('1820175952', '20000000000', '750000', '10000000', '30000000', '1567223044', '700000000000', '20000000000','0', '2400000000', '120', false, true);

        await sleep(120000);

        await coreInstance.closeSwap('0x78a1922aa970df6746bb1ad338f07d9b8ad812d194ae0061409a67e1e322a8cd');
        const postBalance = await daiContract.methods.balanceOf(accounts[0]).call();

        assert.equal(preBalance.toString(), postBalance.toString(), 'balance before should equal balance after up to contract precision');
    });
});
