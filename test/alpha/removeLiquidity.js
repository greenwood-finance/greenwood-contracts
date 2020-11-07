const truffleAssert = require('truffle-assertions');
const core = artifacts.require("alpha_core");
const daiABI = require('../../interfaces/dai');
const daiAddress = '0xC4375B7De8af5a38a93548eb8453a498222C4fF2';
const daiContract = new web3.eth.Contract(daiABI, daiAddress);
const bigUint = '100000000000000000000000000'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

contract("Greenwood Alpha - removeLiquidity", async accounts => {
    it("should remove liquidity from the liquidity account of msg.sender", async () => {
        const coreInstance = await core.deployed();
        const preliquidityAccount = await coreInstance.getAccount.call(accounts[0]);
        const preContractState = await coreInstance.getState.call();

        await daiContract.methods.approve(coreInstance.address, bigUint).send({from: accounts[0]});
        await coreInstance.addLiquidity('10000000000000000');
        await sleep(60000);
        await coreInstance.removeLiquidity('10000000000000000');

        const postLiquidityAccount = await coreInstance.getAccount.call(accounts[0]);
        const postContractState = await coreInstance.getState.call();

        assert.equal(preliquidityAccount.amount.toString(), postLiquidityAccount.amount.toString(), 'Amount before should equal amount after');
        assert.equal(preContractState.totalLiquidity.toString(), postContractState.totalLiquidity.toString(), 'totalLiquidity before should  equal totalLiquidity after');
        assert.equal(preContractState.totalDeposits.toString(), postContractState.totalDeposits.toString(), 'totalDeposits before should  equal totalDeposits after');
        assert.notEqual(preliquidityAccount.lastDepositTime.toString(), postLiquidityAccount.lastDepositTime.toString(), 'lastDepositTime before should not equal lastDepositTime after');
    });

    it("should not remove liquidity from the liquidity account of msg.sender because the withdraw amount is 0", async () => {
        const coreInstance = await core.deployed();
        await coreInstance.addLiquidity('10000000000000000');
        await sleep(60000);
        await truffleAssert.fails(coreInstance.removeLiquidity('0'), truffleAssert.ErrorType.REVERT);
        await coreInstance.removeLiquidity('10000000000000000');
    });

    it("should not remove liquidity from the liquidity account of msg.sender because the min deposit time has not been met", async () => {
        const coreInstance = await core.deployed();
        await coreInstance.addLiquidity('10000000000000000');
        await truffleAssert.fails(coreInstance.removeLiquidity('10000000000000000'), truffleAssert.ErrorType.REVERT);
    });
});