const calculator_contract = artifacts.require("alpha_calculator");
const metric_contract = artifacts.require("alpha_metrics");
const core_contract = artifacts.require("alpha_core");

module.exports = function(deployer) {
    // MAINNET ALPHA (DAI)
    deployer.then(async () => {
        await deployer.deploy(calculator_contract, '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643');
        await deployer.deploy(metric_contract, '0xe3D5260Cd7F8a4207f41C3B2aC87882489f97213');
        await deployer.deploy(core_contract, '0xe3D5260Cd7F8a4207f41C3B2aC87882489f97213', '0x6b175474e89094c44da98b954eedeac495271d0f', calculator_contract.address, metric_contract.address,'1000000000000000000', '604800', '403311093', '20000000000', '750000', '10000000', '30000000', '825371743', '7000000000', '40000000000','0', '1300000000', '10000000000', '7200');
    });
};