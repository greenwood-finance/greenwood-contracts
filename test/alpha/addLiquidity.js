const truffleAssert = require('truffle-assertions');
const core = artifacts.require("alpha_core");
const daiABI = require('../../interfaces/dai');
const daiAddress = '0xC4375B7De8af5a38a93548eb8453a498222C4fF2';
const daiContract = new web3.eth.Contract(daiABI, daiAddress);
const bigUint = '100000000000000000000000000'


contract("Greenwood Alpha - addLiquidity", async accounts => {
    it("should add liquidity to the liquidity account of msg.sender", async () => {
        const coreInstance = await core.deployed();
        const preliquidityAccount = await coreInstance.getAccount.call(accounts[0]);
        const preContractState = await coreInstance.getState.call();

        await daiContract.methods.approve(coreInstance.address, bigUint).send({from: accounts[0]});
        await coreInstance.addLiquidity('10000000000000000');

        const postLiquidityAccount = await coreInstance.getAccount.call(accounts[0]);
        const postContractState = await coreInstance.getState.call();

        assert.notEqual(preliquidityAccount.amount.toString(), postLiquidityAccount.amount.toString(), 'Amount before should not equal amount after');
        assert.notEqual(preliquidityAccount.lastDepositTime.toString(), postLiquidityAccount.lastDepositTime.toString(), 'lastDepositTime before should not equal lastDepositTime after');
        assert.notEqual(preContractState.totalLiquidity.toString(), postContractState.totalLiquidity.toString(), 'totalLiquidity before should not equal totalLiquidity after');
        assert.notEqual(preContractState.totalDeposits.toString(), postContractState.totalDeposits.toString(), 'totalDeposits before should not equal totalDeposits after');
    });

    it("should not add liquidity to the liquidity account of msg.sender because the contract is paused", async () => {
        const coreInstance = await core.deployed();

        await coreInstance.updateModel('1820175952', '20000000000', '750000', '10000000', '30000000', '1567223044', '700000000000', '20000000000','0', '2400000000', '120', true, false);
        await truffleAssert.fails(coreInstance.addLiquidity('10000000000000000'), truffleAssert.ErrorType.REVERT);
        await coreInstance.updateModel('1820175952', '20000000000', '750000', '10000000', '30000000', '1567223044', '700000000000', '20000000000','0', '2400000000', '120', false, false);
    });

    it("should not add liquidity to the liquidity account of msg.sender because the deposit amount is 0", async () => {
        const coreInstance = await core.deployed();
        await truffleAssert.fails(coreInstance.addLiquidity('0'), truffleAssert.ErrorType.REVERT);
    });

    it("should not add liquidity to the liquidity account of msg.sender because the sender does not have enough token", async () => {
        const coreInstance = await core.deployed();
        await truffleAssert.fails(coreInstance.addLiquidity('1000000000000000000000000'), truffleAssert.ErrorType.REVERT);
    });
});
