const truffleAssert = require('truffle-assertions');
const core = artifacts.require("alpha_core");
const metrics = artifacts.require("alpha_metrics");
const daiABI = require('../../interfaces/dai');
const daiAddress = '0xC4375B7De8af5a38a93548eb8453a498222C4fF2';
const daiContract = new web3.eth.Contract(daiABI, daiAddress);
const bigUint = '100000000000000000000000000'

contract("Greenwood Alpha - openReceiveFixedSwap", async accounts => {
    it("should open a receive fixed swap for msg.sender", async () => {
        const coreInstance = await core.deployed();
        const metricInstance = await metrics.deployed();

        const preContractState = await coreInstance.getState.call();
        const preBalance = await daiContract.methods.balanceOf(coreInstance.address).call();
        const preSwapNumbers = await coreInstance.swapNumbers.call(accounts[0]);

        await daiContract.methods.approve(coreInstance.address, bigUint).send({from: accounts[0]});
        await coreInstance.addLiquidity('10000000000000000');
        await metricInstance.setContract(coreInstance.address);
        await coreInstance.openSwap('100000000000000000000', 'rFix');

        const postContractState = await coreInstance.getState.call();
        const postBalance = await daiContract.methods.balanceOf(coreInstance.address).call();
        const swap = await coreInstance.getSwap.call('0x39baecaf5bd17f64134b2a16e006f0bd6cdc0cc65fc4a62f97cde8db03bc44b2');
        const swapType = await coreInstance.getSwapType.call('0x39baecaf5bd17f64134b2a16e006f0bd6cdc0cc65fc4a62f97cde8db03bc44b2');
        const postSwapNumbers = await coreInstance.swapNumbers.call(accounts[0]);

        assert.notEqual(preContractState.avgFixedRatePaying.toString(), postContractState.avgFixedRatePaying.toString(), 'avgFixedRateReceiving before should not equal avgFixedRateReceiving after');
        assert.notEqual(preContractState.fixedToPay.toString(), postContractState.fixedToPay.toString(), 'fixedToReceive before should not equal fixedToReceive after');
        assert.notEqual(preBalance.toString(), postBalance.toString(), 'balance before should not equal balance after');
        assert.notEqual('', swapType.toString(), 'swapType before should not equal swapType after');
        assert.equal('rFix', swapType.toString(), 'swapType should equal rFix');
        assert.notEqual('0', swap.notional.toString(), 'swap notional before should not equal swap notional after');
        assert.notEqual('0', swap.initTime.toString(), 'swap init time before should not equal swap init time after');
        assert.notEqual('0', swap.swapRate.toString(), 'swap rate before should not equal swap rate after');
        assert.notEqual('0', swap.initIndex.toString(), 'swap init index before should not equal swap init index after');
        assert.notEqual('0', swap.userCollateral.toString(), 'swap collateral before should not equal swap collateral after');
        assert.notEqual(true, swap.isClosed, 'swap isClosed bool should not be true');
        assert.notEqual(preSwapNumbers.toString(), postSwapNumbers.toString(), 'swap numbers before should not equal swap numbers after');
    });

    it("should not open a receive fixed swap for msg.sender because the contract is paused", async () => {
        const coreInstance = await core.deployed();

        await coreInstance.updateModel('1820175952', '20000000000', '750000', '10000000', '30000000', '1567223044', '700000000000', '20000000000','0', '2400000000', '120', true, false);
        await truffleAssert.fails(coreInstance.openSwap('100000000000000000000', 'rFix'), truffleAssert.ErrorType.REVERT);
        await coreInstance.updateModel('1820175952', '20000000000', '750000', '10000000', '30000000', '1567223044', '700000000000', '20000000000','0', '2400000000', '120', false, false);
    });

    it("should not open a receive fixed swap for msg.sender because the swap notional is 0", async () => {
        const coreInstance = await core.deployed();
        await truffleAssert.fails(coreInstance.openSwap('0', 'rFix'), truffleAssert.ErrorType.REVERT);
    }); 
});
