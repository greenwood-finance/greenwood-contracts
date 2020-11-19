
# Greenwood V1 Core

This document outlines the public methods that are made available by the Core contract of Greenwood V1.

## Contract Methods

### addLiquidity
```python
@external
def addLiquidity(_deposit_amount: uint256)
```
##### Arguments

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _deposit_amount | uint256 | The number of tokens being added to the liquidity pool multiplied by the precision of the underlying token | 

##### Web3.js example usage

```js
const accounts = await web3.eth.getAccounts();
await daiInstance.methods.approve(coreInstance.address, '100000000000000000000').send({from: accounts[0]});
await coreInstance.addLiquidity('100000000000000000000');
const liquidityAccount = await coreInstance.getAccount(accounts[0]).call();

console.log(liquidityAccount);
```

### removeLiquidity
```python
@external
def removeLiquidity(_withdraw_amount: uint256)
```
##### Arguments

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _withdraw_amount | uint256 | The amount of tokens being removed from the liquidity pool multiplied by the precision of the underlying token | 

##### Web3.js example usage

```js
const accounts = await web3.eth.getAccounts();
await coreInstance.removeLiquidity('100000000000000000000');
const liquidityAccount = await coreInstance.getAccount(accounts[0]).call();

console.log(liquidityAccount);
```
### openSwap
```python
@external
def openSwap(_notional_amount: uint256, _swap_type: String[4])
```
##### Arguments

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _notional_amount | uint256 | The notional value of the swap being opened | 
| _swap_type | String[4] | The type of swap being opened (`pFix` or `rFix`) | 

##### Web3.js example usage
```js
const accounts = await web3.eth.getAccounts();
await coreInstance.openSwap('100000000000000000000', 'pFix');
const swapNumber = await coreInstance.swapNumbers(accounts[0]).call();
const swapNumberBytes = web3.utils.padLeft(web3.utils.toHex(swapNumber), 64)
const addressBytes = web3.utils.padLeft(web3.utils.toHex(accounts[0]), 64)
const swapKey = addressBytes.concat(swapNumberBytes.replace('0x',''));
const swap = await coreInstance.methods.getSwap(web3.utils.keccak256(swapKey)).call();
const swapType = await coreInstance.methods.getSwapType (web3.utils.keccak256(swapKey)).call();

console.log(swapType, swap);
```

### closeSwap

```python
@external
def closeSwap(_order_number: uint256)
```
##### Arguments

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _swap_key | bytes32 | The swap key of the swap to be closed | 


```js
const accounts = await web3.eth.getAccounts();
const swapNumber = await coreInstance.swapNumbers(accounts[0]).call();
const swapNumberBytes = web3.utils.padLeft(web3.utils.toHex(swapNumber), 64)
const addressBytes = web3.utils.padLeft(web3.utils.toHex(accounts[0]), 64)
const swapKey = addressBytes.concat(swapNumberBytes.replace('0x',''));
await coreInstance.closeSwap(swapKey);
const swap = await coreInstance.methods.getSwap(web3.utils.keccak256(swapKey)).call();
const swapType = await coreInstance.methods.getSwapType (web3.utils.keccak256(swapKey)).call();

console.log(swapType, swap);
```