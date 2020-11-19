const calculator_contract = artifacts.require("alpha_calculator");
const metric_contract = artifacts.require("alpha_metrics");
const core_contract = artifacts.require("alpha_core");
const core_contract_usdt = artifacts.require("alpha_core_usdt");

module.exports = function(deployer) {
    // MAINNET V1 (DAI)
    deployer.then(async () => {
        const currentBlock = await web3.eth.getBlockNumber();
        let borrowApy, borrowIndex;

        try {
            const endpoint = 'https://api.compound.finance/api/v2/ctoken?addresses=0x5d3a536e4d6dbd6114cc1ead35777bab948e3643&network=mainnet';
            const result = await axios.get(endpoint);
            borrowApy = (result.data.cToken[0].borrow_rate.value) * 1e18
            borrowApy = borrowApy.toString()
        } catch ( err ) {
            throw new Error (`Error fetching borrow APY from Compound API - ${err.message}`);
        }

        try {
            borrowIndex = await cTokenContract.methods.borrowIndex().call();
            borrowIndex = parseFloat((Number(borrowIndex) / 1e18).toFixed(10)) * 1e10
        } catch ( err ) {
            throw new Error (`Error fetching borrowIndex from cToken contract - ${err.message}`);
        }

        await deployer.deploy(calculator_contract, '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643', '0xfed941d39905b23d6faf02c8301d40bd4834e27f', currentBlock, borrowApy);
        await deployer.deploy(metric_contract, '0xe3D5260Cd7F8a4207f41C3B2aC87882489f97213');
        await deployer.deploy(core_contract, '0xe3D5260Cd7F8a4207f41C3B2aC87882489f97213', '0x6b175474e89094c44da98b954eedeac495271d0f', calculator_contract.address, metric_contract.address, '1000000000000000000', '604800', '397750194', '20000000000', '750000', '10000000', '30000000', '814155018', '7000000000', '40000000000','0', '1300000000', borrowIndex, '7200');
    });

    // MAINNET V1 (USDC)
    deployer.then(async () => {
        const currentBlock = await web3.eth.getBlockNumber();
        let borrowApy, borrowIndex;

        try {
            const endpoint = 'https://api.compound.finance/api/v2/ctoken?addresses=0x39aa39c021dfbae8fac545936693ac917d5e7563&network=mainnet';
            const result = await axios.get(endpoint);
            borrowApy = (result.data.cToken[0].borrow_rate.value) * 1e18
            borrowApy = borrowApy.toString()
        } catch ( err ) {
            throw new Error (`Error fetching borrow APY from Compound API - ${err.message}`);
        }

        try {
            borrowIndex = await cTokenContract.methods.borrowIndex().call();
            borrowIndex = parseFloat((Number(borrowIndex) / 1e18).toFixed(10)) * 1e10
        } catch ( err ) {
            throw new Error (`Error fetching borrowIndex from cToken contract - ${err.message}`);
        }

        await deployer.deploy(calculator_contract, '0x39aa39c021dfbae8fac545936693ac917d5e7563', '0xd8ec56013ea119e7181d231e5048f90fbbe753c0', currentBlock, borrowApy);
        await deployer.deploy(metric_contract, '0xe3D5260Cd7F8a4207f41C3B2aC87882489f97213');
        await deployer.deploy(core_contract, '0xe3D5260Cd7F8a4207f41C3B2aC87882489f97213', '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', calculator_contract.address, metric_contract.address, '1000000', '604800', '404345635', '20000000000', '750000', '10000000', '30000000', '707225723', '7000000000', '40000000000','0', '1300000000', borrowIndex, '7200');
    });

    // MAINNET V1 (USDT)
    deployer.then(async () => {
        const currentBlock = await web3.eth.getBlockNumber();
        let borrowApy, borrowIndex;

        try {
            const endpoint = 'https://api.compound.finance/api/v2/ctoken?addresses=0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9&network=mainnet';
            const result = await axios.get(endpoint);
            borrowApy = (result.data.cToken[0].borrow_rate.value) * 1e18
            borrowApy = borrowApy.toString()
        } catch ( err ) {
            throw new Error (`Error fetching borrow APY from Compound API - ${err.message}`);
        }

        try {
            borrowIndex = await cTokenContract.methods.borrowIndex().call();
            borrowIndex = parseInt(parseFloat((Number(borrowIndex) / 1e18).toFixed(10)) * 1e10)
        } catch ( err ) {
            throw new Error (`Error fetching borrowIndex from cToken contract - ${err.message}`);
        }

        console.log(borrowIndex, borrowApy, currentBlock)

        await deployer.deploy(calculator_contract, '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9', '0xfb564da37b41b2f6b6edcc3e56fbf523bd9f2012', currentBlock, borrowApy);
        await deployer.deploy(metric_contract, '0xe3D5260Cd7F8a4207f41C3B2aC87882489f97213');
        await deployer.deploy(core_contract_usdt, '0xe3D5260Cd7F8a4207f41C3B2aC87882489f97213', '0xdAC17F958D2ee523a2206206994597C13D831ec7', calculator_contract.address, metric_contract.address, '1000000', '604800', '363210725', '20000000000', '750000', '10000000', '30000000', '1113561258', '7000000000', '40000000000','0', '1300000000', borrowIndex, '7200');
    });
};