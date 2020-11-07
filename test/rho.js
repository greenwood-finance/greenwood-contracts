const core = artifacts.require("v0.1.0_core");

const logState = async( testCase, state, liquidityAccount, swap, swapType ) => {
    const modelShift = 0.0000000001
    const PRECISION = 1000000000000000000
    console.log( '----------' );
    console.log( `|  ${testCase}` );
    console.log( '----------' );
    console.log('|  ADMIN: ', state.admin);
    console.log('|  MANTISSA: ', (Number(state.mantissa) * modelShift).toFixed(10));
    console.log('|  YOFFSET: ', (Number(state.yOffset) * modelShift).toFixed(10));
    console.log('|  SLOPE FACTOR: ', (Number(state.slopeFactor) * modelShift).toFixed(10));
    console.log('|  RATE FACTOR SENSITIVITY: ', (Number(state.rateFactorSensitivity) * modelShift).toFixed(10));
    console.log('|  FEE BASE: ', (Number(state.feeBase) * modelShift).toFixed(10));
    console.log('|  FEE SENSITIVITY: ', (Number(state.feeSensitivity) * modelShift).toFixed(10));
    console.log('|  RATE RANGE: ', (Number(state.rateRange) * modelShift).toFixed(10));
    console.log('|  MIN PAYOUT RATE: ', (Number(state.minPayoutRate) * modelShift).toFixed(10));
    console.log('|  MAX PAYOUT RATE: ', (Number(state.maxPayoutRate) * modelShift).toFixed(10));
    console.log('|  RATE FACTOR: ', (Number(state.rateFactor) * modelShift).toFixed(10));
    console.log('|  LAST CHECKPOINT TIME: ', (Number(state.lastCheckpointTime) * modelShift).toFixed(10));
    console.log('|  AVG FIXED RATE RECEIVING: ', (Number(state.avgFixedRateReceiving) * modelShift).toFixed(10));
    console.log('|  NOTIONAL RECEIVING FIXED: ', (Number(state.notionalReceivingFixed) * modelShift).toFixed(10));
    console.log('|  AVG FIXED RATE PAYING: ', (Number(state.avgFixedRatePaying) * modelShift).toFixed(10));
    console.log('|  NOTIONAL PAYING FIXED: ', (Number(state.notionalPayingFixed) * modelShift).toFixed(10));
    console.log('|  NOTIONAL PAYING FLOAT: ', (Number(state.notionalPayingFloat) * modelShift).toFixed(10));
    console.log('|  LAST FLOAT INDEX: ', (Number(state.lastFloatIndex) / PRECISION).toFixed(10));
    console.log('|  NOTIONAL RECEIVING FLOAT: ', (Number(state.notionalReceivingFloat) * modelShift).toFixed(10));
    console.log('|  TOTAL LIQUIDITY: ', (Number(state.totalLiquidity) * modelShift).toFixed(10));
    console.log('|  FIXED TO PAY: ', (Number(state.fixedToPay) * modelShift).toFixed(10));
    console.log('|  FIXED TO RECEIVE: ', (Number(state.fixedToReceive) * modelShift).toFixed(10));
    console.log('|  SUPPLY INDEX: ', (Number(state.supplyIndex) * modelShift).toFixed(10));
    console.log('|  NOTIONAL DAYS PAYING FLOAT: ',(Number(state.notionalDaysPayingFloat) * modelShift).toFixed(10));
    console.log('|  NOTIONAL DAYS RECEIVING FLOAT: ', (Number(state.notionalDaysReceivingFloat) * modelShift).toFixed(10));
    console.log('|  ACTIVE COLLATERAL: ', (Number(state.activeCollateral) * modelShift).toFixed(10));
    console.log('|  SWAP DURATION: ', (Number(state.swapDuration) * modelShift).toFixed(10));
    console.log('|  ORDER NUMBER: ', (Number(state.orderNumber)).toFixed(10));
    console.log( '----------' );
    console.log('|  LIQUIDITY ACCOUNT - AMOUNT: ', liquidityAccount && liquidityAccount.amount ? (Number(liquidityAccount.amount) * modelShift).toFixed(10) : 'NO LIQUIDITY ACCOUNT DATA')
    console.log('|  LIQUIDITY ACCOUNT - LAST DEPOSIT TIME: ', liquidityAccount && liquidityAccount.lastDepositTime ? (Number(liquidityAccount.lastDepositTime) * modelShift).toFixed(10): 'NO LIQUIDITY ACCOUNT DATA')
    console.log('|  LIQUIDITY ACCOUNT - DEPOSIT SUPPLY INDEX: ', liquidityAccount && liquidityAccount.depositSupplyIndex ? (Number(liquidityAccount.depositSupplyIndex) * modelShift).toFixed(10): 'NO LIQUIDITY ACCOUNT DATA')
    console.log( '----------' );
    console.log('|  SWAP - TYPE: ', swapType ? swapType : 'NO SWAP DATA');
    console.log('|  SWAP - NOTIONAL: ', swap && swap.notional ? (Number(swap.notional) * modelShift).toFixed(10) : 'NO SWAP DATA');
    console.log('|  SWAP - INIT TIME: ', swap && swap.initTime ? (Number(swap.initTime) * modelShift).toFixed(10): 'NO SWAP DATA');
    console.log('|  SWAP - SWAP RATE: ', swap && swap.swapRate ? (Number(swap.swapRate) * modelShift).toFixed(10): 'NO SWAP DATA');
    console.log('|  SWAP - INIT INDEX: ', swap && swap.initIndex ? (Number(swap.initIndex) * modelShift).toFixed(10): 'NO SWAP DATA');
    console.log('|  SWAP - USER COLLATERAL: ', swap && swap.userCollateral ? (Number(swap.userCollateral) * modelShift).toFixed(10): 'NO SWAP DATA');
}

contract("Greenwood Core – Spreadsheet case", async accounts => {
    const modelShift = 0.0000000001
    const PRECISION = 1000000000000000000
    it("should deploy the contract and set the initial vars", async () => {
        const instance = await core.deployed();
        const state = await instance.getState.call();

        // await logState( 'CONTRACT DEPLOYMENT', state);

        assert.equal(state.admin, accounts[0], 'The admin address for the contract is incorrect');
        assert.equal(Number((Number(state.mantissa) * modelShift).toFixed(10)), 1000000000000000000, 'The mantissa for the contract is incorrect');
        assert.equal(Number((Number(state.yOffset) * modelShift).toFixed(10)), 0.16, 'The yOffset for the contract is incorrect');
        assert.equal(Number((Number(state.slopeFactor) * modelShift).toFixed(10)), 2, 'The slopeFactor for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactorSensitivity) * modelShift).toFixed(10)), 0.000075, 'The rateFactorSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.feeBase) * modelShift).toFixed(10)), 0.001, 'The feeBase for the contract is incorrect');
        assert.equal(Number((Number(state.feeSensitivity) * modelShift).toFixed(10)), 0.003, 'The feeSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.rateRange) * modelShift).toFixed(10)), 0.085, 'The rateRange for the contract is incorrect');
        assert.equal(Number((Number(state.minPayoutRate) * modelShift).toFixed(10)), 0.08, 'The minPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.maxPayoutRate) * modelShift).toFixed(10)), 0.24, 'The maxPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactor) * modelShift).toFixed(10)), 0, 'The rateFactor for the contract is incorrect');
        assert.equal(parseInt(Number(state.lastCheckpointTime) * modelShift), 1601539200, 'The lastCheckpointTime for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRateReceiving) * modelShift).toFixed(10)), 0, 'The avgFixedRateReceiving for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFixed) * modelShift).toFixed(10)), 0, 'The notionalReceivingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRatePaying) * modelShift).toFixed(10)), 0, 'The avgFixedRatePaying for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFixed) * modelShift).toFixed(10)), 0, 'The notionalPayingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFloat) * modelShift).toFixed(10)), 0, 'The notionalPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.lastFloatIndex) / PRECISION).toFixed(10)), 1, 'The lastFloatIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFloat) * modelShift).toFixed(10)), 0, 'The notionalReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.totalLiquidity) * modelShift).toFixed(10)), 0, 'The totalLiquidity for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToPay) * modelShift).toFixed(10)), 0, 'The fixedToPay for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToReceive) * modelShift).toFixed(10)), 0, 'The fixedToReceive for the contract is incorrect');
        assert.equal(Number((Number(state.supplyIndex) * modelShift).toFixed(10)), 1, 'The supplyIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysPayingFloat) * modelShift).toFixed(10)), 0, 'The notionalDaysPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysReceivingFloat) * modelShift).toFixed(10)), 0, 'The notionalDaysReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.activeCollateral) * modelShift).toFixed(10)), 0, 'The activeCollateral for the contract is incorrect');
        assert.equal(Number((Number(state.swapDuration) * modelShift).toFixed(10)), 90, 'The swapDuration for the contract is incorrect');
        assert.equal(Number((Number(state.orderNumber)).toFixed(10)), 1, 'The orderNumber for the contract is incorrect');
    });

    it("should add liquidity to the liquidity account of msg.sender", async () => {
        const instance = await core.deployed();
        await instance.addLiquidity('100000000000000000000', 1609315200, '1000000000000000000');
        const state = await instance.getState.call();
        const liquidityAccount = await instance.getAccount.call(accounts[0]);

        // await logState( 'ADD LIQUIDITY', state, liquidityAccount);
    
        assert.equal(state.admin, accounts[0], 'The admin address for the contract is incorrect');
        assert.equal(Number((Number(state.mantissa) * modelShift).toFixed(10)), 1000000000000000000, 'The mantissa for the contract is incorrect');
        assert.equal(Number((Number(state.yOffset) * modelShift).toFixed(10)), 0.16, 'The yOffset for the contract is incorrect');
        assert.equal(Number((Number(state.slopeFactor) * modelShift).toFixed(10)), 2, 'The slopeFactor for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactorSensitivity) * modelShift).toFixed(10)), 0.000075, 'The rateFactorSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.feeBase) * modelShift).toFixed(10)), 0.001, 'The feeBase for the contract is incorrect');
        assert.equal(Number((Number(state.feeSensitivity) * modelShift).toFixed(10)), 0.003, 'The feeSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.rateRange) * modelShift).toFixed(10)), 0.085, 'The rateRange for the contract is incorrect');
        assert.equal(Number((Number(state.minPayoutRate) * modelShift).toFixed(10)), 0.08, 'The minPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.maxPayoutRate) * modelShift).toFixed(10)), 0.24, 'The maxPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactor) * modelShift).toFixed(10)), 0, 'The rateFactor for the contract is incorrect');
        assert.equal(parseInt(Number(state.lastCheckpointTime) * modelShift), 1609315200, 'The lastCheckpointTime for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRateReceiving) * modelShift).toFixed(10)), 0, 'The avgFixedRateReceiving for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFixed) * modelShift).toFixed(10)), 0, 'The notionalReceivingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRatePaying) * modelShift).toFixed(10)), 0, 'The avgFixedRatePaying for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFixed) * modelShift).toFixed(10)), 0, 'The notionalPayingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFloat) * modelShift).toFixed(10)), 0, 'The notionalPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.lastFloatIndex) / PRECISION).toFixed(10)), 1, 'The lastFloatIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFloat) * modelShift).toFixed(10)), 0, 'The notionalReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.totalLiquidity) * modelShift).toFixed(10)), 100, 'The totalLiquidity for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToPay) * modelShift).toFixed(10)), 0, 'The fixedToPay for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToReceive) * modelShift).toFixed(10)), 0, 'The fixedToReceive for the contract is incorrect');
        assert.equal(Number((Number(state.supplyIndex) * modelShift).toFixed(10)), 1, 'The supplyIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysPayingFloat) * modelShift).toFixed(10)), 0, 'The notionalDaysPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysReceivingFloat) * modelShift).toFixed(10)), 0, 'The notionalDaysReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.activeCollateral) * modelShift).toFixed(10)), 0, 'The activeCollateral for the contract is incorrect');
        assert.equal(Number((Number(state.swapDuration) * modelShift).toFixed(10)), 90, 'The swapDuration for the contract is incorrect');
        assert.equal(Number((Number(state.orderNumber)).toFixed(10)), 1, 'The orderNumber for the contract is incorrect');
        
        assert.equal(Number((Number(liquidityAccount.amount) * modelShift).toFixed(10)), 100, 'The amount for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.lastDepositTime) * modelShift).toFixed(10)), 1609315200, 'The lastDepositTime for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.depositSupplyIndex) * modelShift).toFixed(10)), 1, 'The depositSupplyIndex for the liquidityAccount is incorrect'); 
    });

    it("should open a payFixed swap using the account of msg.sender", async () => {
        const instance = await core.deployed();
        await instance.openPayFixedSwap('1000', 1609315200, '1000000000000000000');
        const state = await instance.getState.call();
        const liquidityAccount = await instance.getAccount.call(accounts[0]);
        const swap = await instance.getSwap.call(state.orderNumber - 1);
        const swapType = await instance.getSwapType.call(state.orderNumber - 1); 
        
        // await logState( 'OPEN PAY FIXED 1', state, liquidityAccount, swap, swapType);

        assert.equal(state.admin, accounts[0], 'The admin address for the contract is incorrect');
        assert.equal(Number((Number(state.mantissa) * modelShift).toFixed(10)), 1000000000000000000, 'The mantissa for the contract is incorrect');
        assert.equal(Number((Number(state.yOffset) * modelShift).toFixed(10)), 0.16, 'The yOffset for the contract is incorrect');
        assert.equal(Number((Number(state.slopeFactor) * modelShift).toFixed(10)), 2, 'The slopeFactor for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactorSensitivity) * modelShift).toFixed(10)), 0.000075, 'The rateFactorSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.feeBase) * modelShift).toFixed(10)), 0.001, 'The feeBase for the contract is incorrect');
        assert.equal(Number((Number(state.feeSensitivity) * modelShift).toFixed(10)), 0.003, 'The feeSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.rateRange) * modelShift).toFixed(10)), 0.085, 'The rateRange for the contract is incorrect');
        assert.equal(Number((Number(state.minPayoutRate) * modelShift).toFixed(10)), 0.08, 'The minPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.maxPayoutRate) * modelShift).toFixed(10)), 0.24, 'The maxPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactor) * modelShift).toFixed(10)), 0.0675, 'The rateFactor for the contract is incorrect');
        assert.equal(parseInt(Number(state.lastCheckpointTime) * modelShift), 1609315200, 'The lastCheckpointTime for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRateReceiving) * modelShift).toFixed(10)), 0.1650524118, 'The avgFixedRateReceiving for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFixed) * modelShift).toFixed(10)), 1000, 'The notionalReceivingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRatePaying) * modelShift).toFixed(10)), 0, 'The avgFixedRatePaying for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFixed) * modelShift).toFixed(10)), 0, 'The notionalPayingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFloat) * modelShift).toFixed(10)), 1000, 'The notionalPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.lastFloatIndex) / PRECISION).toFixed(10)), 1, 'The lastFloatIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFloat) * modelShift).toFixed(10)), 0, 'The notionalReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.totalLiquidity) * modelShift).toFixed(10)), 100, 'The totalLiquidity for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToPay) * modelShift).toFixed(10)), 0, 'The fixedToPay for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToReceive) * modelShift).toFixed(10)), 41.26310295, 'The fixedToReceive for the contract is incorrect');
        assert.equal(Number((Number(state.supplyIndex) * modelShift).toFixed(10)), 1, 'The supplyIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysPayingFloat) * modelShift).toFixed(10)), 90000, 'The notionalDaysPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysReceivingFloat) * modelShift).toFixed(10)), 0, 'The notionalDaysReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.activeCollateral) * modelShift).toFixed(10)), 0, 'The activeCollateral for the contract is incorrect');
        assert.equal(Number((Number(state.swapDuration) * modelShift).toFixed(10)), 90, 'The swapDuration for the contract is incorrect');
        assert.equal(Number((Number(state.orderNumber)).toFixed(10)), 2, 'The orderNumber for the contract is incorrect');
        
        assert.equal(Number((Number(liquidityAccount.amount) * modelShift).toFixed(10)), 100, 'The amount for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.lastDepositTime) * modelShift).toFixed(10)), 1609315200, 'The lastDepositTime for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.depositSupplyIndex) * modelShift).toFixed(10)), 1, 'The depositSupplyIndex for the liquidityAccount is incorrect');
        
        assert.equal(swapType, 'pFix', 'The swapType for the swap is incorrect');
        assert.equal(Number((Number(swap.notional) * modelShift).toFixed(10)), 1000, 'The  notional for the swap is incorrect');
        assert.equal(Number((Number(swap.swapRate) * modelShift).toFixed(10)), 0.1650524118, 'The  swapRate for the swap is incorrect');
        assert.equal(Number((Number(swap.initIndex) * modelShift).toFixed(10)), 1, 'The  initIndex for the swap is incorrect');
        assert.equal(Number((Number(swap.userCollateral) * modelShift).toFixed(10)), 21.26310295, 'The  userCollateral for the swap is incorrect');
        assert.equal(Number((Number(swap.initTime) * modelShift).toFixed(10)), 1609315200, 'The  initTime for the swap is incorrect');
    });

    it("should open a receiveFixed swap using the account of msg.sender", async () => {
        const instance = await core.deployed();
        await instance.openReceiveFixedSwap('1500', 1611907200, '1010000000000000000');
        const state = await instance.getState.call();
        const liquidityAccount = await instance.getAccount.call(accounts[0]);
        const swap = await instance.getSwap.call(state.orderNumber - 1);
        const swapType = await instance.getSwapType.call(state.orderNumber - 1); 
        
        // await logState( 'OPEN RECEIVE FIXED 1', state, liquidityAccount, swap, swapType);

        assert.equal(state.admin, accounts[0], 'The admin address for the contract is incorrect');
        assert.equal(Number((Number(state.mantissa) * modelShift).toFixed(10)), 1000000000000000000, 'The mantissa for the contract is incorrect');
        assert.equal(Number((Number(state.yOffset) * modelShift).toFixed(10)), 0.16, 'The yOffset for the contract is incorrect');
        assert.equal(Number((Number(state.slopeFactor) * modelShift).toFixed(10)), 2, 'The slopeFactor for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactorSensitivity) * modelShift).toFixed(10)), 0.000075, 'The rateFactorSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.feeBase) * modelShift).toFixed(10)), 0.001, 'The feeBase for the contract is incorrect');
        assert.equal(Number((Number(state.feeSensitivity) * modelShift).toFixed(10)), 0.003, 'The feeSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.rateRange) * modelShift).toFixed(10)), 0.085, 'The rateRange for the contract is incorrect');
        assert.equal(Number((Number(state.minPayoutRate) * modelShift).toFixed(10)), 0.08, 'The minPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.maxPayoutRate) * modelShift).toFixed(10)), 0.24, 'The maxPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactor) * modelShift).toFixed(10)), -0.0300862532, 'The rateFactor for the contract is incorrect');
        assert.equal(parseInt(Number(state.lastCheckpointTime) * modelShift), 1611907200, 'The lastCheckpointTime for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRateReceiving) * modelShift).toFixed(10)), 0.1650524118, 'The avgFixedRateReceiving for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFixed) * modelShift).toFixed(10)), 1000, 'The notionalReceivingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRatePaying) * modelShift).toFixed(10)), 0.1568309248, 'The avgFixedRatePaying for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFixed) * modelShift).toFixed(10)), 1500, 'The notionalPayingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFloat) * modelShift).toFixed(10)), 1010, 'The notionalPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.lastFloatIndex) / PRECISION).toFixed(10)), 1.01, 'The lastFloatIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFloat) * modelShift).toFixed(10)), 1500, 'The notionalReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.totalLiquidity) * modelShift).toFixed(10)), 103.75436765, 'The totalLiquidity for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToPay) * modelShift).toFixed(10)), 58.8115968, 'The fixedToPay for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToReceive) * modelShift).toFixed(10)), 27.5087353, 'The fixedToReceive for the contract is incorrect');
        assert.equal(Number((Number(state.supplyIndex) * modelShift).toFixed(10)), 1.0375436765, 'The supplyIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysPayingFloat) * modelShift).toFixed(10)), 60000, 'The notionalDaysPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysReceivingFloat) * modelShift).toFixed(10)), 135000, 'The notionalDaysReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.activeCollateral) * modelShift).toFixed(10)), 12.4912647, 'The activeCollateral for the contract is incorrect');
        assert.equal(Number((Number(state.swapDuration) * modelShift).toFixed(10)), 90, 'The swapDuration for the contract is incorrect');
        assert.equal(Number((Number(state.orderNumber)).toFixed(10)), 3, 'The orderNumber for the contract is incorrect');
        
        assert.equal(Number((Number(liquidityAccount.amount) * modelShift).toFixed(10)), 100, 'The amount for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.lastDepositTime) * modelShift).toFixed(10)), 1609315200, 'The lastDepositTime for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.depositSupplyIndex) * modelShift).toFixed(10)), 1, 'The depositSupplyIndex for the liquidityAccount is incorrect');
        
        assert.equal(swapType, 'rFix', 'The swapType for the swap is incorrect');
        assert.equal(Number((Number(swap.notional) * modelShift).toFixed(10)), 1500, 'The  notional for the swap is incorrect');
        assert.equal(Number((Number(swap.swapRate) * modelShift).toFixed(10)), 0.1568309248, 'The  swapRate for the swap is incorrect');
        assert.equal(Number((Number(swap.initIndex) * modelShift).toFixed(10)), 1.01, 'The  initIndex for the swap is incorrect');
        assert.equal(Number((Number(swap.userCollateral) * modelShift).toFixed(10)), 31.1884032, 'The  userCollateral for the swap is incorrect');
        assert.equal(Number((Number(swap.initTime) * modelShift).toFixed(10)), 1611907200, 'The  initTime for the swap is incorrect');
    });

    it("should open a payFixed swap using the account of msg.sender", async () => {
        const instance = await core.deployed();
        await instance.openPayFixedSwap('1000', 1614499200, '1021783333333333333');
        const state = await instance.getState.call();
        const liquidityAccount = await instance.getAccount.call(accounts[0]);
        const swap = await instance.getSwap.call(state.orderNumber - 1);
        const swapType = await instance.getSwapType.call(state.orderNumber - 1); 
        
        // await logState( 'OPEN PAY FIXED 2', state, liquidityAccount, swap, swapType);

        assert.equal(state.admin, accounts[0], 'The admin address for the contract is incorrect');
        assert.equal(Number((Number(state.mantissa) * modelShift).toFixed(10)), 1000000000000000000, 'The mantissa for the contract is incorrect');
        assert.equal(Number((Number(state.yOffset) * modelShift).toFixed(10)), 0.16, 'The yOffset for the contract is incorrect');
        assert.equal(Number((Number(state.slopeFactor) * modelShift).toFixed(10)), 2, 'The slopeFactor for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactorSensitivity) * modelShift).toFixed(10)), 0.000075, 'The rateFactorSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.feeBase) * modelShift).toFixed(10)), 0.001, 'The feeBase for the contract is incorrect');
        assert.equal(Number((Number(state.feeSensitivity) * modelShift).toFixed(10)), 0.003, 'The feeSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.rateRange) * modelShift).toFixed(10)), 0.085, 'The rateRange for the contract is incorrect');
        assert.equal(Number((Number(state.minPayoutRate) * modelShift).toFixed(10)), 0.08, 'The minPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.maxPayoutRate) * modelShift).toFixed(10)), 0.24, 'The maxPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactor) * modelShift).toFixed(10)), 0.0350546454, 'The rateFactor for the contract is incorrect');
        assert.equal(parseInt(Number(state.lastCheckpointTime) * modelShift), 1614499200, 'The lastCheckpointTime for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRateReceiving) * modelShift).toFixed(10)), 0.1644478025, 'The avgFixedRateReceiving for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFixed) * modelShift).toFixed(10)), 2000, 'The notionalReceivingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRatePaying) * modelShift).toFixed(10)), 0.1568309248, 'The avgFixedRatePaying for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFixed) * modelShift).toFixed(10)), 1500, 'The notionalPayingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFloat) * modelShift).toFixed(10)), 2021.783333266, 'The notionalPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.lastFloatIndex) / PRECISION).toFixed(10)), 1.0217833333, 'The lastFloatIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFloat) * modelShift).toFixed(10)), 1517.4999999000, 'The notionalReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.totalLiquidity) * modelShift).toFixed(10)), 103.621536334, 'The totalLiquidity for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToPay) * modelShift).toFixed(10)), 39.2077312, 'The fixedToPay for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToReceive) * modelShift).toFixed(10)), 54.715165975, 'The fixedToReceive for the contract is incorrect');
        assert.equal(Number((Number(state.supplyIndex) * modelShift).toFixed(10)), 1.0362153633, 'The supplyIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysPayingFloat) * modelShift).toFixed(10)), 120000, 'The notionalDaysPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysReceivingFloat) * modelShift).toFixed(10)), 90000, 'The notionalDaysReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.activeCollateral) * modelShift).toFixed(10)), 25.453363550, 'The activeCollateral for the contract is incorrect');
        assert.equal(Number((Number(state.swapDuration) * modelShift).toFixed(10)), 90, 'The swapDuration for the contract is incorrect');
        assert.equal(Number((Number(state.orderNumber)).toFixed(10)), 4, 'The orderNumber for the contract is incorrect');
        
        assert.equal(Number((Number(liquidityAccount.amount) * modelShift).toFixed(10)), 100, 'The amount for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.lastDepositTime) * modelShift).toFixed(10)), 1609315200, 'The lastDepositTime for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.depositSupplyIndex) * modelShift).toFixed(10)), 1, 'The depositSupplyIndex for the liquidityAccount is incorrect');
        
        assert.equal(swapType, 'pFix', 'The swapType for the swap is incorrect');
        assert.equal(Number((Number(swap.notional) * modelShift).toFixed(10)), 1000, 'The  notional for the swap is incorrect');
        assert.equal(Number((Number(swap.swapRate) * modelShift).toFixed(10)), 0.1638431933, 'The  swapRate for the swap is incorrect');
        assert.equal(Number((Number(swap.initIndex) * modelShift).toFixed(10)), 1.0217833333, 'The  initIndex for the swap is incorrect');
        assert.equal(Number((Number(swap.userCollateral) * modelShift).toFixed(10)), 20.960798325, 'The  userCollateral for the swap is incorrect');
        assert.equal(Number((Number(swap.initTime) * modelShift).toFixed(10)), 1614499200, 'The  initTime for the swap is incorrect');
    });

    it("should open a receiveFixed swap using the account of msg.sender", async () => {
        const instance = await core.deployed();
        await instance.openReceiveFixedSwap('750', 1615363200, '1024905449070000000');
        const state = await instance.getState.call();
        const liquidityAccount = await instance.getAccount.call(accounts[0]);
        const swap = await instance.getSwap.call(state.orderNumber - 1);
        const swapType = await instance.getSwapType.call(state.orderNumber - 1); 
        
        // await logState( 'OPEN RECEIVE FIXED 2', state, liquidityAccount, swap, swapType);

        assert.equal(state.admin, accounts[0], 'The admin address for the contract is incorrect');
        assert.equal(Number((Number(state.mantissa) * modelShift).toFixed(10)), 1000000000000000000, 'The mantissa for the contract is incorrect');
        assert.equal(Number((Number(state.yOffset) * modelShift).toFixed(10)), 0.16, 'The yOffset for the contract is incorrect');
        assert.equal(Number((Number(state.slopeFactor) * modelShift).toFixed(10)), 2, 'The slopeFactor for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactorSensitivity) * modelShift).toFixed(10)), 0.000075, 'The rateFactorSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.feeBase) * modelShift).toFixed(10)), 0.001, 'The feeBase for the contract is incorrect');
        assert.equal(Number((Number(state.feeSensitivity) * modelShift).toFixed(10)), 0.003, 'The feeSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.rateRange) * modelShift).toFixed(10)), 0.085, 'The rateRange for the contract is incorrect');
        assert.equal(Number((Number(state.minPayoutRate) * modelShift).toFixed(10)), 0.08, 'The minPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.maxPayoutRate) * modelShift).toFixed(10)), 0.24, 'The maxPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactor) * modelShift).toFixed(10)), -0.0133060868, 'The rateFactor for the contract is incorrect');
        assert.equal(parseInt(Number(state.lastCheckpointTime) * modelShift), 1615363200, 'The lastCheckpointTime for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRateReceiving) * modelShift).toFixed(10)), 0.1644478025, 'The avgFixedRateReceiving for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFixed) * modelShift).toFixed(10)), 2000, 'The notionalReceivingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRatePaying) * modelShift).toFixed(10)), 0.1569330297, 'The avgFixedRatePaying for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFixed) * modelShift).toFixed(10)), 2250, 'The notionalPayingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFloat) * modelShift).toFixed(10)), 2027.9610044497, 'The notionalPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.lastFloatIndex) / PRECISION).toFixed(10)), 1.0249054490, 'The lastFloatIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFloat) * modelShift).toFixed(10)), 2272.1368053709, 'The notionalReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.totalLiquidity) * modelShift).toFixed(10)), 104.6820377823, 'The totalLiquidity for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToPay) * modelShift).toFixed(10)), 62.1363417771, 'The fixedToPay for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToReceive) * modelShift).toFixed(10)), 45.5791769473, 'The fixedToReceive for the contract is incorrect');
        assert.equal(Number((Number(state.supplyIndex) * modelShift).toFixed(10)), 1.0468203777, 'The supplyIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysPayingFloat) * modelShift).toFixed(10)), 100000, 'The notionalDaysPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysReceivingFloat) * modelShift).toFixed(10)), 142500, 'The notionalDaysReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.activeCollateral) * modelShift).toFixed(10)), 37.0939323861, 'The activeCollateral for the contract is incorrect');
        assert.equal(Number((Number(state.swapDuration) * modelShift).toFixed(10)), 90, 'The swapDuration for the contract is incorrect');
        assert.equal(Number((Number(state.orderNumber)).toFixed(10)), 5, 'The orderNumber for the contract is incorrect');
        
        assert.equal(Number((Number(liquidityAccount.amount) * modelShift).toFixed(10)), 100, 'The amount for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.lastDepositTime) * modelShift).toFixed(10)), 1609315200, 'The lastDepositTime for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.depositSupplyIndex) * modelShift).toFixed(10)), 1, 'The depositSupplyIndex for the liquidityAccount is incorrect');
        
        assert.equal(swapType, 'rFix', 'The swapType for the swap is incorrect');
        assert.equal(Number((Number(swap.notional) * modelShift).toFixed(10)), 750, 'The  notional for the swap is incorrect');
        assert.equal(Number((Number(swap.swapRate) * modelShift).toFixed(10)), 0.1571372397, 'The  swapRate for the swap is incorrect');
        assert.equal(Number((Number(swap.initIndex) * modelShift).toFixed(10)), 1.0249054490, 'The  initIndex for the swap is incorrect');
        assert.equal(Number((Number(swap.userCollateral) * modelShift).toFixed(10)), 15.5367675562, 'The  userCollateral for the swap is incorrect');
        assert.equal(Number((Number(swap.initTime) * modelShift).toFixed(10)), 1615363200, 'The  initTime for the swap is incorrect');
    });

    it("should close swap with order number 1", async () => {
        const instance = await core.deployed();
        await instance.closeSwap(1, 1617091200, '1030884064200000000');
        const state = await instance.getState.call();
        const liquidityAccount = await instance.getAccount.call(accounts[0]);
        const swap = await instance.getSwap.call(1);
        const swapType = await instance.getSwapType.call(1); 
        
        // await logState( 'CLOSE PAY FIXED 1', state, liquidityAccount, swap, swapType);

        assert.equal(state.admin, accounts[0], 'The admin address for the contract is incorrect');
        assert.equal(Number((Number(state.mantissa) * modelShift).toFixed(10)), 1000000000000000000, 'The mantissa for the contract is incorrect');
        assert.equal(Number((Number(state.yOffset) * modelShift).toFixed(10)), 0.16, 'The yOffset for the contract is incorrect');
        assert.equal(Number((Number(state.slopeFactor) * modelShift).toFixed(10)), 2, 'The slopeFactor for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactorSensitivity) * modelShift).toFixed(10)), 0.000075, 'The rateFactorSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.feeBase) * modelShift).toFixed(10)), 0.001, 'The feeBase for the contract is incorrect');
        assert.equal(Number((Number(state.feeSensitivity) * modelShift).toFixed(10)), 0.003, 'The feeSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.rateRange) * modelShift).toFixed(10)), 0.085, 'The rateRange for the contract is incorrect');
        assert.equal(Number((Number(state.minPayoutRate) * modelShift).toFixed(10)), 0.08, 'The minPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.maxPayoutRate) * modelShift).toFixed(10)), 0.24, 'The maxPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactor) * modelShift).toFixed(10)), -0.0133060868, 'The rateFactor for the contract is incorrect');
        assert.equal(parseInt(Number(state.lastCheckpointTime) * modelShift), 1617091200, 'The lastCheckpointTime for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRateReceiving) * modelShift).toFixed(10)), 0.1638431932, 'The avgFixedRateReceiving for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFixed) * modelShift).toFixed(10)), 1000, 'The notionalReceivingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRatePaying) * modelShift).toFixed(10)), 0.1569330297, 'The avgFixedRatePaying for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFixed) * modelShift).toFixed(10)), 2250, 'The notionalPayingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFloat) * modelShift).toFixed(10)), 1008.9067129108, 'The notionalPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.lastFloatIndex) / PRECISION).toFixed(10)), 1.0308840642, 'The lastFloatIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFloat) * modelShift).toFixed(10)), 2285.3909368870, 'The notionalReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.totalLiquidity) * modelShift).toFixed(10)), 104.7617459803, 'The totalLiquidity for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToPay) * modelShift).toFixed(10)), 42.5197130646, 'The fixedToPay for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToReceive) * modelShift).toFixed(10)), 27.3071988918, 'The fixedToReceive for the contract is incorrect');
        assert.equal(Number((Number(state.supplyIndex) * modelShift).toFixed(10)), 1.0476174596, 'The supplyIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysPayingFloat) * modelShift).toFixed(10)), 60000, 'The notionalDaysPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysReceivingFloat) * modelShift).toFixed(10)), 97500, 'The notionalDaysReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.activeCollateral) * modelShift).toFixed(10)), 33.5458475062, 'The activeCollateral for the contract is incorrect');
        assert.equal(Number((Number(state.swapDuration) * modelShift).toFixed(10)), 90, 'The swapDuration for the contract is incorrect');
        assert.equal(Number((Number(state.orderNumber)).toFixed(10)), 5, 'The orderNumber for the contract is incorrect');
        
        assert.equal(Number((Number(liquidityAccount.amount) * modelShift).toFixed(10)), 100, 'The amount for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.lastDepositTime) * modelShift).toFixed(10)), 1609315200, 'The lastDepositTime for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.depositSupplyIndex) * modelShift).toFixed(10)), 1, 'The depositSupplyIndex for the liquidityAccount is incorrect');
        
        assert.equal(swapType, '', 'The swapType for the swap is incorrect');
        assert.equal(Number((Number(swap.notional) * modelShift).toFixed(10)), 0, 'The  notional for the swap is incorrect');
        assert.equal(Number((Number(swap.swapRate) * modelShift).toFixed(10)), 0, 'The  swapRate for the swap is incorrect');
        assert.equal(Number((Number(swap.initIndex) * modelShift).toFixed(10)), 0, 'The  initIndex for the swap is incorrect');
        assert.equal(Number((Number(swap.userCollateral) * modelShift).toFixed(10)), 0, 'The  userCollateral for the swap is incorrect');
        assert.equal(Number((Number(swap.initTime) * modelShift).toFixed(10)), 0, 'The  initTime for the swap is incorrect');
    });

    it("should close swap with order number 2", async () => {
        const instance = await core.deployed();
        await instance.closeSwap(2, 1619683200, '1041192905000000000');
        const state = await instance.getState.call();
        const liquidityAccount = await instance.getAccount.call(accounts[0]);
        const swap = await instance.getSwap.call(2);
        const swapType = await instance.getSwapType.call(2); 
        
        // await logState( 'CLOSE RECEIVE FIXED 1', state, liquidityAccount, swap, swapType);

        assert.equal(state.admin, accounts[0], 'The admin address for the contract is incorrect');
        assert.equal(Number((Number(state.mantissa) * modelShift).toFixed(10)), 1000000000000000000, 'The mantissa for the contract is incorrect');
        assert.equal(Number((Number(state.yOffset) * modelShift).toFixed(10)), 0.16, 'The yOffset for the contract is incorrect');
        assert.equal(Number((Number(state.slopeFactor) * modelShift).toFixed(10)), 2, 'The slopeFactor for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactorSensitivity) * modelShift).toFixed(10)), 0.000075, 'The rateFactorSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.feeBase) * modelShift).toFixed(10)), 0.001, 'The feeBase for the contract is incorrect');
        assert.equal(Number((Number(state.feeSensitivity) * modelShift).toFixed(10)), 0.003, 'The feeSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.rateRange) * modelShift).toFixed(10)), 0.085, 'The rateRange for the contract is incorrect');
        assert.equal(Number((Number(state.minPayoutRate) * modelShift).toFixed(10)), 0.08, 'The minPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.maxPayoutRate) * modelShift).toFixed(10)), 0.24, 'The maxPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactor) * modelShift).toFixed(10)), -0.0133060868, 'The rateFactor for the contract is incorrect');
        assert.equal(parseInt(Number(state.lastCheckpointTime) * modelShift), 1619683200, 'The lastCheckpointTime for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRateReceiving) * modelShift).toFixed(10)), 0.1638431932, 'The avgFixedRateReceiving for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFixed) * modelShift).toFixed(10)), 1000, 'The notionalReceivingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRatePaying) * modelShift).toFixed(10)), 0.1571372395, 'The avgFixedRatePaying for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFixed) * modelShift).toFixed(10)), 750, 'The notionalPayingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFloat) * modelShift).toFixed(10)), 1018.9957801407, 'The notionalPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.lastFloatIndex) / PRECISION).toFixed(10)), 1.0411929050, 'The lastFloatIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFloat) * modelShift).toFixed(10)), 761.9187499498, 'The notionalReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.totalLiquidity) * modelShift).toFixed(10)), 101.7552447124, 'The totalLiquidity for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToPay) * modelShift).toFixed(10)), 13.0947699959, 'The fixedToPay for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToReceive) * modelShift).toFixed(10)), 13.6535994585, 'The fixedToReceive for the contract is incorrect');
        assert.equal(Number((Number(state.supplyIndex) * modelShift).toFixed(10)), 1.0175524470, 'The supplyIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysPayingFloat) * modelShift).toFixed(10)), 30000, 'The notionalDaysPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysReceivingFloat) * modelShift).toFixed(10)), 30000, 'The notionalDaysReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.activeCollateral) * modelShift).toFixed(10)), 12.7745038708, 'The activeCollateral for the contract is incorrect');
        assert.equal(Number((Number(state.swapDuration) * modelShift).toFixed(10)), 90, 'The swapDuration for the contract is incorrect');
        assert.equal(Number((Number(state.orderNumber)).toFixed(10)), 5, 'The orderNumber for the contract is incorrect');
        
        assert.equal(Number((Number(liquidityAccount.amount) * modelShift).toFixed(10)), 100, 'The amount for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.lastDepositTime) * modelShift).toFixed(10)), 1609315200, 'The lastDepositTime for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.depositSupplyIndex) * modelShift).toFixed(10)), 1, 'The depositSupplyIndex for the liquidityAccount is incorrect');
        
        assert.equal(swapType, '', 'The swapType for the swap is incorrect');
        assert.equal(Number((Number(swap.notional) * modelShift).toFixed(10)), 0, 'The  notional for the swap is incorrect');
        assert.equal(Number((Number(swap.swapRate) * modelShift).toFixed(10)), 0, 'The  swapRate for the swap is incorrect');
        assert.equal(Number((Number(swap.initIndex) * modelShift).toFixed(10)), 0, 'The  initIndex for the swap is incorrect');
        assert.equal(Number((Number(swap.userCollateral) * modelShift).toFixed(10)), 0, 'The  userCollateral for the swap is incorrect');
        assert.equal(Number((Number(swap.initTime) * modelShift).toFixed(10)), 0, 'The  initTime for the swap is incorrect');
    });

    it("should close swap with order number 3", async () => {
        const instance = await core.deployed();
        await instance.closeSwap(3, 1622275200, '1053340155000000000');
        const state = await instance.getState.call();
        const liquidityAccount = await instance.getAccount.call(accounts[0]);
        const swap = await instance.getSwap.call(3);
        const swapType = await instance.getSwapType.call(3); 
        
        // await logState( 'CLOSE PAY FIXED 2', state, liquidityAccount, swap, swapType);

        assert.equal(state.admin, accounts[0], 'The admin address for the contract is incorrect');
        assert.equal(Number((Number(state.mantissa) * modelShift).toFixed(10)), 1000000000000000000, 'The mantissa for the contract is incorrect');
        assert.equal(Number((Number(state.yOffset) * modelShift).toFixed(10)), 0.16, 'The yOffset for the contract is incorrect');
        assert.equal(Number((Number(state.slopeFactor) * modelShift).toFixed(10)), 2, 'The slopeFactor for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactorSensitivity) * modelShift).toFixed(10)), 0.000075, 'The rateFactorSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.feeBase) * modelShift).toFixed(10)), 0.001, 'The feeBase for the contract is incorrect');
        assert.equal(Number((Number(state.feeSensitivity) * modelShift).toFixed(10)), 0.003, 'The feeSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.rateRange) * modelShift).toFixed(10)), 0.085, 'The rateRange for the contract is incorrect');
        assert.equal(Number((Number(state.minPayoutRate) * modelShift).toFixed(10)), 0.08, 'The minPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.maxPayoutRate) * modelShift).toFixed(10)), 0.24, 'The maxPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactor) * modelShift).toFixed(10)), -0.0133060868, 'The rateFactor for the contract is incorrect');
        assert.equal(parseInt(Number(state.lastCheckpointTime) * modelShift), 1622275200, 'The lastCheckpointTime for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRateReceiving) * modelShift).toFixed(10)), 0, 'The avgFixedRateReceiving for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFixed) * modelShift).toFixed(10)), 0, 'The notionalReceivingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRatePaying) * modelShift).toFixed(10)), 0.1571372395, 'The avgFixedRatePaying for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFixed) * modelShift).toFixed(10)), 750, 'The notionalPayingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFloat) * modelShift).toFixed(10)), 0, 'The notionalPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.lastFloatIndex) / PRECISION).toFixed(10)), 1.053340155, 'The lastFloatIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFloat) * modelShift).toFixed(10)), 770.8078016007, 'The notionalReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.totalLiquidity) * modelShift).toFixed(10)), 102.5885348037, 'The totalLiquidity for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToPay) * modelShift).toFixed(10)), 3.2736925272, 'The fixedToPay for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToReceive) * modelShift).toFixed(10)), 0.0000000252, 'The fixedToReceive for the contract is incorrect');
        assert.equal(Number((Number(state.supplyIndex) * modelShift).toFixed(10)), 1.0258853478, 'The supplyIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysPayingFloat) * modelShift).toFixed(10)), 0, 'The notionalDaysPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysReceivingFloat) * modelShift).toFixed(10)), 7500, 'The notionalDaysReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.activeCollateral) * modelShift).toFixed(10)), 1.6070258354, 'The activeCollateral for the contract is incorrect');
        assert.equal(Number((Number(state.swapDuration) * modelShift).toFixed(10)), 90, 'The swapDuration for the contract is incorrect');
        assert.equal(Number((Number(state.orderNumber)).toFixed(10)), 5, 'The orderNumber for the contract is incorrect');
        
        assert.equal(Number((Number(liquidityAccount.amount) * modelShift).toFixed(10)), 100, 'The amount for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.lastDepositTime) * modelShift).toFixed(10)), 1609315200, 'The lastDepositTime for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.depositSupplyIndex) * modelShift).toFixed(10)), 1, 'The depositSupplyIndex for the liquidityAccount is incorrect');
        
        assert.equal(swapType, '', 'The swapType for the swap is incorrect');
        assert.equal(Number((Number(swap.notional) * modelShift).toFixed(10)), 0, 'The  notional for the swap is incorrect');
        assert.equal(Number((Number(swap.swapRate) * modelShift).toFixed(10)), 0, 'The  swapRate for the swap is incorrect');
        assert.equal(Number((Number(swap.initIndex) * modelShift).toFixed(10)), 0, 'The  initIndex for the swap is incorrect');
        assert.equal(Number((Number(swap.userCollateral) * modelShift).toFixed(10)), 0, 'The  userCollateral for the swap is incorrect');
        assert.equal(Number((Number(swap.initTime) * modelShift).toFixed(10)), 0, 'The  initTime for the swap is incorrect');
    });

    it("should close swap with order number 4", async () => {
        const instance = await core.deployed();
        await instance.closeSwap(4, 1623139200, '1056851289000000000');
        const state = await instance.getState.call();
        const liquidityAccount = await instance.getAccount.call(accounts[0]);
        const swap = await instance.getSwap.call(4);
        const swapType = await instance.getSwapType.call(4); 
        
        // await logState( 'CLOSE RECEIVE FIXED 2', state, liquidityAccount, swap, swapType);

        assert.equal(state.admin, accounts[0], 'The admin address for the contract is incorrect');
        assert.equal(Number((Number(state.mantissa) * modelShift).toFixed(10)), 1000000000000000000, 'The mantissa for the contract is incorrect');
        assert.equal(Number((Number(state.yOffset) * modelShift).toFixed(10)), 0.16, 'The yOffset for the contract is incorrect');
        assert.equal(Number((Number(state.slopeFactor) * modelShift).toFixed(10)), 2, 'The slopeFactor for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactorSensitivity) * modelShift).toFixed(10)), 0.000075, 'The rateFactorSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.feeBase) * modelShift).toFixed(10)), 0.001, 'The feeBase for the contract is incorrect');
        assert.equal(Number((Number(state.feeSensitivity) * modelShift).toFixed(10)), 0.003, 'The feeSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.rateRange) * modelShift).toFixed(10)), 0.085, 'The rateRange for the contract is incorrect');
        assert.equal(Number((Number(state.minPayoutRate) * modelShift).toFixed(10)), 0.08, 'The minPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.maxPayoutRate) * modelShift).toFixed(10)), 0.24, 'The maxPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactor) * modelShift).toFixed(10)), -0.0133060868, 'The rateFactor for the contract is incorrect');
        assert.equal(parseInt(Number(state.lastCheckpointTime) * modelShift), 1623139200, 'The lastCheckpointTime for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRateReceiving) * modelShift).toFixed(10)), 0, 'The avgFixedRateReceiving for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFixed) * modelShift).toFixed(10)), 0, 'The notionalReceivingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRatePaying) * modelShift).toFixed(10)), 0, 'The avgFixedRatePaying for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFixed) * modelShift).toFixed(10)), 0, 'The notionalPayingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFloat) * modelShift).toFixed(10)), 0, 'The notionalPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.lastFloatIndex) / PRECISION).toFixed(10)), 1.0568512890, 'The lastFloatIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFloat) * modelShift).toFixed(10)), 0, 'The notionalReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.totalLiquidity) * modelShift).toFixed(10)), 101.8842017042, 'The totalLiquidity for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToPay) * modelShift).toFixed(10)), 0.0000000377, 'The fixedToPay for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToReceive) * modelShift).toFixed(10)), 0.0000000252, 'The fixedToReceive for the contract is incorrect');
        assert.equal(Number((Number(state.supplyIndex) * modelShift).toFixed(10)), 1.0188420168, 'The supplyIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysPayingFloat) * modelShift).toFixed(10)), 0, 'The notionalDaysPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysReceivingFloat) * modelShift).toFixed(10)), 0, 'The notionalDaysReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.activeCollateral) * modelShift).toFixed(10)), 0.0000000125, 'The activeCollateral for the contract is incorrect');
        assert.equal(Number((Number(state.swapDuration) * modelShift).toFixed(10)), 90, 'The swapDuration for the contract is incorrect');
        assert.equal(Number((Number(state.orderNumber)).toFixed(10)), 5, 'The orderNumber for the contract is incorrect');
        
        assert.equal(Number((Number(liquidityAccount.amount) * modelShift).toFixed(10)), 100, 'The amount for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.lastDepositTime) * modelShift).toFixed(10)), 1609315200, 'The lastDepositTime for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.depositSupplyIndex) * modelShift).toFixed(10)), 1, 'The depositSupplyIndex for the liquidityAccount is incorrect');
        
        assert.equal(swapType, '', 'The swapType for the swap is incorrect');
        assert.equal(Number((Number(swap.notional) * modelShift).toFixed(10)), 0, 'The  notional for the swap is incorrect');
        assert.equal(Number((Number(swap.swapRate) * modelShift).toFixed(10)), 0, 'The  swapRate for the swap is incorrect');
        assert.equal(Number((Number(swap.initIndex) * modelShift).toFixed(10)), 0, 'The  initIndex for the swap is incorrect');
        assert.equal(Number((Number(swap.userCollateral) * modelShift).toFixed(10)), 0, 'The  userCollateral for the swap is incorrect');
        assert.equal(Number((Number(swap.initTime) * modelShift).toFixed(10)), 0, 'The  initTime for the swap is incorrect');
    });

    it("should update the interest rate model", async () => {
        const instance = await core.deployed();
        await instance.updateModel('1500000000', '30000000000', '850000', '50000000', '70000000', '900000000', '900000000', '1000000000');
        const state = await instance.getState.call();
        const liquidityAccount = await instance.getAccount.call(accounts[0]);
        
        // await logState( 'UPDATE MODEL', state, liquidityAccount);

        assert.equal(state.admin, accounts[0], 'The admin address for the contract is incorrect');
        assert.equal(Number((Number(state.mantissa) * modelShift).toFixed(10)), 1000000000000000000, 'The mantissa for the contract is incorrect');
        assert.equal(Number((Number(state.yOffset) * modelShift).toFixed(10)), 0.15, 'The yOffset for the contract is incorrect');
        assert.equal(Number((Number(state.slopeFactor) * modelShift).toFixed(10)), 3, 'The slopeFactor for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactorSensitivity) * modelShift).toFixed(10)), 0.000085, 'The rateFactorSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.feeBase) * modelShift).toFixed(10)), 0.005, 'The feeBase for the contract is incorrect');
        assert.equal(Number((Number(state.feeSensitivity) * modelShift).toFixed(10)), 0.007, 'The feeSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.rateRange) * modelShift).toFixed(10)), 0.09, 'The rateRange for the contract is incorrect');
        assert.equal(Number((Number(state.minPayoutRate) * modelShift).toFixed(10)), 0.09, 'The minPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.maxPayoutRate) * modelShift).toFixed(10)), 0.1, 'The maxPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactor) * modelShift).toFixed(10)), -0.0133060868, 'The rateFactor for the contract is incorrect');
        assert.equal(parseInt(Number(state.lastCheckpointTime) * modelShift), 1623139200, 'The lastCheckpointTime for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRateReceiving) * modelShift).toFixed(10)), 0, 'The avgFixedRateReceiving for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFixed) * modelShift).toFixed(10)), 0, 'The notionalReceivingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRatePaying) * modelShift).toFixed(10)), 0, 'The avgFixedRatePaying for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFixed) * modelShift).toFixed(10)), 0, 'The notionalPayingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFloat) * modelShift).toFixed(10)), 0, 'The notionalPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.lastFloatIndex) / PRECISION).toFixed(10)), 1.0568512890, 'The lastFloatIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFloat) * modelShift).toFixed(10)), 0, 'The notionalReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.totalLiquidity) * modelShift).toFixed(10)), 101.8842017042, 'The totalLiquidity for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToPay) * modelShift).toFixed(10)), 0.0000000377, 'The fixedToPay for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToReceive) * modelShift).toFixed(10)), 0.0000000252, 'The fixedToReceive for the contract is incorrect');
        assert.equal(Number((Number(state.supplyIndex) * modelShift).toFixed(10)), 1.0188420168, 'The supplyIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysPayingFloat) * modelShift).toFixed(10)), 0, 'The notionalDaysPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysReceivingFloat) * modelShift).toFixed(10)), 0, 'The notionalDaysReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.activeCollateral) * modelShift).toFixed(10)), 0.0000000125, 'The activeCollateral for the contract is incorrect');
        assert.equal(Number((Number(state.swapDuration) * modelShift).toFixed(10)), 90, 'The swapDuration for the contract is incorrect');
        assert.equal(Number((Number(state.orderNumber)).toFixed(10)), 5, 'The orderNumber for the contract is incorrect');
        
        assert.equal(Number((Number(liquidityAccount.amount) * modelShift).toFixed(10)), 100, 'The amount for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.lastDepositTime) * modelShift).toFixed(10)), 1609315200, 'The lastDepositTime for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.depositSupplyIndex) * modelShift).toFixed(10)), 1, 'The depositSupplyIndex for the liquidityAccount is incorrect');
    });

    it("should remove liquidity from the liquidity account of msg.sender", async () => {
        const instance = await core.deployed();
        await instance.removeLiquidity('100000000000000000000', 1624003200, '1057851289000000000');
        const state = await instance.getState.call();
        const liquidityAccount = await instance.getAccount.call(accounts[0]);
        
        // await logState( 'REMOVE LIQUIDITY', state, liquidityAccount);

        assert.equal(state.admin, accounts[0], 'The admin address for the contract is incorrect');
        assert.equal(Number((Number(state.mantissa) * modelShift).toFixed(10)), 1000000000000000000, 'The mantissa for the contract is incorrect');
        assert.equal(Number((Number(state.yOffset) * modelShift).toFixed(10)), 0.15, 'The yOffset for the contract is incorrect');
        assert.equal(Number((Number(state.slopeFactor) * modelShift).toFixed(10)), 3, 'The slopeFactor for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactorSensitivity) * modelShift).toFixed(10)), 0.000085, 'The rateFactorSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.feeBase) * modelShift).toFixed(10)), 0.005, 'The feeBase for the contract is incorrect');
        assert.equal(Number((Number(state.feeSensitivity) * modelShift).toFixed(10)), 0.007, 'The feeSensitivity for the contract is incorrect');
        assert.equal(Number((Number(state.rateRange) * modelShift).toFixed(10)), 0.09, 'The rateRange for the contract is incorrect');
        assert.equal(Number((Number(state.minPayoutRate) * modelShift).toFixed(10)), 0.09, 'The minPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.maxPayoutRate) * modelShift).toFixed(10)), 0.1, 'The maxPayoutRate for the contract is incorrect');
        assert.equal(Number((Number(state.rateFactor) * modelShift).toFixed(10)), -0.0133060868, 'The rateFactor for the contract is incorrect');
        assert.equal(parseInt(Number(state.lastCheckpointTime) * modelShift), 1624003200, 'The lastCheckpointTime for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRateReceiving) * modelShift).toFixed(10)), 0, 'The avgFixedRateReceiving for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFixed) * modelShift).toFixed(10)), 0, 'The notionalReceivingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.avgFixedRatePaying) * modelShift).toFixed(10)), 0, 'The avgFixedRatePaying for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFixed) * modelShift).toFixed(10)), 0, 'The notionalPayingFixed for the contract is incorrect');
        assert.equal(Number((Number(state.notionalPayingFloat) * modelShift).toFixed(10)), 0, 'The notionalPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.lastFloatIndex) / PRECISION).toFixed(10)), 1.057851289, 'The lastFloatIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalReceivingFloat) * modelShift).toFixed(10)), 0, 'The notionalReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.totalLiquidity) * modelShift).toFixed(10)), 1.8842017042, 'The totalLiquidity for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToPay) * modelShift).toFixed(10)), 0.0000000377, 'The fixedToPay for the contract is incorrect');
        assert.equal(Number((Number(state.fixedToReceive) * modelShift).toFixed(10)), 0.0000000252, 'The fixedToReceive for the contract is incorrect');
        assert.equal(Number((Number(state.supplyIndex) * modelShift).toFixed(10)), 1.0188420168, 'The supplyIndex for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysPayingFloat) * modelShift).toFixed(10)), 0, 'The notionalDaysPayingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.notionalDaysReceivingFloat) * modelShift).toFixed(10)), 0, 'The notionalDaysReceivingFloat for the contract is incorrect');
        assert.equal(Number((Number(state.activeCollateral) * modelShift).toFixed(10)), 0.0000000125, 'The activeCollateral for the contract is incorrect');
        assert.equal(Number((Number(state.swapDuration) * modelShift).toFixed(10)), 90, 'The swapDuration for the contract is incorrect');
        assert.equal(Number((Number(state.orderNumber)).toFixed(10)), 5, 'The orderNumber for the contract is incorrect');
        
        assert.equal(Number((Number(liquidityAccount.amount) * modelShift).toFixed(10)), 1.88420168, 'The amount for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.lastDepositTime) * modelShift).toFixed(10)), 1624003200, 'The lastDepositTime for the liquidityAccount is incorrect');
        assert.equal(Number((Number(liquidityAccount.depositSupplyIndex) * modelShift).toFixed(10)), 1.0188420168, 'The depositSupplyIndex for the liquidityAccount is incorrect');
    });

});